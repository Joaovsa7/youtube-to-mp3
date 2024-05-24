import React, { useRef, useState } from "react"
import Head from "next/head"

import api from "../../config/axios"

import Accordion from '../components/Accordion'

import Preview from "../components/Preview"
interface VideoData {
  title?: string
  thumbnail?: string
  duration?: string
  url?: string
}

const Home = () => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [videoData, setVideoData] = useState<VideoData>({})
  const [downloadLink, setDownloadLink] = useState('')

  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>

  const handleSubmit = (e) => {
    e.preventDefault()
    const videoUrl = inputRef.current.value

    if (!videoUrl?.length) {
      return setError('Link inválido!')
    }

    setLoading(true)
    setVideoData({})
    setDownloadLink('')
    api.get('/video/info', {
      params: {
        videoUrl
      }
    }).then(({ data }) => {
      setLoading(false)
      // inputRef.current.value = ''
      setVideoData({
        thumbnail: data.thumbnail.url,
        title: data.title,
        duration: data.duration_formatted,
      })
      convertVideoToMp3()
    }).catch(e => {
      setLoading(false)
      setError('Erro ao buscar informações do vídeo')
    })
  }

  const convertVideoToMp3 = () => {
    api.post<Blob>('/video/convert', {
      videoURL: inputRef.current.value
    }).then(({ data }) => {
      const videoData = data as unknown as {
        url: string
      }

      setDownloadLink(videoData.url)
    }).catch(console.log)
  }

  const hasError = !!error?.length
  const hasVideoData = videoData?.title

  return (
    <>
      <Head>
        <title>Convert YouTube to MP3 | YouTubeToMP3.tube</title>
        <meta name="description" content="Convert YouTube videos to high-quality MP3 files effortlessly with YouTubeToMP3.tube. Our user-friendly platform allows you to extract audio from any YouTube video in just a few clicks. Enjoy fast conversion, exceptional audio quality, and an ad-free experience. Try it now!" />
        <meta property="og:title" content="Convert YouTube to MP3 | YouTubeToMP3.tube" />
        <meta property="og:description" content="Convert YouTube videos to high-quality MP3 files effortlessly with YouTubeToMP3.tube. Enjoy fast conversion, exceptional audio quality, and an ad-free experience. Try it now!" />
        <meta property="og:url" content="https://youtubetomp3.tube" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Head>
      <div className="container">
        <div className="flex min-h-40vh items-center justify-center flex-col">
          <h1 className="text-4xl mb-10 mt-10   ">Convert YouTube Video to MP3</h1>
          <div className="w-full">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="YouTube URL"
                className="w-full p-2 mb-5 border border-gray-300 rounded"
                ref={inputRef}
              />
              <button
                type="submit"
                className={`w-full p-2 bg-blue-500 text-white rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Loading video...' : 'Search'}
              </button>
            </form>
            {hasError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">{error}</strong>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
                  <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <title>Close</title>
                    <path d="M14.348 14.849a1 1 0 01-1.415 0L10 11.415l-2.933 2.934a1 1 0 11-1.414-1.415L8.585 10 5.651 7.066a1 1 0 011.415-1.415L10 8.585l2.934-2.934a1 1 0 011.414 1.415L11.415 10l2.934 2.934a1 1 0 010 1.415z" />
                  </svg>
                </span>
              </div>
            )}
          </div>
          {hasVideoData && inputRef?.current?.value && (
            <>
              <Preview {...videoData} />
              <a
                href={downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                download={videoData.title}
                className={`w-full p-2 mt-5 bg-blue-500 text-white text-center rounded ${!downloadLink.length ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {downloadLink.length ? 'Download' : 'Loading...'}
              </a>
            </>
          )}
          <h2 className="text-2xl mt-10">How to convert YouTube to MP3</h2>
          <p className="mt-5">
            Are you looking for a seamless way to convert YouTube videos to MP3 files? Look no further than YouTube to MP3, the premier tool designed to make your life easier. With our user-friendly application, all you need to do is paste the YouTube video link into our platform, wait a brief moment as our app swiftly locates your video, and then click 'Download' to instantly save the MP3 to your device. Whether you're looking to enjoy your favorite songs offline, compile playlists, or just save those inspiring talks without the need for internet access, YouTube to MP3 makes it all possible with just a few clicks. Our service ensures high-quality audio files, making it the perfect choice for music lovers and content creators alike.
          </p>
          <h2 className="text-2xl mt-10">Why choose YouTube to MP3?</h2>
          <p className="mt-5 mb-4">
            Why Choose YouTubeToMP3.Tube?
            Fast and Reliable
            Our platform ensures quick and reliable conversions, allowing you to download your favorite audio content without any hassle. You don't have to wait for long processing times or deal with unreliable services.
            High-Quality MP3 Files
            We prioritize the quality of your downloads. Our service guarantees high-quality MP3 files, preserving the original sound quality of the YouTube video.
            User-Friendly Interface
            YouTubeToMP3.Tube is designed with simplicity in mind. Our intuitive interface makes it easy for anyone to convert YouTube videos to MP3 files, regardless of their technical expertise.
            No Registration Required
            Unlike other services, we don't require you to create an account or provide personal information. Simply paste the YouTube URL and start your conversion immediately.
            Safe and Secure
            We prioritize your privacy and security. Our website is secure, and we ensure that your data remains protected throughout the conversion process.
          </p>
        </div>
        <Accordion />
      </div>
    </>
  )
}

export default Home
