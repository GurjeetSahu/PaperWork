import AllTools from "@/src/components/AllTools";

import { Text } from "@/src/components/ui/text";
import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import { useState } from "react";
import { Button, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import * as Sharing from "expo-sharing";

const tools = [
  { emoji: "🔒", label: "Lock", name: "lockPdf" },
  { emoji: "🔓", label: "Remove password", name: "removePassword" },
  { emoji: "➕", label: "Merge", name: "mergePdf" },
  { emoji: "✂️", label: "Split", name: "splitPdf" },
  { emoji: "🎯", label: "Extract pages", name: "extractPages" },
  { emoji: "🔄", label: "Rotate", name: "rotatePdf" },
  { emoji: "🗑", label: "Delete pages", name: "deletePages" },
  { emoji: "🗜", label: "Compress", name: "compressPdf" },
  { emoji: "🖼", label: "Images → PDF", name: "imagesToPdf" },

  // { emoji: "📎", label: "Attachments", category: "PDF", name: "attachmentsExtract" },
  // { emoji: "🩹", label: "Repair", category: "PDF", name: "repairPdf" },
  // { emoji: "🔍", label: "Inspect", category: "PDF", name: "inspectPdf" },
  // { emoji: "🫓", label: "Flatten", category: "PDF", name: "RotatePdf" },
  // { emoji: "🔓", label: "Unlock", category: "Security", name: "RotatePdf" },
  // { emoji: "🔁", label: "Change password", category: "Security", name: "RotatePdf" },
  // { emoji: "🂠", label: "Collate", category: "Pages", name: "RotatePdf" },
  // { emoji: "🛠", label: "Escape hatch", category: "Advanced", name: "RotatePdf" },
  // { emoji: "💧", label: "Watermark", category: "PDF", name: "RotatePdf" },
];

type files = {
  fileName: string;
  fileType: string;
};

export default function Tools() {
  const [pickedFiles, setPickedFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);

  const [b64, setb64] = useState<string>("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [result, setResult] = useState("");
  const [selectedFunction, setSelectedFunction] = useState<string>("");

  const PickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setPickedFiles((prev) => [...prev, ...result.assets]);

        for (const asset of result.assets) {
          const file = new File(asset.uri);
          const base64 = await file.base64();

          setFileNames((prev) => [...prev, asset.name]);
          setb64(base64);
        }
      } else {
        console.log("User cancelled document picker");
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  function saveBase64ToFile(base64Data: string) {
    try {
      const cleanBase64 = base64Data.replace(/^data:.*?;base64,/, "");
      const file = new File(Paths.document, "document.pdf");
      file.write(cleanBase64, { encoding: "base64" });

      console.log("File written successfully to:", file.uri);
      return file.uri;
    } catch (error) {
      console.error("Failed to write file:", error);
    }
  }
  const shareFileToDevice = async () => {
    const isAvailable = await Sharing.isAvailableAsync();

    if (isAvailable) {
      await Sharing.shareAsync("file:///data/user/0/com.gurjeetsahu.onlyDocs/files/document.pdf", {
        mimeType: "application/pdf", // Adjust based on your file extension
        dialogTitle: "Save or Share your file",
      });
    } else {
      console.log("Sharing is not available on this platform");
    }
  };
  // Remove file by index
  const removeFile = (index: number) => {
    setFileNames((prev) => prev.filter((_, i) => i !== index));

    setPickedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Pick File */}
      <View style={styles.pickFile}>
        <View>
          <Button
            color="#48426D"
            title="Pick File"
            onPress={() => {
              PickFile();
            }}
          />
        </View>

        <AllTools
          base64={b64}
          functionName={selectedFunction}
          onResult={(value) => {
            setResult(value);
            saveBase64ToFile(value);
          }}
        />
      </View>

      {/* Files */}
      {fileNames.length > 0 && (
        <View style={styles.fileContainer}>
          <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
            {fileNames.map((name, index) => (
              <View key={`${name}-${index}`} style={styles.card}>
                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton} onPress={() => removeFile(index)} activeOpacity={0.7}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>

                {/* Card Content */}
                <Text style={styles.title}>{name}</Text>

                <Text style={styles.description}>
                  This is a customizable card component. You can easily dismiss it by tapping the close icon in the corner.
                </Text>
              </View>
            ))}

            {/* File Count */}
            <Text style={styles.fileCount}>
              {fileNames.length} PDF
              {fileNames.length === 1 ? "" : "s"} selected
            </Text>
          </ScrollView>
        </View>
      )}

      {/* Log Button */}
      {/* <Button
        title="Log"
        onPress={() => {
          console.log(fileNames);
        }}
      /> */}
      <Button
        color="#48426D"
        title="Share"
        onPress={() => {
          shareFileToDevice();
        }}
      />

      {/* <Button
        title="Delete"
        onPress={() => {
          setFileNames([]);
          setPickedFiles([]);
        }}
      /> */}

      {/* Tools */}
      <View style={styles.toolsContainer}>
        {tools.map((tool) => {
          return (
            <Pressable
              key={tool.label}
              accessibilityRole="button"
              onPress={() => {
                setSelectedFunction(tool.name);
              }}
              style={styles.tool}
            >
              <View>
                <View style={styles.icon}>
                  <Text style={styles.emoji}>{tool.emoji}</Text>
                </View>

                <Text style={styles.label} numberOfLines={2}>
                  {tool.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pickFile: {
    width: "100%",
    height: 36,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "gray",
    borderRadius: 5,
    overflow: "hidden",
  },

  fileContainer: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
  },

  container: {
    flexGrow: 1,
    backgroundColor: "#f7f8fa",
    paddingHorizontal: 18,
    paddingTop: 26,
    paddingBottom: 48,
  },

  toolsContainer: {
    flex: 2,
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#0f172a",
    shadowOpacity: 0.035,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 1,
  },

  tool: {
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
    width: "47%",
    flexDirection: "row",
    minHeight: 82,
    padding: 10,
    backgroundColor: "#F0C38E",
  },

  icon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  emoji: {
    fontSize: 20,
  },

  label: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: "600",
    color: "#1e293b",
  },

  fileCount: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    margin: 16,
    position: "relative",

    // Android Shadow
    elevation: 4,

    // iOS Shadow
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333333",
    paddingRight: 24,
  },

  description: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },

  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },

  closeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666666",
    marginTop: -2,
  },
});
