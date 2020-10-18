import React from "react"
import CSnackbar from "../snackbar"
import { useSelector, useDispatch } from "react-redux"
import appActions from "../../store/actions/app"

const Snackbar = () => {
  const mapHeight = useSelector((state) => state.app.heights.map)
  const text = useSelector((state) => state.app.mapSnackbar)
  const dispatch = useDispatch()

  const setText = (text) => {
    dispatch(appActions.setMapSnackbar(text))
  }

  return (
    <CSnackbar
      text={text}
      setText={setText}
      style={{ bottom: mapHeight - 80 }}
    />
  )
}

export default Snackbar
