import React, { useCallback, useEffect, useLayoutEffect, useState } from "react"
import { useIsFocused } from "@react-navigation/native"
import contactController from "../../../../shared/controllers/contact"
import ListItem from "../../components/listItem"
import SearchResults from "../../components/searchResults"

const WalkListScreen = ({ route, navigation }) => {
  const [walks, setWalks] = useState([])
  const [loading, setLoading] = useState(true)
  const [shouldFetch, setShouldFetch] = useState(true)
  const [reachedEnd, setReachedEnd] = useState(false)
  const [page, setPage] = useState(1)
  const { contact } = route.params ?? {}
  const isFocused = useIsFocused()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Recorridos de ${contact.name}`,
    })
  }, [navigation, contact])

  const fetchWalks = useCallback(async () => {
    setLoading(true)
    const { data, total } = await contactController.getCaredWalks(
      contact.id,
      page,
    )
    const newWalks = page === 1 ? [...data] : [...walks, ...data]
    setReachedEnd(newWalks.length === total)
    setShouldFetch(false)
    setWalks(newWalks)
    setLoading(false)
    setPage(page + 1)
  }, [contact, page])

  useEffect(() => {
    if (isFocused && shouldFetch && !reachedEnd) {
      fetchWalks()
    }
  }, [fetchWalks, isFocused, shouldFetch])

  const handleRefresh = () => {
    setPage(1)
    setReachedEnd(false)
    setShouldFetch(true)
  }

  const renderItem = ({ index }) => {
    return <ListItem title={`Item ${index + 1}`} />
  }

  return (
    <SearchResults
      results={walks}
      renderItem={renderItem}
      loading={loading}
      noResults="Sin recorridos"
      onRefresh={handleRefresh}
      fetchMore={() => setShouldFetch(true)}
    />
  )
}

export default WalkListScreen
