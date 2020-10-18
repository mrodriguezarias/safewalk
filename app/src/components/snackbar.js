import React from "react"
import { StyleSheet } from "react-native"
import { Snackbar as RNSnackbar } from "react-native-paper"

const Snackbar = ({ text, setText, style }) => (
  <RNSnackbar
    visible={!!text}
    onDismiss={() => setText && setText("")}
    action={{
      label: "OK",
      onPress: () => {},
    }}
    style={{ ...styles.snackbar, ...style }}
  >
    {text}
  </RNSnackbar>
)

const styles = StyleSheet.create({
  snackbar: {
    position: "absolute",
    left: 0,
    bottom: 0,
    margin: 15,
    zIndex: 200,
  },
})

export default Snackbar
