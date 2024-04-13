import React, {useState} from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  ImageBackground,
} from "react-native";


import BriefHistory from "./BriefHistory";
import NavigateButtons from "./NavigateButtons";
import { useRoute } from "@react-navigation/native";
import { useUser } from "./UserContext";

export default function Home({ navigation }) {
  const route = useRoute()
  const {username} = useUser();

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Son Analizler</Text>
        <BriefHistory />
      </ScrollView>
      <NavigateButtons/>
      <StatusBar style="light" hidden={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 5,
    marginTop:5,
    textAlign:"left"
  },
  container: {
    flex: 1,
    backgroundColor: "#e8e8e8",
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection:"column"
  },
});
