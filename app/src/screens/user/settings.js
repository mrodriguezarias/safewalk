import React, { useState } from "react"
import { View, ScrollView, StyleSheet, Platform } from "react-native"
import {
  ToggleButton,
  List,
  Portal,
  Dialog,
  Paragraph,
  Button,
} from "react-native-paper"
import MenuItem from "../../components/menuItem"
import { useSelector, useDispatch } from "react-redux"
import appActions from "../../store/actions/app"
import authActions from "../../store/actions/auth"
import authController from "../../../../shared/controllers/auth"

const SettingsScreen = ({ navigation }) => {
  const theme = useSelector((state) => state.app.theme)
  const mapProvider = useSelector((state) => state.app.mapProvider)
  const user = useSelector((state) => state.auth.user)

  const dispatch = useDispatch()
  const [dialogVisible, setDialogVisible] = useState(false)

  const handleLogOut = async (deleteAccount = false) => {
    if (deleteAccount) {
      await authController.deleteAccount()
    }
    dispatch(authActions.logOut())
    setDialogVisible(false)
    navigation.goBack()
  }

  const renderAppSettings = () => (
    <List.Section>
      <List.Subheader>Aplicación</List.Subheader>
      <MenuItem label="Apariencia">
        <ToggleButton.Row
          value={theme}
          onValueChange={(theme) =>
            theme && dispatch(appActions.setTheme(theme))
          }
        >
          <ToggleButton icon="theme-light-dark" value="system" />
          <ToggleButton icon="white-balance-sunny" value="light" />
          <ToggleButton icon="weather-night" value="dark" />
        </ToggleButton.Row>
      </MenuItem>
      {Platform.OS === "ios" && (
        <MenuItem label="Proveedor de Mapas">
          <ToggleButton.Row
            value={mapProvider}
            onValueChange={(mapProvider) =>
              mapProvider && dispatch(appActions.setMapProvider(mapProvider))
            }
          >
            <ToggleButton icon="apple" value="apple" />
            <ToggleButton icon="google" value="google" />
          </ToggleButton.Row>
        </MenuItem>
      )}
    </List.Section>
  )

  const renderAdminSettings = () => (
    <List.Section>
      <List.Subheader>Administración</List.Subheader>
      <MenuItem
        label="Ir al Panel de Control"
        onPress={() => navigation.navigate("Admin")}
      />
    </List.Section>
  )

  const renderUserSettings = () => (
    <List.Section>
      <List.Subheader>Usuario</List.Subheader>
      <MenuItem
        label="Editar Datos"
        onPress={() => navigation.navigate("EditUser")}
      />
      {!user?.premium && (
        <MenuItem
          label="Adquirir Premium"
          onPress={() => navigation.navigate("Premium")}
        />
      )}
      <MenuItem
        label="Eliminar Cuenta"
        onPress={() => setDialogVisible(true)}
      />
      <MenuItem label="Cerrar Sesión" onPress={handleLogOut} />
    </List.Section>
  )

  return (
    <View style={styles.container}>
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>Eliminar Cuenta</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              ¿Seguro que deseas eliminar tu cuenta permanentemente? Esta acción
              no se puede deshacer.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancelar</Button>
            <Button color="red" onPress={() => handleLogOut(true)}>
              Eliminar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
