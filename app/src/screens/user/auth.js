import React, { useState } from "react"
import { View, StyleSheet, ScrollView, Keyboard } from "react-native"
import { Button, Snackbar } from "react-native-paper"
import Field from "../../components/field"
import validationUtils from "../../utils/validation"
import { reduxForm } from "redux-form"
import { useDispatch } from "react-redux"
import authActions from "../../store/actions/auth"
import authController from "../../../../shared/controllers/auth"

const AuthScreen = ({ handleSubmit, navigation }) => {
  const [action, setAction] = useState(null)
  const [snackbarText, setSnackbarText] = useState("")
  const dispatch = useDispatch()

  const doSubmit = (action) => async ({ name, password }) => {
    if (!name || !password) {
      return
    }
    Keyboard.dismiss()
    setAction(action)
    try {
      const user = await authController[action](name, password)
      dispatch(authActions[action](user))
      navigation.goBack()
    } catch (error) {
      setSnackbarText(error.message)
    }
    setAction(null)
  }

  return (
    <>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Field
          name="name"
          label="Nombre"
          validate={[
            validationUtils.required(),
            validationUtils.minLength(4),
            validationUtils.maxLength(16),
          ]}
        />
        <Field
          name="password"
          label="Contraseña"
          secureTextEntry
          validate={[
            validationUtils.required(),
            validationUtils.minLength(8),
            validationUtils.maxLength(32),
          ]}
        />
        <View style={styles.buttons}>
          <Button
            mode="outlined"
            contentStyle={styles.button}
            loading={action === "signUp"}
            onPress={handleSubmit(doSubmit("signUp"))}
          >
            Registrarse
          </Button>
          <Button
            mode="contained"
            contentStyle={styles.button}
            loading={action === "logIn"}
            onPress={handleSubmit(doSubmit("logIn"))}
          >
            Iniciar Sesión
          </Button>
        </View>
      </ScrollView>
      <Snackbar
        visible={!!snackbarText}
        onDismiss={() => setSnackbarText("")}
        action={{
          label: "OK",
          onPress: () => {},
        }}
        style={{ margin: 15 }}
      >
        {snackbarText}
      </Snackbar>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    height: 50,
    width: 165,
  },
})

export default reduxForm({
  form: "auth",
})(AuthScreen)
