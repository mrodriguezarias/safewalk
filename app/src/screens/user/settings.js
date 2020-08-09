import React, { useState } from "react"
import { View, ScrollView, StyleSheet, Platform } from "react-native"
import { List, Portal, Dialog, Paragraph, Button } from "react-native-paper"
import MenuItem from "../../components/menuItem"
import { useSelector, useDispatch } from "react-redux"
import appActions from "../../store/actions/app"
import authActions from "../../store/actions/auth"
import authController from "../../../../shared/controllers/auth"

const SettingsScreen = ({ navigation }) => {
  const theme = useSelector((state) => state.app.theme)
  const mapProvider = useSelector((state) => state.app.mapProvider)
  const mapType = useSelector((state) => state.app.mapType)
  const user = useSelector((state) => state.auth.user)

  const dispatch = useDispatch()
  const [dialogVisible, setDialogVisible] = useState(false)

  const handleLogOut = async (deleteAccount = false) => {
    let action = "logOut"
    if (deleteAccount) {
      action = "deleteAccount"
      await authController.deleteAccount()
    }
    dispatch(authActions.logOut())
    setDialogVisible(false)
    navigation.navigate("Main", { action })
  }

  const renderAppSettings = () => (
    <List.Section>
      <List.Subheader>Aplicación</List.Subheader>
      <MenuItem
        label="Apariencia"
        options={[
          { value: "system", label: "Automática" },
          { value: "light", label: "Diurna" },
          { value: "dark", label: "Nocturna" },
        ]}
        onChange={(theme) => dispatch(appActions.setTheme(theme))}
        value={theme}
      />
      {Platform.OS === "ios" && (
        <MenuItem
          label="Proveedor de Mapas"
          options={[
            { value: "apple", label: "Apple" },
            { value: "google", label: "Google" },
          ]}
          onChange={(mapProvider) =>
            dispatch(appActions.setMapProvider(mapProvider))
          }
          value={mapProvider}
        />
      )}
      <MenuItem
        label="Tipo de mapa"
        options={[
          { value: "standard", label: "Estándar" },
          { value: "satellite", label: "Satélite" },
          { value: "hybrid", label: "Híbrido" },
        ]}
        onChange={(mapType) => dispatch(appActions.setMapType(mapType))}
        value={mapType}
      />
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
