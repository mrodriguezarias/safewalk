import { validate } from "express-validation"

import boundaryController from "../controllers/boundary"
import boundaryValidation from "../validations/boundary"

const boundaryRoute = {
  path: "/boundary",
  configureRouter: (router) => {
    router.post(
      "/within",
      validate(boundaryValidation.isWithinBoundary),
      boundaryController.isWithinBoundary,
    )
  },
}

export default boundaryRoute
