import React, { useState, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AirbnbRating, Button, Input, Rating } from "react-native-elements";
import Toast from "react-native-easy-toast";
import { isEmpty } from "lodash";
import Loading from "../../components/Loading";

export default function AddReviewRestaurant({ navigation, route }) {
  const { idRestaurant } = route.params;
  const toastRef = useRef();

  const [rating, setRating] = useState(null);
  const [title, setTitle] = useState("");
  const [errorTitle, setErrorTitle] = useState(null);
  const [review, setReview] = useState(null);
  const [errorReview, setErrorReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const validForm = () => {
    setErrorTitle(null);
    setErrorReview(null);
    let isValid = true;

    if (!rating) {
      toastRef.current.show("Debes darle una puntuacion al restaurante", 3000);
      isValid = false;
    }

    if (isEmpty(title)) {
      setErrorTitle("Debes ingresar un titutlo a tu comentario.");
      isValid = false;
    }

    if (isEmpty(review)) {
      setErrorReview("Debes ingresar un comentario.");
      isValid = false;
    }

    return isValid;
  };

  const AddReview = () => {
    if (!validForm()) {
      return;
    }

    console.log("fuck yeah!");
  };

  return (
    <View style={styles.viewBody}>
      <View style={styles.viewRating}>
        <AirbnbRating
          count={5}
          reviews={["Malo", "Regular", "Normal", "Muy bueno", "Excelente"]}
          defaultRating={0}
          size={35}
          onFinishRating={(value) => setRating(value)}
        />
      </View>

      <View style={styles.formReview}>
        <Input
          placeholder="Titulo..."
          containerStyle={styles.input}
          onChange={(e) => setTitle(e.nativeEvent.text)}
          errorMessage={errorTitle}
        />

        <Input
          placeholder="Comentario..."
          containerStyle={styles.input}
          style={styles.textArea}
          multiline
          onChange={(e) => setReview(e.nativeEvent.text)}
          errorMessage={errorReview}
        />

        <Button
          title="Enviar comentario"
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
          onPress={() => AddReview()}
        />
      </View>

      <Toast ref={toastRef} position="top" opacity={0.9} />
      <Loading isVisible={loading} text="Enviando comentario..." />
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
  },
  viewRating: {
    height: 110,
    backgroundColor: "#f2f2f2",
  },
  formReview: {
    flex: 1,
    alignItems: "center",
    margin: 10,
    marginTop: 40,
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 150,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 10,
    width: "95%",
  },
  btn: {
    backgroundColor: "#f41c24",
  },
});
