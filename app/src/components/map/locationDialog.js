import React, { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { StyleSheet } from "react-native"
import { RadioButton } from "react-native-paper"
import { useSelector, useDispatch } from "react-redux"

import Dialog from "../dialog"
import requestUtils from "../../../../shared/utils/request"
import walkActions from "../../store/actions/walk"
import appActions from "../../store/actions/app"

const LocationDialog = forwardRef(({ navigation }, ref) => {
  const [location, setLocation] = useState()
  const dispatch = useDispatch()
  const places = useSelector((state) => state.walk.places)
  const isAdmin = useSelector((state) => state.auth?.user?.admin)
  const dialogRef = useRef()

  useImperativeHandle(ref, () => ({
    show: handleShow,
    hide: handleHide,
  }))

  const handleShow = (location) => {
    setLocation(location)
    dialogRef.current.show()
  }

  const handleHide = () => {
    dialogRef.current.hide()
  }

  const saveLocation = (key) => {
    if (key === "current") {
      dispatch(appActions.setMockLocation(location?.coords ?? null))
    } else {
      dispatch(walkActions.setLocation(key, location))
    }
    navigation.navigate("Main")
  }

  const markOnMap = () => {
    dispatch(walkActions.markPlace(location))
    navigation.navigate("Main")
  }

  const unmarkFromMap = () => {
    dispatch(walkActions.unmarkPlace(location))
    navigation.navigate("Main")
  }

  const handleOption = (option) => {
    requestUtils.abort()
    switch (option) {
      case "source":
      case "target":
      case "current":
        saveLocation(option)
        break
      case "mark":
        markOnMap()
        break
      case "unmark":
        unmarkFromMap()
        break
      default:
    }
  }

  const handleValueChange = (value) => {
    handleOption(value)
    handleHide()
  }

  const getOptions = () => {
    const marked = places.some(({ id }) => id === location?.id)
    let options = [
      { value: "source", label: "Establecer como origen" },
      { value: "target", label: "Establecer como destino" },
      marked
        ? { value: "unmark", label: "Desmarcar del mapa" }
        : { value: "mark", label: "Marcar en el mapa" },
      { value: "related", label: "Ver lugares relacionados" },
    ]
    if (isAdmin) {
      options = [
        ...options,
        { value: "current", label: "Establecer ubicación actual" },
      ]
    }
    return options
  }

  return (
    <Dialog
      ref={dialogRef}
      title={location?.name}
      contentStyle={styles.dialogContent}
    >
      <RadioButton.Group onValueChange={handleValueChange}>
        {getOptions().map(({ label, value }) => (
          <RadioButton.Item
            key={value}
            label={label}
            value={value}
            style={styles.optionItem}
          />
        ))}
      </RadioButton.Group>
    </Dialog>
  )
})

const styles = StyleSheet.create({
  dialogContent: {
    paddingHorizontal: 0,
  },
  optionItem: {
    paddingHorizontal: 25,
  },
})

export default LocationDialog
