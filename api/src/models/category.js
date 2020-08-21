import { Schema, model } from "mongoose"
import dbUtils from "../utils/db"

const categorySchema = new Schema(
  {
    name: { type: String, index: { unique: true } },
  },
  {
    toJSON: dbUtils.toJSON(),
  },
)

const categoryModel = model("Category", categorySchema)

export default categoryModel
