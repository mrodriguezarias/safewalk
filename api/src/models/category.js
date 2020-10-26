import mongoose from "mongoose"
import dbUtils from "../utils/db"

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, index: { unique: true } },
  },
  {
    toJSON: dbUtils.toJSON(),
  },
)

const categoryModel = mongoose.model("Category", categorySchema)

export default categoryModel
