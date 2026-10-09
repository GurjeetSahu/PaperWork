import AllTools from "@/src/components/AllTools";
import CompressMenu from "@/src/components/toolForms/CompressMenu";
import DeleteMenu from "@/src/components/toolForms/DeleteMenu";
import ExtractMenu from "@/src/components/toolForms/ExtractMenu";
import ImagesToPdfMenu from "@/src/components/toolForms/ImagesToPdfMenu";
import LockMenu from "@/src/components/toolForms/LockMenu";
import MergeMenu from "@/src/components/toolForms/MergeMenu";
import RotateMenu from "@/src/components/toolForms/RotateMenu";
import SplitMenu from "@/src/components/toolForms/SplitMenu";
import UnlockMenu from "@/src/components/toolForms/UnlockMenu";
import type { ToolFormData } from "@/src/types/toolFormData";
import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { Alert, Button, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import CloseableCard from "@/src/components/ui/card";

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
] as const;

type ToolName = (typeof tools)[number]["name"];

const PDF_TOOLS: ToolName[] = [
  "lockPdf",
  "removePassword",
  "mergePdf",
  "splitPdf",
  "extractPages",
  "rotatePdf",
  "deletePages",
  "compressPdf",
];

export default function Tools() {
  const [pickedFiles, setPickedFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [base64Files, setBase64Files] = useState<string[]>([]);
  const [b64, setb64] = useState<string>("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [result, setResult] = useState("");
  const [resultCard, showResultCard] = useState(false);
  const [splitPartCount, setSplitPartCount] = useState(0);
  const [selectedFunction, setSelectedFunction] = useState<ToolName | "">("");
  const [formData, setFormData] = useState<ToolFormData | null>(null);
  const [runId, setRunId] = useState(0);
  const [activeTool, setActiveTool] = useState<ToolName | null>(null);
  const [outputUri, setOutputUri] = useState<string | null>(null);

  const onResults = (value: string | string[]) => {
    showResultCard(true);
    const primary = Array.isArray(value) ? value[0] : value;
    setSplitPartCount(Array.isArray(value) ? value.length : 0);
    setResult(primary);
    const uri = saveBase64ToFile(primary);
    if (uri) setOutputUri(uri);
  };

  const runTool = (name: ToolName, data: ToolFormData) => {
    setSelectedFunction(name);
    setFormData(data);
    setRunId((n) => n + 1);
  };

  const openTool = (name: ToolName) => {
    if (PDF_TOOLS.includes(name) && fileNames.length === 0) {
      Alert.alert("Pick a PDF first", "Use Pick File to choose at least one PDF for this tool.");
      return;
    }
    if (name === "mergePdf" && fileNames.length < 2) {
      Alert.alert("Need more files", "Pick at least two PDFs to merge.");
      return;
    }
    setActiveTool(name);
  };

  const PickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setPickedFiles((prev) => [...prev, ...result.assets]);

        const newNames: string[] = [];
        const newBase64: string[] = [];

        for (const asset of result.assets) {
          const file = new File(asset.uri);
          const base64 = await file.base64();
          newNames.push(asset.name);
          newBase64.push(base64);
        }

        setFileNames((prev) => [...prev, ...newNames]);
        setBase64Files((prev) => [...prev, ...newBase64]);
        if (newBase64.length > 0) {
          setb64(newBase64[newBase64.length - 1]);
        }
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
      return null;
    }
  }

  const shareFileToDevice = async () => {
    const isAvailable = await Sharing.isAvailableAsync();
    const uri = outputUri ?? `${Paths.document.uri}/document.pdf`;

    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Save or Share your file",
      });
    } else {
      console.log("Sharing is not available on this platform");
    }
  };

  const removeFile = (index: number) => {
    setFileNames((prev) => prev.filter((_, i) => i !== index));
    setPickedFiles((prev) => prev.filter((_, i) => i !== index));
    setBase64Files((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setb64(next[next.length - 1] ?? "");
      return next;
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.pickFile}>
        <View>
          <Button color="#39AEA9" title="Pick File" onPress={PickFile} />
        </View>

        <AllTools
          base64={b64}
          base64Files={base64Files}
          functionName={selectedFunction}
          functionData={formData}
          runId={runId}
          onResult={onResults}
        />
      </View>

      {fileNames.length > 0 && (
        <View style={styles.fileContainer}>
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
            {fileNames.map((name, index) => (
              <View key={`${name}-${index}`} style={styles.card}>
                <TouchableOpacity style={styles.closeButton} onPress={() => removeFile(index)} activeOpacity={0.7}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.description}>Selected for PDF tools (merge uses order shown).</Text>
              </View>
            ))}
            <Text style={styles.fileCount}>
              {fileNames.length} PDF
              {fileNames.length === 1 ? "" : "s"} selected
            </Text>
          </ScrollView>
        </View>
      )}

      {resultCard && (
        <View>
          <CloseableCard
            title={splitPartCount > 1 ? `Done (${splitPartCount} parts — first saved)` : "Done"}
            description={result ? "Output saved. Share or save to your device." : ""}
            onClose={() => showResultCard(false)}
          />
          <Button color="#39AEA9" title="Share" onPress={shareFileToDevice} />
        </View>
      )}

      <LockMenu
        visible={activeTool === "lockPdf"}
        onClose={() => setActiveTool(null)}
        onSubmit={(data) => runTool("lockPdf", data)}
      />
      <UnlockMenu
        visible={activeTool === "removePassword"}
        onClose={() => setActiveTool(null)}
        onSubmit={(data) => runTool("removePassword", data)}
      />
      <MergeMenu
        visible={activeTool === "mergePdf"}
        fileCount={fileNames.length}
        onClose={() => setActiveTool(null)}
        onSubmit={(data) => runTool("mergePdf", data)}
      />
      <SplitMenu
        visible={activeTool === "splitPdf"}
        onClose={() => setActiveTool(null)}
        onSubmit={(data) => runTool("splitPdf", data)}
      />
      <ExtractMenu
        visible={activeTool === "extractPages"}
        onClose={() => setActiveTool(null)}
        onSubmit={(data) => runTool("extractPages", data)}
      />
      <RotateMenu
        visible={activeTool === "rotatePdf"}
        onClose={() => setActiveTool(null)}
        onSubmit={(data) => runTool("rotatePdf", data)}
      />
      <DeleteMenu
        visible={activeTool === "deletePages"}
        onClose={() => setActiveTool(null)}
        onSubmit={(data) => runTool("deletePages", data)}
      />
      <CompressMenu
        visible={activeTool === "compressPdf"}
        onClose={() => setActiveTool(null)}
        onSubmit={(data) => runTool("compressPdf", data)}
      />
      <ImagesToPdfMenu
        visible={activeTool === "imagesToPdf"}
        onClose={() => setActiveTool(null)}
        onSubmit={(data) => runTool("imagesToPdf", data)}
      />

      <View style={styles.toolsContainer}>
        {tools.map((tool) => (
          <Pressable
            key={tool.name}
            accessibilityRole="button"
            onPress={() => openTool(tool.name)}
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
        ))}
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
    backgroundColor: "#E5EFC1",
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
    elevation: 4,
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
