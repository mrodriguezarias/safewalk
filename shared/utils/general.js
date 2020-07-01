import _ from "lodash"

const generalUtils = {
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  renameKey: (obj, key, newKey) => {
    const objCopy = { ...obj }
    if (Object.keys(obj).includes(key)) {
      objCopy[newKey] = _.clone(obj[key], true)
      delete objCopy[key]
    }
    return objCopy
  },
}

export default generalUtils
