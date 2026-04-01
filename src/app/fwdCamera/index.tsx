import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ImageViewer from "../../components/ImageViewer";

import { File, Paths } from "expo-file-system";
import { useLocalSearchParams } from "expo-router";

export default function Index() {
  const { uri }: { uri: string } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* Image Section */}
      <View style={styles.imageWrapper}>
        {uri ? (
          <View style={styles.imageCard}>
            <ImageViewer imgSource={uri} />
          </View>
        ) : (
          <Text style={styles.placeholder}>No Image Selected</Text>
        )}
      </View>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, styles.secondary]}>
          <Text style={styles.secondaryText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.outline]}>
          <Text style={styles.outlineText}>Add More</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.primary]}>
          <Text
            style={styles.primaryText}
            onPress={async () => {
              // try {
              const sourceFile = new File(uri);

              // 2. Define the destination (e.g., in the app's document directory)
              const destinationFile = new File(Paths.document, "saved-age.jpg");

              // 3. Execute the copy operation
              sourceFile.copy(destinationFile);

              console.log("Saved to:", destinationFile.uri);
              // } catch {
              // const destinationFile = new File(Paths.document, "saved-age.jpg");
              // await IntentLauncher.startActivityAsync(
              //   "android.intent.action.VIEW",
              //   {
              //     data: destinationFile.uri,
              //     flags: 1, // Intent.FLAG_GRANT_READ_URI_PERMISSION
              //     type: "image/*",
              //   },
              // );
              // }
            }}
          >
            Proceed
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
});
