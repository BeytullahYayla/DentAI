import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Card, Image, Button, Icon } from "@rneui/themed";
import { Dimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import CameraButton from "./CameraButton";
import HorizontalPercentageBar from "./HorizontalPercentageBar";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

const Detail = () => {
  const route = useRoute();
  const values = [route.params?.healthy, route.params?.calculus, route.params?.tooth_decay, route.params?.gingivitis, route.params?.hypodontia]
  const names = ["Sağlıklı","Tartar","Çürük","Diş Eti İltihabı","Hipodonti"]

  const combinedArray = values.map((value, index) => ({ value, name: names[index] }));
  combinedArray.sort((a, b) => b.value - a.value);

  const sortedValues = combinedArray.map(item => item.value);
  const sortedNames = combinedArray.map(item => item.name);



  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    const formattedDate = `${day}.${month}.${year} ${hour}:${minute}`;
    return formattedDate;
}

  return (
    <View>
      <View style={styles.container}>
        <Card containerStyle={{ borderRadius: 30 }}>
          <View style={styles.user}>
            {route.params?.image ? (
              <Image
                style={styles.image}
                source={{ uri: route.params.image }}
              />
            ) : (
              ""
            )}
          </View>
        </Card>
      </View>
      <View style={styles.cardContainer}>
        <Card containerStyle={{ borderRadius: 30 }}>
          <Card.Title style={styles.resultTitle}>Analiz Sonucu</Card.Title>
          <Card.Divider />
          {sortedValues?.map((itemValue, index) => (
              itemValue > 33 ? (
                <HorizontalPercentageBar
                  key={index}
                  disease={sortedNames[index]}
                  percentage={itemValue}
                />) : null
            ))}
        </Card>
      </View>
      <View style={styles.cardContainer}>
        <Card containerStyle={{ borderRadius: 30 }}>
          <Text style={styles.descText}>{route.params.description}</Text>
        </Card>
      </View>
      <View style={styles.cardContainer}>
        <Card containerStyle={{ borderRadius: 30 }}>
          <Text style={styles.descText}>{formatDate(route.params.createdAt)}</Text>
        </Card>
      </View>
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    width: window.width,
    height: window.height,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"center"
  },
  user: {
    width: 150,
    height: 210,
    justifyContent: "center",
    marginBottom: 3,
  },
  image: {
    width: 150,
    height: 210,
  },
  resultTitle: {
    textAlign: "center",
    color: "black",
    fontSize: 20,
  },
  cardContainer: {
    marginTop: 10,
  },
  resultText: {
    textAlign: "center",
    color: "black",
    fontSize: 20,
    //fontWeight: "bold",
  },
  descText: {
    textAlign: "center",
    color: "black",
    fontSize: 16,
    //fontWeight: "bold",
  },
});
