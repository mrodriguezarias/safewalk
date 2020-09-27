import React, { useEffect, useRef, useState } from "react"
import { Keyboard } from "react-native"
import userService from "../../../../shared/services/user"
import DismissKeyboard from "../../components/dismissKeyboard"
import ListItem from "../../components/listItem"
import SearchResults from "../../components/searchResults"
import SearchBar from "../../components/searchBar"
import NewContactDialog from "../../components/user/newContactDialog"

const NewContactScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const searchRef = useRef()
  const dialogRef = useRef()

  useEffect(() => {
    searchRef.current.focus()
  }, [])

  const onChangeSearch = async (query) => {
    setSearchQuery(query)
    setLoading(true)
    const results = await userService.search(query)
    setResults(results)
    setLoading(false)
  }

  const handleItemPress = (user) => {
    Keyboard.dismiss()
    dialogRef.current.show(user)
  }

  const renderItem = (user) => (
    <ListItem title={user.name} onPress={() => handleItemPress(user)} />
  )

  return (
    <DismissKeyboard>
      <NewContactDialog ref={dialogRef} navigation={navigation} />
      <SearchBar
        ref={searchRef}
        placeholder="Buscar Usuario"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <SearchResults
        results={results}
        loading={loading}
        renderItem={renderItem}
        noResults={!!searchQuery && results.length === 0}
      />
    </DismissKeyboard>
  )
}

export default NewContactScreen
