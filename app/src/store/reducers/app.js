import appActions from "../actions/app"

const initialState = {
  loading: true,
  theme: "system",
}

const load = (state, { theme }) => ({
  ...state,
  loading: false,
  theme: theme ?? "system",
})

const setTheme = (state, { theme }) => ({
  ...state,
  theme,
})

const appReducer = (state = initialState, action) => {
  const { type, payload = {} } = action
  switch (type) {
    case appActions.LOAD:
      return load(state, payload)
    case appActions.SET_THEME:
      return setTheme(state, payload)
    default:
      return state
  }
}

export default appReducer
