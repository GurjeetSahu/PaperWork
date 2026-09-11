"use dom";

import { createPdfToolkit, PdfToolkit } from "pdfstudio";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";

export default function AllTools({ base64 }: { base64: string }) {
  const [pdf, setPdf] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!pdf) {
        try {
          const wasmUrl = `${process.env.EXPO_PUBLIC_BASE_URL ?? ""}/qpdf.wasm`;
          const toolkit: PdfToolkit = await createPdfToolkit({
            wasmUrl,
          });
          //toolkit.
          setPdf(toolkit);
          console.log("PDF toolkit initialized");
        } catch (error) {
          console.error("Failed to initialize PDF toolkit:", error);
          setPdf(null);
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
  }, []);

  function byteArrayToBase64(bytes: number[]): string {
    const uint8 = new Uint8Array(bytes);
    let binary = "";
    for (let i = 0; i < uint8.length; i++) {
      binary += String.fromCharCode(uint8[i]);
    }
    return btoa(binary);
  }

  async function rotatePdf() {
    if (!pdf) return;
    try {
      setProcessing(true);
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const inputBytes = bytes;
      const rotated = await pdf.rotate(inputBytes, { angle: 90 });
      console.log(byteArrayToBase64(rotated));
      const blob = new Blob([rotated], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
      setResultUrl(url);
    } catch (error) {
      console.error("PDF processing failed:", error);
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
        <Text>Loading QPDF...</Text>
      </View>
    );
  }

  if (!pdf) {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Failed to initialize PDF toolkit.</Text>
      </View>
    );
  }

  return (
    <View style={{ width: "100%", gap: 12 }}>
      <Text>QPDF Ready 🚀</Text>
      <Button title={processing ? "Processing..." : "Rotate PDF 90°"} onPress={rotatePdf} disabled={processing} />
    </View>
  );
}
