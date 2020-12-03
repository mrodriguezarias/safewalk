import React, { useState } from "react"
import { View, StyleSheet, FlatList } from "react-native"
import { Paragraph } from "react-native-paper"
import _ from "lodash"

import Spinner from "./spinner"

const SearchResults = ({
  results = [],
  loading = false,
  noResults,
  renderItem,
  onRefresh,
  fetchMore,
}) => {
  const [refreshing, setRefreshing] = useState(false)

  const renderNoResults = () => {
    if (loading || results.length > 0 || !noResults) {
      return null
    }
    let nores = noResults
    if (!Array.isArray(noResults)) {
      nores = [_.isString(noResults) ? noResults : "Sin Resultados"]
    }
    return (
      <View style={styles.noResultsContainer}>
        {nores.map((item, index) => (
          <Paragraph style={styles.noResults} key={index}>
            {item}
          </Paragraph>
        ))}
      </View>
    )
  }

  const handleRefresh = async () => {
    if (!onRefresh) {
      return
    }
    setRefreshing(true)
    await onRefresh()
    setRefreshing(false)
  }

  const handleFetchMore = async () => {
    if (fetchMore) {
      fetchMore()
    }
  }

  const Footer = () => {
    return (
      <View>
        {loading && !refreshing && <Spinner style={styles.spinner} />}
        {renderNoResults()}
      </View>
    )
  }

  return (
    <FlatList
      data={results}
      renderItem={renderItem}
      onEndReachedThreshold={0.9}
      onEndReached={handleFetchMore}
      style={styles.list}
      ListFooterComponent={Footer}
      onRefresh={onRefresh ? handleRefresh : undefined}
      refreshing={refreshing}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  spinner: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 20,
  },
  noResultsContainer: {
    marginVertical: 25,
  },
  noResults: {
    marginBottom: 10,
    paddingHorizontal: 30,
    color: "grey",
    textAlign: "center",
  },
})

export default SearchResults
