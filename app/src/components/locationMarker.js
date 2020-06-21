import React, { useState, useEffect, memo } from "react"
import { StyleSheet, View } from "react-native"
import { Marker } from "react-native-maps"
import * as Location from "expo-location"
import _ from "lodash"

const ANCHOR = { x: 0.5, y: 0.5 }

const colorOfmyLocationMapMarker = "blue"

const SIZE = 20
const HALO_RADIUS = 6
const HALO_SIZE = SIZE + HALO_RADIUS

const LocationMarker = (props) => {
  const [location, setLocation] = useState()

  useEffect(() => {
    let subscription = null
    ;(async () => {
      const { status } = await Location.requestPermissionsAsync()
      if (status === "granted") {
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            maximumAge: 1000,
            timeout: 20000,
          },
          ({ coords }) => {
            if (!_.isEqual(location, coords)) {
              setLocation(coords)
            }
          },
        )
      }
    })()
    return () => {
      subscription && subscription.remove()
    }
  }, [])

  if (!location) {
    return null
  }

  return (
    <Marker
      anchor={ANCHOR}
      style={styles.mapMarker}
      coordinate={location}
      {...props}
    >
      <View style={styles.container}>
        <View style={styles.markerHalo} />
        <View style={styles.marker} />
      </View>
    </Marker>
  )
}

const styles = StyleSheet.create({
  mapMarker: {
    zIndex: 1000,
  },
  container: {
    width: HALO_SIZE,
    height: HALO_SIZE,
  },
  markerHalo: {
    position: "absolute",
    backgroundColor: "white",
    top: 0,
    left: 0,
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: Math.ceil(HALO_SIZE / 2),
    margin: 0,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  marker: {
    justifyContent: "center",
    backgroundColor: colorOfmyLocationMapMarker,
    width: SIZE,
    height: SIZE,
    borderRadius: Math.ceil(SIZE / 2),
    margin: (HALO_SIZE - SIZE) / 2,
  },
  markerText: { width: 0, height: 0 },
})

export default memo(LocationMarker)
