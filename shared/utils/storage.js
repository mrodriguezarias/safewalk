const getValue = (key) => {
  let value = localStorage.getItem(key)
  try {
    value = JSON.parse(value)
  } catch (err) {}
  return value
}

const storageUtils = {
  isset: (key) => {
    return localStorage.getItem(key) !== null
  },
  load: (key, defaultValue = undefined) => {
    try {
      return storageUtils.isset(key) ? getValue(key) : defaultValue
    } catch (err) {
      console.error(err)
      return defaultValue
    }
  },
  save: (key, value = undefined) => {
    try {
      if (value === undefined) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (err) {
      console.error(err)
    }
  },
  clear: (key = undefined) => {
    if (key === undefined) {
      localStorage.clear()
    } else {
      localStorage.removeItem(key)
    }
  },
}

export default storageUtils
