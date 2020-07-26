import nodeController from "../controllers/node"
import authMiddleware from "../middlewares/auth"
import { validate } from "express-validation"
import nodeValidation from "../validations/node"

const nodeRoute = {
  path: "/nodes",
  configureRouter: (router) => {
    router.get("/", authMiddleware(true), nodeController.getNodes)
    router.get(
      "/:id",
      authMiddleware(true),
      validate(nodeValidation.getNode),
      nodeController.getNodeById,
    )
    router.post(
      "/",
      authMiddleware(true),
      validate(nodeValidation.createNode),
      nodeController.createNode,
    )
    router.put(
      "/:id",
      authMiddleware(true),
      validate(nodeValidation.updateNode),
      nodeController.updateNode,
    )
    router.delete(
      "/:id",
      authMiddleware(true),
      validate(nodeValidation.deleteNode),
      nodeController.deleteNode,
    )
  },
}

export default nodeRoute
