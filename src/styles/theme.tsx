import { extendTheme } from '@chakra-ui/react'

const fonts = {
  body: 'Roboto, system-ui, sans-serif',
  heading: 'POppins, Georgia, serif',
  mono: 'Menlo, monospace'
}

const colors = {
  cyan: {
    50: '#E5FFFB',
    100: '#B8FFF5',
    200: '#8AFFEE',
    300: '#5CFFE8',
    400: '#2EFFE1',
    500: '#00FFDB',
    600: '#00CCAF',
    700: '#009983',
    800: '#006658',
    900: '#00332C'
  },
  teal: {
    50: '#EBF9F9',
    100: '#C8EFEE',
    200: '#A4E5E3',
    300: '#81DAD7',
    400: '#5DD0CC',
    500: '#39C6C1',
    600: '#2E9E9B',
    700: '#227774',
    800: '#174F4D',
    900: '#0B2827'
  },
  blue: {
    50: '#E5F2FF',
    100: '#B8DBFF',
    200: '#8AC3FF',
    300: '#5CACFF',
    400: '#2E94FF',
    500: '#007DFF',
    600: '#0064CC',
    700: '#004B99',
    800: '#003266',
    900: '#001933'
  },
  purple: {
    50: '#EDE5FF',
    100: '#CEB8FF',
    200: '#AE8AFF',
    300: '#8F5CFF',
    400: '#6F2EFF',
    500: '#5000FF',
    600: '#4000CC',
    700: '#300099',
    800: '#200066',
    900: '#100033'
  },
  yellow: {
    50: '#FDF6E7',
    100: '#FBE6BC',
    200: '#F8D591',
    300: '#F5C566',
    400: '#F2B43B',
    500: '#EFA410',
    600: '#C0830C',
    700: '#906209',
    800: '#604206',
    900: '#302103'
  },
  orange: {
    50: '#FFF0E5',
    100: '#FFD4B8',
    200: '#FFB88A',
    300: '#FF9C5C',
    400: '#FF812E',
    500: '#FF6500',
    600: '#CC5100',
    700: '#993D00',
    800: '#662800',
    900: '#331400'
  },
  green: {
    50: '#E5FFF4',
    100: '#B8FFDF',
    200: '#8AFFCB',
    300: '#5CFFB7',
    400: '#2EFFA2',
    500: '#00FF8E',
    600: '#00CC72',
    700: '#009955',
    800: '#006639',
    900: '#00331C'
  }
}

export const theme = extendTheme({ colors, fonts })
