import React, { useCallback, useEffect, useRef, useState } from "react"
import { IconButton } from "react-native-paper"
import ListItem from "../../components/listItem"
import SearchResults from "../../components/searchResults"
import contactController from "../../../../shared/controllers/contact"
import { useSelector } from "react-redux"
import CarerPremiumDialog from "../../components/user/carerPremiumDialog"
import { useIsFocused } from "@react-navigation/native"
import contactUtils from "../../utils/contact"

const RequestsScreen = ({ navigation }) => {
  const { id, premium } = useSelector((state) => state.auth.user)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const premiumDialogRef = useRef()
  const isFocused = useIsFocused()

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    const requests = await contactController.getPendingRequests(id)
    setRequests(requests)
    setLoading(false)
  }, [id])

  useEffect(() => {
    if (isFocused) {
      fetchRequests()
    }
  }, [fetchRequests, isFocused])

  const respondRequest = async (confirmed, { id, relation }) => {
    if (confirmed && !premium && relation === "carer") {
      premiumDialogRef.current.show()
      return
    }
    setLoading(true)
    await contactController.respond(id, confirmed)
    fetchRequests()
  }

  const renderItem = (request) => (
    <ListItem
      title={request.user.name}
      description={contactUtils.translateRelation(request.relation)}
      right={() => (
        <>
          <IconButton
            icon="close"
            onPress={() => respondRequest(false, request)}
          />
          <IconButton
            icon="check"
            onPress={() => respondRequest(true, request)}
          />
        </>
      )}
    />
  )

  return (
    <>
      <CarerPremiumDialog ref={premiumDialogRef} navigation={navigation} />
      <SearchResults
        results={requests}
        renderItem={renderItem}
        loading={loading}
        noResults="Sin solicitudes pendientes"
        onRefresh={fetchRequests}
      />
    </>
  )
}

export default RequestsScreen
