import requestUtils from "../utils/request"
import urlUtils from "../utils/url"

const authService = {
  path: "/auth",
  signUp: async (name, password) => {
    const url = urlUtils.join(authService.path, "signup")
    return requestUtils.post(url, {
      name,
      password,
    })
  },
  logIn: async (name, password, shouldBeAdmin) => {
    const url = urlUtils.join(authService.path, "login")
    return requestUtils.post(url, {
      name,
      password,
      shouldBeAdmin,
    })
  },
  logOut: async (userId) => {
    const url = urlUtils.join(authService.path, "logout")
    return requestUtils.post(url, {
      userId,
    })
  },
}

export default authService
