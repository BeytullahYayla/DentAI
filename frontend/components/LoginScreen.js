import { StyleSheet, Text, View, Alert, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Card, Button, Icon } from "@rneui/themed";
import { useUser } from "./UserContext";

const LoginScreen = () => {
  const {username, setUsername} = useUser();
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const handleLogin = () => {
    console.log(username);
    console.log(password);

    axios
      .post(`https://ceec-176-216-33-223.ngrok-free.app/login`, {
        username: username,
        password: password,
      })
      .then((res) => {
        if (res.status === 200) {
          navigation.navigate("Home");
        } else {
          Alert.alert("Hata", "Kullanıcı adı veya şifre yanlış.");
        }
      })
      .catch((err) => {
        console.log(err);
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
