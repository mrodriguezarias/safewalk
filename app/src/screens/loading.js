import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import appActions from "../store/actions/app"
import Spinner from "../components/spinner"

const LoadingScreen = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(appActions.load())
  }, [])

  return <Spinner full size="large" />
}

export default LoadingScreen
