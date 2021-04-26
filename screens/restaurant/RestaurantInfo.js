import React, { useState, useEffect } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { ListItem, Rating, Icon, Input, Button } from "react-native-elements";
import Loading from "../../components/Loading";
import CarouselImages from "../../components/CarouselImages";
import { getDocumentById } from "../../utils/actions";
import { formatPhone } from "../../utils/helpers";
import MapRestaurant from "../../components/restaurant/MapRestaurant";
import { map } from "lodash";
import ListReviews from "../../components/restaurant/ListReviews";

const widthScreen = Dimensions.get("window").width;

export default function RestaurantInfo({ navigation, route }) {
  const { id, name } = route.params;
  navigation.setOptions({ title: name });

  const [restaurant, setRestaurant] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    async function getDataById() {
      const response = await getDocumentById("restaurants", id);
      if (response.statusResponse) {
        setRestaurant(response.document);
      } else {
        setRestaurant({});
        Alert.alert.show(
          "Ocurrio un problema cargando el restaurant, intente mas tarde.",
          3000
        );
      }
    }

    getDataById();
  }, []);

  if (!restaurant) {
    return <Loading isVisible={true} text="Cargando" />;
  }

  return (
    <ScrollView style={styles.ViewBody}>
      <CarouselImages
        images={restaurant.images}
        height={250}
        width={widthScreen}
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
      />

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
      />

      <ListReviews navigation={navigation} idRestaurant={restaurant.id} />
    </ScrollView>
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

function RestauranMapInfo({ name, location, address, email, phone }) {
  const listMapInfo = [
    { text: address, iconName: "map-marker" },
    { text: email, iconName: "at" },
    { text: phone, iconName: "phone" },
  ];

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
            name={item.iconName}
            color="#f41c24"
          />
          <ListItem.Content>
            <ListItem.Title>{item.text}</ListItem.Title>
          </ListItem.Content>
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
});
