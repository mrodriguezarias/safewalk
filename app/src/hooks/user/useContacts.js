import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import contactController from "../../../../shared/controllers/contact"

const UPDATE_INTERVAL = 2 // seconds

const useContacts = (relation, active = true) => {
  const userId = useSelector((state) => state.auth.user?.id)
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    clearInterval(useContacts.interval)
    if (!userId || !active) {
      return
    }
    fetchContacts()
    useContacts.interval = setInterval(fetchContacts, UPDATE_INTERVAL * 1000)
    return () => clearInterval(useContacts.interval)
  }, [userId, active])

  const fetchContacts = async () => {
    const contacts = await contactController.getContactsForUser(
      userId,
      relation,
    )
    setContacts(contacts)
  }

  return contacts
}

useContacts.interval = null

export default useContacts
