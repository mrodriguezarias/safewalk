import React, { useState } from "react"
import { StyleSheet, Linking } from "react-native"
import { useTheme, FAB } from "react-native-paper"
import { useSelector, useDispatch } from "react-redux"
import appActions from "../../store/actions/app"
import contactController from "../../../../shared/controllers/contact"

const ReportFab = () => {
  const [open, setOpen] = useState(false)
  const walk = useSelector((state) => state.walk.walk)
  const theme = useTheme()
  const dispatch = useDispatch()

  const handleStateChange = async ({ open }) => {
    setOpen(open)
  }

  const callThePolice = () => {
    Linking.openURL("tel:911")
  }

  const alertCarers = async () => {
    await contactController.alertContacts()
    dispatch(appActions.setMapSnackbar("Cuidadores alertados"))
  }

  return (
    <FAB.Group
      open={open}
      visible={!!walk}
      icon="alarm-light"
      actions={[
        {
          icon: "phone",
          label: "Llamar a la policía",
          onPress: callThePolice,
        },
        {
          icon: "bell",
          label: "Alertar cuidadores",
          onPress: alertCarers,
        },
      ]}
      onStateChange={handleStateChange}
      style={styles.fabGroup}
      fabStyle={{ backgroundColor: theme.colors.rogue }}
      theme={{ colors: { backdrop: "rgba(0, 0, 0, 0)" } }}
    />
  )
}

const styles = StyleSheet.create({
  fabGroup: {
    position: "absolute",
    margin: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
})

export default ReportFab
