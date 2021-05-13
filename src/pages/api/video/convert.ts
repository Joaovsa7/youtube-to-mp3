import { NextApiRequest, NextApiResponse } from "next";
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ytdl from 'ytdl-core'

ffmpeg.setFfmpegPath(ffmpegPath.path)

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { videoLink } = req.body
    console.log({ videoLink, r: req.body })
    res.setHeader("Content-Type", "audio/mpeg");

    return Promise.resolve(ffmpeg()
    .input(ytdl(String(videoLink)))
    .toFormat('mp3')
    .pipe(res))
  }
}
