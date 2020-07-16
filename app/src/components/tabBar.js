import React, { useState } from "react"
import { View } from "react-native"
import { BottomNavigation } from "react-native-paper"

const TabBar = (props) => {
  const [index, setIndex] = useState()

  // const [routes] = useState([
  //   { key: 'music', title: 'Music', icon: 'queue-music' },
  //   { key: 'albums', title: 'Albums', icon: 'album' },
  //   { key: 'recents', title: 'Recents', icon: 'history' },
  // ]);

  const renderScene = BottomNavigation.SceneMap({
    music: MusicRoute,
    albums: AlbumsRoute,
    recents: RecentsRoute,
  })

  console.log("props", props)
  return <BottomNavigation navigationState={props.state} />
}

export default TabBar
