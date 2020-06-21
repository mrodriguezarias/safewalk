import React from "react"
import { ScrollView, StyleSheet } from "react-native"
import SettingsItem from "../../components/settingsItem"
import { useDispatch } from "react-redux"
import authActions from "../../store/actions/auth"

const UserSettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch()

  const handleLogOut = () => {
    dispatch(authActions.logOut())
    navigation.goBack()
  }

  return (
    <ScrollView style={styles.container}>
      <SettingsItem label="Cerrar Sesión" onPress={handleLogOut} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
})

export default UserSettingsScreen
