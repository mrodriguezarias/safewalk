import React, { useEffect, useState, useRef } from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { Button, useTheme } from "react-native-paper"
import ListSection from "../../components/listSection"
import ListItem from "../../components/listItem"
import { useSelector, useDispatch } from "react-redux"
import authActions from "../../store/actions/auth"
import walkActions from "../../store/actions/walk"
import authController from "../../../../shared/controllers/auth"
import walkController from "../../../../shared/controllers/walk"
import requestUtils from "../../../../shared/utils/request"
import Snackbar from "../../components/snackbar"
import Spinner from "../../components/spinner"
import Dialog from "../../components/dialog"

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

const LoggedInScreen = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user)
  const walk = useSelector((state) => state.walk.walk)
  const theme = useTheme()
  const dispatch = useDispatch()
  const deleteAccountDialog = useRef()

  const handleLogOut = async (deleteAccount = false) => {
    requestUtils.abort()
    if (walk) {
      await walkController.end(walk.id)
      dispatch(walkActions.setWalk(null))
    }
    let action = "logOut"
    let userId = user.id
    if (deleteAccount) {
      action = "deleteAccount"
      userId = null
      await authController.deleteAccount()
    }
    dispatch(authActions.logOut(userId))
    navigation.navigate("Main", { action })
  }

  const renderAdminSettings = () => (
    <ListSection>
      <ListItem
        label="Panel de Control"
        icon="cogs"
        onPress={() => navigation.navigate("Admin")}
      />
    </ListSection>
  )

  const renderUserSettings = () => (
    <>
      <ListSection>
        {user?.premium ? (
          <ListItem
            label="Mis Recorridos"
            icon="map-marker"
            onPress={() => navigation.navigate("WalkList")}
          />
        ) : (
          <ListItem
            label="Adquirir Premium"
            icon="star-circle"
            onPress={() => navigation.navigate("Premium")}
            style={{ backgroundColor: theme.colors.safe }}
          />
        )}
      </ListSection>
      <ListSection>
        <ListItem
          label="Notificaciones"
          icon="bell-circle"
          onPress={() => navigation.navigate("Notifications")}
        />
        <ListItem
          label="Editar Datos"
          icon="account-edit"
          onPress={() => navigation.navigate("EditUser")}
        />
        <ListItem
          label="Eliminar Cuenta"
          icon="account-remove"
          onPress={() => deleteAccountDialog.current.show()}
        />
        <ListItem
          label="Cerrar Sesión"
          icon="logout-variant"
          onPress={handleLogOut}
        />
      </ListSection>
    </>
  )

  return (
    <View style={styles.container}>
      <Dialog
        ref={deleteAccountDialog}
        title="Eliminar Cuenta"
        content="¿Seguro que deseas eliminar tu cuenta permanentemente? Esta acción
              no se puede deshacer."
        accept={{
          text: "Eliminar",
          action: () => handleLogOut(true),
          color: theme.colors.rogue,
        }}
        cancel
      />
      <ScrollView>
        {user && renderUserSettings()}
        {user?.admin && renderAdminSettings()}
      </ScrollView>
    </View>
  )
}

const MainScreen = (props) => {
  const { route } = props
  const { action } = route.params ?? {}
  const logged = useSelector((state) => state.auth.logged)
  const [snackbarText, setSnackbarText] = useState("")

  useEffect(() => {
    if (action in snackbarTexts) {
      setSnackbarText(snackbarTexts[action])
    }
  }, [action])

  if (
    (["logIn", "signUp"].includes(action) && !logged) ||
    (action === "logOut" && logged)
  ) {
    return <Spinner full />
  }

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
