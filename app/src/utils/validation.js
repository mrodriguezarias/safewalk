import _ from "lodash"
import generalUtils from "./general"

const validationUtils = {
  required: generalUtils.memoize(() => (value) =>
    _.isEmpty(value) ? "Requerido" : undefined,
  ),
  minLength: generalUtils.memoize((min) => (value) =>
    value && value.length < min
      ? `Debe tener ${min} caracteres como mínimo`
      : undefined,
  ),
  maxLength: generalUtils.memoize((max) => (value) =>
    value && value.length > max
      ? `Debe tener ${max} caracteres como máximo`
      : undefined,
  ),
}

export default validationUtils
