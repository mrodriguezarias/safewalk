import React, { useState, useEffect } from "react"
import { StyleSheet, ScrollView } from "react-native"
import { Searchbar, Paragraph, useTheme } from "react-native-paper"
import { useSelector, useDispatch } from "react-redux"
import { MaterialIcons } from "@expo/vector-icons"

import DismissKeyboard from "../../components/dismissKeyboard"
import Spinner from "../../components/spinner"
import walkActions from "../../store/actions/walk"
import appActions from "../../store/actions/app"
import geoService from "../../../../shared/services/geo"
import geoUtils from "../../utils/geo"
import GeoError from "../../../../shared/errors/geo"
import MapView from "../../components/map/mapView"
import LocationMarker from "../../components/map/locationMarker"
import LocationItem from "../../components/map/locationItem"
import alertUtils from "../../utils/alert"
import requestUtils from "../../../../shared/utils/request"

const ChangeLocationScreen = ({ route, navigation }) => {
  const theme = useTheme()
  const [previousQuery, setPreviousQuery] = useState()
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [noResults, setNoResults] = useState(false)
  const mockLocation = useSelector((state) => state.app.mockLocation)
  const [location, setLocation] = useState(null)
  const dispatch = useDispatch()
  const { key } = route.params ?? {}

  useEffect(() => {
    return () => {
      requestUtils.abort()
    }
  }, [])

  const handleChangeText = async (value) => {
    setResults([])
    setNoResults(false)
    setQuery(value)
    setLocation(null)
    if (!value) {
      requestUtils.abort()
    }
  }

  const doSearch = async (query) => {
    if (!query || query === previousQuery) {
      return
    }
    setResults([])
    setNoResults(null)
    setLoading(true)
    setPreviousQuery(query)
    try {
      let results = []
      const address = await geoService.searchAddress(query)
      if (address) {
        setResults([address])
        const nearby = await geoService.searchNearby(address.coords)
        results = [address, ...nearby]
      } else {
        const places = await geoService.searchPlaces(query)
        results = [...places]
      }
      setResults(results)
      setNoResults(results.length === 0 ? "Sin Resultados" : null)
    } catch (error) {
      if (error instanceof GeoError) {
        setNoResults(error.message)
      } else if (error.name !== "AbortError") {
        throw error
      }
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = async () => {
    let coords
    if (mockLocation) {
      coords = mockLocation
    } else {
      coords = await geoUtils.getCurrentLocation({ shouldThrow: true })
    }
    return coords
  }

  const saveLocation = async (location) => {
    requestUtils.abort()
    if (key) {
      dispatch(walkActions.setLocation(key, location))
    } else {
      dispatch(appActions.setMockLocation(location?.coords ?? null))
    }
    navigation.goBack()
  }

  const searchLocation = async (location) => {
    setLoading(true)
    setResults([])
    setNoResults(false)
    setQuery("")
    let coords = location
    try {
      if (!coords) {
        coords = await getCurrentLocation()
      }
      const address = await geoService.getAddressOfLocation(coords)
      if (!address) {
        throw new GeoError("Sin Resultados")
      }
      setQuery(address)
      doSearch(address)
    } catch (error) {
      setLoading(false)
      if (!location && error instanceof GeoError) {
        setNoResults(error.message)
      } else if (error.name !== "AbortError") {
        throw error
      }
    }
  }

  const getMarkerColor = () => {
    switch (key) {
      case "source":
        return theme.colors.header
      case "target":
        return theme.colors.tabBar
      default:
        return theme.colors.primary
    }
  }

  const handleMapPress = async (event) => {
    const {
      nativeEvent: { coordinate: coords },
    } = event
    setLocation(coords)
    if (!key) {
      saveLocation({ coords })
      return
    }
    try {
      await geoService.isWithinBoundary(coords)
      await searchLocation(coords)
    } catch ({ message }) {
      alertUtils.alert({
        title: "Error",
        message,
        onPress: () => {
          setLocation(null)
        },
      })
    }
  }

  const handleSetCurrentLocation = () => {
    if (key) {
      searchLocation()
    } else {
      saveLocation()
    }
  }

  return (
    <DismissKeyboard>
      <Searchbar
        placeholder="Dirección, intersección o lugar"
        onChangeText={handleChangeText}
        onEndEditing={() => doSearch(query)}
        value={query}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.search}
        icon={({ size }) => (
          <MaterialIcons
            name="my-location"
            size={size}
            color={theme.colors.primary}
          />
        )}
        onIconPress={handleSetCurrentLocation}
        editable={!loading}
      />
      {results.length > 0 || loading || noResults ? (
        <ScrollView keyboardShouldPersistTaps="handled">
          {results.map((location, index) => (
            <LocationItem
              key={index}
              location={location}
              onPress={() => saveLocation(location)}
              navigation={navigation}
            />
          ))}
          <Spinner visible={loading} style={styles.spinner} />
          {noResults && (
            <Paragraph style={styles.noResults}>{noResults}</Paragraph>
          )}
        </ScrollView>
      ) : (
        <MapView onPress={handleMapPress}>
          <LocationMarker coords={location} color={getMarkerColor()} />
        </MapView>
      )}
    </DismissKeyboard>
  )
}

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 20,
  },
  search: {
    borderRadius: 0,
    height: 60,
    paddingLeft: 5,
  },
  noResults: {
    marginVertical: 20,
    paddingHorizontal: 30,
    color: "grey",
    textAlign: "center",
  },
})

export default ChangeLocationScreen
