import { StyleSheet, Text, View, Alert, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Card, Button, Icon } from "@rneui/themed";
import { useUser } from "./UserContext";
import { API_URL } from "./constants";

const LoginScreen = () => {
  const {username, setUsername} = useUser();
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const handleLogin = () => {
    axios
      .post(API_URL+`/login`, {
        username: username,
        password: password,
      })
      .then((res) => {
        if (res.status === 200) {
          navigation.navigate("Home");
        }
      })
      .catch((err) => {
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
  };

  return (
    <View style={styles.container}>
      <View>
        <Card containerStyle={{ borderRadius: 30, backgroundColor: "#FFFFFF" }}>
          <Card.Title style={{ fontSize: 30, color: "black" }}>
            Hoş Geldiniz!
          </Card.Title>
          <Card.Divider style={{ color: "grey" }} width={1.5} />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setUsername(text)}
            value={username}
            placeholder="Kullanıcı Adı"
            placeholderTextColor="grey" // Opsiyonel: Placeholder rengini ayarlamak için
            textAlign="center"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Şifre"
            placeholderTextColor="grey" // Opsiyonel: Placeholder rengini ayarlamak için
            textAlign="center"
          />
          <Button
            buttonStyle={{
              height: 60,
              marginTop: 40,
              borderRadius: 100,
              backgroundColor: "#ff4500",
              fontSize: 20,
            }}
            title="GİRİŞ"
            onPress={handleLogin}
          />
        </Card>
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Button
          type="clear"
          buttonStyle={{
            height: 60,
            marginTop: 10,
            borderRadius: 100,
            fontSize: 20,
          }}
          title="Hesabınız yok mu? Bir hesap oluşturun."
          titleStyle={{color:"#ff3030"}}
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "top",
    padding: 16,
  },
  input: {
    height: 50,
    borderColor: "#ffdab9",
    fontSize: 18,
    borderWidth: 2,
    marginTop: 12,
    marginBottom: 12,
    padding: 10,
    borderRadius: 30,
  },
});
