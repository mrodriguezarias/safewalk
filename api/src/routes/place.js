import authMiddleware from "../middlewares/auth"
import { validate } from "express-validation"
import placeController from "../controllers/place"
import placeValidation from "../validations/place"

const placeRoute = {
  path: "/places",
  configureRouter: (router) => {
    router.get("/", authMiddleware(true), placeController.getPlaces)
    router.get(
      "/:id",
      authMiddleware(true),
      validate(placeValidation.getPlace),
      placeController.getPlaceById,
    )
    router.post(
      "/",
      authMiddleware(true),
      validate(placeValidation.createPlace),
      placeController.createPlace,
    )
    router.put(
      "/:id",
      authMiddleware(true),
      validate(placeValidation.updatePlace),
      placeController.updatePlace,
    )
    router.delete(
      "/:id",
      authMiddleware(true),
      validate(placeValidation.deletePlace),
      placeController.deletePlace,
    )
  },
}

export default placeRoute
