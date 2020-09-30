import requestUtils from "../utils/request"
import urlUtils from "../utils/url"

const contactService = {
  path: "/contacts",
  create: async (data) => {
    return requestUtils.post(contactService.path, data)
  },
  getPendingRequests: async (userId) => {
    const url = urlUtils.join(contactService.path, "pendingRequests")
    return requestUtils.get(url, { userId })
  },
  respond: async (id, confirmed) => {
    const url = urlUtils.join(contactService.path, id, "respond")
    return requestUtils.put(url, { confirmed })
  },
  getContactsForUser: async (userId, relation) => {
    const url = urlUtils.join(contactService.path, "forUser")
    return requestUtils.get(url, { userId, relation })
  },
  removeContact: async (source, target, relation) => {
    const url = urlUtils.join(contactService.path, "remove")
    return requestUtils.delete(url, { source, target, relation })
  },
}

export default contactService
