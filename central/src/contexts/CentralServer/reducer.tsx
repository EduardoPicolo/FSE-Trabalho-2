import { set } from 'lodash'

import type { FloorComponents } from '.'

export enum ACTIONS {
  ADD_FLOOR = 'ADD_FLOOR',
  REMOVE_FLOOR = 'REMOVE_FLOOR',
  UPDATE_DEVICE = 'UPDATE_DEVICE',
  UPDATE_TEMPERATURE = 'UPDATE_TEMPERATURE'
}

type State = {
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
    status: boolean
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

export const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTIONS.ADD_FLOOR:
      return { floors: { ...state?.floors, ...action?.payload } }
      break

    case ACTIONS.REMOVE_FLOOR:
      delete state?.floors?.[action?.payload]

      return { floors: { ...state?.floors } }
      break

    case ACTIONS.UPDATE_DEVICE: {
      const { floor, device, status } = action.payload

      if (device === 'sensors.smoke') {
        if (status) console.log('Smoke detected!')
        set(state.floors?.[floor], 'sensors.smoke', status)
      }

      const updatedFloor = set(state.floors?.[floor], device, status)

      return { floors: { ...state?.floors, [floor]: updatedFloor } }
      break
    }

    case ACTIONS.UPDATE_TEMPERATURE: {
      const { floor, temperature, humidity } = action.payload

      const updatedFloor = {
        ...state.floors?.[floor],
        sensors: { ...state.floors?.[floor]?.sensors, temperature, humidity }
      }

      return { floors: { ...state?.floors, [floor]: updatedFloor } }
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
