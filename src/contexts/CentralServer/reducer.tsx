import { CentralServerType } from '.'

export const stateReducer = (
  state: CentralServerType,
  newState: Partial<CentralServerType>
) => {
  return { ...state, ...newState }
}
