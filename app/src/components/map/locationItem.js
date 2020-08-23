import React, { useRef } from "react"
import { useTheme, Chip } from "react-native-paper"

import ListItem from "../listItem"
import LocationDialog from "./locationDialog"

const LocationItem = ({ location, onPress, navigation }) => {
  const { name, category, safe } = location
  const theme = useTheme()
  const locationDialog = useRef()

  return (
    <>
      <LocationDialog ref={locationDialog} navigation={navigation} />
      <ListItem
        title={name}
        label={name}
        description={category}
        onPress={onPress}
        onLongPress={() => locationDialog.current.show(location)}
        right={() =>
          safe && (
            <Chip icon="shield" style={{ backgroundColor: theme.colors.safe }}>
              Seguro
            </Chip>
          )
        }
      />
    </>
  )
}

export default LocationItem
