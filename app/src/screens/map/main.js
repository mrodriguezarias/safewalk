import React, { useCallback, useRef, useEffect, useLayoutEffect } from "react"
import { StyleSheet, View } from "react-native"
import { useTheme } from "react-native-paper"
import { useSelector } from "react-redux"

import ActionBar from "../../components/map/actionBar"
import MapView from "../../components/map/mapView"
import LocationMarker from "../../components/map/locationMarker"
import LocationTracker from "../../components/map/locationTracker"
import PathMarker from "../../components/map/pathMarker"
import generalUtils from "../../../../shared/utils/general"
import MainMenu from "../../components/map/mainMenu"
import LocationDialog from "../../components/map/locationDialog"

const MainScreen = ({ navigation }) => {
  const theme = useTheme()
  const mapRef = useRef()
  const locationDialog = useRef()
  const source = useSelector((state) => state.walk.source?.coords)
  const target = useSelector((state) => state.walk.target?.coords)
  const safeWalk = useSelector((state) => state.walk.walk?.safe)
  const places = useSelector((state) => state.walk.places)
  const path = useSelector((state) => state.walk.path)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <MainMenu navigation={navigation} />,
    })
  }, [navigation])

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
    fitMap()
  }, [fitMap, source, target, path])

  const posMarkerColor = safeWalk ? theme.colors.accent : theme.colors.rogue

  return (
    <View style={styles.container}>
      <LocationTracker />
      <LocationDialog ref={locationDialog} navigation={navigation} />
      <ActionBar navigation={navigation} />
      <MapView
        ref={mapRef}
        onLayout={fitMap}
        showsUserLocation
        tintColor={posMarkerColor}
      >
        <LocationMarker
          coords={source}
          color={theme.colors.header}
          zIndex={2}
        />
        <LocationMarker
          coords={target}
          color={theme.colors.tabBar}
          zIndex={3}
        />
        <PathMarker coords={path} />
        {places.map((location, index) => (
          <LocationMarker
            key={index}
            coords={location.coords}
            color={location?.safe ? theme.colors.safe : theme.colors.marker}
            zIndex={4}
            onPress={() => locationDialog.current.show(location)}
          />
        ))}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default MainScreen
