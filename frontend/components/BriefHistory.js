import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, {useState,useEffect} from "react";
import { useFocusEffect } from "@react-navigation/native";
import CardAsset from "./Card";
import { useUser } from "./UserContext";
import axios from "axios";
import { API_URL } from "./constants";

const BriefHistory = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useUser()

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL+`/analyzes/last`, {
        params: {
          username: username
        },
      });
      setData(Object(response.data));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [username]) // Make sure to include any dependencies that should trigger a re-fetch
  );

  return (
    <View>
        {
          data ? (
          data.map((d)=>{
            return(<CardAsset
              key={d.id}
              healthy={d.healthy}
              hypodontia={d.hypodontia}
              calculus={d.calculus}
              gingivitis={d.gingivitis}
              tooth_decay={d.tooth_decay}
              description={d.description}
              image={d.image}
              createdAt={d.created_at}
            />) 
          })
          ) : (
            <View style={styles.centeredTextContainer}>
              <Text style={styles.centeredText}>Analiz Bulunamadı.</Text>
            </View>
          )
        }
    </View>
  );
};

export default BriefHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredText: {
    fontSize: 15,
    textAlign: "center",
  },
});
