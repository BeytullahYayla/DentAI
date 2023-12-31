import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Card, Image, Button, Icon} from "@rneui/themed";
import { Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native'
import CameraButton from "./CameraButton";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

const ImageContainer = ({...props}) => {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Card containerStyle={{ borderRadius: 30 }}>
        <View style={styles.imageBox}>
            {
                props.image ?
                <Image style={styles.image} source={{ uri: props.image }} /> :
                <CameraButton/>
            }
        </View>
      </Card>
    </View>
  );
};

export default ImageContainer;

const styles = StyleSheet.create({
  container: {
    width: window.width,
    height: window.height,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"center"
  },
  imageBox: {
    width:150,
    height:210,
    justifyContent:"center",
    alignItems: "center",
    marginBottom: 3,
  },
  image: {
    width: 150,
    height: 210,
  },
});
