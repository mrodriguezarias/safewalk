import storageUtils from "../../../../shared/utils/storage"
import authActions from "./auth"
import walkActions from "./walk"
import geoUtils from "../../utils/geo"

const appActions = {
  LOAD: "APP/LOAD",
  SET_THEME: "APP/SET_THEME",
  SET_MAP_PROVIDER: "APP/SET_MAP_PROVIDER",
  SET_HEIGHT: "APP/SET_HEIGHT",
  load: () => async (dispatch) => {
    const token = await storageUtils.get("auth")
    const user = await storageUtils.get("user")
    const theme = await storageUtils.get("theme")
    const mapProvider = await storageUtils.get("mapProvider")
    const logged = token !== null
    dispatch({ type: authActions.LOAD, payload: { logged, user } })
    dispatch({ type: appActions.LOAD, payload: { theme, mapProvider } })
    const coords = await geoUtils.getCurrentLocation()
    if (coords) {
      dispatch(
        walkActions.setLocation("source", { name: "Ubicación actual", coords }),
      )
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
  setHeight: (component, height) => ({
    type: appActions.SET_HEIGHT,
    payload: { component, height },
  }),
}

export default appActions
