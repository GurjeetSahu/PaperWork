import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Directory, File, Paths } from "expo-file-system";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
export default function Modal() {
  const { uris } = useLocalSearchParams<{ uris?: string }>();
  const uriList = uris ? JSON.parse(uris) : [];
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
        <TouchableOpacity
          onPress={async () => {
            new Directory(Paths.document, "userData", fileName).create({
              idempotent: true,
            });

            for (const uri of uriList) {
              const sourceFile = new File(uri); //improve here
              const destinationDir = new Directory(
                Paths.document,
                "userData",
                fileName,
              );
              sourceFile.move(destinationDir);
            }
          }}
          style={[styles.button, styles.primary]}
        >
          <Text style={styles.primaryText}>S ave</Text>
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
