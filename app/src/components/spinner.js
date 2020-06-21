import React from "react"
import { StyleSheet, View } from "react-native"
import { Text, ActivityIndicator } from "react-native-paper"

const Spinner = ({ text = "", full = false, ...props }) => (
  <View style={{ ...styles.container, ...(full && styles.full) }}>
    <ActivityIndicator {...props} />
    <Text style={styles.text}>{text}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  full: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 1,
  },
})

export default Spinner
