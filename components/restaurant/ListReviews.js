import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import firebase from "firebase/app";
import { Button } from "react-native-elements";
import RestaurantInfo from "../../screens/restaurant/RestaurantInfo";

export default function ListReviews({ navigation, idRestaurant }) {
  const [userLogged, setUserLogged] = useState(false);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  return (
    <View>
      {userLogged ? (
        <Button
          title="Escribe una opinion"
          buttonStyle={styles.btnAddReview}
          titleStyle={styles.btnTitleAddReview}
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "#f30a0a",
          }}
          onPress={() =>
            navigation.navigate("add-review-restaurant", { idRestaurant })
          }
        />
      ) : (
        <Text
          style={styles.mustLoginText}
          onPress={() => navigation.navigate("login")}
        >
          Para escribir una opinion es necesario estar logueado.{" "}
          <Text style={styles.loginText}>Pulsa aqui para iniciar sesion.</Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  btnAddReview: {
    backgroundColor: "transparent",
  },
  btnTitleAddReview: {
    color: "#f41c24",
  },
  mustLoginText: {
    textAlign: "center",
    color: "#f41c24",
    padding: 20,
  },
  loginText: {
    fontWeight: "bold",
  },
});
