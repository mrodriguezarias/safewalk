import React from "react"
import { Chip, useTheme } from "react-native-paper"

import ListItem from "../listItem"
import SearchResults from "../searchResults"

const LocationItem = ({ location, ...itemProps }) => {
  const { name, category, safe } = location
  const theme = useTheme()
  return (
    <ListItem
      title={name}
      label={name}
      description={category}
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
}) => {
  const renderItem = (location) => (
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
    />
  )
}

export default LocationList
