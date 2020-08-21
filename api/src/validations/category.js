import { Joi } from "express-validation"
import validationUtils from "../utils/validation"

const categorySchema = {
  id: Joi.string().custom(validationUtils.objectId),
  name: Joi.string().min(4).max(16),
}

const categoryValidation = {
  getCategory: {
    params: Joi.object({
      id: categorySchema.id.required(),
    }),
  },
  createCategory: {
    body: Joi.object({
      name: categorySchema.name.required(),
    }),
  },
  updateCategory: {
    params: Joi.object({
      id: categorySchema.id.required(),
    }),
    body: Joi.object({
      id: categorySchema.id,
      name: categorySchema.name,
    }),
  },
  deleteCategory: {
    params: Joi.object({
      id: categorySchema.id.required(),
    }),
  },
}

export default categoryValidation
