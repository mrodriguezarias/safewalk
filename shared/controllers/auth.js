import authService from "../services/auth"
import storageUtils from "../utils/storage"
import userService from "../services/user"
import generalUtils from "../utils/general"

const authController = {
  signUp: async (name, password) => {
    const response = await authService.signUp(name, password)
    await storageUtils.set("auth", response.token)
    return response.user
  },
  logIn: async (name, password, shouldBeAdmin = false) => {
    const response = await authService.logIn(name, password, shouldBeAdmin)
    await storageUtils.set("auth", response.token)
    return response.user
  },
  logOut: async (userId) => {
    await generalUtils.sleep(100)
    if (userId) {
      await authService.logOut(userId)
    }
    await storageUtils.set("auth")
  },
  isLoggedIn: async () => {
    const token = await storageUtils.get("auth")
    return token !== null
  },
  edit: async (data) => {
    const user = await storageUtils.get("user")
    const newUser = await userService.update(user.id, data)
    await storageUtils.set("user", newUser)
    return newUser
  },
  deleteAccount: async () => {
    const user = await storageUtils.get("user")
    if (user) {
      await userService.delete(user.id)
    }
  },
}

export default authController
