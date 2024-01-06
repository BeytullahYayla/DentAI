import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native";
import React from "react";
import Home from "./components/Home";
import CameraPage from "./components/CameraPage";
import Detail from "./components/Detail";
import Header from "./components/Header";
import Entry from "./components/Entry";
import HistoryPage from "./components/HistoryPage";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import { useUser } from "./components/UserContext";

const Stack = createStackNavigator();

export default function Router() {

  const {username} = useUser();

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen}
        options={{
          headerTitle: () => <Header name="" />,
          headerStyle: {
            backgroundColor: "#ffe4e1",
            height: 50,
            borderBottomRightRadius: 50,
            borderBottomLeftRadius: 50,
            shadowColor: "#e8e8e8",
            elevation: 25,
          },
        }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{
        headerTitle: () => <Header name="" />,
        headerStyle: {
          backgroundColor: "#ffe4e1",
          height: 75,
          borderBottomRightRadius: 50,
          borderBottomLeftRadius: 50,
          shadowColor: "#e8e8e8",
          elevation: 25,
        },
      }} />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: () => <Header name="DentAI'a Hoş Geldiniz" />,
          headerStyle: {
            backgroundColor: "#cd5555",
            height: 100,
            borderBottomRightRadius: 50,
            borderBottomLeftRadius: 50,
            shadowColor: "#e8e8e8",
            elevation: 25,
          },
        }}
      />
      <Stack.Screen
        name="CameraPage"
        component={CameraPage}
        options={{
          headerTitle: () => <Header name="Kamera" />,
          headerStyle: {
            backgroundColor: "tomato",
            height: 100,
            borderBottomRightRadius: 50,
            borderBottomLeftRadius: 50,
            shadowColor: "#e8e8e8",
            elevation: 25,
          },
        }}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{
          headerTitle: () => <Header name="Detaylar" />,
          headerStyle: {
            backgroundColor: "tomato",
            height: 100,
            borderBottomRightRadius: 50,
            borderBottomLeftRadius: 50,
            shadowColor: "#e8e8e8",
            elevation: 25,
          },
        }}
      />
      <Stack.Screen
        name="Entry"
        component={Entry}
        options={{
          headerTitle: () => <Header name="Yeni Analiz" />,
          headerStyle: {
            backgroundColor: "#F08080",
            height: 100,
            borderBottomRightRadius: 50,
            borderBottomLeftRadius: 50,
            shadowColor: "#e8e8e8",
            elevation: 25,
          },
        }}
      />
      <Stack.Screen
        name="HistoryPage"
        component={HistoryPage}
        options={{
          headerTitle: () => <Header name="Geçmiş" />,
          headerStyle: {
            backgroundColor: "#F08080",
            height: 100,
            borderBottomRightRadius: 50,
            borderBottomLeftRadius: 50,
            shadowColor: "#e8e8e8",
            elevation: 25,
          },
        }}
      />
    </Stack.Navigator>
  );
}
