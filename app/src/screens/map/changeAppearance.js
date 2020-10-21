import React from "react"
import { Platform, ScrollView } from "react-native"
import { useSelector, useDispatch } from "react-redux"

import ListItem from "../../components/listItem"
import appActions from "../../store/actions/app"

const ChangeAppearanceScreen = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.app.theme)
  const mapProvider = useSelector((state) => state.app.mapProvider)
  const mapType = useSelector((state) => state.app.mapType)

  return (
    <ScrollView>
      <ListItem
        label="Modo"
        options={[
          { value: "system", label: "Automático" },
          { value: "light", label: "Diurno" },
          { value: "dark", label: "Nocturno" },
        ]}
        onChange={(theme) => dispatch(appActions.setTheme(theme))}
        value={theme}
      />
      {Platform.OS === "ios" && (
        <ListItem
          label="Proveedor de Mapas"
          options={[
            { value: "apple", label: "Apple" },
            { value: "google", label: "Google" },
          ]}
          onChange={(mapProvider) =>
            dispatch(appActions.setMapProvider(mapProvider))
          }
          value={mapProvider}
        />
      )}
      <ListItem
        label="Tipo de Mapa"
        options={[
          { value: "standard", label: "Estándar" },
          { value: "satellite", label: "Satélite" },
          { value: "hybrid", label: "Híbrido" },
        ]}
        onChange={(mapType) => dispatch(appActions.setMapType(mapType))}
        value={mapType}
      />
    </ScrollView>
  )
}

export default ChangeAppearanceScreen
