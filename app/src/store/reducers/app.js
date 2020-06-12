import appActions from "../actions/app"

const initialState = {
  loading: true,
}

const load = (state) => ({ ...state, loading: false })

const appReducer = (state = initialState, action) => {
  const { type, payload = {} } = action
  switch (type) {
    case appActions.LOAD:
      return load(state, payload)
    default:
      return state
  }
}

export default appReducer
