import { useEffect } from "react"
import { Keyboard } from "react-native"
import { useDispatch } from "react-redux"
import appActions from "../store/actions/app"

const keyboardUtils = {
  init: () => {
    const dispatch = useDispatch()

    const onKeyboardDidShow = (e) => {
      dispatch(appActions.setHeight("keyboard", e.endCoordinates.height))
    }

    const onKeyboardDidHide = () => {
      dispatch(appActions.setHeight("keyboard", 0))
    }

    useEffect(() => {
      Keyboard.addListener("keyboardDidShow", onKeyboardDidShow)
      Keyboard.addListener("keyboardDidHide", onKeyboardDidHide)
      return () => {
        Keyboard.removeListener("keyboardDidShow", onKeyboardDidShow)
        Keyboard.removeListener("keyboardDidHide", onKeyboardDidHide)
      }
    }, [])
  },
}

export default keyboardUtils
