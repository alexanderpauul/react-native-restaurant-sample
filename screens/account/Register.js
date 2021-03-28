import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RegisterForm from "../../components/account/RegisterForm";

export default function Register() {
  return (
    <KeyboardAwareScrollView>
      <Image
        source={require("../../assets/restaurant-logo.png")}
        resizeMode="contain"
        style={styles.image}
      />

      <RegisterForm />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 150,
    width: "100%",
    marginBottom: 20,
    marginTop: 15,
  },

});
