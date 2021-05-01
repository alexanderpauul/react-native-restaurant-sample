import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TopRestaurant from "../screens/TopRestaurant";

const Stack = createStackNavigator();

export default function TopRestaurantStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="top-restaurant"
        component={TopRestaurant}
        options={{ title: "Los mejores restaurantes" }}
      />
    </Stack.Navigator>
  );
}