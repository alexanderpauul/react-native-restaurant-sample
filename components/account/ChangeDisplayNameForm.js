import { isEmpty } from "lodash";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Button } from "react-native-elements";
import { updateProfile } from "../../utils/actions";

export default function ChangeDisplayNameForm({
  displayName,
  setShowModal,
  toastRef,
  setReloadUser,
}) {
  const [newDisplayName, setNewDisplayName] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    setError(null);

    if (isEmpty(newDisplayName)) {
      setError("Debes ingresar nombres y apellidos");
      return false;
    }

    if (newDisplayName === displayName) {
      setError("Debes ingresar nombres y apellidos diferentes para modificar");
      return false;
    }

    return true;
  };

  const onSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await updateProfile({ displayName: newDisplayName });
    setLoading(false);

    if (!result.statusResponse) {
      setError("Error al actualizar el campo nombres y apellidos");
      return;
    }

    setReloadUser(true);
    toastRef.current.show("Se ha actualizado los nombres y apellidos", 4000);
    setShowModal(false);
  };

  return (
    <View style={styles.formModal}>
      <Input
        placeholder="Ingresa nombres y apellidos"
        containerStyle={styles.input}
        defaultValue={displayName}
        onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
        errorMessage={error}
        rightIcon={{
          type: "material-community",
          name: "account-circle-outline",
          color: "#c2c2c2",
        }}
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
});
