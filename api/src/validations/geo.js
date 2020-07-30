import { Joi } from "express-validation"

const geoPoint = Joi.object({
  longitude: Joi.number().required(),
  latitude: Joi.number().required(),
})

const geoValidation = {
  isWithinBoundary: {
    body: geoPoint,
  },
  getSafePath: {
    body: Joi.object({
      source: geoPoint.required(),
      target: geoPoint.required(),
    }),
  },
}

export default geoValidation
