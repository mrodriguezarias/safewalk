import lodashMemoize from "lodash/memoize"

const generalUtils = {
  memoize: (fn) => lodashMemoize(fn, (...args) => JSON.stringify(args)),
}

export default generalUtils
