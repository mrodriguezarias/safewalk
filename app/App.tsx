import React from "react"
import { StyleSheet, Text, View } from "react-native"
import Form from "./components/Form"

export default function App() {
  return (
    <View style={styles.container}>
      <Form />
      <Form />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
  },
})
