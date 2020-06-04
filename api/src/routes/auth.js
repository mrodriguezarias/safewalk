import { Router } from "express"
import { validate } from "express-validation"

import authController from "../controllers/auth"
import authValidation from "../validations/auth"

const authRoute = (() => {
  const path = "/auth"
  const router = Router()
  router.post(
    `${path}/signup`,
    validate(authValidation.signUp),
    authController.signUp,
  )
  router.post(
    `${path}/login`,
    validate(authValidation.logIn),
    authController.logIn,
  )
  return router
})()

export default authRoute
