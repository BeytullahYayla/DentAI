import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import ImageContainer from "./ImageContainer";
import { Button, Card } from "@rneui/themed";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { useUser } from "./UserContext";
import HorizontalPercentageBar from "./HorizontalPercentageBar";
import { API_URL } from "./constants";

const Entry = () => {
  const route = useRoute()
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const { username } = useUser()
  const imageTeeth = route.params ? route.params.image : ""
  const [values, setValues] = useState([])
  const [names, setNames] = useState([])
  const [description, setDescription] = useState("")



  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const ImageToFormData = (uri) => {
    const form = new FormData();
    form.append("file", {
      name: uri,
      uri: uri,
      type: "image/jpg"
    })
    return form
  }

  const postAnalyze = () => {
    const formData = ImageToFormData(imageTeeth);
    axios.post(API_URL+`/analyzes?username=${username}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type for FormData
        },
      }
    ).then((res) => {
      console.log(res.data)
      if (res.status === 200) {
        const {description, ...otherData} = res.data;
        setNames(Object.keys(otherData))
        setValues(Object.values(otherData))
        setDescription(description)
        reverseAnalyzed()
      }
    }).catch((err) => {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(err.response.data); // The response data
        console.log(err.response.status); // The status code
        console.log(err.response.headers); // The headers
        Alert.alert("Hata", err.response.data.detail);
      } else if (err.request) {
        // The request was made but no response was received
        console.log(err.request);
        Alert.alert("Hata", "Sunucuyla iletişim hatası oluştu.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', err.message);
        Alert.alert("Hata", "Beklenmeyen bir hata oluştu.");
      }
    });
  }

  const reverseAnalyzed = () => {
    setHasAnalyzed(!hasAnalyzed);
  };

  const turkishKeys = {
    "calculus": "Tartar",
    "gingivitis": "Diş Eti İltihabı",
    "healthy": "Sağlıklı",
    "hypodontia": "Hipodonti",
    "tooth_decay": "Çürük"
  };

  const updatedNames = names.map((key) => turkishKeys[key]);

  const combinedArray = values.map((value, index) => ({ value, name: updatedNames[index] }));
  combinedArray.sort((a, b) => b.value - a.value);

  const sortedValues = combinedArray.map(item => item.value);
  const sortedNames = combinedArray.map(item => item.name);

  return (
    <View>
      <View style={{ marginTop: 10 }}>
        <ImageContainer image={imageTeeth} />
      </View>
      {hasAnalyzed ? (
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
          <Card containerStyle={{ borderRadius: 30 }}>
            <Text style={styles.descText}>{description}</Text>
          </Card>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            radius={"lg"}
            buttonStyle={{
              width: 250,
              height: 70,
              backgroundColor: "tomato",
              borderWidth: 2,
              borderColor: "white",
              borderRadius: 25,
            }}
            containerStyle={{
              height: 70,
              marginHorizontal: 10,
              marginVertical: 20,
            }}
            titleStyle={{ fontWeight: "bold" }}
            onPress={() => postAnalyze()}
          >
            <Text style={styles.analyzeText}>Analiz Et</Text>
          </Button>
        </View>
      )}
    </View>
  );
};

export default Entry;

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
  },
  analyzeText: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  resultTitle: {
    textAlign: "center",
    color: "black",
    fontSize: 23,
  },
  cardContainer: {
    marginTop: 10,
  },
  resultText: {
    textAlign: "center",
    color: "black",
    fontSize: 20,
  },
  descText: {
    textAlign: "center",
    color: "black",
    fontSize: 16,
  },
});
