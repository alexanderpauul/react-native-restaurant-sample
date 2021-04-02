import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import CountryPicker from "react-native-country-picker-modal";

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

  const addRestaurant = () => {
    console.log(formData);
    console.log("Fuck Yeah!!!");
  };

  return (
    <View style={styles.form}>
      <FormAdd
        formData={formData}
        setFormData={setFormData}
        errorName={errorName}
        errorDescription={errorDescription}
        errorEmail={errorEmail}
        errorAddress={errorAddress}
        errorPhone={errorPhone}
      />

      <Button
        title="Crear Restaurante"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={() => addRestaurant()}
      />
    </View>
  );
}

function FormAdd({
  formData,
  setFormData,
  errorName,
  errorDescription,
  errorEmail,
  errorAddress,
  errorPhone
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
    phone: "",
    country: "DO",
    callingCode: "809",
    email: "",
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
});
