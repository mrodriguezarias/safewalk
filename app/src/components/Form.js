import React from "react"
import PropTypes from "prop-types"
import { StyleSheet, View, Button, TextInput, Text } from "react-native"

const Form = ({ title, onSubmit, onCancel }) => {
  return (
    <View style={styles.square}>
      <Text>{title}</Text>
      <TextInput style={styles.input} />
      <View style={styles.buttonsContainer}>
        <Button title="Cancel" onPress={onCancel} />
        <Button title="Submit" onPress={onSubmit} />
      </View>
    </View>
  )
}

Form.propTypes = {
  title: PropTypes.string,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
}

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

export default Form
