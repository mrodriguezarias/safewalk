import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { Chip, useTheme } from "react-native-paper"
import { useIsFocused } from "@react-navigation/native"
import contactController from "../../../../shared/controllers/contact"
import timeUtils from "../../../../shared/utils/time"
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
  const theme = useTheme()
  const mounted = useRef()

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useLayoutEffect(() => {
    if (contact) {
      navigation.setOptions({
        headerTitle: `Recorridos de ${contact.name}`,
      })
    }
  }, [navigation, contact])

  const fetchWalks = useCallback(async () => {
    setLoading(true)
    let response
    if (contact) {
      response = await contactController.getCaredWalks(contact.id, page)
    } else {
      response = await contactController.getOwnWalks(page)
    }
    const { data, total } = response
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

  useEffect(() => {
    if (!isFocused) {
      setTimeout(() => {
        if (mounted.current) {
          setPage(1)
          setReachedEnd(false)
          setShouldFetch(true)
          setWalks([])
        }
      }, 1000)
    }
  }, [isFocused])

  const handleRefresh = () => {
    setPage(1)
    setReachedEnd(false)
    setShouldFetch(true)
  }

  const displayWalk = (walk) => {
    navigation.navigate("WalkDetail", {
      walk,
      contact,
    })
  }

  const renderItem = ({ item }) => (
    <ListItem
      title={`Origen: ${item.source.name}\nDestino: ${item.target.name}`}
      titleNumberOfLines={2}
      description={timeUtils.getRelativeTime(item.start)}
      right={() =>
        !item.end && (
          <Chip icon="walk" style={{ backgroundColor: theme.colors.safe }}>
            En camino
          </Chip>
        )
      }
      onPress={() => displayWalk(item)}
    />
  )

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
