import React from "react"
import {
  StyleSheet,
  View,
  Button,
  TextInput,
  Text,
  NativeSyntheticEvent,
  NativeTouchEvent,
} from "react-native"

interface Props {
  title: string
  onSubmit?: (event: NativeSyntheticEvent<NativeTouchEvent>) => void
  onCancel?: (event: NativeSyntheticEvent<NativeTouchEvent>) => void
}

const Form: React.FC<Props> = ({ title, onSubmit, onCancel }) => {
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
