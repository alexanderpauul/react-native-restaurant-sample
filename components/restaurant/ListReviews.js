import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Avatar, Button, Rating } from "react-native-elements";
import { map, size } from "lodash";
import moment from "moment/min/moment-with-locales";
import firebase from "firebase/app";

import { getRestaurantReviews } from "../../utils/actions";
moment.locale("es");

export default function ListReviews({ navigation, idRestaurant }) {
  const [userLogged, setUserLogged] = useState(false);
  const [reviews, setReviews] = useState([]);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useEffect(() => {
    (async () => {
      const response = await getRestaurantReviews(idRestaurant);
      if (response.statusResponse) {
        setReviews(response.reviews);
      }
    })();
  });

  return (
    <View>
      {userLogged ? (
        <Button
          title="Escribe una opinion"
          buttonStyle={styles.btnAddReview}
          titleStyle={styles.btnTitleAddReview}
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "#f30a0a",
          }}
          onPress={() =>
            navigation.navigate("add-review-restaurant", { idRestaurant })
          }
        />
      ) : (
        <Text
          style={styles.mustLoginText}
          onPress={() => navigation.navigate("login")}
        >
          Para escribir una opinion es necesario estar logueado.{" "}
          <Text style={styles.loginText}>Pulsa aqui para iniciar sesion.</Text>
        </Text>
      )}
      {size(reviews) > 0 &&
        map(reviews, (reviewDocument, index) => (
          <Review reviewDocument={reviewDocument} />
        ))}
    </View>
  );
}

function Review({ reviewDocument }) {
  const { title, review, rating, avatarUser } = reviewDocument;
  const createReview = new Date(reviewDocument.createDate.seconds * 1000);

  return (
    <View style={styles.viewReview}>
      <View style={styles.imageAvatar}>
        <Avatar
          renderPlaceholderContent={<ActivityIndicator color="#fff" />}
          size="large"
          rounded
          containerStyle={styles.imageAvatarUser}
          source={
            avatarUser
              ? { uri: avatarUser }
              : require("../../assets/avatar-default.jpg")
          }
        />
      </View>
      <View style={styles.viewInfo}>
        <Text style={styles.reviewTitle}>{title}</Text>
        <Text style={styles.reviewText}>{review}</Text>
        <Rating imageSize={15} startingValue={rating} readonly />
        <Text style={styles.reviewDate}>
          {moment(createReview).format("LLL")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnAddReview: {
    backgroundColor: "transparent",
  },
  btnTitleAddReview: {
    color: "#f41c24",
  },
  mustLoginText: {
    textAlign: "center",
    color: "#f41c24",
    padding: 20,
  },
  loginText: {
    fontWeight: "bold",
  },
  viewReview: {
    flexDirection: "row",
    padding: 10,
    paddingBottom: 20,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1,
  },
  imageAvatar: {
    marginRight: 15,
  },
  imageAvatarUser: {
    width: 50,
    height: 50,
  },
  viewInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  reviewTitle: {
    fontWeight: "bold",
  },
  reviewText: {
    paddingTop: 2,
    color: "gray",
    marginBottom: 5,
  },
  reviewDate: {
    marginTop: 5,
    color: "gray",
    fontSize: 12,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});
