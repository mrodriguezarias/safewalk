import HttpStatus from "http-status-codes"
import categoryService from "../services/category"

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const { filter, range, sort } = req.query
      const {
        categories,
        contentRangeHeader,
      } = await categoryService.getCategories(filter, range, sort)
      res.header("Content-Range", contentRangeHeader)
      res.status(HttpStatus.OK).json(categories)
    } catch (error) {
      next(error)
    }
  },
  getCategoryById: async (req, res, next) => {
    const id = req.params.id
    try {
      const user = await categoryService.getCategoryById(id)
      res.status(HttpStatus.OK).json(user)
    } catch (error) {
      next(error)
    }
  },
  createCategory: async (req, res, next) => {
    const data = req.body
    try {
      const response = await categoryService.createCategory(data)
      res.status(HttpStatus.CREATED).json(response)
    } catch (error) {
      next(error)
    }
  },
  updateCategory: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    try {
      const response = await categoryService.updateCategory(id, data)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  deleteCategory: async (req, res, next) => {
    const id = req.params.id
    try {
      const response = await categoryService.deleteCategory(id)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
}

export default categoryController
