import userController from "../controllers/user"
import authMiddleware from "../middlewares/auth"
import { validate } from "express-validation"
import userValidation from "../validations/user"

const userRoute = {
  path: "/users",
  configureRouter: (router) => {
    router.get("/", authMiddleware(true), userController.getUsers)
    router.get(
      "/:id",
      authMiddleware(true),
      validate(userValidation.getUser),
      userController.getUserById,
    )
    router.post(
      "/",
      authMiddleware(true),
      validate(userValidation.createUser),
      userController.createUser,
    )
    router.put(
      "/:id",
      authMiddleware(true),
      validate(userValidation.updateUser),
      userController.updateUser,
    )
    router.delete(
      "/:id",
      authMiddleware(true),
      validate(userValidation.deleteUser),
      userController.deleteUser,
    )
  },
}

export default userRoute
