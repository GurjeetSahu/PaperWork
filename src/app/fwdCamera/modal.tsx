import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { File, Paths } from "expo-file-system";
import { useLocalSearchParams } from "expo-router";

export default function Modal() {
  const { uri }: { uri: string } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        <TouchableOpacity style={{}}>
          <Text
            style={styles.primaryText}
            onPress={async () => {
              try {
                const sourceFile = new File(uri);
                const destinationFile = new File(Paths.document, "image");
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

  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  imageCard: {
    width: "100%",
    height: "90%",
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#1e293b",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },

  placeholder: {
    color: "#94a3b8",
    fontSize: 16,
  },

  footer: {
    padding: 20,
    gap: 12,
  },

  button: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  primary: {
    backgroundColor: "#6366f1",
  },

  primaryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  secondary: {
    backgroundColor: "#ef4444",
  },

  secondaryText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },

  outline: {
    borderWidth: 1,
    borderColor: "#475569",
  },

  outlineText: {
    color: "#cbd5f5",
    fontSize: 15,
  },
  link: {
    paddingTop: 20,
    fontSize: 20,
  },
});
