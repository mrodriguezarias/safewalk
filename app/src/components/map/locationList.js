import React from "react"
import { Chip, useTheme } from "react-native-paper"

import ListItem from "../listItem"
import SearchResults from "../searchResults"

const LocationItem = ({ location, ...itemProps }) => {
  const { name, category, safe, address } = location
  const theme = useTheme()
  const addressLine = address ? `\n${address}` : ""
  return (
    <ListItem
      title={name}
      label={name}
      description={`${category}${addressLine}`}
      right={() =>
        safe && (
          <Chip icon="shield" style={{ backgroundColor: theme.colors.safe }}>
            Seguro
          </Chip>
        )
      }
      {...itemProps}
    />
  )
}

const LocationList = ({
  locations,
  loading,
  noResults,
  onItemPress,
  onItemLongPress,
  onRefresh,
}) => {
  const renderItem = ({ item: location }) => (
    <LocationItem
      location={location}
      onPress={() => onItemPress && onItemPress(location)}
      onLongPress={() => onItemLongPress && onItemLongPress(location)}
    />
  )

  return (
    <SearchResults
      results={locations}
      renderItem={renderItem}
      loading={loading}
      noResults={noResults}
      onRefresh={onRefresh}
    />
  )
}

export default LocationList
