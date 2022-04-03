import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState
} from 'react'
import cloneDeep from 'lodash/cloneDeep'
import type { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { Socket } from 'socket.io-client'

import { useSocket } from '@hooks/useSocket'

import {
  ACTIONS,
  stateReducer,
  UpdateDeviceAction,
  UpdateTemperatureAction
} from './reducer'
import { mapEventToDevice } from './utils'

type Status = 'pending' | boolean | 'not-connected'

export type Sensors = {
  countIn: Status
  countOut: Status
  temperature: Status | number
  humidity: Status | number
  presence: Status
  smoke: Status
  door: Status
  windows: {
    room1: Status
    room2: Status
  }
}

export type Devices = {
  AC: Status
  bulbs: {
    room01: Status
    room02: Status
    corridor: Status
  }
  sprinkler: Status
}

export type FloorComponents = Devices & { sensors: Sensors } & {
  connected: boolean
  occupation: number
}

export type CentralServerType = {
  floors: Record<string, FloorComponents> | null
  addFloor: (floor: string) => void
  removeFloor: (floor: string) => void
  getFloors: string[]
  currentFloor: string | null
  setCurrentFloor: (floor: string | null) => void
  updateDevice: (payload: UpdateDeviceAction['payload']) => void
  updateTemperature: (data: ServerEvent) => void
  handleEvent: (event: ServerEvent) => void
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null
}

export const CentralServerDefaultValues: CentralServerType = {
  floors: {},
  addFloor: () => ({}),
  removeFloor: () => ({}),
  getFloors: [],
  currentFloor: null,
  setCurrentFloor: () => ({}),
  updateDevice: () => ({}),
  updateTemperature: () => ({}),
  handleEvent: () => ({}),
  socket: null
}

const defaultValues: FloorComponents = {
  connected: false,
  occupation: 0,
  AC: 'pending',
  sprinkler: 'not-connected',
  bulbs: {
    room01: 'pending',
    room02: 'pending',
    corridor: 'pending'
  },
  sensors: {
    temperature: 'pending',
    humidity: 'pending',
    countIn: 'pending',
    countOut: 'pending',
    presence: 'pending',
    smoke: 'pending',
    door: 'not-connected',
    windows: {
      room1: 'pending',
      room2: 'pending'
    }
  }
}

export const CentralServerContext = createContext<CentralServerType>(
  CentralServerDefaultValues
)

export const CentralServerProvider: React.FC = ({ children }) => {
  const socket = useSocket()

  const [state, dispatchEvent] = useReducer(stateReducer, {
    floors: {}
  })

  const [temperature, setTemperature] = useState<number | 'pending'>('pending')
  const [humidity, setHumidity] = useState<number | 'pending'>('pending')

  const [temperature2, setTemperature2] = useState<number | 'pending'>(
    'pending'
  )
  const [humidity2, setHumidity2] = useState<number | 'pending'>('pending')

  const getFloors = useMemo(() => Object.keys(state.floors), [state.floors])

  const [currentFloor, setCurrentFloor] = useState<string | null>(
    getFloors[0] || null
  )

  //   console.log('CentralServerProvider: ', state)

  const addFloor = useCallback((floor: string) => {
    dispatchEvent({
      type: ACTIONS.ADD_FLOOR,
      payload: { [floor]: cloneDeep(defaultValues) }
    })
  }, [])

  const removeFloor = useCallback((floor: string) => {
    dispatchEvent({
      type: ACTIONS.REMOVE_FLOOR,
      payload: floor
    })
  }, [])

  const updateDevice = useCallback((payload: UpdateDeviceAction['payload']) => {
    dispatchEvent({
      type: ACTIONS.UPDATE_DEVICE,
      payload
    })
  }, [])

  const handleEvent = useCallback(
    ({ from, type, value }: ServerEvent) => {
      console.log('Received event: ', { from, type, value })

      const payload = {
        floor: from,
        device: mapEventToDevice[type],
        status: Boolean(Number(value))
      }

      updateDevice(payload)
    },
    [updateDevice]
  )

  const updateTemperature = useCallback((event: ServerEvent) => {
    let data

    try {
      data = JSON.parse(event.value) as UpdateTemperatureAction['payload']
      console.log('TESTE: ', data)
    } catch (error) {
      console.error('Error parsing dht data: ', error)
    }

    dispatchEvent({
      type: ACTIONS.UPDATE_TEMPERATURE,
      payload: {
        floor: event.from,
        temperature: data?.temperature || -10,
        humidity: data?.humidity || -10
      }
    })
  }, [])

  const value = useMemo(
    () => ({
      floors: state.floors,
      getFloors,
      addFloor,
      removeFloor,
      currentFloor,
      setCurrentFloor,
      updateDevice,
      updateTemperature,
      handleEvent,
      socket
    }),
    [
      addFloor,
      currentFloor,
      getFloors,
      handleEvent,
      removeFloor,
      socket,
      state.floors,
      updateDevice,
      updateTemperature
    ]
  )

  return (
    <CentralServerContext.Provider value={value}>
      {children}
    </CentralServerContext.Provider>
  )
}

export function useCServer() {
  const context = useContext(CentralServerContext)

  if (!context) {
    throw new Error('useCServer must be used within a CentralServerProvider')
  }

  return context
}
