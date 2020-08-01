import React, { useState } from "react"
import { StyleSheet, View, ScrollView, Dimensions } from "react-native"
import {
  TextInput,
  TouchableRipple,
  Text,
  IconButton as PaperIconButton,
  useTheme,
} from "react-native-paper"
import { useSelector, useDispatch } from "react-redux"
import walkActions from "../../store/actions/walk"
import Spinner from "../spinner"
import geoService from "../../../../shared/services/geo"

const BAR_WIDTH = Dimensions.get("window").width
const BAR_HEIGHT = 60

const Input = ({ label, value = "", onPress, disabled = false }) => (
  <View style={styles.inputContainer}>
    <TextInput
      label={label}
      editable={false}
      value={value.length > 18 ? value.slice(0, 18) + "…" : value}
      theme={{ roundness: 0 }}
      multiline={false}
      numberOfLines={1}
      style={[
        styles.input,
        {
          fontSize: value.length > 16 ? 14 : 16,
        },
      ]}
      underlineColor="transparent"
    />
    <TouchableRipple
      onPress={disabled ? undefined : onPress}
      style={styles.touchable}
    >
      <Text />
    </TouchableRipple>
  </View>
)

const IconButton = (props) => (
  <View style={styles.buttonContainer}>
    <PaperIconButton size={20} {...props} />
  </View>
)

const LocationsCard = ({ navigation }) => {
  const [loading, setLoading] = useState(false)
  const source = useSelector((state) => state.walk.source)
  const target = useSelector((state) => state.walk.target)
  const dispatch = useDispatch()

  const changeLocation = (key, label) => {
    navigation.navigate("ChangeLocation", { key, label })
  }

  const swapLocations = () => {
    dispatch(walkActions.swapLocations())
  }

  const handleSubmit = async () => {
    setLoading(false)
    const path = await geoService.getSafestPath(source.coords, target.coords)
    dispatch(walkActions.setPath(path))
    setLoading(false)
  }

  return (
    <View style={styles.card}>
      <Input
        label="Origen"
        value={source?.name}
        onPress={() => changeLocation("source", "Origen")}
        disabled={loading}
      />
      <IconButton
        icon="swap-horizontal"
        onPress={swapLocations}
        disabled={loading}
      />
      <Input
        label="Destino"
        value={target?.name}
        onPress={() => changeLocation("target", "Destino")}
        disabled={loading}
      />
      {loading ? (
        <Spinner style={styles.spinner} />
      ) : (
        <IconButton
          icon="map-search-outline"
          onPress={handleSubmit}
          disabled={!source || !target || source.name === target.name}
        />
      )}
    </View>
  )
}

const SafePathCard = () => {
  return (
    <View style={styles.card}>
      <Text>SafePathCard</Text>
    </View>
  )
}

const ActionBar = ({ navigation }) => {
  const theme = useTheme()

  const backgroundColor = theme.dark ? "#343434" : "#E5E4E2"

  const handleScroll = () => {}

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView
        horizontal
        pagingEnabled
        decelerationRate={0}
        snapToInterval={BAR_WIDTH}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        <LocationsCard navigation={navigation} scrollTo={handleScroll} />
        <SafePathCard />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: "auto",
  },
  inputContainer: {
    flex: 1,
    position: "relative",
  },
  input: {
    height: BAR_HEIGHT,
    backgroundColor: "transparent",
  },
  touchable: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  spinner: {
    width: 34,
    transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
  },
})

export default ActionBar
