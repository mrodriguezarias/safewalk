import _ from "lodash"

const urlUtils = {
  join: (...parts) => {
    return _(parts)
      .compact()
      .map((part) => _.trim(part, "/"))
      .join("/")
  },
}

export default urlUtils
