import HttpStatus from "http-status-codes"
import categoryModel from "../models/category"
import HttpError from "../../../shared/errors/http"
import dbUtils from "../utils/db"
import _ from "lodash"

const categoryService = {
  getCategories: async (filter = {}, range, sort) => {
    filter = dbUtils.transformQueryFilter(filter)
    const query = categoryModel.find(filter)
    const count = await categoryModel.count({})
    const [paginated, contentRangeHeader] = dbUtils.paginate(
      query,
      range,
      count,
    )
    const sorted = await dbUtils.sort(paginated, sort)
    const categories = _.map(sorted, (category) => category.toJSON())
    return { categories, contentRangeHeader }
  },
  getCategoryById: async (id) => {
    const category = await categoryModel.findById(id)
    if (!category) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Category not found")
    }
    return category
  },
  getCategoryByName: async (name) => {
    const category = await categoryModel.findOne({ name })
    if (!category) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Category not found")
    }
    return category.toJSON()
  },
  createCategory: async (data) => {
    const name = data?.name
    if (!name) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Category name not provided")
    }

    const category = await categoryModel.findOne({ name })
    if (category) {
      throw new HttpError(
        HttpStatus.CONFLICT,
        `La categoría '${name}' ya existe`,
      )
    }

    const newCategory = await categoryModel.create({
      ...data,
    })
    return newCategory.toJSON()
  },
  updateCategory: async (id, data) => {
    if (_.isEmpty(data)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Data not provided")
    }

    const category = await categoryModel.findById(id)
    if (!category) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Category not found")
    }

    if (data.name && data.name !== category.name) {
      const existing = await categoryModel.findOne({ name: data.name })
      if (existing) {
        throw new HttpError(
          HttpStatus.CONFLICT,
          `La categoría ${data.name} ya existe`,
        )
      }
    }

    data = _.omit(data, "id")
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true },
    )
    if (!updatedCategory) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Category not found")
    }
    return updatedCategory.toJSON()
  },
  deleteCategory: async (id) => {
    const category = await categoryModel.findByIdAndRemove(id)
    if (!category) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Category not found")
    }
    return category.toJSON()
  },
  deleteAllCategories: async () => {
    const count = await categoryModel.count({})
    if (count > 0) {
      await categoryModel.collection.drop()
    }
  },
}

export default categoryService
