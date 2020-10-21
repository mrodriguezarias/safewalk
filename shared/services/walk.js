import requestUtils from "../utils/request"
import urlUtils from "../utils/url"

const walkService = {
  path: "/walks",
  create: async (data) => {
    return requestUtils.post(walkService.path, data)
  },
  update: async (id, data) => {
    const url = urlUtils.join(walkService.path, id)
    return requestUtils.put(url, data)
  },
  get: async (id) => {
    const url = urlUtils.join(walkService.path, id)
    return requestUtils.get(url)
  },
}

export default walkService
