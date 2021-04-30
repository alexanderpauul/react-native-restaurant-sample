import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getTopRestaurant } from "../utils/actions";
import Loading from "../components/Loading";

export default function TopRestaurant() {
  const [restaurants, setRestaurants] = useState(null);
  const [userLogged, setUserLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reloadData, setReloadData] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function getData() {
        setLoading(true);
        const response = await getTopRestaurant(10);
        if (response.statusResponse) {
          setRestaurants(response.restaurants);
          console.log(restaurants);
        }
        setLoading(false);
      }

      //if (userLogged) {
      getData();

      //  }
    }, [])
  );

  return (
    <View>
      <Text>Top Restaurant</Text>
      <Loading isVisible={loading} text="Por favor espere..." />
    </View>
  );
}

const styles = StyleSheet.create({});
