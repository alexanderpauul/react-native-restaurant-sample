import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Restaurant from "../screens/restaurant/Restaurant";
import AddRestaurant from "../screens/restaurant/AddRestaurant";
import RestaurantInfo from "../screens/restaurant/RestaurantInfo";
import AddReviewRestaurant from "../screens/restaurant/AddReviewRestaurant";
import TesterFirebase from "../screens/TesterFirebase";

const Stack = createStackNavigator();

export default function RestaurantStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="restaurant"
        component={Restaurant}
        options={{ title: "Restaurantes" }}
      />

      <Stack.Screen
        name="add-restaurant"
        component={AddRestaurant}
        options={{ title: "Crear Restaurante" }}
      />

      <Stack.Screen name="restaurant-info" component={RestaurantInfo} />

      <Stack.Screen
        name="add-review-restaurant"
        component={AddReviewRestaurant}
        options={{ title: "Nuevo comentario" }}
      />

      <Stack.Screen
        name="tester-firebase"
        component={TesterFirebase}
        options={{ title: "Testear" }}
      />
    </Stack.Navigator>
  );
}
