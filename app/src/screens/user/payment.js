import React, { useState, useRef } from "react"
import { View, StyleSheet, LogBox, Keyboard } from "react-native"
import { useTheme, Headline, Button } from "react-native-paper"
import { useDispatch } from "react-redux"
import { CreditCardInput } from "react-native-credit-card-input"
import generalUtils from "../../../../shared/utils/general"
import authActions from "../../store/actions/auth"
import authController from "../../../../shared/controllers/auth"
import DismissKeyboard from "../../components/dismissKeyboard"
import Dialog from "../../components/dialog"

LogBox.ignoreLogs(["Warning: componentWillReceiveProps has been renamed"])

const PaymentScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const [creditCardData, setCreditCardData] = useState()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const dialog = useRef()

  const themeColor = theme.colors.text

  const handleDialogDismiss = () => {
    if (success) {
      navigation.pop(2)
    }
  }

  const confirmPurchase = async () => {
    setLoading(true)
    await generalUtils.sleep(5000)
    setLoading(false)
    if (creditCardData.values.cvc === "911") {
      const user = await authController.edit({ premium: true })
      dispatch(authActions.edit(user))
      setSuccess(true)
    }
    dialog.current.show()
  }

  const handleCardInputChange = (data) => {
    if (data?.valid) {
      Keyboard.dismiss()
    }
    setCreditCardData(data)
  }

  return (
    <DismissKeyboard>
      <Dialog
        ref={dialog}
        onDismiss={handleDialogDismiss}
        title={success ? "Pago procesado" : "Error al procesar el pago"}
        content={
          success
            ? "¡Enhorabuena! Has conseguido acceso a todas las funcionalidades premium de SafeWalk."
            : "No se pudo procesar el pago. Por favor verifica los datos ingresados e intenta nuevamente."
        }
        accept
      />
      <View style={styles.container}>
        <View style={styles.inner}>
          <CreditCardInput
            allowScroll
            onChange={handleCardInputChange}
            labels={{
              number: "Número de la tarjeta",
              expiry: "Vence",
              cvc: "CVC/CCV",
            }}
            placeholders={{
              number: "1234 5678 1234 5678",
              expiry: "MM/AA",
              cvc: "CVC",
            }}
            labelStyle={{ color: themeColor }}
            inputStyle={{ color: themeColor }}
            inputContainerStyle={{
              borderBottomWidth: 1,
              borderBottomColor: themeColor,
            }}
          />
        </View>
        <View>
          <Headline style={styles.headline}>Pago único de $150</Headline>
          <Button
            mode="contained"
            contentStyle={styles.button}
            disabled={!creditCardData?.valid || loading}
            loading={loading}
            onPress={confirmPurchase}
          >
            {loading ? "Confirmando Compra…" : "Confirmar Compra"}
          </Button>
        </View>
      </View>
    </DismissKeyboard>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 30,
    marginHorizontal: 15,
  },
  inner: {
    flex: 1,
  },
  headline: {
    fontSize: 22,
    marginBottom: 15,
    alignSelf: "center",
  },
  button: {
    fontSize: 50,
    height: 50,
  },
})

export default PaymentScreen
