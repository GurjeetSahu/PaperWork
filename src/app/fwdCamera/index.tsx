import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Button, StyleSheet, View } from "react-native";

import ImageViewer from "../../components/ImageViewer";

export default function Index() {
  const { uri }: { uri: string } = useLocalSearchParams();
  const renderPicture = (uri: string) => {
    return <ImageViewer imgSource={uri} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {uri ? renderPicture(uri) : null}
      </View>
      <View style={styles.footerContainer}>
        <Button title="Retake" />
        <Button title="Add more photo" />
        <Button title="Proceed" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff0000",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
});
