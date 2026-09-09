"use dom";

import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";

import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";

import { createPdfToolkit } from "pdfstudio";

export default function MyComponent() {
  const [pdf, setPdf] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  // Initialize PDF toolkit
  useEffect(() => {
    async function loadData() {
      try {
        const wasmUrl = `${process.env.EXPO_PUBLIC_BASE_URL ?? ""}/qpdf.wasm`;
        const toolkit = await createPdfToolkit({ wasmUrl });
        setPdf(`ready: ${pdf ? "initialized" : "missing"}`);
      } catch (error) {
        console.error("Failed to initialize PDF toolkit:", error);
        setPdf("PDF failed to initialize");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Pick PDF and rotate it
  async function pickAndRotatePdf() {
    if (!pdf) return;

    try {
      setProcessing(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });
      if (result.canceled) {
        return;
      }
      const asset = result.assets[0];
      // Convert the selected file into Uint8Array
      const file = new File(asset.uri);
      const bytes = await file.bytes();
      console.log("Input PDF bytes:", bytes.length);
      // Send Uint8Array to pdfstudio
      const rotated = await pdf.rotate(bytes, {
        angle: 90,
      });
      console.log("Rotated PDF bytes:", rotated.length);
      setResult(rotated);
    } catch (error) {
      console.error("PDF processing failed:", error);
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
        <Text>Loading PDF toolkit...</Text>
      </View>
    );
  }

  if (!pdf) {
    return (
      <View>
        <Text>Failed to initialize PDF toolkit.</Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      <Button
        title={processing ? "Processing..." : "Pick PDF"}
        onPress={pickAndRotatePdf}
        disabled={processing}
      />
      <Button
        title={processing ? "Processing..." : "Pick PDF"}
        onPress={() => {
          //console.log("hi");
        }}
        disabled={processing}
      />
      {result && (
        <Text>
          PDF rotated successfully!{"\n"}
          Output size: {result.length} bytes
        </Text>
      )}
    </View>
  );
}
