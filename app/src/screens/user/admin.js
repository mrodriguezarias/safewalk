import React from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import SettingsItem from "../../components/settingsItem"
import storageUtils from "../../../../shared/utils/storage"
import { List } from "react-native-paper"
import { useDispatch, useSelector } from "react-redux"
import appActions from "../../store/actions/app"

const AdminScreen = () => {
  const state = useSelector((state) => state)
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

  return (
    <View style={styles.container}>
      <ScrollView>
        <List.Section>
          <List.Subheader>Almacenamiento</List.Subheader>
          <SettingsItem label="Imprimir" onPress={handlePrintStorage} />
          <SettingsItem label="Borrar" onPress={handleClearStorage} />
        </List.Section>
        <List.Section>
          <List.Subheader>Estado</List.Subheader>
          <SettingsItem label="Imprimir" onPress={handlePrintState} />
          <SettingsItem label="Reiniciar" onPress={handleReloadState} />
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
