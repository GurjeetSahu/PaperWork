import type { ReactNode } from "react";
import { Button, Modal, Pressable, Text, View } from "react-native";

import { formStyles } from "./formStyles";

type ToolFormModalProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  children: ReactNode;
};

export default function ToolFormModal({
  visible,
  title,
  onClose,
  onSubmit,
  submitLabel = "Done",
  children,
}: ToolFormModalProps) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={formStyles.backdrop} onPress={onClose}>
        <Pressable style={formStyles.modalContent} onPress={(e) => e.stopPropagation()}>
          <Pressable style={formStyles.closeCornerButton} onPress={onClose}>
            <Text style={formStyles.closeButtonText}>✕</Text>
          </Pressable>
          <Text style={formStyles.modalTitle}>{title}</Text>
          <View style={formStyles.textBox}>{children}</View>
          <View style={{ marginTop: 16 }}>
            <Button color="#39AEA9" title={submitLabel} onPress={onSubmit} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
