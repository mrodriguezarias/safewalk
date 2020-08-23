import walkActions from "../actions/walk"

const initialState = {
  source: null,
  target: null,
  path: [],
  places: [],
}

const load = (state, { source, target }) => ({
  ...state,
  source,
  target,
})

const setLocation = (state, { key, location }) => {
  return {
    ...state,
    [key]: location,
    path: [],
    places: state.places.filter(({ id }) => id !== location.id),
  }
}

const swapLocations = (state) => ({
  ...state,
  source: state.target,
  target: state.source,
})

const setPath = (state, { path }) => ({
  ...state,
  path,
})

const markPlace = (state, { place }) => ({
  ...state,
  places: [...state.places, place],
})

const unmarkPlace = (state, { place }) => ({
  ...state,
  places: state.places.filter(({ id }) => id !== place.id),
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
    case walkActions.SET_PATH:
      return setPath(state, payload)
    case walkActions.MARK_PLACE:
      return markPlace(state, payload)
    case walkActions.UNMARK_PLACE:
      return unmarkPlace(state, payload)
    default:
      return state
  }
}

export default walkReducer
