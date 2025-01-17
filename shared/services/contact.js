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
  alertContacts: async () => {
    const url = urlUtils.join(contactService.path, "alert")
    return requestUtils.post(url)
  },
  getCaredWalks: async (userId, page) => {
    const url = urlUtils.join(contactService.path, "caredWalks")
    return requestUtils.get(url, { userId, page })
  },
  getOwnWalks: async (page) => {
    const url = urlUtils.join(contactService.path, "ownWalks")
    return requestUtils.get(url, { page })
  },
  get: async (userId) => {
    const url = urlUtils.join(contactService.path, "user")
    return requestUtils.get(url, { userId })
  },
}

export default contactService
