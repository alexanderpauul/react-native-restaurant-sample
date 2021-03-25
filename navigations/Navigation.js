import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";

import RestaurantStack from "./RestaurantStack";
import FavoriteStack from "./FavoriteStack";
import TopRestaurantStack from "./TopRestaurantStack";
import SearchStack from "./SearchStack";
import AccountStack from "./AccountStack";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  const screenOptions = (route, color) => {
    let iconName;
    switch (route.name) {
      case "restaurant":
        iconName = "compass-outline";
        break;
      case "favorite":
        iconName = "heart-outline";
        break;
      case "top-restaurant":
        iconName = "star-outline";
        break;
      case "search":
        iconName = "magnify";
        break;
      case "account":
        iconName = "home-outline";
        break;
    }

    return (
      <Icon
        type="material-community"
        name={iconName}
        fontSize={22}
        color={color}
      />
    );
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="restaurant"
        tabBarOptions={{
          inactiveTintColor: "#f69a9d",
          activeTintColor: "#ec1c1c",
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => screenOptions(route, color),
        })}
      >
        <Tab.Screen
          name="restaurant"
          component={RestaurantStack}
          options={{ title: "Restaurantes" }}
        />
        <Tab.Screen
          name="favorite"
          component={FavoriteStack}
          options={{ title: "Favoritos" }}
        />
        <Tab.Screen
          name="top-restaurant"
          component={TopRestaurantStack}
          options={{ title: "Top 5" }}
        />
        <Tab.Screen
          name="search"
          component={SearchStack}
          options={{ title: "Buscar" }}
        />
        <Tab.Screen
          name="account"
          component={AccountStack}
          options={{ title: "Cuenta" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}