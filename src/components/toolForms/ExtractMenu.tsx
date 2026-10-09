import { useEffect, useState } from "react";
import { Alert, Text, TextInput } from "react-native";

import type { PagesFormData } from "@/src/types/toolFormData";

import ToolFormModal from "./ToolFormModal";
import { formStyles } from "./formStyles";

type ExtractMenuProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: PagesFormData) => void;
};

export default function ExtractMenu({ visible, onClose, onSubmit }: ExtractMenuProps) {
  const [pages, setPages] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!visible) {
      setPages("");
      setPassword("");
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!pages.trim()) {
      Alert.alert("Pages required", 'Example: "1-3", "1,4,7", or "2".');
      return;
    }
    onSubmit({
      pages: pages.trim(),
      ...(password.trim() ? { password: password.trim() } : {}),
    });
    onClose();
  };

  return (
    <ToolFormModal visible={visible} title="Extract pages" onClose={onClose} onSubmit={handleSubmit}>
      <Text style={formStyles.hint}>qpdf page syntax: 1-5, 1,3,5, z (last page), etc.</Text>
      <TextInput
        style={formStyles.input}
        placeholder="Pages to keep"
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
