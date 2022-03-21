import { Box } from '@chakra-ui/react'

import * as S from './styles'

export const BaseLayout: React.FC = ({ children }) => {
  return (
    <Box minHeight="100vh" padding={['2', '4', '8', '12']}>
      <S.Video
        autoPlay
        playsInline
        muted
        loop
        poster="/img/background.jpg"
        id="myVideo"
      >
        <source src="/video/graph.mp4" type="video/mp4" />
      </S.Video>

      <S.Main>{children}</S.Main>
    </Box>
  )
}
