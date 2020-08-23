import React from "react"
import { ScrollView, StyleSheet } from "react-native"
import { Chip, useTheme, Paragraph } from "react-native-paper"
import _ from "lodash"

import ListItem from "../listItem"
import Spinner from "../spinner"

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
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      {locations.map((location, index) => (
        <LocationItem
          key={index}
          location={location}
          onPress={() => onItemPress && onItemPress(location)}
          onLongPress={() => onItemLongPress && onItemLongPress(location)}
        />
      ))}
      <Spinner visible={loading} style={styles.spinner} />
      {noResults && (
        <Paragraph style={styles.noResults}>
          {_.isString(noResults) ? noResults : "Sin Resultados"}
        </Paragraph>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 20,
  },
  noResults: {
    marginVertical: 20,
    paddingHorizontal: 30,
    color: "grey",
    textAlign: "center",
  },
})

export default LocationList
