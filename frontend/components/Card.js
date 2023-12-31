import { StyleSheet, Text, View } from "react-native";
import React,{useEffect, useState} from "react";
import { Card, Image, Button, Icon} from "@rneui/themed";
import { Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native'

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

const CardAsset = ({...props}) => {
  const [result, setResult] = useState('');
  const variables = [props.healthy, props.calculus, props.tooth_decay, props.gingivitis, props.hypodontia]

  const navigation = useNavigation();

  useEffect(()=>{
    const maxVariable = Math.max(...variables)
    const indexOfMax = variables.indexOf(maxVariable)
    indexOfMax == 0 ? setResult("Sağlıklı") :
    indexOfMax == 1 ? setResult("Tartar") :
    indexOfMax == 2 ? setResult("Çürük") : 
    indexOfMax == 3 ? setResult("Diş Eti İltihabı") : 
    indexOfMax == 4 ? setResult("Hipodonti") : ""
  },[])

  return (
    <View style={styles.container}>
      <Card containerStyle={{ borderRadius: 30 }}>
        <View key={props.key} style={styles.user}>
          <Image style={styles.image} source={{ uri: props.image }} />
          <View style={{ alignItems: "center", width: width / 3 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>Teşhis</Text>
            <Text style={{ marginTop: 10 }}>{result}</Text>
          </View>
          <View>
            <Button
              radius={"lg"}
              buttonStyle={{
                width: width/8,
                height: 50,
                backgroundColor: "orange",
                borderWidth: 2,
                borderColor: "white",
                borderRadius: 25,
              }}
              containerStyle={{
                marginHorizontal: 20,
              }}
              titleStyle={{ fontWeight: "bold" }}
              onPress={() => navigation.navigate("Detail", {
                result:result,
                image:props.image,
                healthy:props.healthy*100,
                hypodontia:props.hypodontia*100,
                calculus:props.calculus*100,
                gingivitis:props.gingivitis*100,
                tooth_decay:props.tooth_decay*100,
                description:"ABC",
                createdAt:props.createdAt
              })}
            >
              <Icon name="arrow-forward" color="white" />
            </Button>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default CardAsset;

const styles = StyleSheet.create({
  container: {
    width: width,
    //flexDirection: "column",
  },
  user: {
    flexDirection: "row",
    marginBottom: 3,
    flexWrap: "wrap",
  },
  image: {
    width: 100,
    height: 50,
    marginRight: 10,
  },
});
