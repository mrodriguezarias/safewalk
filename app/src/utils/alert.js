import { Alert } from "react-native"

const alertUtils = {
  alert: (title, message, buttons = [{ text: "Aceptar" }]) => {
    Alert.alert(title, message, buttons, { cancelable: false })
  },
}

export default alertUtils
