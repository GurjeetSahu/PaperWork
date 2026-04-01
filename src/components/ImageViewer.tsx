import { Image } from "expo-image";
import { StyleSheet } from "react-native";

export default function ImageViewer({ imgSource }: { imgSource: string }) {
  return <Image source={imgSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
