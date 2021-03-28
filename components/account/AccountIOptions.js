import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon, ListItem } from "react-native-elements";
import { isEmpty, map } from "lodash";
import Modal from "../Modal";
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";

export default function AccountIOptions({ user, toastRef, setReloadUser }) {
  const [showModal, setShowModal] = useState(false);
  const [renderComponent, setRenderComponent] = useState(null);

  const generateOptions = () => {
    return [
      {
        title: "Nombres y apellidos",
        iconNameLeft: "account-circle",
        iconColorLeft: "#f05458",
        iconNameRight: "chevron-right",
        iconColorRight: "#f05458",
        onPress: () => selectedComponent("displayName"),
      },
      {
        title: "Correo electronico",
        iconNameLeft: "at",
        iconColorLeft: "#f05458",
        iconNameRight: "chevron-right",
        iconColorRight: "#f05458",
        onPress: () => selectedComponent("email"),
      },
      {
        title: "Contraseña ",
        iconNameLeft: "lock-reset",
        iconColorLeft: "#f05458",
        iconNameRight: "chevron-right",
        iconColorRight: "#f05458",
        onPress: () => selectedComponent("password"),
      },
    ];
  };

  const selectedComponent = (key) => {
    switch (key) {
      case "displayName":
        setRenderComponent(
          <ChangeDisplayNameForm
            displayName={isEmpty(user.displayName) ? "" : user.displayName}
            setShowModal={setShowModal}
            toastRef={toastRef}
            setReloadUser={setReloadUser}
          />
        );
        break;
      case "email":
        setRenderComponent(<Change>email</Change>);
        break;
      case "password":
        setRenderComponent(<Text>password</Text>);
        break;
    }

    setShowModal(true);
  };

  const menuOptions = generateOptions();

  return (
    <View>
      {map(menuOptions, (menu, index) => (
        <ListItem key={index} style={styles.menuItem} onPress={menu.onPress}>
          <Icon
            type="material-community"
            name={menu.iconNameLeft}
            color={menu.iconColorLeft}
          />
          <ListItem.Content>
            <ListItem.Title>{menu.title}</ListItem.Title>
          </ListItem.Content>
          <Icon
            type="material-community"
            name={menu.iconNameRight}
            color={menu.iconColorRight}
          />
        </ListItem>
      ))}

      <Modal isVisible={showModal} setVisible={setShowModal}>
        {renderComponent}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
  },
  optionsPanel: {
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#d4d4d4",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },
});
