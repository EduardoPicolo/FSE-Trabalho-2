import styled from 'styled-components'

export const Video = styled.video`
  position: fixed;
  object-fit: cover;
  width: auto;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  z-index: -100;
`

export const Main = styled.main`
  position: relative;
  display: grid;
  /* width: 100%; */
  width: auto;
  min-height: 85vh;
  padding: 2rem;
  border-radius: 16px;
  background: rgb(235 235 235 / 40%);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 20px 30px;
`
