import React, { useCallback, useEffect, useRef, useState } from "react"
import { View, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"
import { useIsFocused } from "@react-navigation/native"
import LocationMarker from "../../components/map/locationMarker"
import MapView from "../../components/map/mapView"
import PathMarker from "../../components/map/pathMarker"
import WalkDetailInfoBar from "../../components/contacts/walkDetailInfoBar"
import WalkTracker from "../../components/contacts/walkTracker"
import ContactFab from "../../components/contacts/contactFab"
import Spinner from "../../components/spinner"
import walkController from "../../../../shared/controllers/walk"
import contactController from "../../../../shared/controllers/contact"
import generalUtils from "../../../../shared/utils/general"

const WalkDetailScreen = ({ route }) => {
  const { walk: parentWalk, contact: parentContact, walkId, contactId } =
    route.params ?? {}
  const [walk, setWalk] = useState()
  const [contact, setContact] = useState()
  const theme = useTheme()
  const mapRef = useRef()
  const isFocused = useIsFocused()

  useEffect(() => {
    setWalk(parentWalk)
    setContact(parentContact)
  }, [parentWalk, parentContact])

  useEffect(() => {
    if (!walkId) {
      return
    }
    ;(async () => {
      const walk = await walkController.get(walkId)
      const contact = await contactController.get(contactId)
      setWalk(walk)
      setContact(contact)
    })()
  }, [walkId, contactId])

  const fitMap = useCallback(async () => {
    await generalUtils.sleep(100)
    mapRef.current.fitToCoordinates(
      [walk.source.coords, ...walk.path, walk.target.coords, walk.position],
      {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      },
    )
  }, [walk])

  if (!walk) {
    return <Spinner full />
  }

  return (
    <View style={styles.container}>
      <WalkTracker walk={walk} setWalk={setWalk} focused={isFocused} />
      <WalkDetailInfoBar walk={walk} />
      <ContactFab contact={contact} visible={!walk.end} />
      <MapView ref={mapRef} onLayout={fitMap}>
        <LocationMarker
          coords={walk.source.coords}
          color={theme.colors.header}
          zIndex={2}
        />
        <LocationMarker
          coords={walk.target.coords}
          color={theme.colors.tabBar}
          zIndex={3}
        />
        <LocationMarker
          coords={walk.position}
          zIndex={1}
          color={walk.safe ? theme.colors.accent : theme.colors.rogue}
        />
        <PathMarker coords={walk.path} zIndex={1} />
        <PathMarker coords={walk.walked} color={theme.colors.path} zIndex={2} />
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default WalkDetailScreen
