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
          style={{ borderColor: "green", color: "green", borderWidth: 2 }}
          onChangeText={(newText) => setFileName(newText)}
        ></TextInput>
        <TouchableOpacity style={{}}>
          <Text
            style={styles.primaryText}
            onPress={async () => {
              try {
                const sourceFile = new File(uri);
                const destinationFile = new File(Paths.document, fileName);
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
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // dark modern bg
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

  link: {
    paddingTop: 20,
    fontSize: 20,
  },
});
