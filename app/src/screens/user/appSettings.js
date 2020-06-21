import React from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { ToggleButton } from "react-native-paper"
import SettingsItem from "../../components/settingsItem"
import { useSelector, useDispatch } from "react-redux"
import appActions from "../../store/actions/app"

const AppSettingsScreen = () => {
  const theme = useSelector((state) => state.app.theme)
  const dispatch = useDispatch()

  return (
    <View style={styles.container}>
      <ScrollView>
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
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default AppSettingsScreen
