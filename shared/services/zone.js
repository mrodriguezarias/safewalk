import requestUtils from "../utils/request"

const zoneService = {
  path: "/zones",
  create: async (data) => {
    return requestUtils.post(zoneService.path, data)
  },
}

export default zoneService
