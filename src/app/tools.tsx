import AllTools from "@/src/components/AllTools";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
const tools = [
  { emoji: "🔒", label: "Lock", category: "Security", name: "PickFile" },
  { emoji: "🔓", label: "Remove password", category: "Security", name: "RotatePdf" },

  { emoji: "➕", label: "Merge", category: "Pages", name: "RotatePdf" },
  { emoji: "✂️", label: "Split", category: "Pages", name: "RotatePdf" },
  { emoji: "🎯", label: "Extract pages", category: "Pages", name: "RotatePdf" },
  { emoji: "🔄", label: "Rotate", category: "Pages", name: "RotatePdf" },
  { emoji: "🗑", label: "Delete pages", category: "Pages", name: "RotatePdf" },

  { emoji: "🗜", label: "Compress", category: "PDF", name: "RotatePdf" },
  { emoji: "🩹", label: "Repair", category: "PDF", name: "RotatePdf" },
  { emoji: "📎", label: "Attachments", category: "PDF", name: "RotatePdf" },
  { emoji: "🫓", label: "Flatten", category: "PDF", name: "RotatePdf" },
  { emoji: "🔍", label: "Inspect", category: "PDF", name: "RotatePdf" },

  { emoji: "🖼", label: "Images → PDF", category: "Convert", name: "RotatePdf" },
  // { emoji: "🔓", label: "Unlock", category: "Security", name: "RotatePdf" },
  // { emoji: "🔁", label: "Change password", category: "Security", name: "RotatePdf" },
  // { emoji: "🂠", label: "Collate", category: "Pages", name: "RotatePdf" },
  // { emoji: "🛠", label: "Escape hatch", category: "Advanced", name: "RotatePdf" },
  // { emoji: "💧", label: "Watermark", category: "PDF", name: "RotatePdf" },
];

const categories = [...new Set(tools.map((tool) => tool.category))];
const BASE64_PDF =
  "JVBERi0xLjQKJb/3ov4KMSAwIG9iago8PCAvUGFnZXMgMiAwIFIgL1R5cGUgL0NhdGFsb2cgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL0NvdW50IDEgL0tpZHMgWyAzIDAgUiBdIC9UeXBlIC9QYWdlcyA+PgplbmRvYmoKMyAwIG9iago8PCAvQ29udGVudHMgNCAwIFIgL01lZGlhQm94IFsgMCAwIDMwMCAxMDAgXSAvUGFyZW50IDIgMCBSIC9SZXNvdXJjZXMgPDwgL0ZvbnQgPDwgL0YxIDUgMCBSID4+ID4+IC9Sb3RhdGUgOTAgL1R5cGUgL1BhZ2UgPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0xlbmd0aCA0OCAvRmlsdGVyIC9GbGF0ZURlY29kZSA+PgpzdHJlYW0KeJxzCuHSdzNUMDJRCEnjMjVQAKKQFC4Nj9ScnHyF8PyinBRNhZAsLtcQLgDRjAp1ZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8IC9CYXNlRm9udCAvSGVsdmV0aWNhIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udCA+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjQgMDAwMDAgbiAKMDAwMDAwMDEyMyAwMDAwMCBuIAowMDAwMDAwMjYyIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlciA8PCAvUm9vdCAxIDAgUiAvU2l6ZSA2IC9JRCBbPDAxODQxNTEwZjFiZmVhNjJhNmRlMDk5ODg5ZGQ4ODQzPjwwMTg0MTUxMGYxYmZlYTYyYTZkZTA5OTg4OWRkODg0Mz5dID4+CnN0YXJ0eHJlZgo0NTAKJSVFT0YK+PgpzdHJlYW0KQlQKL0YxIDI0IFRmCjUwIDUwIFRkCihIZWxsbyBXb3JsZCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYSA+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyNjEgMDAwMDAgbiAKMDAwMDAwMDM1NCAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDYgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjQyNAolJUVPRgo=";

export default function Tools() {
  const [pickedFiles, setPickedFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [b64, setb64] = useState<string>("");
  const [result, setResult] = useState("");

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

          // console.log("File:", asset.name);
          // console.log("URI:", asset.uri);
          // console.log("Base64:", base64);
          setb64(base64);
        }
      } else {
        console.log("User cancelled document picker");
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };
  const functionRegistry = {
    PickFile,
  } as const;

  const executeFunctionByName = (functionName: keyof typeof functionRegistry) => {
    const selectedFunction = functionRegistry[functionName];

    if (selectedFunction) {
      selectedFunction();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.pdfContainer}>
        <AllTools
          base64={b64}
          onResult={(value) => {
            console.log("Received:", value);
            setResult(value);
          }}
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>PDF Tools</Text>
        <Text style={styles.subtitle}>{tools.length} tools</Text>
      </View>

      {categories.map((category) => {
        const categoryTools = tools.filter((tool) => tool.category === category);

        const rows = Array.from({ length: Math.ceil(categoryTools.length / 2) }, (_, index) => categoryTools.slice(index * 2, index * 2 + 2));

        return (
          <View key={category} style={styles.section}>
            <Text style={styles.category}>{category}</Text>

            <View style={styles.table}>
              {rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {row.map((tool, columnIndex) => (
                    <Pressable
                      key={tool.label}
                      accessibilityRole="button"
                      onPress={() => executeFunctionByName(tool.name as keyof typeof functionRegistry)}
                      style={({ pressed }) => [styles.tool, columnIndex === 0 && styles.leftTool, pressed && styles.toolPressed]}
                    >
                      <View style={styles.icon}>
                        <Text style={styles.emoji}>{tool.emoji}</Text>
                      </View>

                      <Text style={styles.label} numberOfLines={2}>
                        {tool.label}
                      </Text>
                    </Pressable>
                  ))}

                  {row.length === 1 && <View style={styles.toolSpacer} />}
                </View>
              ))}
            </View>
          </View>
        );
      })}

      {/* Optional: useful while testing */}
      {pickedFiles.length > 0 && (
        <Text style={styles.fileCount}>
          {pickedFiles.length} PDF
          {pickedFiles.length === 1 ? "" : "s"} selected
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pdfContainer: {
    width: "100%",
    height: 70,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#f7f8fa",
    paddingHorizontal: 18,
    paddingTop: 26,
    paddingBottom: 48,
  },

  /* Header */

  header: {
    marginBottom: 28,
  },

  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    letterSpacing: -0.8,
    color: "#111827",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "500",
    color: "#94a3b8",
  },

  /* Section */

  section: {
    marginBottom: 30,
  },

  category: {
    marginLeft: 2,
    marginBottom: 11,

    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800",
    letterSpacing: 1,

    textTransform: "uppercase",
    color: "#64748b",
  },

  /* Table */

  table: {
    borderRadius: 18,
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

  row: {
    flexDirection: "row",
    minHeight: 82,
  },

  /* Tool */

  tool: {
    flex: 1,

    minHeight: 82,

    paddingHorizontal: 18,
    paddingVertical: 15,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#ffffff",
  },

  leftTool: {
    borderRightWidth: 1,
    borderRightColor: "#edf0f2",
  },

  toolPressed: {
    backgroundColor: "#f8fafc",
  },

  toolSpacer: {
    flex: 1,
    minHeight: 82,
    backgroundColor: "#ffffff",
  },

  /* Icon */

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

  /* Label */

  label: {
    flex: 1,

    fontSize: 13.5,
    lineHeight: 18,

    fontWeight: "600",
    color: "#1e293b",
  },

  /* Testing */

  fileCount: {
    marginTop: -14,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },
});
