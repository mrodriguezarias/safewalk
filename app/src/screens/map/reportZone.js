import React, { useState, useRef, useLayoutEffect, useCallback } from "react"
import { View, StyleSheet, Platform } from "react-native"
import { useTheme, Text, Divider } from "react-native-paper"
import Slider from "@react-native-community/slider"
import { MaterialIcons } from "@expo/vector-icons"

import MapView from "../../components/map/mapView"
import LocationMarker from "../../components/map/locationMarker"
import geoService from "../../../../shared/services/geo"
import Spinner from "../../components/spinner"
import AppbarAction from "../../components/appbarAction"
import Dialog from "../../components/dialog"
import zoneService from "../../../../shared/services/zone"

const ReportZoneScreen = ({ navigation }) => {
  const [location, setLocation] = useState()
  const [loading, setLoading] = useState(false)
  const [center, setCenter] = useState("")
  const [radius, setRadius] = useState(50)
  const [error, setError] = useState(null)
  const theme = useTheme()
  const mapRef = useRef()
  const confirmDialogRef = useRef()
  const successDialogRef = useRef()
  const errorDialogRef = useRef()

  const getConfirmButton = useCallback(
    () => (
      <AppbarAction
        icon={({ color, size }) => (
          <MaterialIcons name="done" size={size} color={color} />
        )}
        onPress={() => confirmDialogRef.current.show()}
        disabled={!center}
      />
    ),
    [center],
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => getConfirmButton(),
    })
  }, [navigation, getConfirmButton])

  const fitMap = (coords) => {
    const region = {
      longitude: coords.longitude,
      latitude: coords.latitude,
      longitudeDelta: 0.005,
      latitudeDelta: 0.005,
    }
    mapRef.current.animateToRegion(region)
  }

  const handleMapPress = async (event) => {
    const {
      nativeEvent: { coordinate: coords },
    } = event
    setLoading(true)
    try {
      await geoService.isWithinBoundary(coords)
      setLocation(coords)
      const address = await geoService.getAddressOfLocation(coords)
      if (!address) {
        setLocation(null)
      } else {
        fitMap(coords)
      }
      setCenter(address)
    } catch (error) {
      setError(error.message)
      errorDialogRef.current.show()
    } finally {
      setLoading(false)
    }
  }

  const confirmReport = async () => {
    const { longitude, latitude } = location
    await zoneService.create({ longitude, latitude, radius })
    successDialogRef.current.show()
  }

  const renderConfirmDialog = () => (
    <Dialog
      ref={confirmDialogRef}
      title="Confirmar Reporte"
      content="¿Seguro que quieres reportar esta zona como peligrosa?"
      cancel
      accept={{
        text: "Reportar",
        action: confirmReport,
        color: theme.colors.rogue,
      }}
    />
  )

  const renderSuccessDialog = () => (
    <Dialog
      ref={successDialogRef}
      onDismiss={() => navigation.goBack()}
      title="Reporte Confirmado"
      content="Gracias por informarnos que esta zona es peligrosa. Tu reporte nos ayudará a determinar los caminos más seguros."
      accept
    />
  )

  const renderErrorDialog = () => (
    <Dialog ref={errorDialogRef} title="Error" content={error} accept />
  )

  return (
    <>
      {renderConfirmDialog()}
      {renderSuccessDialog()}
      {renderErrorDialog()}
      <View style={{ backgroundColor: theme.colors.back }}>
        <View style={styles.selector}>
          <Text style={styles.label}>Centro:</Text>
          {location ? (
            loading ? (
              <Spinner style={styles.spinner} />
            ) : (
              <Text style={styles.center} numberOfLines={1}>
                {center}
              </Text>
            )
          ) : (
            <Text style={styles.centerPlaceholder}>
              Toca en el mapa para marcar el centro
            </Text>
          )}
        </View>
        <Divider />
        <View style={styles.selector}>
          <Text style={styles.label}>Radio:</Text>
          <Slider
            minimumValue={50}
            maximumValue={200}
            step={1}
            minimumTrackTintColor={theme.colors.primary}
            value={radius}
            onValueChange={setRadius}
            style={styles.slider}
          />
          <Text style={styles.radius}>{`${radius} metros`}</Text>
        </View>
        <Divider />
      </View>
      <MapView ref={mapRef} onPress={handleMapPress} showsUserLocation>
        <LocationMarker
          identifier="center"
          coords={location}
          color={theme.colors.zone}
          radius={radius}
        />
      </MapView>
    </>
  )
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: "row",
    alignItems: "center",
    height: 30,
    margin: 10,
  },
  slider: {
    flexGrow: 1,
    marginHorizontal: Platform.OS === "android" ? -5 : 0,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    marginRight: 10,
    minWidth: 50,
  },
  center: {
    flex: 1,
  },
  centerPlaceholder: {
    opacity: 0.5,
    fontStyle: "italic",
  },
  radius: {
    minWidth: 80,
    textAlign: "right",
  },
  spinner: {
    transform: [{ scale: 0.7 }],
    marginLeft: -5,
  },
})

export default ReportZoneScreen
