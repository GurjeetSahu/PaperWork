import { Button, ButtonText } from "@/src/components/ui/button";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/src/components/ui/modal";
import { Directory, File, Paths } from "expo-file-system";
import { router } from "expo-router";
import React from "react";

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SaveMenu(fromCamera: any, uriList?: any) {
  const [showModal, setShowModal] = React.useState(false);
  const [fileName, setFileName] = React.useState("");
  return (
    <View>
      <Button onPress={() => setShowModal(true)}>
        <ButtonText>Open Modal</ButtonText>
      </Button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
        <ModalBackdrop />

        <ModalContent style={styles.modal}>
          <ModalHeader style={styles.header}>
            <Text style={styles.title}>Save File</Text>

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
                // setShowModal(false)
                if (fromCamera == "false") {
                  //document approach
                  console.log("I am document not coming from camera");
                  new Directory(Paths.document, "userData", fileName).create({
                    idempotent: true,
                  });

                  for (const uri of uriList) {
                    const sourceFile = new File(uri);
                    const destinationDir = new Directory(
                      Paths.document,
                      "userData",
                      fileName,
                    );
                    sourceFile.move(destinationDir);
                  }
                  router.push("/");
                } else if (fromCamera == "true") {
                  console.log("I am coming from camera not a document");
                  new Directory(Paths.document, "userData/temp").rename(
                    fileName,
                  );
                }
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

  body: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4B5563",
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
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // dark modern bg
    justifyContent: "space-between",
  },

  primaryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  primary: {
    backgroundColor: "#6366f1",
  },
  link: {
    paddingTop: 20,
    fontSize: 20,
  },
});
