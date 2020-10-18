import appActions from "../actions/app"
import { Platform, Dimensions } from "react-native"
const initialState = {
  loading: true,
  theme: "system",
  mapProvider: Platform.OS === "ios" ? "apple" : "google",
  mapType: "standard",
  heights: {
    window: Dimensions.get("window").height,
    header: 0,
    keyboard: 0,
    map: 0,
  },
  mockLocation: null,
  mapSnackbar: "",
}

const load = (state, { theme, mapProvider, mapType, mockLocation }) => ({
  ...state,
  loading: false,
  ...(theme && { theme }),
  ...(mapProvider && { mapProvider }),
  ...(mapType && { mapType }),
  ...(mockLocation && { mockLocation }),
})

const setTheme = (state, { theme }) => ({
  ...state,
  theme,
})

const setMapProvider = (state, { mapProvider }) => ({
  ...state,
  mapProvider,
})

const setMapType = (state, { mapType }) => ({
  ...state,
  mapType,
})

const setHeight = (state, { component, height }) => ({
  ...state,
  heights: {
    ...state.heights,
    [component]: height,
  },
})

const setMockLocation = (state, { mockLocation }) => ({
  ...state,
  mockLocation,
})

const setMapSnackbar = (state, { mapSnackbar }) => ({
  ...state,
  mapSnackbar,
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
    case appActions.SET_MAP_TYPE:
      return setMapType(state, payload)
    case appActions.SET_HEIGHT:
      return setHeight(state, payload)
    case appActions.SET_MOCK_LOCATION:
      return setMockLocation(state, payload)
    case appActions.SET_MAP_SNACKBAR:
      return setMapSnackbar(state, payload)
    default:
      return state
  }
}

export default appReducer
