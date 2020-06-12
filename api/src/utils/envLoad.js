import dotenv from "dotenv"
import commandLineArgs from "command-line-args"
import envUtils from "../../../shared/utils/env"

const envLoadUtils = {
  load: () => {
    const options = commandLineArgs([
      {
        name: "env",
        alias: "e",
        defaultValue: "production",
        type: String,
      },
    ])
    const result = dotenv.config({
      path: `./env/${options.env}.env`,
    })
    if (result.error) {
      throw result.error
    }
    envUtils.load()
  },
}

export default envLoadUtils
