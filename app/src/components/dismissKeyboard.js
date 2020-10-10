import React from "react"
import {
  TouchableWithoutFeedback,
  Keyboard,
  View,
  StyleSheet,
} from "react-native"

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}>{children}</View>
  </TouchableWithoutFeedback>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default DismissKeyboard
