import type { CSSProperties } from 'react'

import { Portal } from '@components/Portal'

const svgStyle: CSSProperties = { position: 'absolute' }

export const IconGradient = () => {
  return (
    <Portal>
      <svg width="0" height="0" style={svgStyle}>
        <linearGradient id="svg-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop stopColor="#2584b5" offset="0%" />
          <stop stopColor="#8500ff" offset="100%" />
        </linearGradient>
      </svg>
    </Portal>
  )
}
