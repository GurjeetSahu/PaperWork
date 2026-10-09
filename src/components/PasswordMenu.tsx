import { useState } from "react";
import { Button, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function PasswordMenu({ onSubmitResult }: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setCnfmPwd] = useState("");
  const handlePress = () => {
    onSubmitResult({ pwd, confirmPwd });
  };
  return (
    <View style={styles.container}>
      <Pressable style={styles.openButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.openButtonText}>Op</Text>
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Handles hardware back button on Android
      >
        {/* Backdrop Wrapper: Tapping here closes the modal */}
        <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)}>
          {/* Modal Container: Prevents clicks here from closing the modal */}
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {/* Close Button in the Top-Right Corner */}
            <Pressable style={styles.closeCornerButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>

            {/* Modal Body Elements */}
            <Text style={styles.modalTitle}>Locking Pdf</Text>
            <View style={styles.textBox}>
              <TextInput
                style={styles.input}
                placeholder="Enter password..."
                placeholderTextColor="#888"
                // 2. Bind the value to your state variable
                value={pwd}
                // 3. Update state automatically when text changes
                onChangeText={(newText) => setPwd(newText)}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm password..."
                placeholderTextColor="#888"
                // 2. Bind the value to your state variable
                value={confirmPwd}
                // 3. Update state automatically when text changes
                onChangeText={(newText) => setCnfmPwd(newText)}
              />
            </View>
            <Button title="Done" onPress={handlePress} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  textBox: { justifyContent: "flex-start", alignItems: "flex-start" },
  input: {
    height: 50,
    width: 300,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 5,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    justifyContent: "flex-start",
  },
  resultText: {
    marginTop: 15,
    fontSize: 16,
    color: "#333",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff0000",
    height: 2,
    width: 200,
    padding: 0,
  },
  openButton: {
    backgroundColor: "#4ad500",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  openButtonText: {
    color: "#002051",
    fontWeight: "600",
    fontSize: 16,
  },
  // Dark semi-transparent background stretching across the entire screen
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  // The actual white modal box
  modalContent: {
    width: "85%",
    backgroundColor: "#ffffff",
    borderRadius: 1,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "relative", // Enables absolute positioning for the corner button
  },
  // Positioned strictly in the top-right corner
  closeCornerButton: {
    position: "absolute",
    top: 12,
    right: 16,
    padding: 8, // Enlarges touch target area
  },
  closeButtonText: {
    fontSize: 20,
    color: "#8e8e93",
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
  },
});
