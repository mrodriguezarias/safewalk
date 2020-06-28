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
  clear: async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys()
      const appKeys = allKeys.filter((key) => key.startsWith(APP_PREFIX))
      await AsyncStorage.multiRemove(appKeys)
    } catch (err) {
      console.error(err)
    }
  },
  getAll: async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys()
      const appKeys = allKeys.filter((key) => key.startsWith(APP_PREFIX))
      const all = {}
      for (const appKey of appKeys) {
        const key = appKey.replace(new RegExp(`^${APP_PREFIX}`), "")
        const value = await storageUtils.get(key)
        all[key] = value
      }
      return all
    } catch (err) {
      console.error(err)
    }
  },
}

export default storageUtils
