import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import firebase from "firebase/app";
import ListRestaurants from "../../components/restaurant/ListRestaurants";

export default function Restaurant({ navigation }) {
  const user = firebase.auth().currentUser;

  return (
    <View style={styles.form}>
      <ListRestaurants navigation={navigation} />

      {user && (
        <Icon
          type="material-community"
          name="plus"
          color="#ec1c1c"
          reverse
          containerStyle={styles.btnForm}
          onPress={() => navigation.navigate("add-restaurant")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  form: { flex: 1 },
  btnForm: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
});
