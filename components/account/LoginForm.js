import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Icon, Input } from "react-native-elements";
import { isEmpty, size } from "lodash";
import { useNavigation } from "@react-navigation/native";
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
      setErrorPassword("Debes ingresar una contrasena.");
      isValid = false;
    }

    return isValid;
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

      <Button
        title="Iniciar Sesion"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={() => doLoginUser()}
      />

      <Loading isVisible={loading} text="Iniciando Sesion..." />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { flex: 1, alignItems: "center", marginTop: 30 },
  input: { width: "100%", marginTop: 10 },
  btnContainer: { marginTop: 10, width: "100%", alignSelf: "center" },
  btn: { backgroundColor: "#ec1c1c" },
  icon: {
    color: "#ec1c1c",
  },
});
