import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Directory, File, Paths } from "expo-file-system";
export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

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
    if (!cameraRef.current) return;

    try {
      await cameraRef.current.takePictureAsync().then((photo) => {
        console.log(photo.uri);
        const tempDir = new Directory(Paths.document, "userData/ssdfsdfsdds");
        try {
          tempDir.create();
          new File(photo.uri).move(tempDir);
        } catch {
          new File(photo.uri).move(tempDir);
        }

        setCapturedUri(photo.uri);
      });
    } catch (error) {
      console.error("Failed to capture image", error);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      {capturedUri ? (
        <View style={styles.previewBadge}>
          <Text style={styles.previewText}>Captured: {capturedUri}</Text>
        </View>
      ) : null}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={captureImage}>
          <Text style={styles.text}>Capture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.text}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
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
    borderWidth: 2,
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
