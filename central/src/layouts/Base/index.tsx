import { useEffect } from 'react'
import { Box, Flex, Text, VStack } from '@chakra-ui/react'

import { formatDate } from '@utils/formatDate'

import * as S from './styles'

export const BaseLayout: React.FC = ({ children }) => {
  useEffect(() => {
    document.getElementsByTagName('video')[0].playbackRate = 0.6
  }, [])

  return (
    <Box minHeight="100vh" padding={['2', '4', '8', '10']}>
      <S.Video autoPlay playsInline muted loop poster="/img/graph.webp">
        <source src="/video/graphhh.webm" type="video/webm" />
        <source src="/video/graphhh.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </S.Video>

      <VStack margin="0 auto" width="fit-content" maxWidth="1440px">
        <Flex justifyContent="space-between" width="100%" px={2} mb={-2}>
          <Text fontSize="xs" color="gray.500" fontWeight="light">
            // Servidor Central
          </Text>
          <Text
            fontSize="xs"
            color="gray.500"
            fontWeight="light"
            alignSelf="flex-end"
          >
            {formatDate(new Date(), 'long', 'pt-BR')}
          </Text>
        </Flex>

        <S.Main>{children}</S.Main>

        <Text
          fontSize="xs"
          color="gray.500"
          fontWeight="light"
          paddingRight="1.5"
          alignSelf="flex-end"
        >
          // Fundamentos de Sistemas Embarcados - Trabalho 2
        </Text>
      </VStack>
    </Box>
  )
}
