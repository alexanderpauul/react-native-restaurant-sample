import React, { useState } from "react";
import { StyleSheet, Text, View, Platform, Alert } from "react-native";
import { Button, Icon, Input } from "react-native-elements";
import { isEmpty, size } from "lodash";
import { useNavigation } from "@react-navigation/native";
import * as GoogleSignIn from "expo-google-sign-in";
import * as firebase from "firebase";
import Loading from "../Loading";
import { validateEmail } from "../../utils/helpers";
import { loginUser } from "../../utils/actions";

export default function LoginForm() {
  const defaultFormValues = () => {
    return { email: "", password: "" };
  };

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValues());
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  const validateData = () => {
    setErrorEmail("");
    setErrorPassword("");

    let isValid = true;

    if (!validateEmail(formData.email)) {
      setErrorEmail("Debes de ingresar un email valido.");
      isValid = false;
    }

    if (isEmpty(formData.password)) {
      setErrorPassword("Debes ingresar una contraseña.");
      isValid = false;
    }

    return isValid;
  };

  async function googleSignInAsync() {
    try {
      await GoogleSignIn.initAsync();
      if (Platform.OS === "android") {
        await GoogleSignIn.askForPlayServicesAsync();
      }
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === "success") {
        onSignIn(user);
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        Alert.alert(JSON.stringify(result));
        return { cancelled: true };
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(error.message);
      return { error: true };
    }
  }

  function onSignIn(googleUser) {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(function (firebaseUser) {
        unsubscribe();
        if (!isUserEqual(googleUser, firebaseUser)) {
          const credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.auth.idToken,
            googleUser.auth.accessToken
          );
          setLoading(true);
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(() => {
              setLoading(false);
            })
            .catch(function (error) {
              setLoading(false);
              Alert.alert(error.message);
            });
        } else {
          Alert.alert("Usuario ya está logueado");
        }
      });
  }

  function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
      let providerData = firebaseUser.providerData;
      for (let i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          return true;
        }
      }
    }
    return false;
  }

  const doLogin = async () => {
    if (!validateData()) {
      return;
    }

    setLoading(true);
    const result = await loginWithEmailAndPassword(
      formData.email,
      formData.password
    );
    setLoading(false);

    if (!result.statusResponse) {
      setErrorEmail(result.error);
      setErrorPassword(result.error);
      return;
    }

    navigation.navigate("account");
  };

  const doLoginUser = async () => {
    if (!validateData()) {
      return;
    }

    setLoading(true);
    const result = await loginUser(formData.email, formData.password);
    setLoading(false);

    if (!result.statusResponse) {
      setErrorEmail(result.error);
      setErrorPassword(result.error);
      return;
    }

    navigation.navigate("restaurant");
  };

  return (
    <View style={styles.form}>
      <Input
        placeholder="Ingresa tu email..."
        containerStyle={styles.input}
        onChange={(e) => onChange(e, "email")}
        keyboardType="email-address"
        errorMessage={errorEmail}
        defaultValue={formData.email}
      />
      <Input
        placeholder="Ingrega tu contraseña..."
        containerStyle={styles.input}
        password={true}
        secureTextEntry={!showPassword}
        onChange={(e) => onChange(e, "password")}
        errorMessage={errorPassword}
        defaultValue={formData.password}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.icon}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      <Button
        title="Iniciar Sesion"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={() => doLoginUser()}
      />

      <Button
        title="Iniciar sesion con Google"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btnGoogle}
        icon={
          <Icon
            name="google"
            type="material-community"
            marginRight={10}
            size={20}
            color="#fff"
          />
        }
        onPress={() => googleSignInAsync()}
      />

      <Loading isVisible={loading} text="Iniciando Sesion..." />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { flex: 1, alignItems: "center", marginTop: 30 },
  input: { width: "100%", marginTop: 10 },
  btnContainer: { marginTop: 10, width: "100%", alignSelf: "center" },
  btn: { backgroundColor: "#eb8334" },
  icon: {
    color: "#ec1c1c",
  },
  btnGoogle: {
    backgroundColor: "#ea4335",
  },
});
