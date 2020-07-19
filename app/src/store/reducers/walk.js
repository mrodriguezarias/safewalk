import walkActions from "../actions/walk"

const initialState = {
  source: null,
  target: null,
}

const load = (state, { source, target }) => ({
  ...state,
  source,
  target,
})

const setLocation = (state, { key, location }) => ({
  ...state,
  [key]: location,
})

const swapLocations = (state) => ({
  ...state,
  source: state.target,
  target: state.source,
})

const walkReducer = (state = initialState, action) => {
  const { type, payload = {} } = action
  switch (type) {
    case walkActions.LOAD:
      return load(state, payload)
    case walkActions.SET_LOCATION:
      return setLocation(state, payload)
    case walkActions.SWAP_LOCATIONS:
      return swapLocations(state, payload)
    default:
      return state
  }
}

export default walkReducer
