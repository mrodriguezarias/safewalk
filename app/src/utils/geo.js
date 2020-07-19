import * as Location from "expo-location"

const geoUtils = {
  getCurrentLocation: async (highAccuracy = false) => {
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
    return {
      x: location?.coords?.longitude,
      y: location?.coords?.latitude,
    }
  },
}

export default geoUtils
