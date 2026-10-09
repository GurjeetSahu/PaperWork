import { useEffect, useState } from "react";
import { Text, TextInput } from "react-native";

import type { CompressPdfFormData } from "@/src/types/toolFormData";

import ToolFormModal from "./ToolFormModal";
import { formStyles } from "./formStyles";

type CompressMenuProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CompressPdfFormData) => void;
};

export default function CompressMenu({ visible, onClose, onSubmit }: CompressMenuProps) {
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState("9");

  useEffect(() => {
    if (!visible) {
      setPassword("");
      setLevel("9");
    }
  }, [visible]);

  const handleSubmit = () => {
    const compressionLevel = parseInt(level, 10);
    onSubmit({
      ...(password.trim() ? { password: password.trim() } : {}),
      ...(Number.isFinite(compressionLevel) && compressionLevel >= 1 && compressionLevel <= 9
        ? { compressionLevel }
        : {}),
    });
    onClose();
  };

  return (
    <ToolFormModal visible={visible} title="Compress PDF" onClose={onClose} onSubmit={handleSubmit}>
      <Text style={formStyles.hint}>Recompresses streams (lossless). Level 1–9, default 9.</Text>
      <TextInput
        style={formStyles.input}
        placeholder="Compression level (1–9)"
        placeholderTextColor="#888"
        keyboardType="number-pad"
        value={level}
        onChangeText={setLevel}
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
