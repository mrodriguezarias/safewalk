import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { useSelector } from "react-redux"
import Header from "../../components/header"
import AppSettingsScreen from "./appSettings"
import UserSettingsScren from "./userSettings"
import AdminScreen from "./admin"
import MainScreen from "./main"
import AuthScreen from "./auth"
import AppbarAction from "../../components/appbarAction"

const Stack = createStackNavigator()

const UserScreen = () => {
  const userName = useSelector((state) => state.auth.user?.name)
  return (
    <Stack.Navigator
      initialRouteName="FeedList"
      headerMode="screen"
      screenOptions={{
        header: ({ scene, previous, navigation }) => (
          <Header scene={scene} previous={previous} navigation={navigation} />
        ),
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{
          headerTitle: userName ?? "Usuario",
          headerRight: ({ navigation }) => (
            <>
              {userName && (
                <AppbarAction
                  icon="account-circle"
                  onPress={() => navigation.navigate("UserSettings")}
                />
              )}
              <AppbarAction
                icon="tune"
                onPress={() => navigation.navigate("AppSettings")}
              />
            </>
          ),
        }}
      />
      <Stack.Screen
        name="UserSettings"
        component={UserSettingsScren}
        options={{ headerTitle: "Usuario" }}
      />
      <Stack.Screen
        name="AppSettings"
        component={AppSettingsScreen}
        options={{ headerTitle: "Opciones" }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerTitle: "Iniciar Sesión o Registrarse" }}
      />
      <Stack.Screen
        name="Admin"
        component={AdminScreen}
        options={{ headerTitle: "Administración" }}
      />
    </Stack.Navigator>
  )
}

export default UserScreen
