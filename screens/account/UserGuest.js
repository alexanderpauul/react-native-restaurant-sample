import React from "react";
import { Button } from "react-native-elements";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function UserGuest() {
  const navigation = useNavigation();

  return (
    <ScrollView
      contentContainerStyle={styles.centerContainer}
      style={styles.viewBody}
    >
      <Image
        source={require("../../assets/restaurant-logo.png")}
        resizeMode="contain"
        style={styles.image}
      />

      <Text style={styles.title}>Consulta tu perfil en Restaurnates</Text>
      <Text style={styles.description}>
        ¿Como describirias tu mejor restaurante? Busca y visualiza los mejores
        restaurantes de una forma sencilla, vota cual te ha gustado mas y
        conmenta como ha sido tu experiencia.
      </Text>

      <Button
        title="Ver tu perfil"
        buttonStyle={styles.profile}
        onPress={() => navigation.navigate("login")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewBody: { marginHorizontal: 30 },
  image: { height: 300, width: "100%", marginBottom: 10 },
  title: {
    fontWeight: "bold",
    fontSize: 19,
    marginVertical: 10,
  },
  description: { textAlign: "justify", marginBottom: 20, color: "#5e5e5e" },
  profile: { backgroundColor: "#f05458" },
  centerContainer: { flexGrow: 1, justifyContent: "center" },
});
