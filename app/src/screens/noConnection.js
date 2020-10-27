import React from "react"
import { View, StyleSheet } from "react-native"
import { Paragraph, Title, useTheme } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const NoConnection = () => {
  const theme = useTheme()
  return (
    <View style={{ ...styles.container, backgroundColor: theme.colors.back }}>
      <MaterialCommunityIcons
        name="wifi-off"
        size={60}
        color={theme.colors.text}
      />
      <Title>Sin Conexión</Title>
      <Paragraph>SafeWalk requiere conexión a Internet</Paragraph>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "pink",
  },
})

export default NoConnection
