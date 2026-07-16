import SaveMenu from "@/src/components/SaveMenu";
import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Directory, File, Paths } from "expo-file-system";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color="#94a3b8" />
        <Text style={styles.permissionTitle}>Camera access needed</Text>
        <Text style={styles.permissionMessage}>
          Allow camera access to scan and capture documents.
        </Text>
        <TouchableOpacity
          style={[styles.button, styles.primary]}
          onPress={requestPermission}
        >
          <Text style={styles.primaryText}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function captureImage() {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync();
      const tempDir = new Directory(Paths.document, "userData/temp");
      tempDir.create({ idempotent: true });
      new File(photo.uri).move(tempDir);
    } catch (error) {
      console.error("Failed to capture image", error);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

      <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={[styles.controls, { paddingBottom: insets.bottom + 24 }]}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={toggleCameraFacing}
        >
          <Ionicons name="camera-reverse-outline" size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.shutterOuter} onPress={captureImage}>
          <View style={styles.shutterInner} />
        </TouchableOpacity>

        <SaveMenu fromCamera={true} />
        {/* <TouchableOpacity
          style={[styles.button, styles.proceedButton]}
          onPress={() => {
            router.push({
              pathname: "/imgPreview/modal",
              params: { fromCamera: "true" },
            });
          }}
        >
          <Text style={styles.primaryText}>Proceed</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 12,
  },
  permissionTitle: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 8,
  },
  permissionMessage: {
    color: "#94a3b8",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 8,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#fff",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 88,
  },
  proceedButton: {
    backgroundColor: "#6366f1",
  },
  primary: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 24,
  },
  primaryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
