import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system";
import { useEffect, useState } from "react";
import { Alert, Button, Text, View } from "react-native";

import type { ImagesToPdfFormData } from "@/src/types/toolFormData";

import ToolFormModal from "./ToolFormModal";
import { formStyles } from "./formStyles";

type ImagesToPdfMenuProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ImagesToPdfFormData) => void;
};

export default function ImagesToPdfMenu({ visible, onClose, onSubmit }: ImagesToPdfMenuProps) {
  const [names, setNames] = useState<string[]>([]);
  const [imagesBase64, setImagesBase64] = useState<string[]>([]);
  const [dpi, setDpi] = useState("72");

  useEffect(() => {
    if (!visible) {
      setNames([]);
      setImagesBase64([]);
      setDpi("72");
    }
  }, [visible]);

  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo library access to pick images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (result.canceled) return;

    const nextNames: string[] = [];
    const nextB64: string[] = [];

    for (const asset of result.assets) {
      try {
        const file = new File(asset.uri);
        const base64 = await file.base64();
        nextNames.push(asset.fileName ?? asset.uri.split("/").pop() ?? "image.jpg");
        nextB64.push(base64);
      } catch (e) {
        console.error("Failed to read image:", e);
      }
    }

    setNames((prev) => [...prev, ...nextNames]);
    setImagesBase64((prev) => [...prev, ...nextB64]);
  };

  const handleSubmit = () => {
    if (imagesBase64.length === 0) {
      Alert.alert("No images", "Pick at least one JPEG image.");
      return;
    }
    const dpiNum = parseInt(dpi, 10);
    onSubmit({
      imagesBase64,
      ...(Number.isFinite(dpiNum) && dpiNum > 0 ? { dpi: dpiNum } : {}),
    });
    onClose();
  };

  return (
    <ToolFormModal visible={visible} title="Images → PDF" onClose={onClose} onSubmit={handleSubmit}>
      <Text style={formStyles.hint}>JPEG images only (one page per image).</Text>
      <Button color="#39AEA9" title="Pick images" onPress={pickImages} />
      {names.map((name, i) => (
        <View key={`${name}-${i}`} style={formStyles.imageRow}>
          <Text numberOfLines={1} style={{ flex: 1, marginRight: 8 }}>
            {name}
          </Text>
        </View>
      ))}
      <Text style={{ marginTop: 8, fontSize: 13, color: "#64748b" }}>DPI (default 72)</Text>
      <View style={{ marginTop: 4 }}>
        <Button title={`DPI: ${dpi} (tap cycle)`} onPress={() => setDpi(dpi === "72" ? "150" : dpi === "150" ? "300" : "72")} />
      </View>
    </ToolFormModal>
  );
}
