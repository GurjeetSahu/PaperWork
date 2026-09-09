"use dom";

import { createPdfToolkit } from "pdfstudio";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";

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

        const toolkit = await createPdfToolkit({
          wasmUrl,
        });

        setPdf(toolkit);
      } catch (error) {
        console.error("Failed to initialize PDF toolkit:", error);
        setPdf(null);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Convert Base64 → Uint8Array
  function base64ToUint8Array(base64: string): Uint8Array {
    // Remove possible data URL prefix:
    // data:application/pdf;base64,AAAA...
    const cleanBase64 = base64.includes(",") ? base64.split(",")[1] : base64;

    const binaryString = atob(cleanBase64);

    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
  }

  // Base64 PDF → rotate
  async function rotatePdf() {
    if (!pdf) return;

    try {
      setProcessing(true);
      setResult(null);

      // Your Base64 PDF goes here
      const base64Pdf =
        "JVBERi0xLjEKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCAzMDAgMTAwXSA+PgplbmRvYmoKdHJhaWxlcgo8PCAvUm9vdCAxIDAgUiA+PgpFT0YK";

      // Convert Base64 → Uint8Array
      const bytes = base64ToUint8Array(base64Pdf);

      console.log("Input PDF bytes:", bytes.length);

      // Give Uint8Array directly to pdfstudio
      const rotated = await pdf.rotate(bytes, {
        angle: 90,
      });

      console.log("Rotated PDF bytes:", rotated.length);

      setResult(rotated);
    } catch (error) {
      console.error("PDF processing failed:", error);
    } finally {
      setProcessing(false);
      console.log("success");
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
      <Text>PDF Toolkit Ready</Text>

      <Button
        title={processing ? "Processing..." : "Rotate Base64 PDF"}
        onPress={rotatePdf}
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
//"JVBERi0xLjEKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCAzMDAgMTAwXSA+PgplbmRvYmoKdHJhaWxlcgo8PCAvUm9vdCAxIDAgUiA+PgpFT0YK";
