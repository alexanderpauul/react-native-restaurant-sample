import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import firebase from "firebase/app";
import { size } from "lodash";

import {
  getCurrentUser,
  getMoreRestaurants,
  getRestaurants,
  isUserLogged,
} from "../../utils/actions";
import Loading from "../../components/Loading";
import ListRestaurants from "../../components/restaurant/ListRestaurants";

export default function Restaurant({ navigation }) {
  const [user, setUser] = useState(null);
  const [startRestaurant, setStartRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  const limitRestaurantes = 10;

  useEffect(() => {
  
    firebase.auth().onAuthStateChanged((userInfo) => {
      userInfo ? setUser(true) : setUser(false);
    });

  }, []);

  useFocusEffect(
    useCallback(() => {
      async function getData() {
        setLoading(true);
        const response = await getRestaurants(limitRestaurantes);
        if (response.statusResponse) {
          setStartRestaurant(response.startRestaurant);
          setRestaurants(response.restaurants);
        }
        setLoading(false);
      }
      getData();
    }, [])
  );

  const handleLoadMore = async () => {
    if (!startRestaurant) {
      return;
    }

    setLoading(true);
    const response = await getMoreRestaurants(
      limitRestaurantes,
      startRestaurant
    );

    if (response.statusResponse) {
      setStartRestaurant(response.startRestaurant);
      setRestaurants([...restaurants, ...response.restaurants]);
    }
    setLoading(false);
  };

  if (user == null) {
    return <Loading isVisible={true} text="Cargando..." />;
  }

  return (
    <View style={styles.form}>
      {size(restaurants) > 0 ? (
        <ListRestaurants
          restaurants={restaurants}
          navigation={navigation}
          handleLoadMore={() => handleLoadMore()}
        />
      ) : (
        <View style={styles.notFoundView}>
          <Text style={styles.notFoundText}>
            No hay restaurantes registrados.
          </Text>
        </View>
      )}
      {user && (
        <Icon
          type="material-community"
          name="plus"
          color="#ec1c1c"
          reverse
          containerStyle={styles.btnForm}
          onPress={() => navigation.navigate("add-restaurant")}
        />
      )}

      <Loading isVisible={loading} text="Cargando restaurantes..." />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { flex: 1 },
  btnForm: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
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
