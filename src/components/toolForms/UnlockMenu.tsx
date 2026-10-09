import { useEffect, useState } from "react";
import { Alert, TextInput } from "react-native";

import type { RemovePasswordFormData } from "@/src/types/toolFormData";

import ToolFormModal from "./ToolFormModal";
import { formStyles } from "./formStyles";

type UnlockMenuProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: RemovePasswordFormData) => void;
};

export default function UnlockMenu({ visible, onClose, onSubmit }: UnlockMenuProps) {
  const [pwd, setPwd] = useState("");

  useEffect(() => {
    if (!visible) setPwd("");
  }, [visible]);

  const handleSubmit = () => {
    if (!pwd) {
      Alert.alert("Password required", "Enter the PDF password to remove it.");
      return;
    }
    onSubmit({ password: pwd });
    onClose();
  };

  return (
    <ToolFormModal visible={visible} title="Remove password" onClose={onClose} onSubmit={handleSubmit}>
      <TextInput
        style={formStyles.input}
        placeholder="Current PDF password"
        placeholderTextColor="#888"
        secureTextEntry
        value={pwd}
        onChangeText={setPwd}
      />
    </ToolFormModal>
  );
}
