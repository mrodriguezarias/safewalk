import requestUtils from "../utils/request"

const contactService = {
  path: "/contacts",
  create: async (data) => {
    return requestUtils.post(contactService.path, data)
  },
}

export default contactService
