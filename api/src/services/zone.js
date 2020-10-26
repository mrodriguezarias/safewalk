import HttpStatus from "http-status-codes"
import zoneModel from "../models/zone"
import HttpError from "../../../shared/errors/http"
import dbUtils from "../utils/db"
import _ from "lodash"

const zoneService = {
  getZones: async ({ filter = {}, range, sort } = {}) => {
    filter = dbUtils.transformQueryFilter(filter)
    const query = zoneModel.find(filter)
    const count = await zoneModel.count({})
    const [paginated, contentRangeHeader] = dbUtils.paginate(
      query,
      range,
      count,
    )
    const sorted = await dbUtils.sort(paginated, sort)
    const zones = _.map(sorted, (zone) => zone.toJSON())
    return { zones, contentRangeHeader }
  },
  getZoneById: async (id) => {
    const zone = await zoneModel.findById(id)
    if (!zone) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Zone not found")
    }
    return zone.toJSON()
  },
  createZone: async (data) => {
    if (_.isEmpty(data)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Zone not provided")
    }
    data = dbUtils.toDocWithLocation(data)
    const newZone = await zoneModel.create({
      ...data,
    })
    return newZone.toJSON()
  },
  updateZone: async (id, data) => {
    if (_.isEmpty(data)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Zone not provided")
    }

    const zone = await zoneModel.findById(id)
    if (!zone) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Zone not found")
    }

    data = dbUtils.toDocWithLocation(data)
    const updatedZone = await zoneModel.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true },
    )
    if (!updatedZone) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Zone not found")
    }
    return updatedZone.toJSON()
  },
  deleteZone: async (id) => {
    const zone = await zoneModel.findByIdAndDelete(id)
    if (!zone) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Zone not found")
    }
    return zone.toJSON()
  },
  deleteAllZones: async () => {
    const count = await zoneModel.count({})
    if (count > 0) {
      await zoneModel.collection.drop()
    }
  },
}

export default zoneService
