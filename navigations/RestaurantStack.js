import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Restaurant from "../screens/restaurant/Restaurant";
import AddRestaurant from "../screens/restaurant/AddRestaurant";

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
    </Stack.Navigator>
  );
}
