import requestUtils from "../utils/request"
import urlUtils from "../utils/url"

const boundaryService = {
  path: "/boundary",
  isWithinBoundary: async (longitude, latitude) => {
    const url = urlUtils.join(boundaryService.path, "within")
    return requestUtils.post(url, {
      longitude,
      latitude,
    })
  },
}

export default boundaryService
