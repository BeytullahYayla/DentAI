import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import CameraPage from "./components/CameraPage";
import Home from "./components/Home";
import { NavigationContainer } from "@react-navigation/native";
import Router from "./Router";
import "expo-dev-client";
import { UserProvider } from "./components/UserContext";

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </UserProvider>
  );
}
