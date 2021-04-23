import React, { useState, useEffect } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { Avatar, Button, Icon, Input, Image } from "react-native-elements";
import { map, size, filter, isEmpty } from "lodash";
import CountryPicker from "react-native-country-picker-modal";
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";

import {
  getCurrentLocation,
  loadImageFromGallery,
  validateEmail,
} from "../../utils/helpers";
import {
  addDocumentWithoutId,
  getCurrentUser,
  uploadImage,
} from "../../utils/actions";
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

  const addRestaurant = async () => {
    if (!validForm()) {
      return;
    }

    setLoading(true);
    const responseUploadmages = await uploadmages();
    const restaurant = {
      name: formData.name,
      address: formData.address,
      description: formData.description,
      email: formData.email,
      callingCode: formData.callingCode,
      phone: formData.phone,
      location: locationRestaurant,
      images: responseUploadmages,
      rating: 0,
      ratingTotal: 0,
      quantityVoting: 0,
      createDate: new Date(),
      createBy: getCurrentUser().uid,
    };

    const responseAddDocument = await addDocumentWithoutId(
      "restaurants",
      restaurant
    );
    setLoading(false);

    if (!responseAddDocument.statusResponse) {
      toastRef.current.show(
        "Error al guardar el restaunte, favor intenta mas tarde.",
        3000
      );

      return;
    }

    navigation.navigate("restaurant");
  };

  const uploadmages = async () => {
    const imagesUrl = [];
    await Promise.all(
      map(imagesSelected, async (image) => {
        const response = await uploadImage(image, "restaurants", uuid());
        if (response.statusResponse) {
          imagesUrl.push(response.url);
        }
      })
    );

    return imagesUrl;
  };

  const validForm = () => {
    clearError();
    let isValid = true;

    if (isEmpty(formData.name)) {
      setErrorName("Debes ingresar el nombre del restaurante.");
      isValid = false;
    }

    if (isEmpty(formData.address)) {
      setErrorAddress("Debes ingresar la direccion del restaurante.");
      isValid = false;
    }

    if (isEmpty(formData.phone)) {
      setErrorPhone("Debes ingresar el telefono del restaurante.");
      isValid = false;
    }

    if (size(formData.phone) < 7) {
      setErrorPhone("Debes completar el telefono del restaurante.");
      isValid = false;
    }

    if (!validateEmail(formData.email)) {
      setErrorEmail("Debes ingresar el email del restaurante.");
      isValid = false;
    }

    if (isEmpty(formData.description)) {
      setErrorDescription("Debes ingresar una descripción del restaurante.");
      isValid = false;
    }

    if (!locationRestaurant) {
      toastRef.current.show(
        "Debes de localizar el restaurante en el mapa.",
        3000
      );
      isValid = false;
    } else if (size(imagesSelected) === 0) {
      toastRef.current.show(
        "Debes de agregar al menos una imangen a el restaurante.",
        3000
      );
      isValid = false;
    }

    return isValid;
  };

  const clearError = () => {
    setErrorName(null);
    setErrorAddress(null);
    setErrorPhone(null);
    setErrorEmail(null);
    setErrorDescription(null);
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
        locationRestaurant={locationRestaurant}
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
  const [newRegion, setNewRegion] = useState(null);
  useEffect(() => {
    (async () => {
      const response = await getCurrentLocation();
      if (response.status) {
        setNewRegion(response.location);
      }
    })();
  }, []);

  const confirmLocation = () => {
    setLocationRestaurant(newRegion);
    toastRef.current.show("Localizacion guardada correctamente", 3000);
    setIsVisibleMap(false);
  };

  return (
    <Modal isVisible={isVisibleMap} setIsVisibleMap={setIsVisibleMap}>
      <View>
        {newRegion && (
          <MapView
            style={styles.mapStyle}
            initialRegion={newRegion}
            showsUserLocation={true}
            onRegionChange={(region) => setNewRegion(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: newRegion.latitude,
                longitude: newRegion.longitude,
              }}
              draggable
            />
          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button
            title="Guardar Ubicacion"
            style={styles.viewMapBtnContainetSave}
            buttonStyle={styles.viewMapBtnSave}
            onPress={confirmLocation}
          />

          <Button
            title="Cancelar"
            style={styles.viewMapBtnContainetCancel}
            buttonStyle={styles.viewMapBtnCancel}
            onPress={() => setIsVisibleMap(false)}
          />
        </View>
      </View>
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
  locationRestaurant,
}) {
  const [country, setCountry] = useState("DO");
  const [callingCode, setCallingCode] = useState("809");
  const [phone, setPhone] = useState("");

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  console.log(locationRestaurant);
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
          color: locationRestaurant ? "#c2c2c2" : "#f41c24",
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
    description: "",
    email: "",
    phone: "",
    country: "DO",
    callingCode: "809",
  };
};

const styles = StyleSheet.create({
  form: { marginHorizontal: 30, marginBottom: 40 },
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
  mapStyle: { width: "100%", height: 550 },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  viewMapBtnContainetSave: { paddingLeft: 5 },
  viewMapBtnSave: { backgroundColor: "#f41c24" },
  viewMapBtnContainetCancel: { paddingLeft: 5 },
  viewMapBtnCancel: { backgroundColor: "#e3e3e3" },
});
