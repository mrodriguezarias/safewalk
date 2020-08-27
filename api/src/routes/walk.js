import walkController from "../controllers/walk"
import authMiddleware from "../middlewares/auth"
import { validate } from "express-validation"
import walkValidation from "../validations/walk"

const walkRoute = {
  path: "/walks",
  configureRouter: (router) => {
    router.get("/", authMiddleware(true), walkController.getWalks)
    router.get(
      "/:id",
      authMiddleware(true),
      validate(walkValidation.getWalk),
      walkController.getWalkById,
    )
    router.post(
      "/",
      authMiddleware(true, "req.body.user"),
      validate(walkValidation.createWalk),
      walkController.createWalk,
    )
    router.put(
      "/:id",
      authMiddleware(true, "walk.user"),
      validate(walkValidation.updateWalk),
      walkController.updateWalk,
    )
    router.delete(
      "/:id",
      authMiddleware(true),
      validate(walkValidation.deleteWalk),
      walkController.deleteWalk,
    )
  },
}

export default walkRoute
