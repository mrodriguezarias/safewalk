import authController from "../../../shared/controllers/auth"
import HttpError from "../../../shared/errors/http"

const authProvider = {
  login: ({ username, password }) => {
    return authController.logIn(username, password, true)
  },
  logout: () => {
    return authController.logOut()
  },
  checkError: ({ status, message }) => {
    return Promise.reject(new HttpError(status, message))
  },
  checkAuth: () => {
    return authController.isLoggedIn()
      ? Promise.resolve()
      : Promise.reject(new Error())
  },
  getPermissions: () => {
    return Promise.resolve()
  },
}

export default authProvider
