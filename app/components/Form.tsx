import React from "react"
import { StyleSheet, View, Button, TextInput, Text } from "react-native"

const Form = () => {
  return (
    <View style={styles.square}>
      <Text>Lorem ipsum</Text>
      <TextInput style={styles.input} />
      <View style={styles.buttonsContainer}>
        <Button title="Cancel" onPress={() => console.log("cancelled")} />
        <Button title="Submit" onPress={() => console.log("submitted")} />
      </View>
    </View>
  )
}

export default Form

const styles = StyleSheet.create({
  square: {
    borderRadius: 20,
    width: 200,
    height: 200,
    backgroundColor: "skyblue",
    margin: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  input: {
    width: 100,
    backgroundColor: "white",
    marginTop: 10,
  },
})
