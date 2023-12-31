import { View, Text } from "react-native";
import React from "react";
import { Button, Icon } from "@rneui/themed";
import MaskedView from "@react-native-masked-view/masked-view";
import { useNavigation } from "@react-navigation/native";

const Header = (props) => {

  const navigation = useNavigation()

  return (
    <View style={{ flexDirection: "row", margin: 15 }}>

      <Text style={{ fontWeight: "bold", fontSize: 30, color: "white", marginLeft:10 }}>
        {props.name}
      </Text>
    </View>
  );
};

export default Header;
