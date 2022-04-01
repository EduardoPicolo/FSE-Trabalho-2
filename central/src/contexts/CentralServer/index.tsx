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
  temperature: Status
  humidity: Status
}

export type Devices = {
  AC: Status
  bulbs: {
    room01: Status
    room02: Status
    corridor: Status
  }
  windows: {
    room1: Status
    room2: Status
  }
}

export type FloorComponents = Sensors & Devices & { connected: boolean }

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
}

const defaultValues = {
  connected: false,
  temperature: 'pending',
  humidity: 'pending',
  AC: 'pending',
  bulbs: {
    room01: 'pending',
    room02: 'pending',
    corridor: 'pending'
  },
  windows: {
    room1: 'pending',
    room2: 'pending'
  }
}

export const CentralServerDefaultValues: CentralServerType = {
  floors: null,
  addFloor: () => ({}),
  removeFloor: () => ({}),
  getFloors: [],
  currentFloor: null,
  setCurrentFloor: () => ({}),
  updateDevice: () => ({})
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
        temperature: true,
        humidity: true,
        AC: true,
        bulbs: {
          room01: true,
          room02: false,
          corridor: false
        },
        windows: {
          room1: true,
          room2: true
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

  const value = useMemo(
    () => ({
      ...state,
      getFloors,
      addFloor,
      removeFloor,
      currentFloor,
      setCurrentFloor,
      updateDevice
    }),
    [addFloor, currentFloor, getFloors, removeFloor, state, updateDevice]
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
