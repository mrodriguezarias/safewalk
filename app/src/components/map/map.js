import React, { useState, useEffect, useRef, memo, useCallback } from "react"
import MapView, { PROVIDER_GOOGLE } from "react-native-maps"
import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"
import { useSelector } from "react-redux"

import generalUtils from "../../../../shared/utils/general"
import geoUtils from "../../utils/geo"
import LocationMarker from "./locationMarker"
import PathMarker from "./pathMarker"
import { darkMapTheme } from "../../theme"

const Map = memo(() => {
  const [mapRegion, setMapRegion] = useState(null)
  const mapProvider = useSelector((state) => state.app.mapProvider)
  const theme = useTheme()
  const mapRef = useRef()
  const source = useSelector((state) => state.walk.source?.coords)
  const target = useSelector((state) => state.walk.target?.coords)
  const path = useSelector((state) => state.walk.path)

  const fitMap = useCallback(async () => {
    if (!source || !target) {
      return
    }
    await generalUtils.sleep(100)
    mapRef.current.fitToCoordinates([source, ...path, target], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    })
  }, [source, target, path])

  useEffect(() => {
    ;(async () => {
      if (mapRegion) {
        return
      }
      const location = await geoUtils.getCurrentLocation({
        checkBoundary: false,
      })
      setMapRegion({
        longitude: location?.longitude,
        latitude: location?.latitude,
        longitudeDelta: 0.0421,
        latitudeDelta: 0.0922,
      })
    })()
  }, [])

  useEffect(() => {
    fitMap()
  }, [fitMap, source, target, path])

  if (!mapRegion) {
    return null
  }
  return (
    <MapView
      ref={mapRef}
      style={styles.container}
      initialRegion={mapRegion}
      provider={mapProvider === "google" ? PROVIDER_GOOGLE : null}
      customMapStyle={theme.dark ? darkMapTheme : null}
      onLayout={fitMap}
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
      <PathMarker coords={path} />
    </MapView>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default Map
