import React, { useState, useRef, useEffect } from "react"
import { StyleSheet, View, ScrollView, Dimensions } from "react-native"
import {
  TextInput,
  TouchableRipple,
  Text,
  IconButton as PaperIconButton,
  useTheme,
  Button,
  Switch,
} from "react-native-paper"
import { useSelector, useDispatch } from "react-redux"
import walkActions from "../../store/actions/walk"
import Spinner from "../spinner"
import geoService from "../../../../shared/services/geo"
import walkController from "../../../../shared/controllers/walk"
import TextScaler from "../textScaler"
import Dialog from "../dialog"
import ListItem from "../listItem"
import geoUtils from "../../../../shared/utils/geo"
import appGeoUtils from "../../utils/geo"

const BAR_WIDTH = Dimensions.get("window").width
const BAR_HEIGHT = 60

const Input = ({ label, value = "", onPress, disabled = false }) => {
  const [fontSize, setFontSize] = useState()
  const [text, setText] = useState()
  const [inputWidth, setInputWidth] = useState()

  return (
    <View style={styles.inputContainer}>
      <TextScaler
        width={inputWidth}
        offset={18}
        hidden
        fontSize={16}
        minFontSize={10}
        setFontSize={setFontSize}
        setText={setText}
      >
        {value}
      </TextScaler>
      <TextInput
        label={label}
        editable={false}
        onLayout={({ nativeEvent: { layout } }) => {
          setInputWidth(layout.width)
        }}
        value={text}
        theme={{ roundness: 0 }}
        multiline={false}
        numberOfLines={1}
        style={[styles.input, { fontSize }]}
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
}

const IconButton = (props) => (
  <View style={styles.buttonContainer}>
    <PaperIconButton size={20} {...props} />
  </View>
)

const LocationsCard = ({ navigation, scrollTo }) => {
  const [loading, setLoading] = useState(false)
  const source = useSelector((state) => state.walk.source)
  const target = useSelector((state) => state.walk.target)
  const logged = useSelector((state) => state.auth.logged)
  const mockLocation = useSelector((state) => state.app.mockLocation)
  const dispatch = useDispatch()

  const changeLocation = (key) => {
    navigation.navigate("SearchLocation", { key })
  }

  const swapLocations = () => {
    dispatch(walkActions.swapLocations())
  }

  const handleSubmit = async () => {
    setLoading(true)
    const path = await geoService.getSafestPath(source.coords, target.coords)
    dispatch(walkActions.setPath(path))
    setLoading(false)
    if (logged) {
      const loc = await getCurrentLocation()
      if (geoUtils.nearCoords(loc, source.coords)) {
        scrollTo("Walk")
      }
    }
  }

  const getCurrentLocation = async () => {
    let coords
    if (mockLocation) {
      coords = mockLocation
    } else {
      coords = await appGeoUtils.getCurrentLocation()
    }
    return coords
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

const SafePathCard = ({ scrollTo }) => {
  const [loading, setLoading] = useState(false)
  const [arrived, setArrived] = useState(false)
  const user = useSelector((state) => state.auth.user)
  const path = useSelector((state) => state.walk.path)
  const walk = useSelector((state) => state.walk.walk)
  const dispatch = useDispatch()
  const dialogRef = useRef()
  const theme = useTheme()

  useEffect(() => {
    if (!walk) {
      goBack()
    }
  }, [walk])

  const goBack = () => {
    scrollTo("Location")
  }

  const startWalk = async () => {
    setLoading(true)
    const walk = await walkController.start(user.id, path)
    dispatch(walkActions.setWalk(walk))
    setLoading(false)
  }

  const stopWalk = async () => {
    setArrived(false)
    dialogRef.current.show()
  }

  const confirmStopWalk = async () => {
    dialogRef.current.hide()
    setLoading(true)
    await walkController.end(walk.id, arrived)
    dispatch(walkActions.setWalk(null))
    setLoading(false)
  }

  return (
    <View style={styles.card}>
      <Dialog
        ref={dialogRef}
        title="¿Llegaste bien?"
        content={
          <ListItem
            noDivider
            label="Anunciar Llegada Segura"
            right={() => (
              <Switch
                value={arrived}
                onValueChange={() => setArrived((arrived) => !arrived)}
                color={theme.colors.safe}
              />
            )}
          />
        }
        contentStyle={{
          marginTop: -10,
          marginBottom: -20,
          marginHorizontal: -15,
        }}
        actions={
          <>
            <Button onPress={() => dialogRef.current.hide()}>Volver</Button>
            <Button onPress={confirmStopWalk}>Terminar</Button>
          </>
        }
      />
      <View style={styles.backIconContainer}>
        {!walk && <IconButton icon="chevron-left" onPress={goBack} />}
      </View>
      <View style={styles.content}>
        <Button
          onPress={walk ? stopWalk : startWalk}
          mode="contained"
          loading={loading}
          disabled={loading}
        >
          {walk ? "Terminar recorrido" : "Iniciar recorrido"}
        </Button>
      </View>
    </View>
  )
}

const ActionBar = ({ navigation }) => {
  const theme = useTheme()
  const scrollViewRef = useRef()

  const backgroundColor = theme.dark ? "#343434" : "#E5E4E2"

  const handleScroll = (card) => {
    const cards = ["Location", "Walk"]
    const index = cards.indexOf(card)
    if (index === -1) {
      return
    }
    scrollViewRef.current.scrollTo({
      x: BAR_WIDTH * index,
      y: 0,
      animated: true,
    })
  }

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
        ref={scrollViewRef}
      >
        <LocationsCard navigation={navigation} scrollTo={handleScroll} />
        <SafePathCard navigation={navigation} scrollTo={handleScroll} />
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
    paddingHorizontal: 0,
    marginLeft: 15,
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
    position: "relative",
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
  backIconContainer: {
    position: "absolute",
    left: 0,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
})

export default ActionBar
