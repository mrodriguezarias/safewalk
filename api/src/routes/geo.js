import { validate } from "express-validation"

import geoController from "../controllers/geo"
import geoValidation from "../validations/geo"

const geoRoute = {
  path: "/geo",
  configureRouter: (router) => {
    router.post(
      "/withinBoundary",
      validate(geoValidation.isWithinBoundary),
      geoController.isWithinBoundary,
    )
    router.post(
      "/safestPath",
      validate(geoValidation.getSafestPath),
      geoController.getSafestPath,
    )
    router.post(
      "/nearbyPlaces",
      validate(geoValidation.getNearbyPlaces),
      geoController.getNearbyPlaces,
    )
    router.post(
      "/searchPlaces",
      validate(geoValidation.searchPlaces),
      geoController.searchPlaces,
    )
  },
}

export default geoRoute
