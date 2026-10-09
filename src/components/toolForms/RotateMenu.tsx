import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import type { RotatePdfFormData } from "@/src/types/toolFormData";

import ToolFormModal from "./ToolFormModal";
import { formStyles } from "./formStyles";

const ANGLES: RotatePdfFormData["angle"][] = [90, 180, 270, -90];

type RotateMenuProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: RotatePdfFormData) => void;
};

export default function RotateMenu({ visible, onClose, onSubmit }: RotateMenuProps) {
  const [angle, setAngle] = useState<RotatePdfFormData["angle"]>(90);
  const [pages, setPages] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!visible) {
      setAngle(90);
      setPages("");
      setPassword("");
    }
  }, [visible]);

  const handleSubmit = () => {
    onSubmit({
      angle,
      ...(pages.trim() ? { pages: pages.trim() } : {}),
      ...(password.trim() ? { password: password.trim() } : {}),
    });
    onClose();
  };

  return (
    <ToolFormModal visible={visible} title="Rotate pages" onClose={onClose} onSubmit={handleSubmit}>
      <Text style={formStyles.hint}>Clockwise degrees (relative to current rotation).</Text>
      <View style={formStyles.angleRow}>
        {ANGLES.map((a) => (
          <Pressable
            key={a}
            style={[formStyles.angleChip, angle === a && formStyles.angleChipSelected]}
            onPress={() => setAngle(a)}
          >
            <Text style={formStyles.angleChipText}>{a}°</Text>
          </Pressable>
        ))}
      </View>
      <TextInput
        style={formStyles.input}
        placeholder="Pages (optional, all if empty)"
        placeholderTextColor="#888"
        value={pages}
        onChangeText={setPages}
      />
      <TextInput
        style={formStyles.input}
        placeholder="PDF password (if encrypted)"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
    </ToolFormModal>
  );
}
