import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react"
import { useTheme } from "react-native-paper"
import { useSelector, useDispatch } from "react-redux"
import { MaterialIcons } from "@expo/vector-icons"

import DismissKeyboard from "../../components/dismissKeyboard"
import walkActions from "../../store/actions/walk"
import appActions from "../../store/actions/app"
import geoService from "../../../../shared/services/geo"
import geoUtils from "../../utils/geo"
import GeoError from "../../../../shared/errors/geo"
import MapView from "../../components/map/mapView"
import alertUtils from "../../utils/alert"
import requestUtils from "../../../../shared/utils/request"
import LocationDialog from "../../components/map/locationDialog"
import LocationMarker from "../../components/map/locationMarker"
import LocationList from "../../components/map/locationList"
import SearchBar from "../../components/searchBar"

const keyLabels = new Map([
  ["source", "Origen"],
  ["target", "Destino"],
  ["current", "Ubicación"],
])

const SearchLocationScreen = ({ navigation, route }) => {
  const theme = useTheme()
  const locationDialog = useRef()
  const [previousQuery, setPreviousQuery] = useState()
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [noResults, setNoResults] = useState(false)
  const mockLocation = useSelector((state) => state.app.mockLocation)
  const [location, setLocation] = useState(null)
  const dispatch = useDispatch()
  const { key } = route.params ?? {}

  const getHeaderTitle = useCallback(() => {
    if (key) {
      return `Cambiar ${keyLabels.get(key)}`
    }
    return "Buscar Lugar o Dirección"
  }, [key])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: getHeaderTitle(),
    })
  }, [navigation, getHeaderTitle])

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

  const doRefresh = async () => {
    await doSearch(previousQuery, true)
  }

  const doSearch = async (query, refresh = false) => {
    if (!query || (query === previousQuery && !refresh)) {
      return
    }
    if (!refresh) {
      setResults([])
    }
    setNoResults(false)
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
        const coords = await getCurrentLocation()
        const places = await geoService.searchNearby(coords, query)
        results = [...places]
      }
      setResults(results)
      setNoResults(results.length === 0)
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
      coords = await geoUtils.getCurrentLocation({
        shouldThrow: true,
        checkBoundary: true,
      })
    }
    return coords
  }

  const saveLocation = async (location) => {
    requestUtils.abort()
    if (key === "current") {
      dispatch(appActions.setMockLocation(location?.coords ?? null))
    } else {
      dispatch(walkActions.setLocation(key, location))
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
      case "current":
        return theme.colors.primary
      default:
        return theme.colors.marker
    }
  }

  const handleMapPress = async (event) => {
    const {
      nativeEvent: { coordinate: coords },
    } = event
    setLocation(coords)
    if (key === "current") {
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
    if (key === "current") {
      saveLocation()
    } else {
      searchLocation()
    }
  }

  const handleItemPress = (location) => {
    if (key) {
      saveLocation(location)
    } else {
      locationDialog.current.show(location)
    }
  }

  const handleItemLongPress = (location) => {
    if (key) {
      locationDialog.current.show(location)
    }
  }

  return (
    <DismissKeyboard>
      <LocationDialog ref={locationDialog} navigation={navigation} />
      <SearchBar
        placeholder="Dirección, intersección o lugar"
        onChangeText={handleChangeText}
        onEndEditing={() => doSearch(query)}
        value={query}
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
        <LocationList
          locations={results}
          loading={loading}
          noResults={noResults}
          onItemPress={handleItemPress}
          onItemLongPress={handleItemLongPress}
          onRefresh={doRefresh}
        />
      ) : (
        <MapView onPress={handleMapPress} showsUserLocation>
          <LocationMarker coords={location} color={getMarkerColor()} />
        </MapView>
      )}
    </DismissKeyboard>
  )
}

export default SearchLocationScreen
