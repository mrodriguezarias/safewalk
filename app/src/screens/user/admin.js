import React from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { List, Switch } from "react-native-paper"
import { useDispatch, useSelector } from "react-redux"

import MenuItem from "../../components/menuItem"
import storageUtils from "../../../../shared/utils/storage"
import appActions from "../../store/actions/app"
import authController from "../../../../shared/controllers/auth"
import authActions from "../../store/actions/auth"

const AdminScreen = ({ navigation }) => {
  const state = useSelector((state) => state)
  const isPremium = useSelector((state) => state.auth.user.premium)

  const dispatch = useDispatch()

  const handlePrintStorage = async () => {
    const storage = await storageUtils.getAll()
    console.info("storage", storage)
  }

  const handleClearStorage = async () => {
    await storageUtils.clear()
  }

  const handlePrintState = async () => {
    console.info("state", state)
  }

  const handleReloadState = async () => {
    dispatch(appActions.load())
  }

  const handleTogglePremium = async () => {
    const user = await authController.edit({ premium: !isPremium })
    dispatch(authActions.edit(user))
  }

  const handleChangeLocation = () => {
    navigation.navigate("ChangeLocation")
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <List.Section>
          <List.Subheader>Almacenamiento</List.Subheader>
          <MenuItem label="Imprimir" onPress={handlePrintStorage} />
          <MenuItem label="Borrar" onPress={handleClearStorage} />
        </List.Section>
        <List.Section>
          <List.Subheader>Estado</List.Subheader>
          <MenuItem label="Imprimir" onPress={handlePrintState} />
          <MenuItem label="Reiniciar" onPress={handleReloadState} />
        </List.Section>
        <List.Section>
          <List.Subheader>Premium</List.Subheader>
          <MenuItem label="Activo">
            <Switch value={isPremium} onValueChange={handleTogglePremium} />
          </MenuItem>
        </List.Section>
        <List.Section>
          <List.Subheader>Mapa</List.Subheader>
          <MenuItem
            label="Cambiar ubicación actual"
            onPress={handleChangeLocation}
          />
        </List.Section>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default AdminScreen
