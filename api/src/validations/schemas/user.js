import { Joi } from "express-validation"
import validationUtils from "../../utils/validation"

const userSchema = {
  id: Joi.string().custom(validationUtils.objectId),
  name: Joi.string().min(4).max(16),
  password: Joi.string().min(8).max(32),
  admin: Joi.boolean().default(false),
}

export default userSchema
