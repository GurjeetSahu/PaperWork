import { useEffect, useState } from "react";
import { Alert, TextInput } from "react-native";

import type { LockPdfFormData } from "@/src/types/toolFormData";

import ToolFormModal from "./ToolFormModal";
import { formStyles } from "./formStyles";

type LockMenuProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: LockPdfFormData) => void;
};

export default function LockMenu({ visible, onClose, onSubmit }: LockMenuProps) {
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  useEffect(() => {
    if (!visible) {
      setPwd("");
      setConfirmPwd("");
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!pwd.trim()) {
      Alert.alert("Password required", "Enter a password to lock the PDF.");
      return;
    }
    if (pwd !== confirmPwd) {
      Alert.alert("Passwords do not match", "Confirm the same password in both fields.");
      return;
    }
    onSubmit({ userPassword: pwd });
    onClose();
  };

  return (
    <ToolFormModal visible={visible} title="Lock PDF" onClose={onClose} onSubmit={handleSubmit}>
      <TextInput
        style={formStyles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={pwd}
        onChangeText={setPwd}
      />
      <TextInput
        style={formStyles.input}
        placeholder="Confirm password"
        placeholderTextColor="#888"
        secureTextEntry
        value={confirmPwd}
        onChangeText={setConfirmPwd}
      />
    </ToolFormModal>
  );
}
