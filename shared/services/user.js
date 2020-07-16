import requestUtils from "../utils/request"
import urlUtils from "../utils/url"

const userService = {
  path: "/users",
  update: async (id, data) => {
    const url = urlUtils.join(userService.path, id)
    return requestUtils.put(url, data)
  },
  delete: async (id) => {
    const url = urlUtils.join(userService.path, id)
    return requestUtils.delete(url)
  },
}

export default userService
