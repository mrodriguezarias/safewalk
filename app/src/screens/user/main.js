import React from "react"
import { View, StyleSheet } from "react-native"
import { Button } from "react-native-paper"
import { useSelector } from "react-redux"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import ContactsScreen from "./contacts"

const Tab = createMaterialTopTabNavigator()

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
  return !logged ? (
    <LoggedOutScreen navigation={navigation} />
  ) : (
    <Tab.Navigator>
      <Tab.Screen name="Todos" component={ContactsScreen} />
      <Tab.Screen
        name="Cuidados"
        component={ContactsScreen}
        initialParams={{ filter: "cared" }}
      />
      <Tab.Screen
        name="Cuidadores"
        component={ContactsScreen}
        initialParams={{ filter: "carers" }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default MainScreen
