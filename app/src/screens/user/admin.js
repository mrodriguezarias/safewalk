import React from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { Switch } from "react-native-paper"
import { useDispatch, useSelector } from "react-redux"

import ListSection from "../../components/listSection"
import ListItem from "../../components/listItem"
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
        <ListSection title="Almacenamiento">
          <ListItem label="Imprimir" onPress={handlePrintStorage} />
          <ListItem label="Borrar" onPress={handleClearStorage} />
        </ListSection>
        <ListSection title="Estado">
          <ListItem label="Imprimir" onPress={handlePrintState} />
          <ListItem label="Reiniciar" onPress={handleReloadState} />
        </ListSection>
        <ListSection title="Premium">
          <ListItem
            label="Activo"
            right={() => (
              <Switch value={isPremium} onValueChange={handleTogglePremium} />
            )}
          />
        </ListSection>
        <ListSection title="Mapa">
          <ListItem
            label="Cambiar ubicación actual"
            onPress={handleChangeLocation}
          />
        </ListSection>
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
