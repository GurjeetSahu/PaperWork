import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ImagePickerExample() {
  const router = useRouter();
  const [uri, setUri] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setUri(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    // No permissions request is necessary for launching the image library.
    // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
    // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
    // so the app users aren't surprised by a system dialog after picking a video.
    // See "Invoke permissions for videos" sub section for more details.
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 1,
    })
      .then((result) => {
        if (result?.assets && result.assets[0]?.uri) {
          setUri(result.assets[0].uri);
          router.push({
            pathname: "/fwdCamera",
            params: { uri: result.assets[0].uri },
          });
          console.log(result.assets[0].uri);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View style={styles.row}>
      {[
        { icon: "upload-file" as const, label: "Upload", action: pickImage },
        { icon: "qr-code-scanner" as const, label: "Scan", action: openCamera },
        { icon: "download" as const, label: "Fetch" },
      ].map((item, i) => (
        <TouchableOpacity key={i} style={styles.card} onPress={item.action}>
          <MaterialIcons name={item.icon} size={28} color="#2563eb" />
          <Text>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  c: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  card: {
    backgroundColor: "white",
    width: "30%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
});
