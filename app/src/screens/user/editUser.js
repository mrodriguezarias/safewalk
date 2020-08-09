import React, { useState } from "react"
import { ScrollView, StyleSheet, View, Keyboard } from "react-native"
import Form from "../../components/form"
import Field from "../../components/field"
import validationUtils from "../../utils/validation"
import { useDispatch, useSelector } from "react-redux"
import authActions from "../../store/actions/auth"
import { Button, Snackbar } from "react-native-paper"
import authController from "../../../../shared/controllers/auth"

const emptyValues = {
  phone: null,
}

const EditUserScreen = ({ navigation }) => {
  const [snackbarText, setSnackbarText] = useState("")
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  const handleSubmit = async (values) => {
    Keyboard.dismiss()
    setLoading(true)
    try {
      const user = await authController.edit({ ...emptyValues, ...values })
      dispatch(authActions.edit(user))
      navigation.goBack()
    } catch (error) {
      setSnackbarText(error.message)
    }
    setLoading(false)
  }

  return (
    <>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Form
          initialValues={user}
          render={({ valid, values, dirty }) => (
            <View style={styles.form}>
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
                name="phone"
                label="Teléfono"
                validate={[
                  validationUtils.minLength(10),
                  validationUtils.maxLength(20),
                  validationUtils.phoneNumber(),
                ]}
              />
              <Button
                compact
                disabled={!valid || !dirty || loading}
                loading={loading}
                style={styles.button}
                onPress={() => handleSubmit(values)}
              >
                Guardar Cambios
              </Button>
            </View>
          )}
        />
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
  },
  form: {
    margin: 15,
    marginBottom: 5,
  },
  button: {
    marginTop: 5,
    alignItems: "center",
  },
})

export default EditUserScreen
