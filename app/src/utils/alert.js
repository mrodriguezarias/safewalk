import { Alert } from "react-native"

const alertUtils = {
  alert: ({
    title,
    message,
    buttonLabel,
    onPress,
    buttons = [{ text: "Aceptar" }],
  }) => {
    if (onPress || buttonLabel) {
      buttons = [
        {
          text: buttonLabel ?? "Aceptar",
          onPress,
        },
      ]
    }
    Alert.alert(title, message, buttons, { cancelable: false })
  },
}

export default alertUtils
