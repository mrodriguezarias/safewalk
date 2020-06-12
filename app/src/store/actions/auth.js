import authController from "../../../../shared/controllers/auth"
import storageUtils from "../../../../shared/utils/storage"

const authActions = {
  LOAD: "LOAD",
  SIGNUP: "SIGNUP",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  load: (state) => ({ type: authActions.LOAD, payload: state }),
  signUp: (user) => async (dispatch) => {
    await storageUtils.set("user", user)
    dispatch({ type: authActions.SIGNUP, payload: { user } })
  },
  logIn: (user) => async (dispatch) => {
    await storageUtils.set("user", user)
    dispatch({ type: authActions.LOGIN, payload: { user } })
  },
  logOut: () => async (dispatch) => {
    await authController.logOut()
    await storageUtils.set("user")
    dispatch({ type: authActions.LOGOUT })
  },
}

export default authActions
