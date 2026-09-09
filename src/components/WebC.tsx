"use dom";

import { createPdfToolkit } from "pdfstudio";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";

// Tiny 1-page PDF saying "Hello World"
const BASE64_PDF =
  "JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCAzMDAgMTAwXSAvQ29udGVudHMgNCAwIFIgL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgNSAwIFIgPj4gPj4gPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0xlbmd0aCA0NCA+PgpzdHJlYW0KQlQKL0YxIDI0IFRmCjUwIDUwIFRkCihIZWxsbyBXb3JsZCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYSA+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyNjEgMDAwMDAgbiAKMDAwMDAwMDM1NCAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDYgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjQyNAolJUVPRgo=";

export default function MyComponent() {
  const [pdf, setPdf] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const wasmUrl = `${process.env.EXPO_PUBLIC_BASE_URL ?? ""}/qpdf.wasm`;
        const toolkit = await createPdfToolkit({
          wasmUrl,
        });

        setPdf(toolkit);
        console.log("PDF toolkit initialized");
      } catch (error) {
        console.error("Failed to initialize PDF toolkit:", error);
        setPdf(null);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function base64ToUint8Array(base64: string) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
  }
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
      const inputBytes = base64ToUint8Array(BASE64_PDF);
      // console.log("Input PDF:", inputBytes.length, "bytes");
      const rotated = await pdf.rotate(inputBytes, {
        angle: 90,
      });
      const bytes = byteArrayToBase64(rotated);
      console.log(bytes);

      const blob = new Blob([rotated], {
        type: "application/pdf",
      });

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
    <View
      style={{
        width: "100%",
        height: "100%",
        gap: 12,
      }}
    >
      <Text>QPDF Ready 🚀</Text>

      <Button
        title={processing ? "Processing..." : "Rotate PDF 90°"}
        onPress={rotatePdf}
        disabled={processing}
      />

      {resultUrl && (
        <iframe
          src={resultUrl}
          style={{
            width: "100%",
            height: "100%",
            minHeight: 600,
            border: "1px solid black",
          }}
        />
      )}
    </View>
  );
}
