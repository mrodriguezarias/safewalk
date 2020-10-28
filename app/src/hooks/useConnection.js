import { useEffect, useState } from "react"
import NetInfo from "@react-native-community/netinfo"

const useConnection = () => {
  const [isConnected, setIsConnected] = useState()

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable !== isConnected) {
        setIsConnected(() => state.isInternetReachable)
      }
    })
    return NetInfo.addEventListener((state) => {
      if (state.isInternetReachable !== isConnected) {
        setIsConnected(() => state.isInternetReachable)
      }
    })
  }, [isConnected])

  return isConnected
}

export default useConnection
