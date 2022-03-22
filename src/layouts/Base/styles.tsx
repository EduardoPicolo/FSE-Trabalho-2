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
  min-height: 89vh;
  padding: 2rem;
  border-radius: 16px;
  background: rgb(0 0 0 / 40%);
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;
`
