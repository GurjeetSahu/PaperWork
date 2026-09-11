"use dom";

import { createPdfToolkit, PdfToolkit } from "pdfstudio";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function AllTools() {
  const [pdf, setPdf] = useState<PdfToolkit | null>(null);
  const [loading, setLoading] = useState(true);
  async function loadData() {
    if (!pdf) {
      try {
        const wasmUrl = `${process.env.EXPO_PUBLIC_BASE_URL}/qpdf.wasm`;
        const toolkit: PdfToolkit = await createPdfToolkit({ wasmUrl });
        setPdf(toolkit);
        console.log("PDF toolkit initialized");
      } catch (error) {
        console.error("Failed to initialize PDF toolkit:", error);
        setPdf(null);
      } finally {
        setLoading(false);
      }
    } else {
      // console.log("Ready");
    }
  }
  useEffect(() => {
    loadData();
  }, []);

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
    </View>
  );
}
