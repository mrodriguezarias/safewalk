import _ from "lodash"

const nonCapitalizableWords = [
  "y",
  "el",
  "la",
  "en",
  "del",
  "con",
  "de",
  "las",
  "los",
]

const titleCaseWord = (word, alwaysCapitalize = false) => {
  if (word === word.toUpperCase()) {
    return word
  }
  word = word.toLowerCase()
  const matches = word.match(/^(.*?)(\w)(.*)$/)
  const [pre, upper, post] = [matches?.[1], matches?.[2], matches?.[3]]
  if (
    !matches ||
    (!alwaysCapitalize && nonCapitalizableWords.includes(upper + post))
  ) {
    return word
  }
  return pre + upper.toUpperCase() + post
}

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
  titleCase: (string) => {
    return generalUtils.capitalize(
      string
        .split(" ")
        .map((word) => titleCaseWord(word))
        .join(" "),
    )
  },
  debounce: (func) => {
    setTimeout(func, 0)
  },
  capitalize: (string) => {
    return string.replace(/^\w/, (c) => c.toUpperCase())
  },
  normalize: (string) => {
    string = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    string = string.replace(/[^a-zA-Z\d\s]/g, "")
    string = string.toLowerCase()
    return string
  },
}

export default generalUtils
