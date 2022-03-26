type NextPage = import('next').NextPage

type ReactElement = import('react').ReactElement

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => JSX.Element
}
