import React, { useState, useCallback, useEffect, useRef } from "react"
import { Linking } from "react-native"
import { IconButton } from "react-native-paper"
import { useSelector } from "react-redux"
import contactController from "../../../../shared/controllers/contact"
import { useIsFocused } from "@react-navigation/native"
import Dialog from "../../components/dialog"
import ListItem from "../../components/listItem"
import SearchResults from "../../components/searchResults"
import contactUtils from "../../utils/contact"

const ContactScreen = ({ route }) => {
  const userId = useSelector((state) => state.auth.user?.id)
  const [loading, setLoading] = useState(false)
  const [contacts, setContacts] = useState([])
  const { relation } = route.params ?? {}
  const removeContactDialog = useRef()
  const isFocused = useIsFocused()

  const fetchContacts = useCallback(async () => {
    if (!userId) {
      return
    }
    setLoading(true)
    const contacts = await contactController.getContactsForUser(
      userId,
      relation,
    )
    setContacts(contacts)
    setLoading(false)
  }, [userId, relation])

  useEffect(() => {
    if (isFocused) {
      fetchContacts()
    }
  }, [fetchContacts, isFocused])

  const placeCall = (phone) => {
    Linking.openURL(`tel:${phone}`)
  }

  const removeContact = async (contact) => {
    removeContactDialog.current.show({
      contact,
      relation: contactUtils.translateRelation(relation),
    })
  }

  const confirmRemoval = async ({ id: target }) => {
    await contactController.removeContact(userId, target, relation)
  }

  const RemoveContactDialog = () => (
    <Dialog
      ref={removeContactDialog}
      title={({ relation }) => `Eliminar ${relation}`}
      content={({ contact, relation }) => {
        return `${contact?.name} dejará de ser tu contacto ${relation}.`
      }}
      cancel
      accept={({ contact }) => ({
        text: "Eliminar",
        action: () => confirmRemoval(contact),
      })}
      onDismiss={(accepted) => accepted && fetchContacts()}
    />
  )

  const renderItem = (contact) => (
    <ListItem
      title={contact.name}
      right={() => (
        <>
          {relation === "cared" && (
            <IconButton icon="map-marker" onPress={() => {}} disabled />
          )}
          <IconButton
            icon="phone"
            onPress={() => placeCall(contact.phone)}
            disabled={!contact.phone}
          />
          <IconButton icon="trash-can" onPress={() => removeContact(contact)} />
        </>
      )}
    />
  )

  return (
    <>
      <RemoveContactDialog />
      <SearchResults
        results={contacts}
        renderItem={renderItem}
        loading={loading}
        noResults={`Sin contactos ${contactUtils.translateRelation(
          relation,
          true,
        )}`}
        onRefresh={fetchContacts}
      />
    </>
  )
}

export default ContactScreen
