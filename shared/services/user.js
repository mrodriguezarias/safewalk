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
  search: async (query) => {
    const url = urlUtils.join(userService.path, "search")
    return requestUtils.get(url, { query })
  },
}

export default userService
