import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Card, Image, Icon, Rating } from "react-native-elements";

export default function ListTopRestaurant({ restaurants, navigation }) {
  return (
    <FlatList
      data={restaurants}
      keyExtractor={(item, index) => index.toString()}
      renderItem={(restaurant) => (
        <Restaurant restaurant={restaurant} navigation={navigation} />
      )}
    />
  );
}

function Restaurant({ restaurant, navigation }) {
  const [iconColor, setIconColor] = useState("#000000");
  const { name, rating, images, description, id } = restaurant.item;

  useEffect(() => {
    if (restaurant.index === 0) {
      setIconColor("#efb819");
    } else if (restaurant.index === 1) {
      setIconColor("#e3e4e5");
    } else if (restaurant.index === 2) {
      setIconColor("#cd7f32");
    }
  }, []);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("restaurant", {
          screen: "restaurant-info",
          params: { id, name },
        })
      }
    >
      <Card containerStyle={styles.containerCard}>
        <Icon
          type="material-community"
          name="chess-queen"
          color={iconColor}
          size={40}
          containerStyle={styles.containerIcon}
        />

        <Image
          style={styles.restaurantImage}
          resizeMode="cover"
          PlaceholderContent={<ActivityIndicator size="large" color="#fff" />}
          source={{ uri: images[0] }}
        />

        <View style={styles.titleRating}>
          <Text style={styles.title}>{name}</Text>
          <Rating imageSize={20} startingValue={rating} readonly />
        </View>

        <Text style={styles.description}>{description}</Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerCard: {
    marginBottom: 30,
    borderWidth: 0,
  },
  containerIcon: {
    position: "absolute",
    top: -30,
    left: -30,
    zIndex: 1,
  },
  restaurantImage: {
    width: "100%",
    height: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    color: "grey",
    marginTop: 0,
    textAlign: "justify",
  },
  titleRating: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-between",
  },
});
