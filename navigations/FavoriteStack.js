import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Favorite from "../screens/Favorite";

const Stack = createStackNavigator();

export default function FavoriteStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="favorite"
        component={Favorite}
        options={{ title: "Favorito" }}
      />
    </Stack.Navigator>
  );
}
