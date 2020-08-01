import React, { useState, useRef, useEffect } from "react"
import { StyleSheet, ScrollView } from "react-native"
import { Searchbar, Paragraph, useTheme } from "react-native-paper"
import { useSelector, useDispatch } from "react-redux"
import { MaterialIcons } from "@expo/vector-icons"

import DismissKeyboard from "../../components/dismissKeyboard"
import MenuItem from "../../components/menuItem"
import Spinner from "../../components/spinner"
import walkActions from "../../store/actions/walk"
import geoService from "../../../../shared/services/geo"
import geoUtils from "../../utils/geo"
import GeoError from "../../../../shared/errors/geo"

const ChangeLocationScreen = ({ route, navigation }) => {
  const searchbarRef = useRef()
  const theme = useTheme()
  const [previousQuery, setPreviousQuery] = useState()
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [noResults, setNoResults] = useState(false)
  const mockLocation = useSelector((state) => state.app.mockLocation)
  const dispatch = useDispatch()
  const { key } = route.params

  useEffect(() => {
    searchbarRef.current.focus()
  }, [])

  const handleChangeText = async (value) => {
    if (loading) {
      return
    }
    setResults([])
    setNoResults(false)
    setQuery(value)
    if (!value) {
      searchbarRef.current.focus()
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
      } else {
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

  const setLocation = async (location) => {
    dispatch(walkActions.setLocation(key, location))
    navigation.goBack()
  }

  const handleUseCurrentLocation = async () => {
    setLoading(true)
    setResults([])
    setNoResults(false)
    setQuery("")
    try {
      const coords = await getCurrentLocation()
      const address = await geoService.getAddressOfLocation(coords)
      setQuery(address)
      doSearch(address)
    } catch (error) {
      if (error instanceof GeoError) {
        setNoResults(error.message)
        setLoading(false)
      } else {
        throw error
      }
    }
  }

  return (
    <DismissKeyboard>
      <Searchbar
        ref={searchbarRef}
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
        onIconPress={handleUseCurrentLocation}
        editable={!loading}
      />
      <ScrollView keyboardShouldPersistTaps="handled">
        {results.map((location, index) => (
          <MenuItem
            key={index}
            label={location.name}
            onPress={() => setLocation(location)}
          />
        ))}
        <Spinner visible={loading} style={styles.spinner} />
        {noResults && (
          <Paragraph style={styles.noResults}>{noResults}</Paragraph>
        )}
      </ScrollView>
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
