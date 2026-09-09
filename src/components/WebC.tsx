"use dom";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { createPdfToolkit } from "pdfstudio";

export default function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const pdf = await createPdfToolkit({ wasmUrl: "./qpdf.wasm" });
      } catch {
        setLoading(true);
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
