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

type Status = 'pending' | boolean

export type Sensors = {
  occupation: number
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
  AC: 'pending',
  sprinkler: 'pending',
  bulbs: {
    room01: 'pending',
    room02: 'pending',
    corridor: 'pending'
  },
  sensors: {
    temperature: 'pending',
    humidity: 'pending',
    occupation: 0,
    presence: 'pending',
    smoke: 'pending',
    door: 'pending',
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
      const payload = {
        floor: from,
        device: '',
        status: Boolean(Number(value))
      }

      switch (type) {
        // case 'temperatura':
        //   payload.device = 'sensors.temperature'
        //   break
        // case 'umidade':
        //   payload.device = 'sensors.humidity'
        //   break
        case 'presenca':
          payload.device = 'sensors.presence'
          break
        case 'fumaca':
          payload.device = 'sensors.smoke'

          if (value === '1')
            updateDevice({ floor: from, device: 'sprinkler', status: true })
          else updateDevice({ floor: from, device: 'sprinkler', status: false })

          break
        case 'janela 01':
          payload.device = 'sensors.windows.room1'
          break
        case 'janela 02':
          payload.device = 'sensors.windows.room2'
          break
        case 'porta':
          payload.device = 'sensors.door'
          break
        case 'lampada 01':
          payload.device = 'bulbs.room01'
          break
        case 'lampada 02':
          payload.device = 'bulbs.room02'
          break
        case 'lampada 03':
          payload.device = 'bulbs.corridor'
          break
        case 'ar-condicionado':
          payload.device = 'AC'
          break
        case 'aspersor':
          payload.device = 'sprinkler'
          break
        default:
          break
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
