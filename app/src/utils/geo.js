import * as Location from "expo-location"
import geoService from "../../../shared/services/geo"
import GeoError from "../../../shared/errors/geo"

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
    let location = {}
    if (!highAccuracy) {
      location = await Location.getLastKnownPositionAsync()
    } else {
      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        maximumAge: 1000,
        timeout: 20000,
      })
    }
    const { longitude, latitude } = location?.coords ?? {}
    if (!longitude || !latitude) {
      return null
    }
    if (checkBoundary) {
      const isWithinBoundary = await geoService.isWithinBoundary(
        longitude,
        latitude,
      )
      if (!isWithinBoundary) {
        if (!shouldThrow) {
          return null
        }
        throw new GeoError(
          "De momento solo proveemos servicio dentro de la Ciudad de Buenos Aires.",
        )
      }
    }
    return { longitude, latitude }
  },
}

export default geoUtils
