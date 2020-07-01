import carerController from "../controllers/carer"
import authMiddleware from "../middlewares/auth"
import { validate } from "express-validation"
import carerValidation from "../validations/carer"

const carerRoute = {
  path: "/carers",
  configureRouter: (router) => {
    router.get("/", authMiddleware(true), carerController.getCarers)
    router.get(
      "/:id",
      authMiddleware(true),
      validate(carerValidation.getCarer),
      carerController.getCarerById,
    )
    router.post(
      "/",
      authMiddleware(true),
      validate(carerValidation.createCarer),
      carerController.createCarer,
    )
    router.put(
      "/:id",
      authMiddleware(true),
      validate(carerValidation.updateCarer),
      carerController.updateCarer,
    )
    router.delete(
      "/:id",
      authMiddleware(true),
      validate(carerValidation.deleteCarer),
      carerController.deleteCarer,
    )
  },
}

export default carerRoute
