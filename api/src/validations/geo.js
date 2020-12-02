import { Joi } from "express-validation"
import validationUtils from "../utils/validation"

const geoPoint = Joi.object({
  longitude: Joi.number().required(),
  latitude: Joi.number().required(),
})

const geoValidation = {
  isWithinBoundary: {
    body: geoPoint.required(),
  },
  getSafestPath: {
    body: Joi.object({
      source: geoPoint.required(),
      target: geoPoint.required(),
    }),
  },
  getNearbyPlaces: {
    body: Joi.object({
      location: geoPoint.required(),
      query: Joi.string(),
      limit: Joi.number(),
      distance: Joi.number(),
    }),
  },
  getRelatedPlaces: {
    body: Joi.object({
      place: Joi.string().custom(validationUtils.objectId).required(),
      limit: Joi.number(),
      distance: Joi.number(),
    }),
  },
}

export default geoValidation
