import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Button, Icon, Image } from "react-native-elements";
import Toast from "react-native-easy-toast";
import { useFocusEffect } from "@react-navigation/native";
import firebase from "firebase/app";
import { deleteFavorite, getFavorites } from "../utils/actions";
import Loading from "../components/Loading";

export default function Favorite({ navigation }) {
  const toastRef = useRef();
  const [restaurants, setRestaurants] = useState(null);
  const [userLogged, setUserLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reloadData, setReloadData] = useState(false);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useFocusEffect(
    useCallback(() => {
      async function getData() {
        setLoading(true);
        const response = await getFavorites();
        setRestaurants(response.favorites);
        setLoading(false);
      }

      if (userLogged) {
        getData();
      }
    }, [userLogged, reloadData])
  );

  if (!userLogged) {
    return <UserNoLogged navigation={navigation} />;
  }

  if (!restaurants) {
    return <Loading isVisible={true} text="Cargando restaurantes..." />;
  } else if (restaurants?.length === 0) {
    return <NoFauntRestaurants />;
  }

  return (
    <View style={styles.viewBody}>
      {restaurants ? (
        <FlatList
          data={restaurants}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(restaurant) => (
            <Restaurant
              restaurant={restaurant}
              setLoading={setLoading}
              toastRef={toastRef}
              navigation={navigation}
              setReloadData={setReloadData}
            />
          )}
        />
      ) : (
        <View style={styles.loaderRestaurant}>
          <ActivityIndicator size="large">
            <Text style={{ textAlign: "center" }}>
              Cargando Restaurantes...
            </Text>
          </ActivityIndicator>
        </View>
      )}
      <Toast ref={toastRef} position="top" opacity={0.9} />
      <Loading isVisible={loading} text="Por favor espere..." />
    </View>
  );
}

function Restaurant({
  restaurant,
  setLoading,
  toastRef,
  navigation,
  setReloadData,
}) {
  const { id, name, images } = restaurant.item;

  const removeFavorite = async () => {
    setLoading(true);
    const response = await deleteFavorite(id);
    if (response.statusResponse) {
      setReloadData(true);
      toastRef.current.show("Restaurante eliminado de favorito", 3000);
    } else {
      toastRef.current.show(
        "Error al eliminar el restaurante de favorito",
        3000
      );
    }
    setLoading(true);
  };
  const confirmRemoveFavorite = () => {
    Alert.alert(
      "Eliminar restaurante de Favoritos",
      "Estas seguro que quieres borrar el restaurante de favorite?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Si",
          style: "default",
          onPress: removeFavorite,
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.restaurant}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("restaurant", {
            screen: "restaurant-info",
            params: { id, name },
          })
        }
      >
        <Image
          resizeMode="cover"
          style={styles.image}
          PlaceholderContent={<ActivityIndicator color="#fff" />}
          source={{ uri: images[0] }}
        />

        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Icon
            type="material-community"
            name="heart"
            color="#f00"
            containerStyle={styles.favorite}
            underlayColor="transparent"
            onPress={() => confirmRemoveFavorite()}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

function UserNoLogged({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 20,
      }}
    >
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Necesitas estar logueado para ver los favoritos.
      </Text>
      <Button
        title="Ir al login"
        containerStyle={{ marginTop: 20, width: "100%" }}
        buttonStyle={{ backgroundColor: "#f04567" }}
        onPress={() => navigation.navigate("account", { screen: "login" })}
      />
    </View>
  );
}

function NoFauntRestaurants() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 20,
      }}
    >
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Aun no tienes restaurantes en favoritos.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: { flex: 1, backgroundColor: "#f2f2f2" },
  loaderRestaurant: { marginVertical: 10 },
  restaurant: {
    margin: 10,
  },
  image: {
    width: "100%",
    height: 180,
  },
  info: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: -30,
    backgroundColor: "#fff",
  },
  name: {
    fontWeight: "bold",
    fontSize: 20,
  },
  favorite: {
    marginTop: -35,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 100,
  },
});
