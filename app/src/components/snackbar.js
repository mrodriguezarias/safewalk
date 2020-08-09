import React from "react"
import { Snackbar as RNSnackbar } from "react-native-paper"

const Snackbar = ({ text, setText }) => (
  <RNSnackbar
    visible={!!text}
    onDismiss={() => setText("")}
    action={{
      label: "OK",
      onPress: () => {},
    }}
    style={{ margin: 15 }}
  >
    {text}
  </RNSnackbar>
)

export default Snackbar
