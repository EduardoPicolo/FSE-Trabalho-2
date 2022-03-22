import React, { createContext, useContext, useMemo, useReducer } from 'react'

import { stateReducer } from './reducer'

// import { useRequest } from '@hooks'

type Sensors = {
  temperature: number
  humidity: number
}

type Devices = {
  AC: boolean
  bulbs: {
    room01: boolean
    room02: boolean
    corridor: boolean
  }
}

export type CentralServerType = {
  groundFloor: Sensors & Devices
  '1': Sensors & Devices
}

const defaultValues = {
  temperature: 0,
  humidity: 0,
  AC: false,
  bulbs: {
    room01: false,
    room02: false,
    corridor: false
  }
}

export const CentralServerDefaultValues: CentralServerType = {
  groundFloor: defaultValues,
  '1': defaultValues
}

export const CentralServer = createContext<CentralServerType>(
  CentralServerDefaultValues
)

export const CentralServerProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, CentralServerDefaultValues)

  const value = useMemo(() => state, [state])

  return (
    <CentralServer.Provider value={value}>{children}</CentralServer.Provider>
  )
}

export function useCServer() {
  const context = useContext(CentralServer)

  if (!context) {
    throw new Error('useCServer must be used within a CentralServerProvider')
  }

  return context
}
