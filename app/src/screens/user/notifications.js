import React from "react"
import { ScrollView } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import authController from "../../../../shared/controllers/auth"
import { pushTypes } from "../../../../shared/utils/push"
import ListItem from "../../components/listItem"
import authActions from "../../store/actions/auth"

const options = [
  {
    title: "Invitación de contacto",
    description:
      "Un usuario te envía una invitación para ser su contacto cuidador o cuidado",
    type: pushTypes.invite,
  },
  {
    title: "Incidente de seguridad",
    description: "Un contacto cuidado reporta un incidente de seguridad",
    type: pushTypes.alert,
  },
  {
    title: "Comienzo de recorrido",
    description: "Un contacto cuidado inicia un nuevo recorrido",
    type: pushTypes.startWalk,
  },
  {
    title: "Llegada segura",
    description: "Un contacto cuidado informa sobre una llegada segura",
    type: pushTypes.safeArrival,
  },
  {
    title: "Rogue Walk",
    description: "Un contacto cuidado se desvía del camino seguro",
    type: pushTypes.rogueWalk,
  },
]

const NotificationsScreen = () => {
  const notifications = useSelector(
    (state) => state.auth.user?.notifications ?? {},
  )
  const dispatch = useDispatch()

  const handleChange = async (type, value) => {
    const user = await authController.edit({ notifications: { [type]: value } })
    dispatch(authActions.edit(user))
  }

  return (
    <ScrollView>
      {options.map(({ title, description, type }) => (
        <ListItem
          key={type}
          title={title}
          description={description}
          descriptionNumberOfLines={2}
          switch
          onChange={(value) => handleChange(type, value)}
          value={notifications[type]}
        />
      ))}
    </ScrollView>
  )
}

export default NotificationsScreen
