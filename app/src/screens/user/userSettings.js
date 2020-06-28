import React from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import SettingsItem from "../../components/settingsItem"
import Form from "../../components/form"
import Field from "../../components/field"
import validationUtils from "../../utils/validation"
import { useDispatch, useSelector } from "react-redux"
import authActions from "../../store/actions/auth"

const UserSettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  const handleLogOut = () => {
    dispatch(authActions.logOut())
    navigation.goBack()
  }

  const handleFieldSubmission = ({ name, value, valid }) => {
    if (valid) {
      dispatch(authActions.edit({ [name]: value || null }))
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Form
        initialValues={user}
        render={({ handleSubmit, pristine, form, submitting, values }) => (
          <View style={styles.form}>
            <Field
              name="name"
              label="Nombre"
              validate={[
                validationUtils.required(),
                validationUtils.minLength(4),
                validationUtils.maxLength(16),
              ]}
              onBlur={handleFieldSubmission}
            />
            <Field
              name="phone"
              label="Teléfono"
              validate={[
                validationUtils.minLength(10),
                validationUtils.maxLength(20),
                validationUtils.phoneNumber(),
              ]}
              onBlur={handleFieldSubmission}
            />
          </View>
        )}
      />
      {user?.admin && (
        <SettingsItem
          label="Administración"
          onPress={() => navigation.navigate("Admin")}
        />
      )}
      {!user?.premium && <SettingsItem label="Adquirir Premium" />}
      <SettingsItem label="Cerrar Sesión" onPress={handleLogOut} />
    </ScrollView>
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
})

export default UserSettingsScreen
