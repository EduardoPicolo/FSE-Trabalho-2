import { Box, Text, VStack } from '@chakra-ui/react'

import { formatDate } from '@utils/formatDate'

import * as S from './styles'

export const BaseLayout: React.FC = ({ children }) => {
  return (
    <Box minHeight="100vh" padding={['2', '4', '8', '10']}>
      <S.Video autoPlay playsInline muted loop poster="/img/graph.webp">
        <source src="/video/graphhh.webm" type="video/webm" />
        {/* <source src="/video/graph.mp4" type="video/mp4" /> */}
      </S.Video>

      <VStack margin="0 auto" maxWidth="1440px">
        <Text
          fontSize="xs"
          color="InactiveCaptionText"
          fontWeight="light"
          paddingRight="1.5"
          alignSelf="flex-end"
        >
          // {formatDate(new Date(), 'long', 'pt-BR')}
        </Text>
        <S.Main>{children}</S.Main>
      </VStack>
    </Box>
  )
}
