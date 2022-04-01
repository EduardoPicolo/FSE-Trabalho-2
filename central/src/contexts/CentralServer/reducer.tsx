import { FloorComponents } from '.'

export enum ACTIONS {
  ADD_FLOOR = 'ADD_FLOOR',
  REMOVE_FLOOR = 'REMOVE_FLOOR'
}

type State = {
  floors: Record<string, FloorComponents>
}

type Action = {
  type: ACTIONS
  payload: any
}

export const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTIONS.ADD_FLOOR:
      return { floors: { ...state.floors, ...action.payload } }
    case ACTIONS.REMOVE_FLOOR:
      delete state?.floors?.[action?.payload]

      return { floors: { ...state.floors } }
    default:
      console.log('Invalid action')

      return { ...state }
      break
  }

  //   return {
  //     floors: {
  //       ...state,
  //       ...newState
  //     }
  //     // groundFloor: {
  //     //   ...state.groundFloor,
  //     //   ...(newState?.groundFloor ?? {}),
  //     //   bulbs: { ...state?.groundFloor?.bulbs, ...newState?.groundFloor?.bulbs }
  //     // },
  //     // firstFloor: {
  //     //   ...state.firstFloor,
  //     //   ...(newState?.firstFloor ?? {}),
  //     //   bulbs: { ...state?.firstFloor?.bulbs, ...newState?.firstFloor?.bulbs }
  //     // }
  //   }
}
