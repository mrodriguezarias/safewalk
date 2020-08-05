import * as Location from "expo-location"
import geoService from "../../../shared/services/geo"

const geoUtils = {
  getCurrentLocation: async ({
    highAccuracy = false,
    shouldThrow = false,
    checkBoundary = true,
  } = {}) => {
    const { status } = await Location.requestPermissionsAsync()
    if (status !== "granted") {
      return null
    }
    let location
    if (!highAccuracy) {
      try {
        location = await Location.getLastKnownPositionAsync()
      } catch {}
    }
    if (!location) {
      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        maximumAge: 1000,
        timeout: 20000,
      })
    }
    const { longitude, latitude } = location?.coords ?? {}
    if (!longitude) {
      return null
    }
    const coords = { longitude, latitude }
    if (checkBoundary) {
      try {
        await geoService.isWithinBoundary(coords)
      } catch (error) {
        if (shouldThrow) {
          throw error
        }
        return null
      }
    }
    return coords
  },
}

export default geoUtils
