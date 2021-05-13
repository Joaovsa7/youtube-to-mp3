import * as React from "react"
import { ChakraProvider } from "@chakra-ui/react"

function App({ Component }) {
  return (
    <ChakraProvider>
      <Component />
    </ChakraProvider>
  )
}

export default App
