import { Joi } from "express-validation"

const boundaryValidation = {
  isWithinBoundary: {
    body: Joi.object({
      longitude: Joi.number().required(),
      latitude: Joi.number().required(),
    }),
  },
}

export default boundaryValidation
