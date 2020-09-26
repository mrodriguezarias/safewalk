import contactController from "../controllers/contact"
import authMiddleware from "../middlewares/auth"
import { validate } from "express-validation"
import contactValidation from "../validations/contact"

const contactRoute = {
  path: "/contacts",
  configureRouter: (router) => {
    router.get("/", authMiddleware(true), contactController.getContacts)
    router.get(
      "/:id",
      authMiddleware(true),
      validate(contactValidation.getContact),
      contactController.getContactById,
    )
    router.post(
      "/",
      authMiddleware(true),
      validate(contactValidation.createContact),
      contactController.createContact,
    )
    router.put(
      "/:id",
      authMiddleware(true),
      validate(contactValidation.updateContact),
      contactController.updateContact,
    )
    router.delete(
      "/:id",
      authMiddleware(true),
      validate(contactValidation.deleteContact),
      contactController.deleteContact,
    )
  },
}

export default contactRoute
