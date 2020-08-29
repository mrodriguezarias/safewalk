import walkService from "../services/walk"
import geoUtils from "../../shared/utils/geo"
import _ from "lodash"

const walkController = {
  start: async (user, path) => {
    return await walkService.create({ user, path })
  },
  end: async (id, arrived = false) => {
    const now = Date.now()
    return await walkService.update(id, {
      arrived,
      end: now,
      updated: now,
    })
  },
  updatePosition: async (id, walked, position) => {
    const lastPosition = _.last(walked)
    let data = {
      updated: Date.now(),
    }
    if (!geoUtils.nearCoords(position, lastPosition)) {
      walked = [...walked, position]
      data = {
        ...data,
        position,
        walked,
      }
    }
    return await walkService.update(id, data)
  },
}

export default walkController
