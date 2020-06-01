import { Router } from "express"
import userController from "../controllers/user"
import authMiddleware from "../middlewares/auth"
import { validate } from "express-validation"
import userValidation from "../validations/user"

const userRoute = (() => {
  const path = "/user"
  const router = Router()
  router.get(`${path}s`, authMiddleware(true), userController.getUsers)
  router.get(
    `${path}/:id`,
    authMiddleware(true),
    validate(userValidation.getUser),
    userController.getUserById,
  )
  router.post(
    `${path}`,
    authMiddleware(true),
    validate(userValidation.createUser),
    userController.createUser,
  )
  router.put(
    `${path}/:id`,
    authMiddleware(true),
    validate(userValidation.updateUser),
    userController.updateUser,
  )
  router.delete(
    `${path}/:id`,
    authMiddleware(true),
    validate(userValidation.deleteUser),
    userController.deleteUser,
  )
  return router
})()

export default userRoute
