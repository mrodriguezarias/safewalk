import pathController from "../controllers/path"
import authMiddleware from "../middlewares/auth"
import { validate } from "express-validation"
import pathValidation from "../validations/path"

const pathRoute = {
  path: "/paths",
  configureRouter: (router) => {
    router.get("/", authMiddleware(true), pathController.getPaths)
    router.get(
      "/:id",
      authMiddleware(true),
      validate(pathValidation.getPath),
      pathController.getPathById,
    )
    router.post(
      "/",
      authMiddleware(true),
      validate(pathValidation.createPath),
      pathController.createPath,
    )
    router.put(
      "/:id",
      authMiddleware(true),
      validate(pathValidation.updatePath),
      pathController.updatePath,
    )
    router.delete(
      "/:id",
      authMiddleware(true),
      validate(pathValidation.deletePath),
      pathController.deletePath,
    )
  },
}

export default pathRoute
