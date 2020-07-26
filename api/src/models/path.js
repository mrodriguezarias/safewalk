import { Schema, model } from "mongoose"
import dbUtils from "../utils/db"

const pathSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "Node",
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "Node",
    },
  },
  {
    toJSON: dbUtils.toJSON,
  },
)

const pathModel = model("Path", pathSchema)

export default pathModel
