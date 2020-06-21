import React, { useState, useEffect, memo } from "react"
import MapView from "react-native-maps"
import { StyleSheet, View, Dimensions } from "react-native"
import * as Location from "expo-location"

import LocationMarker from "../components/locationMarker"

const MapScreen = () => {
  const [mapRegion, setMapRegion] = useState(null)

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestPermissionsAsync()
      if (status !== "granted") {
        return
      }
      const location = await Location.getCurrentPositionAsync({})
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
    })()
  }, [])

  return (
    <View style={styles.container}>
      <MapView style={styles.mapStyle} region={mapRegion}>
        <LocationMarker />
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
})

export default memo(MapScreen)
