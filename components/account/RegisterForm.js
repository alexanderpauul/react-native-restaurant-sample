import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Icon, Input } from "react-native-elements";
import { validateEmail } from "../../utils/helpers";
import {
  addDocumentWithId,
  getCurrentUser,
  getToken,
  registerUser,
} from "../../utils/actions";
import { size } from "lodash";
import { useNavigation } from "@react-navigation/native";
import Loading from "../Loading";

export default function RegisterForm() {
  const defaultFormValues = () => {
    return { email: "", password: "", confirm: "" };
  };

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValues());
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirm, setErrorConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  const validateData = () => {
    setErrorEmail("");
    setErrorPassword("");
    setErrorConfirm("");

    let isValid = true;

    if (!validateEmail(formData.email)) {
      setErrorEmail("Debes de ingresar un email valido.");
      isValid = false;
    }

    if (size(formData.password) < 6) {
      setErrorPassword(
        "Debes ingresar una contrasena de al menos 6 caracteres."
      );
      isValid = false;
    }

    if (size(formData.confirm) < 6) {
      setErrorConfirm(
        "Debes ingresar una confirmacion de contrasena de al menos 6 caracteres."
      );
      isValid = false;
    }

    if (formData.password != formData.confirm) {
      setErrorPassword("La contrasena y la confirmacion no son iguales.");
      setErrorConfirm("La contrasena y la confirmacion no son iguales.");
      isValid = false;
    }

    return isValid;
  };

  const doRegisterUser = async () => {
    if (!validateData()) {
      return;
    }

    setLoading(true);
    const result = await registerUser(formData.email, formData.password);

    if (!result.statusResponse) {
      setLoading(false);
      setErrorEmail(result.error);
      return;
    }

    const token = await getToken();
    const resultUser = await addDocumentWithId(
      "users",
      { token },
      getCurrentUser().uid
    );

    if (!resultUser.statusResponse) {
      setLoading(false);
      setErrorEmail(result.error);
      return;
    }

    setLoading(false);
    navigation.navigate("account");
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
        placeholder="Ingrega tu contrasena..."
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
      <Input
        placeholder="Confirma tu contrasena..."
        containerStyle={styles.input}
        password={true}
        secureTextEntry={!showPassword}
        onChange={(e) => onChange(e, "confirm")}
        errorMessage={errorConfirm}
        defaultValue={formData.confirm}
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
        title="Registrar Nuevo Usuario"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={() => doRegisterUser()}
      />

      <Loading isVisible={loading} text="Creando Cuenta" />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { marginHorizontal: 30, marginTop: 30 },
  input: { width: "100%", marginTop: 10 },
  btnContainer: { marginTop: 10, width: "100%", alignSelf: "center" },
  btn: { backgroundColor: "#ec1c1c" },
  icon: {
    color: "#ec1c1c",
  },
});
