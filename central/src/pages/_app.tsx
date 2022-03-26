import type { AppProps } from 'next/app'
import Head from 'next/head'
import NextNprogress from 'nextjs-progressbar'
import { toast } from 'react-toastify'
import { ChakraProvider } from '@chakra-ui/react'
import { NextPageWithLayout } from 'types/next-page'

import { CentralServerProvider } from '@contexts/CentralServer'
import { BaseLayout } from '@layouts/Base'
import { IconGradient } from '@UI/iconGradient'

// import { SWRConfig, SWRConfiguration } from 'swr'
import { GlobalStyles } from '@styles/globals'
import { theme } from '@styles/theme'
// import { theme } from '@styles/theme'
import 'react-loading-skeleton/dist/skeleton.css'
import 'react-toastify/dist/ReactToastify.css'

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

// const swrConfig: SWRConfiguration = {
//   revalidateOnFocus: process.env.NODE_ENV !== 'development',
//   shouldRetryOnError: false
// }

const nextNprogressOptions = {
  showSpinner: false
}

toast.configure({
  autoClose: 4000,
  position: 'top-right'
})

toast.configure({
  position: 'bottom-center',
  autoClose: false,
  closeButton: false,
  enableMultiContainer: true,
  containerId: 'fetch-error'
})

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <BaseLayout>{page}</BaseLayout>)

  return (
    <>
      <Head>
        <title>FSE Trabalho 2</title>
      </Head>

      <ChakraProvider theme={theme} resetCSS>
        <CentralServerProvider>
          <GlobalStyles />

          {/* <SWRConfig value={swrConfig}> */}
          <NextNprogress
            color="linear-gradient(
              to right,
              #00c3ff,
              #b169f3
              )"
            startPosition={0.4}
            stopDelayMs={200}
            height={4}
            options={nextNprogressOptions}
            showOnShallow={false}
          />
          {getLayout(<Component {...pageProps} />)}
          {/* </SWRConfig> */}
        </CentralServerProvider>

        <IconGradient />
      </ChakraProvider>
    </>
  )
}

export default App
