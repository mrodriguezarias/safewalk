import walkActions from "../actions/walk"

const initialState = {
  source: "hasta",
  target: "",
}

const load = (state, { source, target }) => ({
  ...state,
  source,
  target,
})
const setSource = (state, { source }) => ({ ...state, source })
const setTarget = (state, { target }) => ({ ...state, target })

const walkReducer = (state = initialState, action) => {
  const { type, payload = {} } = action
  switch (type) {
    case walkActions.LOAD:
      return load(state, payload)
    case walkActions.SET_SOURCE:
      return setSource(state, payload)
    case walkActions.SET_TARGET:
      return setTarget(state, payload)
    default:
      return state
  }
}

export default walkReducer
