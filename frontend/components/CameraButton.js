import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button, Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

const CameraButton = () => {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
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
        onPress={() => navigation.navigate("CameraPage")}
      >
        <Icon name="camera-alt" color="white" />
      </Button>
    </View>
  );
};

export default CameraButton;

const styles = StyleSheet.create({
  container:{
    justifyContent:"center",
    alignItems:"center",
    marginTop: 10,
    marginRight: 10
  }
});
