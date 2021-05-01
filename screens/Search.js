import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SearchBar, ListItem, Icon, Image } from "react-native-elements";
import { isEmpty, size } from "lodash";
import { searchRestaurant } from "../utils/actions";

export default function Search({ navigation }) {
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    if (isEmpty(search)) {
      return;
    }

    async function getData() {
      const response = await searchRestaurant(search);
      if (response.statusResponse) {
        setRestaurants(response.restaurants);
      }
    }

    getData();
  }, [search]);

  return (
    <View>
      <SearchBar
        placeholder="Ingresa nombre del restaurante"
        onChangeText={(e) => setSearch(e)}
        containerStyle={styles.searchBar}
        value={search}
      />
      {size(restaurants) > 0 ? (
        <FlatList
          data={restaurants}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(restaurant) => (
            <Restaurant restaurant={restaurant} navigation={navigation} />
          )}
        />
      ) : isEmpty(search) ? (
        <Text style={styles.noFound}>
          Por favor ingrese el nombre de restauran a buscar.
        </Text>
      ) : (
        <Text style={styles.noFound}>
          No se encontraron restaurantes con este criterio.
        </Text>
      )}
    </View>
  );
}

function Restaurant({ restaurant, navigation }) {
  const { name, images, id } = restaurant.item;

  return (
    <ListItem
      style={styles.menuItem}
      onPress={() =>
        navigation.navigate("restaurant", {
          screen: "restaurant-info",
          params: { id, name },
        })
      }
    >
      <Image
        resizeMnode="cover"
        PlaceholderContent={<ActivityIndicator color="#fff" />}
        source={{ uri: images[0] }}
        style={styles.imageRestaurant}
      />
      <ListItem.Content>
        <ListItem.Title>{name}</ListItem.Title>
      </ListItem.Content>

      <Icon type="material-community" name="chevron-right" />
    </ListItem>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  noFound: {
    alignSelf: "center",
    width: "90%",
  },
  menuItem: {
    margin: 10,
  },
  imageRestaurant: {
    width: 90,
    height: 90,
  },
});
