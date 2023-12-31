import { Camera, CameraType } from "expo-camera";
import { TouchableOpacity, Text, View, ActivityIndicator, Alert  } from "react-native";
import { useState, useEffect, useRef } from "react";
import * as MediaLibrary from 'expo-media-library';
import { Permissions  } from "expo-media-library";
import { useNavigation } from "@react-navigation/native";

export default function CameraPage() {
  const [type, setType] = useState(CameraType.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState()
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted")
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera.</Text>;
  }

  const handleTakePicture = async () => {
    //const { status } = await MediaLibrary.requestPermissionsAsync();

    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log(photo.uri);

      if (!photo.cancelled) {
        try{
          const asset = await MediaLibrary.createAssetAsync(photo.uri);
          const album = await MediaLibrary.getAlbumAsync("Expo");

          if (album === null) {
            // Album yoksa oluştur
            await MediaLibrary.createAlbumAsync("Expo", asset, false);
          } else {
            // Album varsa, var olan albüme ekle
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          }

          navigation.navigate('Entry', { image: photo.uri });
        }
        //const asset = await MediaLibrary.createAssetAsync(photo.uri.toString());
        //MediaLibrary.createAlbumAsync("Expo", asset)
        catch(error){
          Alert.alert('An Error Occurred!')
        };
      }
    }
  };

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#e8e8e8" }}>
      <View style={{marginTop:15, marginRight:20, marginLeft:20, backgroundColor:"#ffc1c1", borderBottomRightRadius: 50,
            borderBottomLeftRadius: 50,}}>
      <Camera
        style={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          overflow: "hidden",
          width: "100%",
          aspectRatio: 0.6,
        }}
        type={type}
        ref={cameraRef}
        onTouchStart={()=>toggleCameraType()}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row",
          }}
        ></View>
      </Camera>
      <TouchableOpacity
        style={{
          alignSelf: "center",
          alignItems: "center",
          width: 90,
          height: 90,
          borderRadius: 45,
          marginTop: "2%",
          marginBottom: "2%",
          borderColor: "#5A5A5A",
          borderWidth: 10,
        }}
        onPress={handleTakePicture}
      >
        <View style={{ opacity: 0.5 }} />
      </TouchableOpacity>
      </View>
    </View>
  );
}
