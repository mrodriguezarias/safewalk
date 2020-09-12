import zoneController from "../controllers/zone"
import authMiddleware from "../middlewares/auth"
import { validate } from "express-validation"
import zoneValidation from "../validations/zone"

const zoneRoute = {
  path: "/zones",
  configureRouter: (router) => {
    router.get("/", authMiddleware(true), zoneController.getZones)
    router.get(
      "/:id",
      authMiddleware(true),
      validate(zoneValidation.getZone),
      zoneController.getZoneById,
    )
    router.post(
      "/",
      validate(zoneValidation.createZone),
      zoneController.createZone,
    )
    router.put(
      "/:id",
      authMiddleware(true),
      validate(zoneValidation.updateZone),
      zoneController.updateZone,
    )
    router.delete(
      "/:id",
      authMiddleware(true),
      validate(zoneValidation.deleteZone),
      zoneController.deleteZone,
    )
  },
}

export default zoneRoute
