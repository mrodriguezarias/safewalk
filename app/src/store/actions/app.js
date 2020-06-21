import storageUtils from "../../../../shared/utils/storage"
import authActions from "./auth"

const appActions = {
  LOAD: "LOAD",
  SET_THEME: "SET_THEME",
  load: () => async (dispatch) => {
    const token = await storageUtils.get("auth")
    const user = await storageUtils.get("user")
    const theme = await storageUtils.get("theme")
    const logged = token !== null
    dispatch({ type: authActions.LOAD, payload: { logged, user } })
    dispatch({ type: appActions.LOAD, payload: { theme } })
  },
  setTheme: (theme) => async (dispatch) => {
    await storageUtils.set("theme", theme)
    dispatch({ type: appActions.SET_THEME, payload: { theme } })
  },
}

export default appActions
