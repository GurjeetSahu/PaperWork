"use dom";
import { useEffect, useState } from "react";
import { Platform, Text, View } from "react-native";

import { createPdfToolkit } from "pdfstudio";

export default function MyComponent() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (Platform.OS !== "web") {
        setData("PDF toolkit is only supported on web.");
        setLoading(false);
        return;
      }

      try {
        const wasmUrl = `${process.env.EXPO_PUBLIC_BASE_URL ?? ""}/qpdf.wasm`;
        const pdf = await createPdfToolkit({ wasmUrl });
        setData(`ready: ${pdf ? "initialized" : "missing"}`);
      } catch (error) {
        console.error("Failed to initialize PDF toolkit:", error);
        setData("PDF failed to initialize");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>{data}</Text>
    </View>
  );
}
