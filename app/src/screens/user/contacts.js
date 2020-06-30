import React from "react"
import { View, StyleSheet } from "react-native"
import { Text } from "react-native-paper"

const ContactScreen = ({ route }) => {
  const { filter } = route.params ?? {}
  const label =
    filter === "cared"
      ? "Contactos Cuidados"
      : filter === "carers"
      ? "Contactos Cuidadores"
      : "Todos los Contactos"
  return (
    <View style={styles.centered}>
      <Text>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default ContactScreen
