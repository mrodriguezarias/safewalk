import walkService from "../services/walk"
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
  updatePosition: async (id, position) => {
    return await walkService.addPosition(id, position)
  },
  get: async (id) => {
    return await walkService.get(id)
  },
}

export default walkController
