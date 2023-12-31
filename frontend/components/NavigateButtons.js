import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button, Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { FlatGrid } from "react-native-super-grid";

const NavigateButtons = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.colLeft}>
          <Button
            radius={"lg"}
            buttonStyle={{
              width: 70,
              height: 70,
              backgroundColor: "gray",
              borderWidth: 2,
              borderColor: "white",
              borderRadius: 35,
            }}
            containerStyle={{
              height: 70,
              marginHorizontal: 10,
              marginVertical: 10,
            }}
            titleStyle={{ fontWeight: "bold" }}
            onPress={() => navigation.navigate("HistoryPage")}
          >
            <Icon name="history" color="white" />
          </Button>
        </View>
        <View style={styles.colRight}>
          <Button
            radius={"lg"}
            buttonStyle={{
              width: 70,
              height: 70,
              backgroundColor: "tomato",
              borderWidth: 2,
              borderColor: "white",
              borderRadius: 35,
            }}
            containerStyle={{
              height: 70,
              marginHorizontal: 10,
              marginVertical: 10,
            }}
            titleStyle={{ fontWeight: "bold" }}
            onPress={() => navigation.navigate("Entry")}
          >
            <Icon name="add" color="white" />
          </Button>
        </View>
      </View>
    </View>
  );
};

export default NavigateButtons;

const styles = StyleSheet.create({
  container: {
    width:500,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 5,
  },
  row: {
    width:500,
    flexDirection: "row",
  },
  colLeft: {
    width:200,
    //flexDirection: "flex",
    alignItems:"flex-start"
  },
  colRight:{
    width:200,
    //flexDirection: "flex",
    alignItems:"flex-end"
  }
});
