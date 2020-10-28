import React from "react"
import { View, StyleSheet } from "react-native"
import { Paragraph, Title, useTheme } from "react-native-paper"
import { MaterialIcons } from "@expo/vector-icons"

const NoPermission = () => {
  const theme = useTheme()
  return (
    <View style={{ ...styles.container, backgroundColor: theme.colors.back }}>
      <MaterialIcons name="location-off" size={60} color={theme.colors.text} />
      <Title>Sin acceso a los mapas</Title>
      <Paragraph>SafeWalk requiere acceso a la geolocalización</Paragraph>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default NoPermission
