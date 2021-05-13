import { Image } from "@chakra-ui/image"
import { Box, Flex, Heading, Text } from "@chakra-ui/layout"

interface Props {
  title?: string
  thumbnail?: string
  duration?: string
}

const Preview: React.FC<Props> = ({ title, thumbnail, duration }) => (
  <Flex
    alignItems='center'
    padding='20px'
    borderRadius={8}
    border='1px solid #ccc'
    backgroundColor='#f5f5f5'
    marginBottom={5}
  >
    <Box height='100%' marginRight={5}>
      <Image src={thumbnail} alt={title} width={120} />
    </Box>
    <Box marginRight={5}>
      <Heading as='h2' size='md'>{title}</Heading>
      <Text fontSize="xs">Duration: {duration}</Text>
    </Box>
  </Flex>
)

export default Preview
