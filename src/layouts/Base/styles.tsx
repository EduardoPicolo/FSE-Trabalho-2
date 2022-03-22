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
  display: grid;
  width: 100%;
  min-height: 85vh;
  padding: 2rem;
  border-radius: 16px;
  background: rgb(235 235 235 / 30%);
  backdrop-filter: blur(13px);
  -webkit-backdrop-filter: blur(13px);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 20px 30px;
`
