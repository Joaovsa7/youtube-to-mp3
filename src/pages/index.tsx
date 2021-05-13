import React, { useRef, useState } from "react"

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
    <Container maxW="container.sm">
      <Flex height='100vh' alignItems='center' justifyContent='center' flexDir='column'>
        <Heading as='h1' marginBottom={10}>
          Conversor de Youtube para mp3
        </Heading>
        <Box width='100%'>
          <form onSubmit={handleSubmit}>
            <Input type='text' placeholder='Digite aqui o link do youtube' marginBottom={5} ref={inputRef} />
            <Button colorScheme='blue' type='submit' marginBottom={5} isLoading={loading} loadingText='Procurando o vídeo...'>
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
              loadingText="Carregando..."
            >
              Download
            </Button>
          </>
        )}
      </Flex>
    </Container>
  )
}

export default Home
