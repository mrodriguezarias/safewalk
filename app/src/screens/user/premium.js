import React from "react"
import { View, StyleSheet } from "react-native"
import { Title, List, useTheme, Button } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const PremiumScreen = ({ navigation }) => {
  const theme = useTheme()

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <MaterialCommunityIcons
          name="star-circle"
          size={80}
          color={theme.colors.text}
          style={styles.star}
        />
        <Title style={styles.title}>
          Hazte Premium para desbloquear todas las funcionalidades de la
          aplicación, incluyendo:
        </Title>
        <List.Item
          title="Ubicación en tiempo real"
          description="Compártela a todos tus Cuidadores"
          left={({ color }) => (
            <View style={styles.listIcon}>
              <MaterialCommunityIcons
                color={color}
                name="compass-outline"
                size={40}
              />
            </View>
          )}
        />
        <List.Item
          title="Alertas de seguridad"
          description="Avisa si crees que estás en peligro"
          left={({ color }) => (
            <View style={styles.listIcon}>
              <MaterialCommunityIcons
                color={color}
                name="alert-circle-outline"
                size={40}
              />
            </View>
          )}
        />
      </View>
      <View>
        <Button
          mode="contained"
          contentStyle={styles.button}
          onPress={() => navigation.navigate("Payment")}
        >
          Adquirir Premium
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    margin: 30,
  },
  inner: {
    flex: 1,
  },
  star: {
    marginTop: 30,
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  listIcon: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  button: {
    fontSize: 50,
    height: 50,
  },
})

export default PremiumScreen
