import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/src/components/ui/modal";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function NewFolder() {
  const [showModal, setShowModal] = useState(false);
  const [fileName, setFileName] = useState("");
  return (
    <View>
      <View style={styles.optionRow}>
        <View style={styles.labelChip}>
          <Text style={styles.labelText}>New Folder</Text>
        </View>
        <TouchableOpacity
          style={styles.optionButton}
          activeOpacity={0.85}
          onPress={() => {
            setShowModal(true);
          }}
        >
          <MaterialIcons name={"folder-open"} size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
        <ModalBackdrop />

        <ModalContent style={styles.modal}>
          <ModalHeader style={styles.header}>
            <Text style={styles.title}>New Folder</Text>

            <ModalCloseButton>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            <TextInput
              style={[
                styles.primaryText,
                {
                  borderColor: "black",
                  color: "black",
                  borderWidth: 2,
                  borderRadius: 10,
                  fontSize: 12,
                },
              ]}
              onChangeText={(newText) => setFileName(newText)}
              placeholder="Ex- Aadhar Card, Driving Licence etc."
            />
          </ModalBody>

          <ModalFooter style={styles.footer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancel]}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.save]}
              onPress={async () => {
                setShowModal(false);
                //work here
                //new Directory(Paths.document, fileName).create();
              }}
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    backgroundColor: "#fff",
    width: "90%",
    maxWidth: 380,
    borderWidth: 0,
    elevation: 8,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },

  closeText: {
    fontSize: 18,
    color: "#6B7280",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
    gap: 12,
  },

  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },

  cancel: {
    backgroundColor: "#F3F4F6",
  },

  save: {
    backgroundColor: "#4F46E5",
  },

  cancelText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 15,
  },

  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  primaryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    zIndex: 10,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  mainFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});
