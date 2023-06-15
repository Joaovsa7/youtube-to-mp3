import React, { useRef, useState } from "react"
import Head from "next/head"

import api from "../../config/axios"

import { Button } from "@chakra-ui/button"
import { Input } from "@chakra-ui/input"
import { Box, Flex, Heading } from "@chakra-ui/layout"
import {
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Container
} from "@chakra-ui/react"

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
    })
  }

  const convertVideoToMp3 = () => {
    api.post<Blob>('/video/convert', {
      videoLink: inputRef.current.value
    }, {
      responseType: 'blob'
    }).then(({ data }) => {
      const blob = new Blob([data], { type: 'audio/mpeg' })
      const url = window.URL.createObjectURL(blob)
      const audio = new Audio()
      audio.src = url
      setDownloadLink(url)
    })
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
      <Container maxW="container.sm">
        <Flex height='100vh' alignItems='center' justifyContent='center' flexDir='column'>
          <Heading as='h1' marginBottom={10}>
            Convert youtube video to mp3
          </Heading>
          <Box width='100%'>
            <form onSubmit={handleSubmit}>
              <Input type='text' placeholder='youtube url' marginBottom={5} ref={inputRef} />
              <Button colorScheme='blue' type='submit' marginBottom={5} isLoading={loading} loadingText='Loading video...'>
                Pesquisar
              </Button>
            </form>
            {hasError && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>{error}</AlertTitle>
                <CloseButton position="absolute" right="8px" top="8px" onClick={() => setError(null)} />
              </Alert>
            )}
          </Box>
          {hasVideoData && inputRef?.current?.value && (
            <>
              <Preview {...videoData} />
              <Button
                href={downloadLink}
                target='_blank'
                as='a'
                download={videoData.title}
                isLoading={!downloadLink.length}
                loadingText="Loading..."
              >
                Download
              </Button>
            </>
          )}
        </Flex>
        <p>
        YouTubeToMP3.tube is the premier destination for converting YouTube videos to MP3 format effortlessly. With our intuitive interface and lightning-fast conversion process, you can seamlessly extract the audio from any YouTube video and enjoy it in high-quality MP3 format. Our website is designed to provide a smooth and efficient user experience, ensuring that you can convert your desired YouTube videos into audio files with utmost ease.

At YouTubeToMP3.tube, we prioritize the latest SEO strategies and incorporate highly relevant keywords to enhance our ranking on search engines like Google. With our commitment to optimizing your search results, you can easily find us using keywords such as "YouTube to MP3 converter," "convert YouTube videos to MP3," and "fast audio conversion." As a result, our website maintains a prominent presence, allowing you to access our services conveniently.

Our platform utilizes cutting-edge technology to ensure the highest audio quality for your converted MP3 files. Supporting a wide range of video formats, YouTubeToMP3.tube enables you to convert YouTube videos in various resolutions and bitrates. Whether you are a music lover, podcast enthusiast, or seeking inspirational content, our website empowers you to convert any YouTube video into an MP3 file effortlessly.

Visit YouTubeToMP3.tube today and experience the unparalleled convenience, speed, and exceptional audio quality that distinguish us from other platforms. Say goodbye to limitations and unlock the world of audio content from your favorite YouTube videos with just a few clicks. Enjoy an ad-free environment and a secure conversion process as you explore the vast audio possibilities that await you.
        </p>
      </Container>
    </>
  )
}

export default Home
