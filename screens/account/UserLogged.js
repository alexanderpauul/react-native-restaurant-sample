import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { closeSession, getCurrentUser } from "../../utils/actions";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import InfoUser from "../../components/account/InfoUser";

export default function UserLogged() {
  const navigation = useNavigation();
  const toastRef = useRef();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  return (
    <View style={styles.form}>
      {user && (
        <View>
          <InfoUser
            user={user}
            setLoading={setLoading}
            setLoadingText={setLoadingText}
          />

          <Text>Account Options</Text>
        </View>
      )}
      <Text>Account Options</Text>

      <Button
        title="Cerrar Sesion"
        buttonStyle={styles.btnCloseSession}
        titleStyle={styles.btnCloseSessionTitle}
        onPress={() => {
          closeSession();
          navigation.navigate("restaurant");
        }}
      />

      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading isVisible={loading} text={loadingText} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    minHeight: "100%",
    backgroundColor: "#F9F9F9",
  },
  btnCloseSession: {
    marginTop: 30,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#ec1c1c",
    borderBottomWidth: 1,
    borderBottomColor: "#ec1c1c",
    paddingVertical: 10,
  },
  btnCloseSessionTitle: {
    color: "#ec1c1c",
  },
});
