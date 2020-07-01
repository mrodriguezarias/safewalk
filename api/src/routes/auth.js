import { validate } from "express-validation"

import authController from "../controllers/auth"
import authValidation from "../validations/auth"

const authRoute = {
  path: "/auth",
  configureRouter: (router) => {
    router.post(
      "/signup",
      validate(authValidation.signUp),
      authController.signUp,
    )
    router.post("/login", validate(authValidation.logIn), authController.logIn)
  },
}

export default authRoute
