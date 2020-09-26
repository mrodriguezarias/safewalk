import React from "react"
import { StyleSheet } from "react-native"
import { Title, useTheme } from "react-native-paper"
import { createStackNavigator } from "@react-navigation/stack"
import { useSelector } from "react-redux"
import Header from "../../components/header"
import MainScreen from "./main"
import AuthScreen from "./auth"
import AppbarAction from "../../components/appbarAction"
import NewContactScreen from "./newContact"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import RequestsScreen from "./requests"

const Stack = createStackNavigator()

const UserScreen = () => {
  const user = useSelector((state) => state.auth.user)
  const theme = useTheme()
  return (
    <Stack.Navigator
      initialRouteName="MainUser"
      headerMode="screen"
      screenOptions={{
        header: ({ scene, previous, navigation }) => (
          <Header scene={scene} previous={previous} navigation={navigation} />
        ),
      }}
    >
      <Stack.Screen
        name="MainUser"
        component={MainScreen}
        options={{
          headerLeft: ({ navigation }) =>
            user && (
              <AppbarAction
                icon="plus"
                onPress={() => navigation.navigate("NewContact")}
              />
            ),
          headerTitle: () => (
            <>
              <Title style={styles.title}>{user?.name ?? "Usuario"}</Title>
              {user?.premium && (
                <>
                  {" "}
                  <MaterialCommunityIcons
                    name="star-circle"
                    size={16}
                    color={theme.colors.text}
                  />
                </>
              )}
            </>
          ),
        }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerTitle: "Iniciar Sesión o Registrarse" }}
      />
      <Stack.Screen
        name="NewContact"
        component={NewContactScreen}
        options={{ headerTitle: "Nuevo Contacto" }}
      />
      <Stack.Screen
        name="Requests"
        component={RequestsScreen}
        options={{ headerTitle: "Solicitudes" }}
      />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  title: {
    margin: 50,
  },
})

export default UserScreen
