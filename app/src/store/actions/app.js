import storageUtils from "../../../../shared/utils/storage"
import authActions from "./auth"

const appActions = {
  LOAD: "LOAD",
  load: () => async (dispatch) => {
    const token = await storageUtils.get("auth")
    const user = await storageUtils.get("user")
    const logged = token !== null
    dispatch({ type: authActions.LOAD, payload: { logged, user } })
    dispatch({ type: appActions.LOAD })
  },
}

export default appActions
