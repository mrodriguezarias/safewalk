import categoryController from "../controllers/category"
import authMiddleware from "../middlewares/auth"
import { validate } from "express-validation"
import categoryValidation from "../validations/category"

const categoryRoute = {
  path: "/categories",
  configureRouter: (router) => {
    router.get("/", authMiddleware(true), categoryController.getCategories)
    router.get(
      "/:id",
      authMiddleware(true),
      validate(categoryValidation.getCategory),
      categoryController.getCategoryById,
    )
    router.post(
      "/",
      authMiddleware(true),
      validate(categoryValidation.createCategory),
      categoryController.createCategory,
    )
    router.put(
      "/:id",
      authMiddleware(true),
      validate(categoryValidation.updateCategory),
      categoryController.updateCategory,
    )
    router.delete(
      "/:id",
      authMiddleware(true),
      validate(categoryValidation.deleteCategory),
      categoryController.deleteCategory,
    )
  },
}

export default categoryRoute
