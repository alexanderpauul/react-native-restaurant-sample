import React from "react";
import { ActivityIndicator } from "react-native";
import {
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "react-native-elements";
import { size } from "lodash";
import { formatPhone } from "../../utils/helpers";

export default function ListRestaurants({
  restaurants,
  navigation,
  handleLoadMore,
}) {
  return (
    <View>
      <FlatList
        data={restaurants}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        renderItem={(restaurant) => (
          <Restaurant restaurant={restaurant} navigation={navigation} />
        )}
      />
    </View>
  );
}

function Restaurant({ restaurant, navigation, handleLoadMore }) {
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
});
