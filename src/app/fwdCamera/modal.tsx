import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { File, Paths } from "expo-file-system";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function Modal() {
  const { uri }: { uri: string } = useLocalSearchParams();
  const [fileName, setFileName] = useState("");
  return (
    <View style={styles.container}>
      <View style={styles.footer}>
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
        ></TextInput>
        <TouchableOpacity style={[styles.button, styles.primary]}>
          <Text
            style={styles.primaryText}
            onPress={async () => {
              try {
                const sourceFile = new File(uri);
                const destinationFile = new File(
                  Paths.document,
                  "userData",
                  fileName,
                );
                sourceFile.copy(destinationFile);
                console.log("Saved to:", destinationFile.uri);
              } catch {}
            }}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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

  footer: {
    padding: 20,
    gap: 12,
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
