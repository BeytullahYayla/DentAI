import { Camera, CameraType } from "expo-camera";
import { TouchableOpacity, Text, View, ActivityIndicator, Alert  } from "react-native";
import { useState, useEffect, useRef } from "react";
import * as MediaLibrary from 'expo-media-library';
import { Permissions  } from "expo-media-library";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "./constants";
export default function CameraPage() {
  const [type, setType] = useState(CameraType.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState()
  const cameraRef = useRef(null);
  const navigation = useNavigation();



  const ImageToFormData = (uri) => {
    const form = new FormData();
    form.append("file", {
      name: uri,
      uri: uri,
      type: "image/jpg"
    })
    return form
  }

  const detectImage = (uri) => {
    const formData = ImageToFormData(uri);
    axios.post(API_URL+`/detect`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type for FormData
        },
      }
    ).then((res) => {
      console.log(res.data)
      if (res.status === 200) {
        navigation.navigate('Entry', { image: uri })
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
          detectImage(photo.uri);
          //navigation.navigate('Entry', { image: photo.uri });
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
