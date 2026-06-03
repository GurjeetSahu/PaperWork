import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Directory, File, Paths } from "expo-file-system";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [count, setCount] = useState(0);
  const cameraRef = useRef<CameraView | null>(null);
  const router = useRouter();
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function captureImage() {
    setCount(count + 1);
    if (!cameraRef.current) return;

    try {
      await cameraRef.current.takePictureAsync().then((photo) => {
        const tempDir = new Directory(Paths.document, "userData/temp");
        tempDir.create({ idempotent: true });
        new File(photo.uri).move(tempDir);
      });
    } catch (error) {
      console.error("Failed to capture image", error);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={toggleCameraFacing}>
          <Entypo name="cycle" size={100} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={captureImage}>
          <Ionicons name="radio-button-on-outline" size={100} color="gray" />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.text}>Retake</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push({
              pathname: "/imgPreview/modal",
              params: {
                fromCamera: "true",
              },
            });
          }}
        >
          <Text style={styles.text}>Proceed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 24,
    gap: 16,
  },
  button: {
    flex: 1,
    alignItems: "center",
    borderWidth: 5,
    borderColor: "green",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  previewBadge: {
    position: "absolute",
    top: 64,
    left: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 8,
    padding: 8,
  },
  previewText: {
    color: "white",
    fontSize: 12,
  },
});
