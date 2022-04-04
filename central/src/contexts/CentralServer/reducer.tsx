import { set } from 'lodash'

export enum ACTIONS {
  ADD_FLOOR = 'ADD_FLOOR',
  REMOVE_FLOOR = 'REMOVE_FLOOR',
  UPDATE_DEVICE = 'UPDATE_DEVICE',
  UPDATE_TEMPERATURE = 'UPDATE_TEMPERATURE',
  UPDATE_OCCUPATION = 'UPDATE_OCCUPATION'
}

type State = {
  floors: Record<string, FloorComponents>
  totalOccupancy: number | 'pending'
  occupancy: Record<string, number>
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
        totalOccupancy: state.totalOccupancy,
        occupancy: {
          ...state.occupancy,
          [Object?.keys?.(action.payload)?.[0]]: 0
        },
        floors: { ...state?.floors, ...action?.payload }
      }
      break

    case ACTIONS.REMOVE_FLOOR:
      delete state?.floors?.[action?.payload]
      delete state?.occupancy?.[action?.payload]

      return {
        totalOccupancy: state.totalOccupancy,
        occupancy: state.occupancy,
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
        totalOccupancy: state.totalOccupancy,
        occupancy: state.occupancy,
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
        totalOccupancy: state.totalOccupancy,
        occupancy: state.occupancy,
        floors: { ...state?.floors, [floor]: updatedFloor }
      }
      break
    }

    case ACTIONS.UPDATE_OCCUPATION: {
      const { floor, type, value } = action.payload as UpdateCountPayload
      console.log('UPDATE occupancy', floor, type, value)

      let totalOccupancy = state.totalOccupancy
      let occupancy = state.occupancy?.[floor]

      if (type === 'contagemPredio') {
        if (state.totalOccupancy === 0 && Number(value) === -1) {
          totalOccupancy = 0
        } else {
          totalOccupancy = (state.totalOccupancy as number) + Number(value)
        }

        if (occupancy === 0 && Number(value) === -1) {
          occupancy = 0
        } else occupancy = occupancy + Number(value)

        return {
          totalOccupancy,
          occupancy: { ...state.occupancy, [floor]: occupancy },
          floors: state?.floors
        }
      }

      if (type === 'contagemAndar') {
        let count = state.occupancy?.[floor] || 0
        let updatedTerreoCount = state.occupancy?.['Térreo']

        if (Number(value) === 1)
          updatedTerreoCount = (updatedTerreoCount as number) - 1
        else if (Number(value) === -1)
          updatedTerreoCount = (updatedTerreoCount as number) + 1

        if (count === 0 && Number(value) === -1) {
          count = 0
        } else {
          count = (count as number) + Number(value)
        }

        return {
          totalOccupancy,
          occupancy: {
            ...state.occupancy,
            Térreo: updatedTerreoCount,
            [floor]: count
          },
          floors: state?.floors
        }
      }

      return state

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
