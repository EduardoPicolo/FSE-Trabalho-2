import type { CentralServerType } from '.'

export const stateReducer = (
  state: Omit<CentralServerType, 'dispatchEvent'>,
  newState: Partial<Omit<CentralServerType, 'dispatchEvent'>>
) => {
  return {
    groundFloor: {
      ...state.groundFloor,
      ...(newState?.groundFloor ?? {}),
      bulbs: { ...state?.groundFloor?.bulbs, ...newState?.groundFloor?.bulbs }
    },
    firstFloor: {
      ...state.firstFloor,
      ...(newState?.firstFloor ?? {}),
      bulbs: { ...state?.firstFloor?.bulbs, ...newState?.firstFloor?.bulbs }
    }
  }
}
