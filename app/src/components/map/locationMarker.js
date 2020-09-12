import React, { useState, useEffect, memo } from "react"
import { StyleSheet, View } from "react-native"
import { useTheme } from "react-native-paper"
import { Marker, Circle } from "react-native-maps"
import * as Location from "expo-location"
import _ from "lodash"
import Color from "color"

const ANCHOR = { x: 0.5, y: 0.5 }

const SIZE = 16
const HALO_RADIUS = 6
const HALO_SIZE = SIZE + HALO_RADIUS

const LocationMarker = memo(
  ({ current, coords, color, radius, radiusColor, ...markerProps }) => {
    const [location, setLocation] = useState()
    const theme = useTheme()

    useEffect(() => {
      setLocation(coords)
    }, [coords])

    useEffect(() => {
      if (!current) {
        return
      }
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
    }, [current])

    if (!location) {
      return null
    }

    const renderRadius = () => {
      if (!radius) {
        return
      }
      let strokeColor, fillColor
      if (radiusColor) {
        strokeColor = Color(radiusColor).darken(0.3)
        fillColor = Color(radiusColor).alpha(0.5).lighten(0.1)
      }
      return (
        <Circle
          center={location}
          radius={radius}
          strokeColor={strokeColor}
          fillColor={fillColor}
        />
      )
    }

    return (
      <>
        {renderRadius()}
        <Marker
          anchor={ANCHOR}
          style={styles.mapMarker}
          coordinate={location}
          {...markerProps}
        >
          <View style={styles.container}>
            <View style={styles.markerHalo} />
            <View
              style={[
                styles.marker,
                { backgroundColor: color ?? theme.colors.primary },
              ]}
            />
          </View>
        </Marker>
      </>
    )
  },
)

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
    width: SIZE,
    height: SIZE,
    borderRadius: Math.ceil(SIZE / 2),
    margin: (HALO_SIZE - SIZE) / 2,
  },
  markerText: { width: 0, height: 0 },
})

export default LocationMarker
