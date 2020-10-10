import React from "react"
import { StyleSheet, View } from "react-native"
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
import PremiumScreen from "../settings/premium"
import PaymentScreen from "../settings/payment"

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
                icon="account-plus"
                onPress={() => navigation.navigate("NewContact")}
              />
            ),
          headerTitle: () => (
            <View style={styles.headerTitleContent}>
              <Title>{user?.name ?? "Usuario"}</Title>
              {user?.premium && (
                <MaterialCommunityIcons
                  name="star-circle"
                  size={20}
                  color={theme.colors.safe}
                  style={styles.starIcon}
                />
              )}
            </View>
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
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  headerTitleContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  starIcon: {
    marginLeft: 2,
  },
})

export default UserScreen
