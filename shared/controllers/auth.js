import authService from "../services/auth"
import storageUtils from "../utils/storage"

const authController = {
  logIn: async (name, password, shouldBeAdmin = false) => {
    const response = await authService.logIn(name, password, shouldBeAdmin)
    storageUtils.save("auth", response.token)
    return response.user
  },
  logOut: async () => {
    storageUtils.clear("auth")
  },
  isLoggedIn: () => {
    return storageUtils.isset("auth")
  },
}

export default authController
