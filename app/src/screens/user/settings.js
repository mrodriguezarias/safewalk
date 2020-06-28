import React from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { ToggleButton, List } from "react-native-paper"
import SettingsItem from "../../components/settingsItem"
import { useSelector, useDispatch } from "react-redux"
import appActions from "../../store/actions/app"
import authActions from "../../store/actions/auth"

const SettingsScreen = ({ navigation }) => {
  const theme = useSelector((state) => state.app.theme)
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()

  const handleLogOut = () => {
    dispatch(authActions.logOut())
    navigation.goBack()
  }

  const renderAppSettings = () => (
    <List.Section>
      <List.Subheader>Aplicación</List.Subheader>
      <SettingsItem label="Apariencia">
        <ToggleButton.Row
          value={theme}
          onValueChange={(theme) => dispatch(appActions.setTheme(theme))}
        >
          <ToggleButton icon="theme-light-dark" value="system" />
          <ToggleButton icon="white-balance-sunny" value="light" />
          <ToggleButton icon="weather-night" value="dark" />
        </ToggleButton.Row>
      </SettingsItem>
    </List.Section>
  )

  const renderAdminSettings = () => (
    <List.Section>
      <List.Subheader>Administración</List.Subheader>
      <SettingsItem
        label="Ir al Panel de Control"
        onPress={() => navigation.navigate("Admin")}
      />
    </List.Section>
  )

  const renderUserSettings = () => (
    <List.Section>
      <List.Subheader>Usuario</List.Subheader>
      <SettingsItem
        label="Editar Datos"
        onPress={() => navigation.navigate("EditUser")}
      />
      {!user?.premium && (
        <SettingsItem
          label="Adquirir Premium"
          onPress={() => navigation.navigate("Premium")}
        />
      )}
      <SettingsItem label="Cerrar Sesión" onPress={handleLogOut} />
    </List.Section>
  )

  return (
    <View style={styles.container}>
      <ScrollView>
        {renderAppSettings()}
        {user && renderUserSettings()}
        {user?.admin && renderAdminSettings()}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default SettingsScreen
