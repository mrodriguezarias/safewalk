import { Router } from "express"
import { validate } from "express-validation"

import authMiddleware from "../middlewares/auth"
import authController from "../controllers/auth"
import userValidation from "../validations/user"

const authRoute = (() => {
  const path = "/auth"
  const router = Router()
  router.post(
    `${path}/signup`,
    validate(userValidation.createUser),
    authController.signUp,
  )
  router.post(
    `${path}/login`,
    validate(userValidation.createUser),
    authController.logIn,
  )
  router.post(`${path}/logout`, authMiddleware(), authController.logOut)
  return router
})()

export default authRoute
