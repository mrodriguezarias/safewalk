import React, { useState, useRef, useEffect } from "react"
import { StyleSheet, ScrollView } from "react-native"
import { Searchbar, Subheading } from "react-native-paper"
import { useDispatch } from "react-redux"

import DismissKeyboard from "../../components/dismissKeyboard"
import MenuItem from "../../components/menuItem"
import Spinner from "../../components/spinner"
import walkActions from "../../store/actions/walk"
import geoService from "../../../../shared/services/geo"
import geoUtils from "../../utils/geo"
import alertUtils from "../../utils/alert"

const ChangeLocationScreen = ({ route, navigation }) => {
  const searchbarRef = useRef()
  const [previousQuery, setPreviousQuery] = useState()
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [noResults, setNoResults] = useState(false)
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

  const confirmSearch = async () => {
    if (!query || query === previousQuery) {
      return
    }
    setResults([])
    setNoResults(false)
    setLoading(true)
    setPreviousQuery(query)
    let results
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
    setNoResults(results.length === 0)
    setLoading(false)
  }

  const setLocation = async (location) => {
    if (!location) {
      try {
        const coords = await geoUtils.getCurrentLocation({ shouldThrow: true })
        location = {
          name: "Ubicación actual",
          coords,
        }
      } catch (error) {
        alertUtils.alert("Ubicación no soportada", error.message)
        return
      }
    }
    dispatch(walkActions.setLocation(key, location))
    navigation.goBack()
  }

  return (
    <DismissKeyboard>
      <Searchbar
        ref={searchbarRef}
        placeholder="Dirección, intersección o lugar"
        onChangeText={handleChangeText}
        onEndEditing={confirmSearch}
        value={query}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.search}
        editable={!loading}
      />
      <ScrollView keyboardShouldPersistTaps="handled">
        <MenuItem
          accent
          label="Usar ubicación actual"
          onPress={() => setLocation()}
        />
        {results.map((location, index) => (
          <MenuItem
            key={index}
            label={location.name}
            onPress={() => setLocation(location)}
          />
        ))}
        <Spinner visible={loading} style={styles.spinner} />
        {noResults && (
          <Subheading style={styles.noResults}>Sin resultados</Subheading>
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
  },
  noResults: {
    marginVertical: 15,
    color: "grey",
    textAlign: "center",
  },
})

export default ChangeLocationScreen
