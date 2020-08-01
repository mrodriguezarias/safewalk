import React, { useLayoutEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import MapView from "../../components/map/mapView"
import LocationMarker from "../../components/map/locationMarker"
import AppbarAction from "../../components/appbarAction"
import appActions from "../../store/actions/app"

const ChangeLocationScreen = ({ navigation }) => {
  const mockLocation = useSelector((state) => state.app.mockLocation)
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <AppbarAction
            icon="delete"
            disabled={!mockLocation}
            onPress={handleDeleteLocation}
          />
        </>
      ),
    })
  }, [navigation, mockLocation])

  const handleMapPress = (event) => {
    const {
      nativeEvent: { coordinate: location },
    } = event
    dispatch(appActions.setMockLocation(location))
  }

  const handleDeleteLocation = () => {
    dispatch(appActions.setMockLocation(null))
  }

  return (
    <MapView onPress={handleMapPress} showsUserLocation={!mockLocation}>
      <LocationMarker coords={mockLocation} />
    </MapView>
  )
}

export default ChangeLocationScreen
