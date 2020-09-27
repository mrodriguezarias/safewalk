import React, { forwardRef, useImperativeHandle, useRef } from "react"
import Dialog from "../dialog"

const CarerPremiumDialog = forwardRef(({ navigation }, ref) => {
  const dialogRef = useRef()

  useImperativeHandle(ref, () => ({
    show: handleShow,
    hide: handleHide,
  }))

  const handleShow = () => {
    dialogRef.current.show()
  }

  const handleHide = () => {
    dialogRef.current.hide()
  }

  // TODO: Uncomment on sprint 5
  // const getPremium = () => {
  //   navigation.navigate("Premium")
  // }

  return (
    <Dialog
      ref={dialogRef}
      title="Beneficio Premium"
      content="Los contactos cuidadores son un beneficio exclusivo para usuarios premium."
      accept
      // accept={{ text: "Obtener premium", action: getPremium }}
      // cancel
    />
  )
})

export default CarerPremiumDialog
