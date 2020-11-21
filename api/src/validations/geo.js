import { Joi } from "express-validation"

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
}

export default geoValidation
