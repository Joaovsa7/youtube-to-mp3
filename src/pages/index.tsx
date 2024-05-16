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
  Container,
  Text,
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
      <Container maxW="container.sm">
        <Flex minHeight='40vh' alignItems='center' justifyContent='center' flexDir='column'>
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
        <Heading as='h2' marginTop={10}>
            How to convert YouTube to MP3
          </Heading>
          <Text marginTop={5}>
          Are you looking for a seamless way to convert YouTube videos to MP3 files? Look no further than YouTube to MP3, the premier tool designed to make your life easier. With our user-friendly application, all you need to do is paste the YouTube video link into our platform, wait a brief moment as our app swiftly locates your video, and then click 'Download' to instantly save the MP3 to your device. Whether you're looking to enjoy your favorite songs offline, compile playlists, or just save those inspiring talks without the need for internet access, YouTube to MP3 makes it all possible with just a few clicks. Our service ensures high-quality audio files, making it the perfect choice for music lovers and content creators alike.
          </Text>
          <Heading as='h2' marginTop={10}>
            Why choose YouTube to MP3?
          </Heading>
          <Text marginTop={5}>
          Transform your multimedia experience with YouTube to MP3, a powerful tool designed to convert YouTube videos into high-quality MP3 files effortlessly. This application is tailored for simplicity and efficiency, enabling users to easily input a YouTube link, wait as the app processes the video, and download their audio file in just moments. Ideal for anyone looking to access their favorite YouTube content offline or integrate audio into personal projects, YouTube to MP3 ensures you get the best in audio quality and conversion speed. Take advantage of this reliable and user-friendly app to enrich your audio collection and keep your favorite tunes with you at all times, no matter where you go.
          </Text>
      </Container>
    </>
  )
}

export default Home
