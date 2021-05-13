import { NextApiRequest, NextApiResponse } from "next";
import Youtube from 'youtube-sr'

export default async function getVideoInfos(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { videoUrl } = req.query
    const data = await Youtube.getVideo(String(videoUrl))
    return res.send(data)
  }
}
