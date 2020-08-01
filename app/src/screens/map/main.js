import React, { useCallback, useRef, useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { useTheme } from "react-native-paper"
import { useSelector } from "react-redux"

import ActionBar from "../../components/map/actionBar"
import MapView from "../../components/map/mapView"
import LocationMarker from "../../components/map/locationMarker"
import PathMarker from "../../components/map/pathMarker"
import generalUtils from "../../../../shared/utils/general"

const MainScreen = ({ navigation }) => {
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
    fitMap()
  }, [fitMap, source, target, path])

  return (
    <View style={styles.container}>
      <ActionBar navigation={navigation} />
      <MapView ref={mapRef} onLayout={fitMap} showsUserLocation>
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
