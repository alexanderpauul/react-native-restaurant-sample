import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import { isEmpty, size } from "lodash";
import { updatePassword, validateLoginUser } from "../../utils/actions";

export default function ChangePasswordForm({ setShowModal, toastRef }) {
  const [newPassword, setNewPassword] = useState(null);
  const [errorNewPassword, setErrorNewPassword] = useState(null);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [errorCurrentPassword, setErrorCurrentPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    setErrorNewPassword(null);
    setErrorCurrentPassword(null);
    setErrorConfirmPassword(null);

    let isValid = true;

    if (isEmpty(currentPassword)) {
      setErrorCurrentPassword("Debes ingresar la contraseña.");
      isValid = false;
    }

    if (size(newPassword) < 6) {
      setErrorNewPassword(
        "Debes ingresar una contraseña de al menos 6 caracteres."
      );
      isValid = false;
    }

    if (size(confirmPassword) < 6) {
      setErrorConfirmPassword(
        "Debes ingresar una contraseña de confirmacion de al menos 6 caracteres."
      );
      isValid = false;
    }

    if (!isEmpty(newPassword) && !isEmpty(confirmPassword)) {
      if (newPassword != confirmPassword) {
        setErrorNewPassword(
          "La nueva contraseña y la confirmacion no son iguales."
        );
        setErrorConfirmPassword(
          "La nuevo contraseña y la confirmacion no son iguales."
        );
        isValid = false;
      }
    }

    if (!isEmpty(newPassword) && !isEmpty(currentPassword)) {
      if (newPassword === currentPassword) {
        setErrorCurrentPassword(
          "La nueva contraseña y la actual deben ser diferente."
        );
        setErrorNewPassword(
          "La nueva contraseña y la actual deben ser diferente."
        );
        setErrorConfirmPassword(
          "La nueva contraseña y la actual deben ser diferente."
        );
        isValid = false;
      }
    }

    return isValid;
  };

  const onSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const resultValidateCredential = await validateLoginUser(currentPassword);
    if (!resultValidateCredential.statusResponse) {
      setErrorCurrentPassword("Error validando las credenciales");
      setLoading(false);
      return;
    }

    const resultUpdatePassword = await updatePassword(newPassword);
    setLoading(false);
    if (!resultUpdatePassword.statusResponse) {
      setErrorNewPassword("No se puede actualizar la contraseña.");
      return;
    }

    toastRef.current.show("Se ha actualizado la contraseña.", 4000);
    setShowModal(false);
  };

  return (
    <View style={styles.formModal}>
      <Input
        placeholder="Contraseña actual."
        containerStyle={styles.input}
        password={true}
        secureTextEntry={!showPassword}
        defaultValue={currentPassword}
        onChange={(e) => setCurrentPassword(e.nativeEvent.text)}
        errorMessage={errorCurrentPassword}
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
        placeholder="Nueva contraseña."
        containerStyle={styles.input}
        password={true}
        secureTextEntry={!showPassword}
        defaultValue={newPassword}
        onChange={(e) => setNewPassword(e.nativeEvent.text)}
        errorMessage={errorNewPassword}
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
        placeholder="Confirma la nueva contraseña."
        containerStyle={styles.input}
        password={true}
        secureTextEntry={!showPassword}
        defaultValue={confirmPassword}
        onChange={(e) => setConfirmPassword(e.nativeEvent.text)}
        errorMessage={errorConfirmPassword}
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
