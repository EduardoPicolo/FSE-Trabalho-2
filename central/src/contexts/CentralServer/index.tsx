import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState
} from 'react'

import { ACTIONS, stateReducer, UpdateDeviceAction } from './reducer'

type Status = boolean | number | 'pending'

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
  //   groundFloor: FloorComponents
  //   firstFloor: FloorComponents
  floors: Record<string, FloorComponents> | null
  addFloor: (floor: string) => void
  removeFloor: (floor: string) => void
  getFloors: string[]
  currentFloor: string | null
  setCurrentFloor: (floor: string | null) => void
  updateDevice: (payload: UpdateDeviceAction['payload']) => void
  handleEvent: (event: ServerEvent) => void
}

const defaultValues = {
  connected: false,
  occupation: 0,
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
  floors: null,
  addFloor: () => ({}),
  removeFloor: () => ({}),
  getFloors: [],
  currentFloor: null,
  setCurrentFloor: () => ({}),
  updateDevice: () => ({}),
  handleEvent: () => ({})
}

export const CentralServer = createContext<CentralServerType>(
  CentralServerDefaultValues
)

export const CentralServerProvider: React.FC = ({ children }) => {
  //   const [state, dispatchEvent] = useReducer(stateReducer, {
  //     floors: {}
  //   })
  const [state, dispatchEvent] = useReducer(stateReducer, {
    floors: {
      Térreo: {
        connected: false,
        occupation: 0,
        AC: true,
        sprinkler: false,
        bulbs: {
          room01: true,
          room02: false,
          corridor: false
        },
        sensors: {
          temperature: true,
          humidity: true,
          presence: false,
          smoke: false,
          door: true,
          windows: {
            room1: true,
            room2: true
          }
        }
      } as any,
      '1oAndar': defaultValues as any
    }
  })

  const getFloors = useMemo(() => Object.keys(state.floors), [state.floors])

  const [currentFloor, setCurrentFloor] = useState<string | null>(
    getFloors[0] || null
  )

  console.log('CentralServerProvider: ', state)

  const addFloor = useCallback(
    (floor: string) => {
      dispatchEvent({
        type: ACTIONS.ADD_FLOOR,
        payload: { [floor]: defaultValues }
      })
    },
    [dispatchEvent]
  )

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
        default:
          break
      }

      updateDevice(payload)
    },
    [updateDevice]
  )

  const value = useMemo(
    () => ({
      ...state,
      getFloors,
      addFloor,
      removeFloor,
      currentFloor,
      setCurrentFloor,
      updateDevice,
      handleEvent
    }),
    [
      addFloor,
      currentFloor,
      getFloors,
      handleEvent,
      removeFloor,
      state,
      updateDevice
    ]
  )

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
