import React, { useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { Button, Icon, Input } from "react-native-elements";
import Loading from "../../components/Loading";
import { sendEmailResetPassword } from "../../utils/actions";
import { validateEmail } from "../../utils/helpers";

export default function RecoverPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateData = () => {
    setErrorEmail(null);
    let valid = true;

    if (!validateEmail(email)) {
      setErrorEmail("Debes de ingresar un email valido");
      valid = false;
    }

    return valid;
  };

  const onsubmit = async () => {
    if (!validateData()) {
      return;
    }

    setLoading(true);
    const result = await sendEmailResetPassword(email);
    if (!result.statusResponse) {
      setLoading(false);
      Alert.alert("Error", "Este correo no esta registrado.");
      return;
    } else {
      setLoading(false);
      Alert.alert(
        "Confirmacion",
        "Se envio un emaail a tu cuenta para recuperar la contraseña."
      );
      navigation.navigate("account", { screen: "login" });
    }
    setLoading(false);
  };

  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Ingresa tu email"
        containerStyle={styles.inputForm}
        onChange={(e) => setEmail(e.nativeEvent.text)}
        defaultValue={email}
        errorMessage={errorEmail}
        keyboardType="email-address"
        rightIcon={<Icon type="material-community" name="at" />}
        iconStyle={styles.icon}
      />
      <Button
        title="Recuperar contraseña"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btnRecover}
        onPress={() => onsubmit()}
      />

      <Loading isVisible={loading} text="Recuperando contraseña..." />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  inputForm: {
    width: "90%",
  },
  btnContainer: {
    marginTop: 20,
    width: "85%",
    alignSelf: "center",
  },
  btnRecover: {
    backgroundColor: "#f41c24",
  },
  icon: {
    color: "#c1c1c1",
  },
});
