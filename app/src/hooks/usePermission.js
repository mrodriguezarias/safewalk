import { useEffect, useRef, useState } from "react"
import * as Permissions from "expo-permissions"

const UPDATE_INTERVAL = 1 // seconds

const usePermission = () => {
  const [hasPermission, setHasPermission] = useState()
  const mounted = useRef()
  const interval = useRef()

  useEffect(() => {
    clearInterval(interval.current)
    mounted.current = true
    fetchPermission()
    interval.current = setInterval(fetchPermission, UPDATE_INTERVAL * 1000)
    return () => {
      mounted.current = false
      clearInterval(interval.current)
    }
  }, [])

  const fetchPermission = async () => {
    const { status } = await Permissions.getAsync(Permissions.LOCATION)
    const newHasPermission = status === "granted"
    if (hasPermission !== newHasPermission && mounted.current) {
      setHasPermission(newHasPermission)
    }
  }

  return hasPermission
}

export default usePermission
