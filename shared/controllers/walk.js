import walkService from "../services/walk"
import geoUtils from "../../shared/utils/geo"
import _ from "lodash"

const walkController = {
  start: async ({ user, path, source, target }) => {
    source = _.pick(source, ["name", "coords"])
    target = _.pick(target, ["name", "coords"])
    return await walkService.create({ user, path, source, target })
  },
  end: async (id, arrived = false) => {
    const now = Date.now()
    return await walkService.update(id, {
      arrived,
      end: now,
      updated: now,
    })
  },
  updatePosition: async (id, path, walked, position) => {
    const lastPosition = _.last(walked)
    let data = {
      updated: Date.now(),
    }
    if (!geoUtils.pointsAreNear(position, lastPosition)) {
      const safe = geoUtils.isNearPath(position, path)
      walked = [...walked, position]
      data = {
        ...data,
        position,
        walked,
        safe,
      }
    }
    return await walkService.update(id, data)
  },
}

export default walkController
