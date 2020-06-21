import React from "react"
import { View, StyleSheet } from "react-native"
import { Button } from "react-native-paper"
import { useSelector } from "react-redux"

const LoggedOutScreen = ({ navigation }) => (
  <View style={styles.centered}>
    <Button
      icon="key-variant"
      mode="contained"
      onPress={() => navigation.navigate("Auth")}
      contentStyle={{ height: 50 }}
    >
      Iniciar Sesión o Registrarse
    </Button>
  </View>
)

const MainScreen = ({ navigation }) => {
  const logged = useSelector((state) => state.auth.logged)
  return (
    <View style={styles.container}>
      {!logged && <LoggedOutScreen navigation={navigation} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default MainScreen
