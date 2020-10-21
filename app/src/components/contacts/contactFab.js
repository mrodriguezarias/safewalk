import React, { useState } from "react"
import { StyleSheet, Linking } from "react-native"
import { useTheme, FAB } from "react-native-paper"

const ContactFab = ({ visible = true, contact }) => {
  const [open, setOpen] = useState(false)
  const theme = useTheme()

  const handleStateChange = async ({ open }) => {
    setOpen(open)
  }

  const callThePolice = () => {
    Linking.openURL("tel:911")
  }

  const callContact = () => {
    Linking.openURL(`tel:${contact.phone}`)
  }

  const getActions = () => {
    let actions = [
      {
        icon: "phone",
        label: "Llamar a la policía",
        onPress: callThePolice,
      },
    ]
    if (contact.phone) {
      actions = [
        ...actions,
        {
          icon: "contact-phone",
          label: `Llamar a ${contact.name}`,
          onPress: callContact,
        },
      ]
    }
    return actions
  }

  if (!contact || !visible) {
    return null
  }

  return (
    <FAB.Group
      open={open}
      icon="phone"
      actions={getActions()}
      onStateChange={handleStateChange}
      style={styles.fabGroup}
      fabStyle={{ backgroundColor: theme.colors.rogue }}
      theme={{ colors: { backdrop: "rgba(0, 0, 0, 0)" } }}
    />
  )
}

const styles = StyleSheet.create({
  fabGroup: {
    position: "absolute",
    margin: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
})

export default ContactFab
