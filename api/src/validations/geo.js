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
      limit: Joi.number(),
    }),
  },
  searchPlaces: {
    body: Joi.object({
      query: Joi.string().required(),
      limit: Joi.number(),
    }),
  },
}

export default geoValidation
