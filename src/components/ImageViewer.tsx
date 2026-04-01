import { Image } from "expo-image";
import { StyleSheet } from "react-native";

export default function ImageViewer({ imgSource }: { imgSource: string }) {
  return <Image source={imgSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
});
