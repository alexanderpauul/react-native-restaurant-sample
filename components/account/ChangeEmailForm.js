import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import { isEmpty } from "lodash";
import {
  updateEmail,
  updateProfile,
  validateLoginUser,
} from "../../utils/actions";
import { validateEmail } from "../../utils/helpers";

export default function changeEmailForm({
  email,
  setShowModal,
  toastRef,
  setReloadUser,
}) {
  const [newEmail, setNewEmail] = useState(email);
  const [password, setPassword] = useState(null);
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    setErrorEmail(null);
    setErrorPassword(null);
    let isValid = true;

    if (!validateEmail(newEmail)) {
      setErrorEmail("Debes ingresar una cuenta de correo valida.");
      isValid = false;
    }

    if (newEmail === email) {
      setErrorEmail(
        "Debes ingresar una cuenta de correo diferente a la actual."
      );
      isValid = false;
    }

    if (isEmpty(password)) {
      setErrorPassword("Debes ingresar la contraseña.");
      isValid = false;
    }

    return isValid;
  };

  const onSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const resultValidateCredential = await validateLoginUser(password);
    if (!resultValidateCredential.statusResponse) {
      setErrorPassword("Error validando las credenciales");
      setLoading(false);
      return;
    }

    const resultUpdateEmail = await updateEmail(newEmail);
    setLoading(false);
    if (!resultUpdateEmail.statusResponse) {
      setErrorEmail("No se puede actualizar la cuenta de correo.");
      return;
    }

    setReloadUser(true);
    toastRef.current.show("Se ha actualizado la cuenta de correo.", 4000);
    setShowModal(false);
  };

  return (
    <View style={styles.formModal}>
      <Input
        placeholder="Ingresa el nuevo correo"
        containerStyle={styles.input}
        defaultValue={email}
        onChange={(e) => setNewEmail(e.nativeEvent.text)}
        errorMessage={errorEmail}
        keyboardType="email-address"
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#c2c2c2",
        }}
      />

      <Input
        placeholder="Ingresa tu contraseña."
        containerStyle={styles.input}
        password={true}
        secureTextEntry={!showPassword}
        defaultValue={password}
        onChange={(e) => setPassword(e.nativeEvent.text)}
        errorMessage={errorPassword}
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
        title="Guardar cambios"
        containerStyle={styles.btnForm}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formModal: {
    alignItems: "center",
    paddingVertical: 10,
  },
  input: {
    marginBottom: 10,
  },
  btnForm: {
    width: "95%",
  },
  btn: {
    backgroundColor: "#f41c24",
  },
  icon: {
    color: "#ec1c1c",
  },
});
