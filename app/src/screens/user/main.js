import React, { useState, useEffect } from "react"
import { View, StyleSheet } from "react-native"
import { Button } from "react-native-paper"
import { useSelector } from "react-redux"
import Snackbar from "../../components/snackbar"
// import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
// import ContactsScreen from "./contacts"

// const Tab = createMaterialTopTabNavigator()

const snackbarTexts = {
  signUp: "Usuario registrado con éxito",
  deleteAccount: "Cuenta eliminada",
}

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

const LoggedInScreen = () => {
  return (
    <View />
    // <Tab.Navigator>
    //   <Tab.Screen
    //     name="Cuidados"
    //     component={ContactsScreen}
    //     initialParams={{ filter: "cared" }}
    //   />
    //   <Tab.Screen
    //     name="Cuidadores"
    //     component={ContactsScreen}
    //     initialParams={{ filter: "carers" }}
    //   />
    // </Tab.Navigator>
  )
}

const MainScreen = (props) => {
  const { action } = props.route.params ?? {}
  const logged = useSelector((state) => state.auth.logged)
  const [snackbarText, setSnackbarText] = useState("")
  useEffect(() => {
    if (action in snackbarTexts) {
      setSnackbarText(snackbarTexts[action])
    }
  }, [action])
  return (
    <View style={styles.container}>
      {logged ? <LoggedInScreen {...props} /> : <LoggedOutScreen {...props} />}
      <Snackbar text={snackbarText} setText={setSnackbarText} />
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
