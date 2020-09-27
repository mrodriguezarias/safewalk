import React, { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { StyleSheet } from "react-native"
import { Chip, useTheme } from "react-native-paper"
import { useSelector } from "react-redux"
import contactController from "../../../../shared/controllers/contact"
import requestUtils from "../../../../shared/utils/request"

import Dialog from "../dialog"
import ListItem from "../listItem"
import CarerPremiumDialog from "./carerPremiumDialog"

const options = [
  {
    value: "carer",
    label: "Quiero que me cuide",
    premium: true,
  },
  {
    value: "cared",
    label: "Me gustaría cuidarlo",
    premium: false,
  },
]

const NewContactDialog = forwardRef(({ navigation }, ref) => {
  const loggedUser = useSelector((state) => state.auth.user)
  const theme = useTheme()
  const dialogRef = useRef()
  const premiumDialogRef = useRef()
  const confirmDialogRef = useRef()
  const errorDialogRef = useRef()
  const successDialogRef = useRef()
  const [targetUser, setTargetUser] = useState()

  useImperativeHandle(ref, () => ({
    show: handleShow,
    hide: handleHide,
  }))

  const handleShow = (user) => {
    setTargetUser(user)
    dialogRef.current.show()
  }

  const handleHide = () => {
    dialogRef.current.hide()
  }

  const sendRequest = async (relation) => {
    try {
      await contactController.sendRequest({
        from: loggedUser,
        to: targetUser,
        relation,
      })
      successDialogRef.current.show(relation)
    } catch (error) {
      errorDialogRef.current.show(error.message)
    }
  }

  const handleValueChange = async (value) => {
    requestUtils.abort()
    if (value === "carer" && !loggedUser.premium) {
      premiumDialogRef.current.show()
    } else {
      confirmDialogRef.current.show(value)
    }
    handleHide()
  }

  const ConfirmDialog = () => (
    <Dialog
      ref={confirmDialogRef}
      title="Confirmar envío de solicitud"
      content={(relation) =>
        `Se le enviará una solicitud a ${
          targetUser?.name
        } para que sea tu contacto cuidado${relation === "carer" ? "r" : ""}.`
      }
      cancel
      accept={{ text: "Enviar", action: sendRequest }}
    />
  )

  const ErrorDialog = () => (
    <Dialog
      ref={errorDialogRef}
      title="Error"
      content={(error) => error}
      accept
    />
  )

  const SuccessDialog = () => (
    <Dialog
      ref={successDialogRef}
      title="Solicitud enviada con éxito"
      content={(relation) =>
        `${targetUser?.name} aparecerá en tu lista de contactos ${
          relation === "carer" ? "cuidadores" : "cuidados"
        } cuando acepte la solicitud.`
      }
      accept
      onDismiss={() => navigation.goBack()}
    />
  )

  return (
    <>
      <CarerPremiumDialog ref={premiumDialogRef} navigation={navigation} />
      <ConfirmDialog />
      <ErrorDialog />
      <SuccessDialog />
      <Dialog
        ref={dialogRef}
        title={targetUser?.name}
        contentStyle={styles.dialogContent}
      >
        {options.map(({ label, value, premium }) => (
          <ListItem
            key={value}
            label={label}
            onPress={() => handleValueChange(value)}
            noDivider
            style={styles.optionItem}
            right={() =>
              premium && (
                <Chip
                  icon="star-circle"
                  style={{ backgroundColor: theme.colors.safe }}
                >
                  Premium
                </Chip>
              )
            }
          />
        ))}
      </Dialog>
    </>
  )
})

const styles = StyleSheet.create({
  dialogContent: {
    paddingHorizontal: 0,
  },
  optionItem: {
    paddingHorizontal: 15,
  },
})

export default NewContactDialog
