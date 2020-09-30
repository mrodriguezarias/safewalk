import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import contactController from "../../../../shared/controllers/contact"

const UPDATE_INTERVAL = 2 // seconds

const useRequests = (active = true) => {
  const userId = useSelector((state) => state.auth.user?.id)
  const [requests, setRequests] = useState([])

  useEffect(() => {
    clearInterval(useRequests.interval)
    if (!userId || !active) {
      return
    }
    fetchRequests()
    useRequests.interval = setInterval(fetchRequests, UPDATE_INTERVAL * 1000)
    return () => clearInterval(useRequests.interval)
  }, [userId, active])

  const fetchRequests = async () => {
    try {
      const requests = await contactController.getPendingRequests(userId)
      setRequests(requests)
    } catch {}
  }

  return requests
}

useRequests.interval = null

export default useRequests
