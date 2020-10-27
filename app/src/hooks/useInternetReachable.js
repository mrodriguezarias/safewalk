import { useEffect, useState } from "react"
import NetInfo from "@react-native-community/netinfo"

const useInternetReachable = () => {
  const [isInternetReachable, setIsInternetReachable] = useState()

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable !== isInternetReachable) {
        setIsInternetReachable(() => state.isInternetReachable)
      }
    })
    return NetInfo.addEventListener((state) => {
      if (state.isInternetReachable !== isInternetReachable) {
        setIsInternetReachable(() => state.isInternetReachable)
      }
    })
  }, [isInternetReachable])

  return isInternetReachable
}

export default useInternetReachable
