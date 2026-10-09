import { useEffect, useState } from "react";
import { Alert, Text, TextInput } from "react-native";

import type { SplitPdfFormData } from "@/src/types/toolFormData";

import ToolFormModal from "./ToolFormModal";
import { formStyles } from "./formStyles";

type SplitMenuProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: SplitPdfFormData) => void;
};

export default function SplitMenu({ visible, onClose, onSubmit }: SplitMenuProps) {
  const [pagesPerFile, setPagesPerFile] = useState("1");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!visible) {
      setPagesPerFile("1");
      setPassword("");
    }
  }, [visible]);

  const handleSubmit = () => {
    const n = parseInt(pagesPerFile, 10);
    if (!Number.isFinite(n) || n < 1) {
      Alert.alert("Invalid value", "Pages per file must be at least 1.");
      return;
    }
    onSubmit({
      pagesPerFile: n,
      ...(password.trim() ? { password: password.trim() } : {}),
    });
    onClose();
  };

  return (
    <ToolFormModal visible={visible} title="Split PDF" onClose={onClose} onSubmit={handleSubmit}>
      <Text style={formStyles.hint}>Each output file will contain this many pages (default 1).</Text>
      <TextInput
        style={formStyles.input}
        placeholder="Pages per file"
        placeholderTextColor="#888"
        keyboardType="number-pad"
        value={pagesPerFile}
        onChangeText={setPagesPerFile}
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
