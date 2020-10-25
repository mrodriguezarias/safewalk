import { validate } from "express-validation"

import authMiddleware from "../middlewares/auth"
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
    router.post(
      "/logout",
      authMiddleware(true, "req.body.userId"),
      validate(authValidation.logOut),
      authController.logOut,
    )
  },
}

export default authRoute
