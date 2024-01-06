import { StyleSheet, Text, View, Alert, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Card, Button, Icon } from "@rneui/themed";

const RegisterScreen = () => {
  const [firstname, setFirstname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");

  const navigation = useNavigation();

  const handleGenderPress = (selectedGender) => {
    setGender(selectedGender);
  };

  const handleRegister = () => {

    if (firstname !== "" && lastname !== "" && username !== "" && password !== "" && gender !== "") {
      axios
        .post(`https://b6b4-149-140-157-40.ngrok-free.app/register`, {
          first_name: firstname,
          middle_name: middlename,
          last_name: lastname,
          username: username,
          password: password,
          gender: gender,
        })
        .then((res) => {
          if (res.status === 201) {
            navigation.goBack();
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
    } else {
      Alert.alert("Hata", "Lütfen gerekli tüm alanları doldurunuz.");
    }


  };

  return (
    <View style={styles.container}>
      <View>
        <Card containerStyle={{ borderRadius: 30, backgroundColor: "#FFFFFF" }}>
          <Card.Title style={{ fontSize: 30, color: "black" }}>
            Yeni Hesap
          </Card.Title>
          <Card.Divider style={{ color: "grey" }} width={1.5} />
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { marginRight: 5, flex: 1 }]}
              onChangeText={(text) => setFirstname(text)}
              value={firstname}
              placeholder="İsim"
              placeholderTextColor="grey"
              textAlign="center"
            />
            <TextInput
              style={[styles.input, { marginLeft: 5, flex: 1 }]}
              onChangeText={(text) => setMiddlename(text)}
              value={middlename}
              placeholder="İkinci İsim"
              placeholderTextColor="grey"
              textAlign="center"
            />
          </View>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setLastname(text)}
            value={lastname}
            placeholder="Soyisim"
            placeholderTextColor="grey" // Opsiyonel: Placeholder rengini ayarlamak için
            textAlign="center"
          />
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
          <View style={styles.genderButtonsContainer}>
            <TouchableOpacity
              style={[styles.genderButton, { backgroundColor: gender === "male" ? "#add8e6" : "transparent" }]}
              onPress={() => handleGenderPress("male")}
            >
              <Icon name="mars" type="font-awesome" color={gender === "male" ? "white" : "#4682b4"} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderButton, { backgroundColor: gender === "female" ? "#ffc0cb" : "transparent" }]}
              onPress={() => handleGenderPress("female")}
            >
              <Icon name="venus" type="font-awesome" color={gender === "female" ? "white" : "#ff69b4"} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderButton, { backgroundColor: gender === "other" ? "#98fb98" : "transparent" }]}
              onPress={() => handleGenderPress("other")}
            >
              <Icon name="venus-mars" type="font-awesome" color={gender === "other" ? "white" : "#008000"} />
            </TouchableOpacity>
          </View>
          <Button
            buttonStyle={{
              height: 60,
              marginTop: 40,
              borderRadius: 100,
              backgroundColor: "#ff4500",
              fontSize: 20,
            }}
            title="KAYIT OL"
            onPress={handleRegister}
          />
        </Card>
      </View>
    </View>
  );
};

export default RegisterScreen;

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
  inputContainer: {
    flexDirection: "row",
  },
  genderContainer: {
    flexDirection: "row",
  },
  genderButtonsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  genderButton: {
    flex: 1,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    margin: 5,
  },
});
