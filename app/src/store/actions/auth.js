import authController from "../../../../shared/controllers/auth"
import storageUtils from "../../../../shared/utils/storage"

const authActions = {
  LOAD: "AUTH/LOAD",
  SIGNUP: "AUTH/SIGNUP",
  LOGIN: "AUTH/LOGIN",
  LOGOUT: "AUTH/LOGOUT",
  EDIT: "AUTH/EDIT",
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
  edit: (user) => ({ type: authActions.EDIT, payload: { user } }),
}

export default authActions
