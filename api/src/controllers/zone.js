import HttpStatus from "http-status-codes"
import zoneService from "../services/zone"

const zoneController = {
  getZones: async (req, res, next) => {
    try {
      const { filter, range, sort } = req.query
      const { zones, contentRangeHeader } = await zoneService.getZones({
        filter,
        range,
        sort,
      })
      res.header("Content-Range", contentRangeHeader)
      res.status(HttpStatus.OK).json(zones)
    } catch (error) {
      next(error)
    }
  },
  getZoneById: async (req, res, next) => {
    const id = req.params.id
    try {
      const zone = await zoneService.getZoneById(id)
      res.status(HttpStatus.OK).json(zone)
    } catch (error) {
      next(error)
    }
  },
  createZone: async (req, res, next) => {
    const data = req.body
    try {
      const response = await zoneService.createZone(data)
      res.status(HttpStatus.CREATED).json(response)
    } catch (error) {
      next(error)
    }
  },
  updateZone: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    try {
      const response = await zoneService.updateZone(id, data)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  deleteZone: async (req, res, next) => {
    const id = req.params.id
    try {
      const response = await zoneService.deleteZone(id)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
}

export default zoneController
