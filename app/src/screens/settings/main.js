import React, { useState } from "react"
import { View, ScrollView, StyleSheet, Platform } from "react-native"
import { Portal, Dialog, Paragraph, Button } from "react-native-paper"
import ListSection from "../../components/listSection"
import ListItem from "../../components/listItem"
import { useSelector, useDispatch } from "react-redux"
import appActions from "../../store/actions/app"
import authActions from "../../store/actions/auth"
import walkActions from "../../store/actions/walk"
import authController from "../../../../shared/controllers/auth"
import walkController from "../../../../shared/controllers/walk"

const MainScreen = ({ navigation }) => {
  const theme = useSelector((state) => state.app.theme)
  const mapProvider = useSelector((state) => state.app.mapProvider)
  const mapType = useSelector((state) => state.app.mapType)
  const user = useSelector((state) => state.auth.user)
  const walk = useSelector((state) => state.walk.walk)

  const dispatch = useDispatch()
  const [dialogVisible, setDialogVisible] = useState(false)

  const handleLogOut = async (deleteAccount = false) => {
    if (walk) {
      await walkController.end(walk.id)
      dispatch(walkActions.setWalk(null))
    }
    let action = "logOut"
    if (deleteAccount) {
      action = "deleteAccount"
      await authController.deleteAccount()
    }
    dispatch(authActions.logOut())
    setDialogVisible(false)
    navigation.navigate("MainUser", { action })
  }

  const renderAppSettings = () => (
    <ListSection title="Aplicación">
      <ListItem
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
        <ListItem
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
      <ListItem
        label="Tipo de mapa"
        options={[
          { value: "standard", label: "Estándar" },
          { value: "satellite", label: "Satélite" },
          { value: "hybrid", label: "Híbrido" },
        ]}
        onChange={(mapType) => dispatch(appActions.setMapType(mapType))}
        value={mapType}
      />
    </ListSection>
  )

  const renderAdminSettings = () => (
    <ListSection title="Administración">
      <ListItem
        label="Ir al Panel de Control"
        onPress={() => navigation.navigate("Admin")}
      />
    </ListSection>
  )

  const renderUserSettings = () => (
    <ListSection title="Usuario">
      <ListItem
        label="Editar Datos"
        onPress={() => navigation.navigate("EditUser")}
      />
      {/* {!user?.premium && (
        <ListItem
          label="Adquirir Premium"
          onPress={() => navigation.navigate("Premium")}
        />
      )} */}
      <ListItem
        label="Eliminar Cuenta"
        onPress={() => setDialogVisible(true)}
      />
      <ListItem label="Cerrar Sesión" onPress={handleLogOut} />
    </ListSection>
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

export default MainScreen
