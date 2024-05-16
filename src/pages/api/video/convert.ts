import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import ytdl from 'ytdl-core';
import { spawn } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import { PassThrough } from 'stream';

// Initialize the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export default async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { videoURL } = req.body;
            if (!videoURL || !ytdl.validateURL(videoURL)) {
                return res.status(400).json({ error: 'Invalid or missing URL' });
            }

            const videoTitle = encodeURIComponent((await ytdl.getInfo(videoURL)).videoDetails.title);

            const stream = ytdl(videoURL, {
                quality: 'highestaudio',
            });

            const passThrough = new PassThrough();

            const ffmpegProcess = spawn(ffmpeg, [
                '-loglevel', 'error', '-hide_banner',
                '-i', 'pipe:0',  // Input from stdin
                '-acodec', 'libmp3lame',
                '-b:a', '192k',
                '-af', 'dynaudnorm=f=200',
                '-f', 'mp3',
                'pipe:1',  // Output to stdout
            ], {
                windowsHide: true,
                stdio: ['pipe', 'pipe', 'inherit', 'pipe'],
            });

            stream.pipe(ffmpegProcess.stdio[0]);
            ffmpegProcess.stdio[1].pipe(passThrough);

            const key = `${videoTitle}-${Date.now().toString().slice(0,5)}.mp3`;
            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: key,
                Body: passThrough
            };

            try {
                const upload = new Upload({
                    client: s3Client,
                    params: uploadParams
                });

                await upload.done();
                res.status(200).json({ message: 'File uploaded successfully', url: `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}` });
            } catch (uploadError) {
                console.error('Upload failed:', uploadError);
                res.status(500).json({ error: 'Failed to upload file' });
            }

        } catch (error) {
            console.error('Server error', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
};
