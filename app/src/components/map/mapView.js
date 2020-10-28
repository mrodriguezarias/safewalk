import React, { useState, useEffect, memo, forwardRef, useRef } from "react"
import RNMapView, { PROVIDER_GOOGLE } from "react-native-maps"
import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"
import { useSelector } from "react-redux"

import geoUtils from "../../utils/geo"
import { darkMapTheme } from "../../theme"
import LocationMarker from "./locationMarker"

const MapView = memo(
  forwardRef(({ children, showsUserLocation, ...props }, ref) => {
    const [mapRegion, setMapRegion] = useState(null)
    const mapProvider = useSelector((state) => state.app.mapProvider)
    const mapType = useSelector((state) => state.app.mapType)
    const mockLocation = useSelector((state) => state.app.mockLocation)
    const theme = useTheme()
    const mounted = useRef()

    useEffect(() => {
      mounted.current = true
      ;(async () => {
        if (mapRegion) {
          return
        }
        let location
        if (mockLocation) {
          location = mockLocation
        } else {
          location = await geoUtils.getCurrentLocation()
        }
        if (mounted.current) {
          setMapRegion({
            longitude: location?.longitude,
            latitude: location?.latitude,
            longitudeDelta: 0.0421,
            latitudeDelta: 0.0922,
          })
        }
      })()
      return () => {
        mounted.current = false
      }
    }, [])

    if (!mapRegion?.latitude) {
      return null
    }
    return (
      <RNMapView
        ref={ref}
        style={styles.container}
        mapType={mapType}
        initialRegion={mapRegion}
        provider={mapProvider === "google" ? PROVIDER_GOOGLE : null}
        customMapStyle={theme.dark ? darkMapTheme : null}
        userLocationAnnotationTitle=""
        showsPointsOfInterest={false}
        showsTraffic={false}
        toolbarEnabled={false}
        loadingEnabled
        loadingBackgroundColor={theme.colors.background}
        loadingIndicatorColor={theme.colors.accent}
        tintColor={theme.colors.accent}
        legalLabelInsets={{ bottom: -100 }}
        compassOffset={{ x: -5, y: 5 }}
        showsUserLocation={mockLocation ? false : showsUserLocation}
        {...props}
      >
        {showsUserLocation && mockLocation && (
          <LocationMarker
            coords={mockLocation}
            zIndex={1}
            color={props.tintColor ?? theme.colors.accent}
            radius={100}
          />
        )}
        {children}
      </RNMapView>
    )
  }),
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default MapView
