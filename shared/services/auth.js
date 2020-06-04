import requestUtils from "../utils/request"
import urlUtils from "../utils/url"

const authService = {
  path: "/auth",
  logIn: async (name, password, shouldBeAdmin) => {
    const url = urlUtils.join(authService.path, "login")
    return requestUtils.post(url, {
      name,
      password,
      shouldBeAdmin,
    })
  },
}

export default authService
