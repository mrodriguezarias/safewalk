import React, { useCallback, useRef, useEffect, useLayoutEffect } from "react"
import { StyleSheet, View } from "react-native"
import { useTheme } from "react-native-paper"
import { useSelector, useDispatch } from "react-redux"
import { useIsFocused } from "@react-navigation/native"

import ActionBar from "../../components/map/actionBar"
import MapView from "../../components/map/mapView"
import LocationMarker from "../../components/map/locationMarker"
import LocationTracker from "../../components/map/locationTracker"
import PathMarker from "../../components/map/pathMarker"
import generalUtils from "../../../../shared/utils/general"
import MainMenu from "../../components/map/mainMenu"
import ReportFab from "../../components/map/reportFab"
import LocationDialog from "../../components/map/locationDialog"
import appActions from "../../store/actions/app"
import Snackbar from "../../components/map/snackbar"
import useContacts from "../../hooks/user/useContacts"

const MainScreen = ({ navigation }) => {
  const theme = useTheme()
  const mapRef = useRef()
  const locationDialog = useRef()
  const source = useSelector((state) => state.walk.source?.coords)
  const target = useSelector((state) => state.walk.target?.coords)
  const walk = useSelector((state) => state.walk.walk)
  const places = useSelector((state) => state.walk.places)
  const path = useSelector((state) => state.walk.path)
  const canChangeLocation = useSelector(
    (state) => state.auth?.user?.canChangeLocation,
  )
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const carers = useContacts("carer", isFocused && walk)
  const hasCarers = carers.length > 0

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

  const handleMapLongPress = async (event) => {
    const {
      nativeEvent: { coordinate: coords },
    } = event
    if (canChangeLocation) {
      dispatch(appActions.setMockLocation(coords))
    }
  }

  const handleLayout = (event) => {
    fitMap()
    const { height } = event.nativeEvent.layout
    dispatch(appActions.setHeight("map", height))
  }

  const posMarkerColor =
    walk?.safe === false ? theme.colors.rogue : theme.colors.accent

  return (
    <View style={styles.container}>
      <LocationTracker />
      <LocationDialog ref={locationDialog} navigation={navigation} />
      <ActionBar navigation={navigation} hasCarers={hasCarers} />
      <ReportFab hasCarers={hasCarers} />
      <MapView
        ref={mapRef}
        onLayout={handleLayout}
        showsUserLocation
        tintColor={posMarkerColor}
        onLongPress={handleMapLongPress}
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
        <PathMarker coords={path} zIndex={1} />
        <PathMarker
          coords={walk?.walked}
          zIndex={2}
          color={theme.colors.path}
        />
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
      <Snackbar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default MainScreen
