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
        <Text marginTop={5} mb={4}>

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
        </Text>
        <Accordion />
      </Container>
    </>
  )
}

export default Home
