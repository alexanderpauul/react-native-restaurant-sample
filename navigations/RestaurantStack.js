import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Restaurant from "../screens/restaurant/Restaurant";

const Stack = createStackNavigator();

export default function RestaurantStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="restaurant"
        component={Restaurant}
        options={{ title: "Restaurantes" }}
      />
    </Stack.Navigator>
  );
}
