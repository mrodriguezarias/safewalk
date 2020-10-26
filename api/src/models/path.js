import mongoose from "mongoose"
import dbUtils from "../utils/db"

const pathSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Node",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Node",
    },
  },
  {
    toJSON: dbUtils.toJSON(),
  },
)

const pathModel = mongoose.model("Path", pathSchema)

export default pathModel
