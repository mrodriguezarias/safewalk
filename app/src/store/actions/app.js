import storageUtils from "../../../../shared/utils/storage"
import authActions from "./auth"

const appActions = {
  LOAD: "LOAD",
  SET_THEME: "SET_THEME",
  SET_MAP_PROVIDER: "SET_MAP_PROVIDER",
  load: () => async (dispatch) => {
    const token = await storageUtils.get("auth")
    const user = await storageUtils.get("user")
    const theme = await storageUtils.get("theme")
    const mapProvider = await storageUtils.get("mapProvider")
    const logged = token !== null
    dispatch({ type: authActions.LOAD, payload: { logged, user } })
    dispatch({ type: appActions.LOAD, payload: { theme, mapProvider } })
  },
  setTheme: (theme) => async (dispatch) => {
    await storageUtils.set("theme", theme)
    dispatch({ type: appActions.SET_THEME, payload: { theme } })
  },
  setMapProvider: (mapProvider) => async (dispatch) => {
    await storageUtils.set("mapProvider", mapProvider)
    dispatch({ type: appActions.SET_MAP_PROVIDER, payload: { mapProvider } })
  },
}

export default appActions
