import React from "react"
import { StyleSheet } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import { useSelector } from "react-redux"
import Header from "../../components/header"
import SettingsScreen from "./settings"
import AdminScreen from "./admin"
import MainScreen from "./main"
import AuthScreen from "./auth"
import AppbarAction from "../../components/appbarAction"
import PremiumScreen from "./premium"
import PaymentScreen from "./payment"
import EditUserScreen from "./editUser"
import NewContactScreen from "./newContact"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Title } from "react-native-paper"

const Stack = createStackNavigator()

const UserScreen = () => {
  const user = useSelector((state) => state.auth.user)
  return (
    <Stack.Navigator
      initialRouteName="Main"
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
                  <MaterialCommunityIcons name="star-circle" size={16} />
                </>
              )}
            </>
          ),
          headerRight: ({ navigation }) => (
            <AppbarAction
              icon="tune"
              onPress={() => navigation.navigate("Settings")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="EditUser"
        component={EditUserScreen}
        options={{ headerTitle: "Editar Usuario" }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
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
        options={{ headerTitle: "Panel de Control" }}
      />
      <Stack.Screen
        name="Premium"
        component={PremiumScreen}
        options={{ headerTitle: "Adquirir Premium" }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ headerTitle: "Información de Pago" }}
      />
      <Stack.Screen
        name="NewContact"
        component={NewContactScreen}
        options={{ headerTitle: "Nuevo Contacto" }}
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
