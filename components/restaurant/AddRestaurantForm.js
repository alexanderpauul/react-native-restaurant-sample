import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { Button, Input, Icon, Avatar, Image } from "react-native-elements";
import CountryPicker from "react-native-country-picker-modal";
import { map, size, filter } from "lodash";
import { loadImageFromGallery } from "../../utils/helpers";
import Modal from "../../components/Modal";

const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm({
  toastRef,
  setLoading,
  navigation,
}) {
  const [formData, setFormData] = useState(defaultFormValues());
  const [errorName, setErrorName] = useState(null);
  const [errorDescription, setErrorDescription] = useState(null);
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorAddress, setErrorAddress] = useState(null);
  const [errorPhone, setErrorPhone] = useState(null);
  const [imagesSelected, setImagesSelected] = useState([]);
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [locationRestaurant, setLocationRestaurant] = useState(null);

  const addRestaurant = () => {
    console.log(formData);
    console.log("Fuck Yeah!!!");
  };

  return (
    <ScrollView style={styles.form}>
      <ImageRestaurant imageRestaurant={imagesSelected[0]} />
      <FormAdd
        formData={formData}
        setFormData={setFormData}
        errorName={errorName}
        errorDescription={errorDescription}
        errorEmail={errorEmail}
        errorAddress={errorAddress}
        errorPhone={errorPhone}
        setIsVisibleMap={setIsVisibleMap}
      />

      <UploadImage
        toastRef={toastRef}
        imagesSelected={imagesSelected}
        setImagesSelected={setImagesSelected}
      />

      <Button
        title="Crear Restaurante"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={() => addRestaurant()}
      />

      <MapRestaurant
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setLocationRestaurant={setLocationRestaurant}
        toastRef={toastRef}
      />
    </ScrollView>
  );
}
function MapRestaurant({
  isVisibleMap,
  setIsVisibleMap,
  setLocationRestaurant,
  toastRef,
}) {
  return (
    <Modal isVisible={isVisibleMap} setIsVisibleMap={isVisibleMap}>
      <Text>Map goes here...</Text>
    </Modal>
  );
}

function ImageRestaurant({ imageRestaurant }) {
  return (
    <View style={styles.viewPhoto}>
      <Image
        style={{ width: widthScreen, height: 200 }}
        source={
          imageRestaurant
            ? { uri: imageRestaurant }
            : require("../../assets/no-image.png")
        }
      />
    </View>
  );
}

function UploadImage({ toastRef, imagesSelected, setImagesSelected }) {
  const imageSelect = async () => {
    const response = await loadImageFromGallery([4, 3]);
    if (!response.status) {
      toastRef.current.show("No ha seleccionado ninguna imagen", 3000);
      return;
    }

    setImagesSelected([...imagesSelected, response.image]);
  };

  const removeImage = (image) => {
    Alert.alert(
      "Eliminar imagen",
      "¿Estas seguro que quieres eliminar la imagen?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Si",
          onPress: () => {
            setImagesSelected(
              filter(imagesSelected, (imageUrl) => imageUrl != image)
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView horizontal style={styles.viewImages}>
      {size(imagesSelected) < 10 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}
      {map(imagesSelected, (imageRestaurant, index) => (
        <Avatar
          key={index}
          style={styles.miniaturesStyle}
          source={{ uri: imageRestaurant }}
          onPress={() => removeImage(imageRestaurant)}
        />
      ))}
    </ScrollView>
  );
}

function FormAdd({
  formData,
  setFormData,
  errorName,
  errorDescription,
  errorEmail,
  errorAddress,
  errorPhone,
  setIsVisibleMap,
}) {
  const [country, setCountry] = useState("DO");
  const [callingCode, setCallingCode] = useState("809");
  const [phone, setPhone] = useState("");

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  return (
    <View>
      <Input
        placeholder="Nombre del restaurante"
        containerStyle={styles.input}
        defaultValue={formData.name}
        onChange={(e) => onChange(e, "name")}
        errorMessage={errorName}
      />
      <Input
        placeholder="Dirección"
        containerStyle={styles.input}
        defaultValue={formData.address}
        onChange={(e) => onChange(e, "address")}
        errorMessage={errorAddress}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: "#c2c2c2",
          onPress: () => setIsVisibleMap(true),
        }}
      />
      <Input
        placeholder="Correo electrónico"
        keyboardType="email-address"
        containerStyle={styles.input}
        defaultValue={formData.email}
        onChange={(e) => onChange(e, "email")}
        errorMessage={errorEmail}
      />
      <View style={styles.phone}>
        <CountryPicker
          withFlag
          withModal
          withCallingCode
          withFilter
          withCallingCodeButton
          withAlphaFilter
          containerStyle={styles.countryPicker}
          countryCode={country}
          onSelect={(country) => {
            setFormData({
              ...formData,
              country: country.cca2,
              callingCode: country.callingCode[0],
            });
            setCountry(country.cca2);
            setCallingCode(country.callingCode[0]);
          }}
        />
        <Input
          placeholder="Teléfono"
          keyboardType="phone-pad"
          containerStyle={styles.inputPhone}
          defaultValue={formData.phone}
          onChange={(e) => onChange(e, "phone")}
          errorMessage={errorPhone}
        />
      </View>

      <Input
        placeholder="Descripción del restaurante"
        multiline
        containerStyle={styles.textArea}
        defaultValue={formData.description}
        onChange={(e) => onChange(e, "description")}
        errorMessage={errorDescription}
      />
    </View>
  );
}

const defaultFormValues = () => {
  return {
    name: "",
    descriptionn: "",
    email: "",
    phone: "",
    country: "DO",
    callingCode: "809",
  };
};

const styles = StyleSheet.create({
  form: { marginHorizontal: 30, marginTop: 40 },
  textArea: { height: 100, width: "100%", marginTop: 10 },
  phone: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "baseline",
  },
  countryPicker: { width: "10%" },
  inputPhone: { width: "75%", marginTop: 10 },
  input: { width: "100%", marginTop: 10 },
  btnContainer: { marginTop: 10, width: "100%", alignSelf: "center" },
  btn: { backgroundColor: "#ec1c1c" },
  viewImages: { flexDirection: "row" },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
  },
  miniaturesStyle: { width: 70, height: 70, marginRight: 10 },
  viewPhoto: { alignItems: "center", height: 200, marginBottom: 20 },
});
