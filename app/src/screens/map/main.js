import React, { useState, useEffect, useRef, memo } from "react"
import MapView, { PROVIDER_GOOGLE } from "react-native-maps"
import { useTheme } from "react-native-paper"
import { StyleSheet, View } from "react-native"
import { useSelector } from "react-redux"
import * as Location from "expo-location"

import LocationMarker from "../../components/locationMarker"
import Bar from "./bar"
import generalUtils from "../../../../shared/utils/general"

const MainScreen = ({ navigation }) => {
  const [mapRegion, setMapRegion] = useState(null)
  const mapProvider = useSelector((state) => state.app.mapProvider)
  const source = useSelector((state) => state.walk.source?.coords)
  const target = useSelector((state) => state.walk.target?.coords)
  const theme = useTheme()
  const mapRef = useRef()

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

  useEffect(() => {
    if (!source || !target) {
      return
    }
    ;(async () => {
      await generalUtils.sleep(100)
      mapRef.current.fitToSuppliedMarkers(["mk1", "mk2", "mk3"], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      })
    })()
  }, [source, target])

  return (
    <View style={styles.container}>
      <Bar navigation={navigation} />
      <MapView
        ref={mapRef}
        style={styles.mapView}
        region={mapRegion}
        provider={mapProvider === "google" ? PROVIDER_GOOGLE : null}
        customMapStyle={theme.dark ? darkMapTheme : null}
      >
        <LocationMarker
          current
          color={theme.colors.primary}
          identifier="mk1"
          zIndex={1}
        />
        <LocationMarker
          coords={source}
          color={theme.colors.header}
          identifier="mk2"
          zIndex={2}
        />
        <LocationMarker
          coords={target}
          color={theme.colors.tabBar}
          identifier="mk3"
          zIndex={3}
        />
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    flex: 1,
  },
})

const darkMapTheme = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#263c3f",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6b9a76",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#38414e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#212a37",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9ca5b3",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#1f2835",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#f3d19c",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#2f3948",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#515c6d",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
]

export default memo(MainScreen)
