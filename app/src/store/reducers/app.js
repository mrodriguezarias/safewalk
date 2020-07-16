import appActions from "../actions/app"
import { Platform, Dimensions } from "react-native"
const initialState = {
  loading: true,
  theme: "system",
  mapProvider: Platform.OS === "ios" ? "apple" : "google",
  heights: {
    window: Dimensions.get("window").height,
    header: 0,
    tabBar: 90,
    keyboard: 0,
  },
}

const load = (state, { theme, mapProvider }) => ({
  ...state,
  loading: false,
  ...(theme && { theme }),
  ...(mapProvider && { mapProvider }),
})

const setTheme = (state, { theme }) => ({
  ...state,
  theme,
})

const setMapProvider = (state, { mapProvider }) => ({
  ...state,
  mapProvider,
})

const setHeight = (state, { component, height }) => ({
  ...state,
  heights: {
    ...state.heights,
    [component]: height,
  },
})

const appReducer = (state = initialState, action) => {
  const { type, payload = {} } = action
  switch (type) {
    case appActions.LOAD:
      return load(state, payload)
    case appActions.SET_THEME:
      return setTheme(state, payload)
    case appActions.SET_MAP_PROVIDER:
      return setMapProvider(state, payload)
    case appActions.SET_HEIGHT:
      return setHeight(state, payload)
    default:
      return state
  }
}

export default appReducer
