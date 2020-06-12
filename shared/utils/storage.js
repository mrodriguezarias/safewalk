import AsyncStorage from "@react-native-community/async-storage"
const APP_PREFIX = "@safewalk_"

const storageUtils = {
  get: async (key, defaultValue = null) => {
    let value = null
    try {
      value = await AsyncStorage.getItem(`${APP_PREFIX}${key}`)
      if (value !== null) {
        value = JSON.parse(value)
      }
    } catch (err) {
      console.error(err)
    }
    if (value === null) {
      value = defaultValue
    }
    return value
  },
  set: async (key, value = null) => {
    try {
      if (value === null) {
        await AsyncStorage.removeItem(`${APP_PREFIX}${key}`)
      } else {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(`${APP_PREFIX}${key}`, jsonValue)
      }
    } catch (err) {
      console.error(err)
    }
  },
}

export default storageUtils
