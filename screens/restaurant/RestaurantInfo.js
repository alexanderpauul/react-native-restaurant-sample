import React, { useState, useRef, useEffect } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { ListItem, Rating, Icon, Input, Button } from "react-native-elements";
import firebase from "firebase/app";
import { isEmpty, map } from "lodash";
import Toast from "react-native-easy-toast";

import {
  callNumber,
  formatPhone,
  sendEmail,
  sendWhatsApp,
} from "../../utils/helpers";
import {
  addDocumentWithoutId,
  getCurrentUser,
  getDocumentById,
  getIsFavorite,
  deleteFavorite,
  sendPushNotification,
  setNotificationMessage,
  getUserFavorites,
} from "../../utils/actions";
import Modal from "../../components/Modal";
import Loading from "../../components/Loading";
import CarouselImages from "../../components/CarouselImages";
import ListReviews from "../../components/restaurant/ListReviews";
import MapRestaurant from "../../components/restaurant/MapRestaurant";

const widthScreen = Dimensions.get("window").width;

export default function RestaurantInfo({ navigation, route }) {
  const [restaurant, setRestaurant] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalNotification, setModalNotification] = useState(false);

  const { id, name } = route.params;
  navigation.setOptions({ title: name });
  const toastRef = useRef();

  const user = firebase.auth().currentUser;
  const ref = firebase.firestore().collection("restaurants");
  const refFavorites = firebase.firestore().collection("favorites");

  useEffect(() => {
    let record = {};
    return ref.doc(id).onSnapshot((snap) => {
      record = { id: snap.id, ...snap.data() };

      if (record) {
        setRestaurant(record);
      } else {
        setRestaurant({});
        Alert.alert.show(
          "Ocurrio un problema cargando el restaurant, intente mas tarde.",
          3000
        );
      }
    });
  }, []);

  useEffect(() => {
    async function getFavoritesRestaurants() {
      if (user && restaurant) {
        return refFavorites
          .where("idRestaurant", "==", id)
          .where("idUser", "==", user.uid)
          .onSnapshot((querySnapshot) => {
            if (querySnapshot.docs.length > 0) {
              setIsFavorite(true);
            } else {
              setIsFavorite(false);
            }
          });
      }
    }

    getFavoritesRestaurants();
  }, [user, restaurant]);

  if (!restaurant) {
    return <Loading isVisible={loading} text="Cargando" />;
  }

  const addFavorite = async () => {
    if (!user) {
      toastRef.current.show("Debes iniciar sesion.", 3000);
      return;
    }

    setLoading(true);

    const response = await refFavorites.add({
      idUser: user.uid,
      idRestaurant: id,
    });

    setLoading(false);

    if (response.statusResponse) {
      setIsFavorite(true);
      toastRef.current.show("Agregado a favorito.", 3000);
    } else {
      toastRef.current.show("No se pudo agregar favorito", 3000);
    }
  };

  const removeFavorite = async () => {
    if (!user) {
      toastRef.current.show("Debes iniciar sesion.", 3000);
      return;
    }

    setLoading(true);

    refFavorites
      .where("idRestaurant", "==", id)
      .where("idUser", "==", user.uid)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          refFavorites.doc(doc.id).delete();
          setIsFavorite(false);
        });
      });

    setLoading(false);
  };

  return (
    <ScrollView style={styles.ViewBody}>
      <CarouselImages
        images={restaurant.images}
        height={250}
        width={widthScreen}
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
      />

      <View style={styles.viewFavorite}>
        <Icon
          type="material-community"
          name={isFavorite ? "heart" : "heart-outline"}
          onPress={isFavorite ? removeFavorite : addFavorite}
          color="#f41c24"
          size={35}
          underlayColor="transparent"
        />
      </View>

      <TitleRestaurant
        name={restaurant.name}
        description={restaurant.description}
        rating={restaurant.rating}
      />

      <RestauranMapInfo
        name={restaurant.name}
        location={restaurant.location}
        address={restaurant.address}
        email={restaurant.email}
        phone={formatPhone(restaurant.callingCode, restaurant.phone)}
        currentUser={user}
        setLoading={setLoading}
        setModalNotification={setModalNotification}
      />

      <ListReviews navigation={navigation} idRestaurant={restaurant.id} />

      <SendMessage
        modalNotification={modalNotification}
        setModalNotification={setModalNotification}
        setLoading={setLoading}
        restaurant={restaurant}
      />

      <Toast ref={toastRef} position="top" opacity={0.9} />
      <Loading isVisible={loading} text="Por favor espere..." />
    </ScrollView>
  );
}

function SendMessage({
  modalNotification,
  setModalNotification,
  setLoading,
  restaurant,
}) {
  const [title, setTitle] = useState(null);
  const [errorTitle, setErrorTitle] = useState(null);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const user = firebase.auth().currentUser;
  const validForm = () => {
    let isValid = true;

    if (isEmpty(title)) {
      setErrorTitle("Debes ingresar un titulo a tu mensaje");
      isValid = false;
    }

    if (isEmpty(message)) {
      setErrorMessage("Debes ingresar un mensaje");
      isValid = false;
    }

    return isValid;
  };

  const sentNotification = async () => {
    if (!validForm()) {
      return;
    }

    setLoading(true);

    const userName = user.displayName ? user.displayName : "Anomino";
    const theMessage = `${message}, del restaurante: ${restaurant.name}`;

    const usersFavorites = await getUserFavorites(restaurant.id);
    if (!usersFavorites.statusResponse) {
      setLoading(false);
      Alert.alert("Error enviado la notificacion.");
      return;
    }

    await Promise.all(
      map(usersFavorites.users, async (user) => {
        const messageNotification = setNotificationMessage(
          user.token,
          `${userName}, dijo: ${title}`,
          theMessage,
          { data: theMessage }
        );

        await sendPushNotification(messageNotification);
      })
    );

    setLoading(false);
    setModalNotification(false);
    setTitle(null);
    setMessage(null);
  };

  return (
    <Modal isVisible={modalNotification} setVisible={setModalNotification}>
      <View style={styles.modalContainer}>
        <Text style={styles.textModal}>
          Enviale un mensaje a los amantes de {restaurant.name}
        </Text>

        <Input
          placeholder="Titulo del mensaje..."
          onChangeText={(text) => setTitle(text)}
          value={title}
          errorMessage={errorTitle}
        />
        <Input
          placeholder="Mensaje..."
          onChangeText={(text) => setMessage(text)}
          value={message}
          errorMessage={errorMessage}
          multiline
          style={styles.textArea}
        />

        <Button
          title="Enviar Mensaje"
          buttonStyle={styles.btnSend}
          containerStyle={styles.btnSendContainer}
          onPress={() => sentNotification()}
        />
      </View>
    </Modal>
  );
}

function TitleRestaurant({ name, description, rating }) {
  return (
    <View style={styles.viewRestaurantTitle}>
      <View style={styles.viewRestaurantContainer}>
        <Text style={styles.nameRestaurant}>{name}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(rating)}
        />
      </View>
      <Text style={styles.descriptionRestaurant}>{description}</Text>
    </View>
  );
}

function RestauranMapInfo({
  name,
  location,
  address,
  email,
  phone,
  currentUser,
  setLoading,
  setModalNotification,
}) {
  const listMapInfo = [
    {
      type: "address",
      text: address,
      iconLeft: "map-marker",
      iconRight: "message-text-outline",
    },
    { type: "email", text: email, iconLeft: "at" },
    { type: "phone", text: phone, iconLeft: "phone", iconRight: "whatsapp" },
  ];

  const actionLeft = (type) => {
    if (type == "phone") {
      callNumber(phone);
    } else if (type == "email") {
      if (currentUser) {
        sendEmail(
          email,
          `Soy ${currentUser.displayName}, estoy interesado en sus servicios.`
        );
      } else {
        sendEmail(email, "Estoy interesado en sus servicios.");
      }
    }
  };

  const actionRight = (type) => {
    if (type == "phone") {
      if (currentUser) {
        sendWhatsApp(
          phone,
          `Soy ${currentUser.displayName}, estoy interesado en sus servicios.`
        );
      } else {
        sendEmail(phone, "Interesado", "Estoy interesado en sus servicios.");
      }
    } else if (type == "address") {
      setModalNotification(true);
    }
  };

  return (
    <View style={styles.viewRestauranMapInfo}>
      <Text style={styles.restaurantMapInfoTitle}>
        Información sobre el restaurante
      </Text>

      <MapRestaurant location={location} name={name} height={150} />

      {map(listMapInfo, (item, index) => (
        <ListItem key={index} style={styles.containerListItem}>
          <Icon
            type="material-community"
            name={item.iconLeft}
            color="#f41c24"
            onPress={() => actionLeft(item.type)}
          />
          <ListItem.Content>
            <ListItem.Title>{item.text}</ListItem.Title>
          </ListItem.Content>

          {item.iconRight && (
            <Icon
              type="material-community"
              name={item.iconRight}
              color="#f41c24"
              onPress={() => actionRight(item.type)}
            />
          )}
        </ListItem>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  ViewBody: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  viewRestaurantTitle: {
    padding: 12,
  },
  viewRestaurantContainer: {
    flexDirection: "row",
  },
  nameRestaurant: {
    fontWeight: "bold",
  },
  rating: {
    position: "absolute",
    right: 0,
  },
  descriptionRestaurant: {
    marginTop: 10,
    color: "gray",
    textAlign: "justify",
  },
  viewRestauranMapInfo: {
    margin: 15,
  },
  restaurantMapInfoTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 15,
  },
  containerListItem: {
    borderBottomColor: "#f41c24",
    borderBottomWidth: 1,
  },
  viewFavorite: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#ffffff",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    borderRadius: 50,
    padding: 5,
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  textModal: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  textArea: {
    height: 50,
    paddingHorizontal: 10,
  },
  btnSend: {
    backgroundColor: "#f41c24",
  },
  btnSendContainer: {
    width: "95%",
    marginVertical: 10,
  },
});
