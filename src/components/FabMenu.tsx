import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  ImagePickerResult,
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import NewFolder from "@/src/components/NewFolder";

type FabOption = {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  label: string;
  onPress: () => void;
};

const TAB_BAR_HEIGHT = 56;

export default function FabMenu() {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const pickImage = async () => {
    const permissionResult = await requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }

    await launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    })
      .then((result: ImagePickerResult) => {
        if (result?.assets) {
          const uris = result.assets.map((asset) => asset.uri);
          router.push({
            pathname: "/imgPreview",
            params: { uris: JSON.stringify(uris) },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openCamera = () => {
    router.push({ pathname: "/cameraScreen" });
  };

  const options: FabOption[] = [
    { icon: "upload-file", label: "Upload", onPress: pickImage },
    { icon: "document-scanner", label: "Scan", onPress: openCamera },
  ];

  const handleOptionPress = (option: FabOption) => {
    setOpen(false);
    option.onPress();
  };

  return (
    <>
      {open && (
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
      )}

      <View
        style={[
          styles.wrapper,
          { bottom: insets.bottom + TAB_BAR_HEIGHT + 16, right: 16 },
        ]}
        pointerEvents="box-none"
      >
        {open &&
          options.map((option) => (
            <View key={option.label} style={styles.optionRow}>
              <View style={styles.labelChip}>
                <Text style={styles.labelText}>{option.label}</Text>
              </View>
              <TouchableOpacity
                style={styles.optionButton}
                activeOpacity={0.85}
                onPress={() => handleOptionPress(option)}
              >
                <MaterialIcons name={option.icon} size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        {open && <NewFolder />}

        <TouchableOpacity
          style={[styles.mainFab, open && styles.mainFabOpen]}
          activeOpacity={0.9}
          onPress={() => setOpen((prev) => !prev)}
        >
          <Ionicons name={open ? "close" : "add"} size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    zIndex: 10,
  },
  wrapper: {
    position: "absolute",
    alignItems: "flex-end",
    zIndex: 20,
    gap: 12,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  labelChip: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.15)",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  optionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
  },
  mainFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.25)",
  },
  mainFabOpen: {
    backgroundColor: "#4f46e5",
  },
});
