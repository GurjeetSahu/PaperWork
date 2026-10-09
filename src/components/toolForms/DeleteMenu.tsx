import { useEffect, useState } from "react";
import { Alert, Text, TextInput } from "react-native";

import type { PagesFormData } from "@/src/types/toolFormData";

import ToolFormModal from "./ToolFormModal";
import { formStyles } from "./formStyles";

type DeleteMenuProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: PagesFormData) => void;
};

export default function DeleteMenu({ visible, onClose, onSubmit }: DeleteMenuProps) {
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
      Alert.alert("Pages required", "Enter which pages to remove.");
      return;
    }
    onSubmit({
      pages: pages.trim(),
      ...(password.trim() ? { password: password.trim() } : {}),
    });
    onClose();
  };

  return (
    <ToolFormModal visible={visible} title="Delete pages" onClose={onClose} onSubmit={handleSubmit}>
      <Text style={formStyles.hint}>Pages to remove from the document.</Text>
      <TextInput
        style={formStyles.input}
        placeholder="Pages to delete"
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
