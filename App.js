import React, { useEffect, useRef } from "react";
import { LogBox } from "react-native";
import Navigation from "./navigations/Navigation";
import { StartNotifications } from "./utils/actions";

LogBox.ignoreAllLogs();
LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    StartNotifications(notificationListener, responseListener);
  }, []);

  return <Navigation />;
}
