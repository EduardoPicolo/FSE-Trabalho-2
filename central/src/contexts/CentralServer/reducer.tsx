import { set } from 'lodash'

import type { FloorComponents } from '.'

export enum ACTIONS {
  ADD_FLOOR = 'ADD_FLOOR',
  REMOVE_FLOOR = 'REMOVE_FLOOR',
  UPDATE_DEVICE = 'UPDATE_DEVICE',
  UPDATE_TEMPERATURE = 'UPDATE_TEMPERATURE',
  UPDATE_OCCUPATION = 'UPDATE_OCCUPATION'
}

type State = {
  totalOccupation: number | 'pending'
  floors: Record<string, FloorComponents>
}

type Action = {
  type: ACTIONS
  payload: any
}

export interface UpdateDeviceAction extends Action {
  type: ACTIONS.UPDATE_DEVICE
  payload: {
    floor: string
    device: string
    status: any
  }
}

export interface UpdateTemperatureAction extends Action {
  type: ACTIONS.UPDATE_TEMPERATURE
  payload: {
    floor: string
    temperature: number
    humidity: number
  }
}

export type UpdateCountPayload = {
  floor: string
  type: 'contagemPredio' | 'contagemAndar'
  value: number
}

export const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTIONS.ADD_FLOOR:
      return {
        totalOccupation: state.totalOccupation,
        floors: { ...state?.floors, ...action?.payload }
      }
      break

    case ACTIONS.REMOVE_FLOOR:
      delete state?.floors?.[action?.payload]

      return {
        totalOccupation: state.totalOccupation,
        floors: { ...state?.floors }
      }
      break

    case ACTIONS.UPDATE_DEVICE: {
      const { floor, device, status } = action.payload

      if (device === 'sensors.smoke') {
        if (status) console.log('Smoke detected!')
        set(state.floors?.[floor], 'sprinkler', status)
      }

      const updatedFloor = set(state.floors?.[floor], device, status)

      return {
        totalOccupation: state.totalOccupation,
        floors: { ...state?.floors, [floor]: updatedFloor }
      }
      break
    }

    case ACTIONS.UPDATE_TEMPERATURE: {
      const { floor, temperature, humidity } = action.payload

      if (temperature === -1 || humidity === -1) return state

      const updatedFloor = {
        ...state.floors?.[floor],
        sensors: { ...state.floors?.[floor]?.sensors, temperature, humidity }
      }

      return {
        totalOccupation: state.totalOccupation,
        floors: { ...state?.floors, [floor]: updatedFloor }
      }
      break
    }

    case ACTIONS.UPDATE_OCCUPATION: {
      const { floor, type, value } = action.payload as UpdateCountPayload
      console.log('UPDATE OCCUPATION', floor, type, value)

      let totalOccupation = state.totalOccupation

      if (type === 'contagemPredio') {
        if (state.totalOccupation === 'pending' && Number(value) === 1) {
          totalOccupation = 1
        } else if (
          state.totalOccupation === 'pending' &&
          Number(value) === -1
        ) {
          totalOccupation = 0
        } else if (state.totalOccupation === 0 && Number(value) === -1) {
          totalOccupation = 0
        } else {
          totalOccupation = (state.totalOccupation as number) + Number(value)
        }
      }

      let floorOccupation = state.floors?.[floor]?.occupation
      console.log('floorOccupation: ', floorOccupation)
      if (floorOccupation === 'pending') {
        floorOccupation = Number(value) === 1 ? 1 : 0
      } else if (floorOccupation === 0 && Number(value) === -1) {
        floorOccupation = 0
      } else floorOccupation = (floorOccupation as number) + Number(value)

      const updatedFloor = set(
        state.floors?.[floor],
        'occupation',
        floorOccupation
      )

      let updatedTerreoCount = state.floors?.['Térreo']?.occupation

      if (type === 'contagemAndar') {
        if (Number(value) === 1)
          updatedTerreoCount = (updatedTerreoCount as number) - 1
        else if (Number(value) === -1)
          updatedTerreoCount = (updatedTerreoCount as number) + 1

        const updatedTerreo = set(
          state.floors?.['Térreo'],
          'occupation',
          updatedTerreoCount
        )

        return {
          totalOccupation,
          floors: {
            ...state?.floors,
            [floor]: updatedFloor,
            Térreo: updatedTerreo
          }
        }
      }

      return {
        totalOccupation,
        floors: { ...state?.floors, [floor]: updatedFloor }
      }
      break
    }

    default:
      console.log(
        'Invalid action Invalid action Invalid action Invalid action Invalid action Invalid action Invalid action'
      )

      return state
      break
  }
}
