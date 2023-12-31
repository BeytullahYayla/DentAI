import React from 'react';
import { View, Text } from 'react-native';
import { Svg, Rect } from 'react-native-svg';
import { Dimensions } from "react-native";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

const HorizontalPercentageBar = ({disease, percentage }) => {
    const barWidth = 5 * width / 6; // Çubuk genişliği
    const barHeight = 33; // Çubuk yüksekliği

    const filledWidth = (barWidth * percentage) / 100;

    const Colors = [
        '#FF5733', // Turuncu
        '#33FF57', // Yeşil
        '#5733FF', // Mor
        '#FFD700', // Altın Sarısı
        '#00FFFF', // Cam Göbeği
        '#32CD32', // Limon Yeşili
        '#FF4500', // Alev Kırmızısı
        '#00FA9A', // Deniz Yeşili
        '#FF1493', // Derin Pembe
        '#1E90FF', // Orta Mavi
        '#FF8C00', // Koyu Portakal
        '#6A5ACD', // Lavanta
        '#20B2AA', // Açık Deniz Yeşili
        '#FF69B4', // Orkide Pembe
        '#8A2BE2', // Mavi Mor
        '#3CB371', // Deniz Yeşili
        '#FF6347', // Mercan
        '#FF00FF', // Magenta
        '#008080', // Teal
        '#800080', // Purple
        '#FFDAB9', // Peachpuff
        '#00FF7F', // Springgreen
        '#DAA520', // Goldenrod
        '#8B008B', // Darkmagenta
        '#2E8B57', // Seagreen
        '#FFA07A', // Lightsalmon
        '#4B0082', // Indigo
        '#ADFF2F', // Greenyellow
      ];

    const randomColor = Colors[Math.floor(Math.random() * Colors.length)];

    return (
        <View>
            <View style={{ marginLeft: 5 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{disease}</Text>
            </View>
            <View style={{ marginTop: 5, marginBottom: 5 }}>
                <Svg height={barHeight} width={barWidth}>
                    <Rect rx={15} ry={15} width={barWidth} height={barHeight} fill="#e0e0e0" />
                    <Rect rx={15} ry={15} width={filledWidth} height={barHeight} fill={randomColor} />
                </Svg>
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'black', position: 'absolute', left: 10, fontSize: 18, fontWeight: 'bold' }}>{percentage}%</Text>
                </View>
            </View>
        </View>
    );
};

export default HorizontalPercentageBar;