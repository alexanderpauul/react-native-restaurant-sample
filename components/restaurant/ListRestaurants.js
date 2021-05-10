import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "react-native-elements";

import { size } from "lodash";
import firebase from "firebase/app";
import Loading from "../Loading";
import { formatPhone } from "../../utils/helpers";

export default function ListRestaurants({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  const ref = firebase.firestore().collection("restaurants");
  const limitRestaurantes = 50;

  useEffect(() => {
    setLoading(true);

    return ref
      .orderBy("createDate", "desc")
      .limitToLast(limitRestaurantes)
      .onSnapshot((snap) => {
        const records = [];
        snap.forEach((doc) => {
          const {
            name,
            address,
            phone,
            callingCode,
            createBy,
            createDate,
            description,
            email,
            images,
            location,
            quantityVoting,
            rating,
            ratingTotal,
          } = doc.data();

          records.push({
            id: doc.id,
            name,
            address,
            phone,
            callingCode,
            createBy,
            createDate,
            description,
            email,
            images,
            location,
            quantityVoting,
            rating,
            ratingTotal,
          });
        });

        if (records) {
          setRestaurants(records);
          setLoading(false);
        }
        setLoading(false);
      });
  }, []);

  return (
    <View>
      {size(restaurants) > 0 ? (
        <FlatList
          data={restaurants}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(restaurant) => (
            <Restaurant restaurant={restaurant} navigation={navigation} />
          )}
        />
      ) : (
        <View style={styles.notFoundView}>
          <Text style={styles.notFoundText}>
            No hay restaurantes registrados.
          </Text>
        </View>
      )}

      <Loading isVisible={loading} text="Cargando restaurantes..." />
    </View>
  );
}

function Restaurant({ restaurant, navigation }) {
  const {
    id,
    images,
    name,
    address,
    description,
    phone,
    callingCode,
  } = restaurant.item;

  const imageRestaurant = images[0];

  const goRestaurant = () => {
    navigation.navigate("restaurant-info", { id, name });
  };

  return (
    <TouchableOpacity onPress={() => goRestaurant()}>
      <View style={styles.viewRestaurant}>
        <View style={styles.viewRestaurantImage}>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="#ffffff" />}
            source={{ uri: imageRestaurant }}
            style={styles.imageRestaurant}
          />
        </View>
        <View>
          <Text style={styles.restaurantTile}>{name}</Text>
          <Text style={styles.restaurantInfo}>{address}</Text>
          <Text style={styles.restaurantInfo}>
            {formatPhone(callingCode, phone)}
          </Text>
          <Text style={styles.restaurantDescription}>
            {size(description) > 60
              ? `${description.substr(0, 60)}...`
              : description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  viewRestaurant: {
    flexDirection: "row",
    margin: 10,
  },
  viewRestaurantImage: {
    marginRight: 15,
  },
  imageRestaurant: {
    width: 90,
    height: 90,
  },
  restaurantTile: {
    fontWeight: "bold",
  },
  restaurantInfo: {
    paddingTop: 2,
    color: "gray",
  },
  restaurantDescription: {
    paddingTop: 2,
    color: "gray",
    width: "60%",
  },
  notFoundView: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
