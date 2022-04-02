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

import { ACTIONS, stateReducer, UpdateDeviceAction } from './reducer'
import { mapEventToDevice } from './utils'

type Status = 'pending' | boolean | 'not-connected'

export type Sensors = {
  countIn: Status
  countOut: Status
  temperature: Status
  humidity: Status
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
  handleEvent: (event: ServerEvent) => void
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null
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

export const CentralServerDefaultValues: CentralServerType = {
  floors: {},
  addFloor: () => ({}),
  removeFloor: () => ({}),
  getFloors: [],
  currentFloor: null,
  setCurrentFloor: () => ({}),
  updateDevice: () => ({}),
  handleEvent: () => ({}),
  socket: null
}

export const CentralServerContext = createContext<CentralServerType>(
  CentralServerDefaultValues
)

export const CentralServerProvider: React.FC = ({ children }) => {
  const socket = useSocket()

  const [state, dispatchEvent] = useReducer(stateReducer, {
    floors: {}
  })

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
      console.log('HandleEvent: ', { from, type, value })

      const payload = {
        floor: from,
        device: mapEventToDevice[type],
        status: Boolean(Number(value))
      }

      updateDevice(payload)
    },
    [updateDevice]
  )

  const value = useMemo(
    () => ({
      floors: state.floors,
      getFloors,
      addFloor,
      removeFloor,
      currentFloor,
      setCurrentFloor,
      updateDevice,
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
      updateDevice
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
