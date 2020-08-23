import React, { useState, useEffect, useRef } from "react"

import LocationList from "../../components/map/locationList"
import geoService from "../../../../shared/services/geo"
import LocationDialog from "../../components/map/locationDialog"

const RelatedPlacesScreen = ({ navigation, route }) => {
  const { location } = route.params ?? {}
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const locationDialog = useRef()

  useEffect(() => {
    ;(async () => {
      const places = await geoService.getRelatedPlaces(location)
      setLoading(false)
      setPlaces(places)
    })()
  }, [location])

  const handleItemPress = (location) => {
    locationDialog.current.show(location)
  }

  return (
    <>
      <LocationDialog ref={locationDialog} navigation={navigation} />
      <LocationList
        locations={places}
        loading={loading}
        noResults={!loading && places.length === 0}
        onItemPress={handleItemPress}
      />
    </>
  )
}

export default RelatedPlacesScreen
