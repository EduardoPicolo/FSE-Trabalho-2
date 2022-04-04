import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState
} from 'react'
import { toast } from 'react-toastify'
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
import { mapDeviceToEvent, mapEventToDevice } from './utils'

const floorDefaultValues: FloorComponents = {
  connected: false,
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

export type CentralServerContextType = {
  totalOccupancy: number | 'pending'
  occupancy: Record<string, number>
  updateCount: (event: ServerEvent) => void
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

export const CentralServerDefaultValues: CentralServerContextType = {
  totalOccupancy: 0,
  occupancy: {},
  updateCount: () => ({}),
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

export const CentralServerContext = createContext<CentralServerContextType>(
  CentralServerDefaultValues
)

export const CentralServerProvider: React.FC = ({ children }) => {
  const socket = useSocket()

  const [state, dispatchEvent] = useReducer(stateReducer, {
    totalOccupancy: 0,
    occupancy: {},
    floors: {}
  })

  const updateCount = useCallback((event: ServerEvent) => {
    dispatchEvent({
      type: ACTIONS.UPDATE_OCCUPATION,
      payload: {
        floor: event.from,
        type: event.type,
        value: event.value
      }
    })
  }, [])

  const getFloors = useMemo(() => Object.keys(state.floors), [state.floors])

  const [currentFloor, setCurrentFloor] = useState<string | null>(
    getFloors[0] || null
  )

  const addFloor = useCallback((floor: string) => {
    dispatchEvent({
      type: ACTIONS.ADD_FLOOR,
      payload: { [floor]: cloneDeep(floorDefaultValues) }
    })
  }, [])

  const removeFloor = useCallback(
    (floor: string) => {
      dispatchEvent({
        type: ACTIONS.REMOVE_FLOOR,
        payload: floor
      })
      setCurrentFloor(Object.keys(state?.floors)?.[0] || null)
    },
    [state.floors]
  )

  const updateDevice = useCallback(
    (payload: UpdateDeviceAction['payload']) => {
      dispatchEvent({
        type: ACTIONS.UPDATE_DEVICE,
        payload
      })

      if (payload.device === 'sensors.smoke') {
        socket?.emit?.('input-event', {
          to: payload.floor,
          type: mapDeviceToEvent['sprinkler'],
          value: payload.status ? '1' : '0'
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [socket]
  )

  const handleEvent = useCallback(
    ({ from, type, value }: ServerEvent) => {
      console.log('Received event: ', { from, type, value })

      const payload = {
        floor: from,
        device: mapEventToDevice[type],
        status: Boolean(Number(value))
      }

      updateDevice(payload)

      if (payload?.device?.includes?.('sensor') && payload?.status) {
        toast.warning(
          `Sensor ${mapDeviceToEvent[payload.device]} Ativado no ${
            payload.floor
          }`,
          {
            theme: 'colored'
          }
        )
        const audio = new Audio('/sound/alert.wav')
        audio.play()
      }
    },
    [updateDevice]
  )

  const updateTemperature = useCallback((event: ServerEvent) => {
    let data

    try {
      data = JSON.parse(event.value) as UpdateTemperatureAction['payload']
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
      totalOccupancy: state.totalOccupancy,
      occupancy: state.occupancy,
      updateCount,
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
      state.occupancy,
      state.totalOccupancy,
      updateCount,
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
