import storageUtils from "../../../../shared/utils/storage"
import authActions from "./auth"
import walkActions from "./walk"
import geoUtils from "../../utils/geo"
import geoService from "../../../../shared/services/geo"

const appActions = {
  LOAD: "APP/LOAD",
  SET_THEME: "APP/SET_THEME",
  SET_MAP_PROVIDER: "APP/SET_MAP_PROVIDER",
  SET_MAP_TYPE: "APP/SET_MAP_TYPE",
  SET_HEIGHT: "APP/SET_HEIGHT",
  SET_MOCK_LOCATION: "APP/SET_MOCK_LOCATION",
  load: () => async (dispatch) => {
    const token = await storageUtils.get("auth")
    const user = await storageUtils.get("user")
    const theme = await storageUtils.get("theme")
    const mapProvider = await storageUtils.get("mapProvider")
    const mapType = await storageUtils.get("mapType")
    const mockLocation = await storageUtils.get("mockLocation")
    const logged = token !== null
    dispatch({ type: authActions.LOAD, payload: { logged, user } })
    dispatch({
      type: appActions.LOAD,
      payload: { theme, mapProvider, mapType, mockLocation },
    })
    let coords = mockLocation
    if (!coords) {
      coords = await geoUtils.getCurrentLocation({ checkBoundary: true })
    }
    if (coords) {
      const address = await geoService.getAddressOfLocation(coords)
      dispatch(walkActions.setLocation("source", { name: address, coords }))
    }
  },
  setTheme: (theme) => async (dispatch) => {
    await storageUtils.set("theme", theme)
    dispatch({ type: appActions.SET_THEME, payload: { theme } })
  },
  setMapProvider: (mapProvider) => async (dispatch) => {
    await storageUtils.set("mapProvider", mapProvider)
    dispatch({ type: appActions.SET_MAP_PROVIDER, payload: { mapProvider } })
  },
  setMapType: (mapType) => async (dispatch) => {
    await storageUtils.set("mapType", mapType)
    dispatch({ type: appActions.SET_MAP_TYPE, payload: { mapType } })
  },
  setHeight: (component, height) => ({
    type: appActions.SET_HEIGHT,
    payload: { component, height },
  }),
  setMockLocation: (mockLocation) => async (dispatch) => {
    await storageUtils.set("mockLocation", mockLocation)
    dispatch({
      type: appActions.SET_MOCK_LOCATION,
      payload: { mockLocation },
    })
  },
}

export default appActions
