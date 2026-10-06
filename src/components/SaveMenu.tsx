import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "@/src/components/ui/modal";
import { Directory, File, Paths } from "expo-file-system";
import { router } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useUsers } from "./User";

type SaveMenuProps = {
  fromCamera: boolean;
  uriList?: string[];
};

export default function SaveMenu(props: SaveMenuProps) {
  const { currentUser, refreshFolders } = useUsers();
  const { fromCamera, uriList = [] } = props;
  const [showModal, setShowModal] = useState(false);
  const [fileName, setFileName] = useState("");
  const [subCat, setSubCat] = useState("");

  const resetModal = () => {
    setShowModal(false);
    setFileName("");
    setSubCat("");
  };

  const openModal = () => {
    setFileName("");
    setSubCat("");
    setShowModal(true);
  };

  const handleSave = async () => {
    const trimmedFileName = fileName.trim();
    const trimmedSubCat = subCat.trim();

    if (!currentUser || !trimmedFileName || !trimmedSubCat) {
      return;
    }

    resetModal();

    if (!fromCamera) {
      new Directory(Paths.document, "userData", currentUser, trimmedSubCat, trimmedFileName).create({});

      for (const uri of uriList) {
        const sourceFile = new File(uri);
        const destinationDir = new Directory(Paths.document, "userData", currentUser, trimmedSubCat, trimmedFileName);
        sourceFile.move(destinationDir);
      }
      refreshFolders();
      router.push("/");
      return;
    }

    const subCategory = new Directory(Paths.document, "userData", currentUser, trimmedSubCat);
    subCategory.create({ idempotent: true });

    new Directory(Paths.document, "userData", "temp").rename(trimmedFileName);
    const file = new Directory(Paths.document, "userData", trimmedFileName);
    file.move(subCategory);
    refreshFolders();
    router.push("/");
  };

  return (
    <View>
      <Button title="Procced" onPress={openModal} />

      <Modal isOpen={showModal} onClose={resetModal} size="md">
        <ModalBackdrop />

        <ModalContent style={styles.modal}>
          <ModalHeader style={styles.header}>
            <Text style={styles.title}>Rename</Text>

            <ModalCloseButton>
              <TouchableOpacity style={styles.closeButton} onPress={resetModal}>
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
              value={fileName}
              onChangeText={setFileName}
              placeholder="Ex- Aadhar Card, Driving Licence etc."
            />
            <TextInput
              value={subCat}
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
              onChangeText={setSubCat}
              placeholder="Category"
            />
          </ModalBody>

          <ModalFooter style={styles.footer}>
            <TouchableOpacity style={[styles.actionButton, styles.cancel]} onPress={resetModal}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.save]} onPress={handleSave}>
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
});
