import styled from 'styled-components'

export const Video = styled.video`
  position: fixed;
  object-fit: cover;
  width: 100vw;
  height: 100vh;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: -1;
`

export const Main = styled.main`
  position: relative;
  width: 100%;
  max-width: 1440px;
  min-height: 75vh;
  margin: 0 auto;
  border-radius: 16px;
  background: rgb(255 255 255 / 50%);
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);
`
