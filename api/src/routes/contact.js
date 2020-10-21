import contactController from "../controllers/contact"
import authMiddleware from "../middlewares/auth"
import { validate } from "express-validation"
import contactValidation from "../validations/contact"

const contactRoute = {
  path: "/contacts",
  configureRouter: (router) => {
    router.post(
      "/",
      authMiddleware(true, "req.body.source"),
      validate(contactValidation.createContact),
      contactController.createContact,
    )
    router.get("/", authMiddleware(true), contactController.getContacts)
    router.get(
      "/pendingRequests",
      authMiddleware(true, "req.query.userId"),
      contactController.getPendingRequests,
    )
    router.get(
      "/forUser",
      authMiddleware(true, "req.query.userId"),
      contactController.getContactsForUser,
    )
    router.get("/user", authMiddleware(), contactController.getContactUser)
    router.get("/caredWalks", authMiddleware(), contactController.getCaredWalks)
    router.get("/ownWalks", authMiddleware(), contactController.getOwnWalks)
    router.get(
      "/:id",
      authMiddleware(true),
      validate(contactValidation.getContact),
      contactController.getContactById,
    )
    router.put(
      "/:id/respond",
      authMiddleware(true, "contact.target"),
      validate(contactValidation.respond),
      contactController.respond,
    )
    router.put(
      "/:id",
      authMiddleware(true),
      validate(contactValidation.updateContact),
      contactController.updateContact,
    )
    router.post("/alert", authMiddleware(), contactController.alertContacts)
    router.delete(
      "/remove",
      authMiddleware(true, "req.query.source"),
      contactController.removeContact,
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
