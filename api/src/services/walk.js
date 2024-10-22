import HttpStatus from "http-status-codes"
import walkModel from "../models/walk"
import HttpError from "../../../shared/errors/http"
import dbUtils from "../utils/db"
import _ from "lodash"
import userModel from "../models/user"
import contactService from "./contact"
import pushUtils, { pushTypes } from "../utils/push"
import geoUtils from "../../../shared/utils/geo"

const geoKeys = {
  path: "line",
  position: "point",
}

const walkService = {
  getWalks: async ({ filter = {}, range, sort } = {}) => {
    filter = dbUtils.transformQueryFilter(filter)
    const query = walkModel.find(filter)
    const count = await walkModel.count({})
    const [paginated, contentRangeHeader] = dbUtils.paginate(
      query,
      range,
      count,
    )
    const sorted = await dbUtils.sort(paginated, sort)
    const walks = _.map(sorted, (walk) => walk.toJSON())
    return { walks, contentRangeHeader }
  },
  getWalkById: async (id, loggedId) => {
    const logged = await userModel.findById(loggedId)
    const isAdmin = logged?.admin
    const walk = await walkModel.findById(id)
    const isOwnWalk = walk && String(walk.user) === loggedId
    let isCaredWalk = false
    if (!isAdmin && !isOwnWalk && walk) {
      const cared = await contactService.getContactsForUser(loggedId, "cared")
      isCaredWalk = cared.map(({ id }) => id).includes(String(walk.user))
    }
    if (!isAdmin && !isOwnWalk && !isCaredWalk) {
      throw new HttpError(HttpStatus.FORBIDDEN, "Unauthorized")
    }
    if (!walk) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Walk not found")
    }
    return walk.toJSON()
  },
  getWalksForUser: async (userId, { page = 1, limit = 10, filters } = {}) => {
    const filter = { user: userId, ...filters }
    const query = walkModel.find(filter).sort({ start: -1 })
    const count = await walkModel.count(filter)
    const offset = (page - 1) * limit
    let walks = await query.skip(offset).limit(limit)
    walks = _.map(walks, (walk) => walk.toJSON())
    return { data: walks, total: count }
  },
  getWalkInProgress: async (userId) => {
    const walk = await walkModel.findOne({ user: userId, end: null })
    return walk ? walk.toJSON() : null
  },
  createWalk: async (data) => {
    if (_.isEmpty(data) || !data?.path?.[0]) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Walk not provided")
    }
    if (!data.position) {
      data.position = data.source.coords
    }
    if (!data.walked) {
      data.walked = [data.position]
    }
    data = dbUtils.toGeoJSON(data, geoKeys)
    const walk = await walkModel.create({
      ...data,
    })
    const user = await userModel.findById(walk.user)
    pushUtils.sendNotificationToCarers({
      type: pushTypes.startWalk,
      userId: walk.user,
      message: `${user.name} inició un recorrido desde ${walk.source.name}`,
      payload: { walkId: walk.id, contactId: walk.user },
    })
    return walk.toJSON()
  },
  updateWalk: async (id, data) => {
    if (_.isEmpty(data)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Walk not provided")
    }

    const walk = await walkModel.findById(id)
    if (!walk) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Walk not found")
    }

    data = dbUtils.toGeoJSON(data, geoKeys)
    const updatedWalk = await walkModel.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true },
    )
    if (!updatedWalk) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Walk not found")
    }

    if (!walk.arrived && updatedWalk.arrived) {
      const user = await userModel.findById(walk.user)
      pushUtils.sendNotificationToCarers({
        type: pushTypes.safeArrival,
        userId: walk.user,
        message: `${user.name} llegó seguro a ${walk.target.name}`,
        payload: { walkId: walk.id, contactId: walk.user },
      })
    }

    if (walk.safe && !updatedWalk.safe) {
      const user = await userModel.findById(walk.user)
      pushUtils.sendNotificationToCarers({
        type: pushTypes.rogueWalk,
        userId: walk.user,
        message: `${user.name} se desvió del camino seguro`,
        payload: { walkId: walk.id, contactId: walk.user },
      })
    }

    return updatedWalk.toJSON()
  },
  deleteWalk: async (id) => {
    const walk = await walkModel.findByIdAndRemove(id)
    if (!walk) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Walk not found")
    }
    return walk.toJSON()
  },
  deleteAllWalks: async () => {
    const count = await walkModel.count({})
    if (count > 0) {
      await walkModel.collection.drop()
    }
  },
  addPosition: async (id, position, loggedId) => {
    const walk = await walkService.getWalkById(id, loggedId)
    let { path, walked } = walk
    const lastPosition = _.last(walked)

    let data = {
      updated: Date.now(),
    }

    if (!geoUtils.pointsAreNear(position, lastPosition, 10)) {
      const safe = geoUtils.isNearPath(position, path, 80)
      walked = [...walked, position]
      data = {
        ...data,
        position,
        walked,
        safe,
      }
    }
    return await walkService.updateWalk(id, data)
  },
}

export default walkService
