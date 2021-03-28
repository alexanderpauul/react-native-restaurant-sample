import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-elements";

import { updateProfile, uploadImage } from "../../utils/actions";
import { loadImageFromGallery } from "../../utils/helpers";

export default function InfoUser({ user, setLoading, setLoadingText }) {
  const [photoUrl, setPhotoUrl] = useState(user.photoURL);

  const changePhoto = async () => {
    const result = await loadImageFromGallery([1, 1]);
    if (!result.status) {
      return;
    }

    setLoadingText("Actualizando imagen de perfil...");
    setLoading(true);

    const resultUploadImage = await uploadImage(
      result.image,
      "avatars",
      user.uid
    );

    if (!resultUploadImage.statusResponse) {
      setLoading(false);
      Alert.alert("Ha ocurrido un erro al almacenar la imagen de perfil");
      return;
    }

    const resultUpdateProfile = await updateProfile({
      photoURL: resultUploadImage.url,
    });
    setLoading(false);

    if (resultUpdateProfile.statusResponse) {
      setPhotoUrl(resultUploadImage.url);
    } else {
      Alert.alert("Ha ocurrido un error al actualizar la imagen de perfil");
    }
  };

  return (
    <View style={styles.form}>
      <Avatar
        rounded={true}
        size="large"
        containerStyle={styles.avatar}
        source={
          photoUrl
            ? { uri: photoUrl }
            : require("../../assets/avatar-default.jpg")
        }
        onPress={changePhoto}
      />

      <View style={styles.infoUser}>
        <Text style={styles.displayName}>
          {user.displayName ? user.displayName : "Anonimo"}
        </Text>
        <Text>{user.email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    paddingVertical: 30,
  },
  infoUser: {
    marginLeft: 20,
  },
  displayName: {
    fontWeight: "bold",
    paddingBottom: 5,
  },
});
