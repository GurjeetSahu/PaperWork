"use dom";

import { createPdfToolkit, PdfToolkit } from "pdfstudio";
//import { LockOptions, UnlockOptions, SplitOptions, ExtractPagesOptions, RotateOptions, DeletePagesOptions, ImagesToPdfOptions, CompressOptions } from "pdfstudio";
import { useEffect, useState } from "react";
import { View } from "react-native";

type AllToolsProps = {
  base64: string;
  functionName?: string;
  functionData?: string;
  onResult: (value: string) => void;
};

export default function AllTools({ base64, functionName, functionData, onResult }: AllToolsProps) {
  const [pdf, setPdf] = useState<any>(null);
  //const [pdf, setPdf] = useState<PdfToolkit | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

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

  useEffect(() => {
    if (!functionName || !base64 || !pdf || processing) return;

    const executeSelectedFunction = async () => {
      switch (functionName) {
        case "lockPdf":
          await lockPdf();
          break;
        case "removePassword":
          await removePassword();
          break;
        case "mergePdf":
          await mergePdf();
          break;
        case "splitPdf":
          await splitPdf();
          break;
        case "extractPages":
          await extractPages();
          break;
        case "rotatePdf":
          await rotatePdf();
          break;
        case "deletePages":
          await deletePages();
          break;
        default:
          console.warn(`No PDF function registered for: ${functionName}`);
      }
    };

    executeSelectedFunction();
  }, [base64, functionName, pdf, processing]);

  async function lockPdf() {
    if (!pdf || !base64) return;
    try {
      setProcessing(true);
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const inputBytes = bytes;

      const rotated = await pdf.lock(inputBytes, { userPassword: functionData });
      onResult(byteArrayToBase64(rotated));
    } catch (error) {
      console.error("PDF processing failed:", error);
    } finally {
      setProcessing(false);
    }
  }
  async function removePassword() {
    if (!pdf || !base64) return;
    try {
      setProcessing(true);
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const inputBytes = bytes;

      const password = "d";
      const deleted = await pdf.removePassword(inputBytes, { password: functionData });
      onResult(byteArrayToBase64(deleted));
    } catch (error) {
      console.error("PDF processing failed:", error);
    } finally {
      setProcessing(false);
    }
  }

  async function mergePdf() {
    if (!pdf || !base64) return;
    try {
      setProcessing(true);
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const inputBytes = bytes;

      const pages: ReadonlyArray<string> = [""];
      const extracted = await pdf.merge({ pages: pages });
      onResult(byteArrayToBase64(extracted));
    } catch (error) {
      console.error("PDF processing failed:", error);
    } finally {
      setProcessing(false);
    }
  }
  async function splitPdf() {
    if (!pdf || !base64) return;
    try {
      setProcessing(true);
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const inputBytes = bytes;

      const extracted = await pdf.extractPages(inputBytes, { pages: functionData });
      onResult(byteArrayToBase64(extracted));
    } catch (error) {
      console.error("PDF processing failed:", error);
    } finally {
      setProcessing(false);
    }
  }
  async function extractPages() {
    if (!pdf || !base64) return;
    try {
      setProcessing(true);
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const inputBytes = bytes;
      const extracted = await pdf.extractPages(inputBytes, { pages: functionData });
      onResult(byteArrayToBase64(extracted));
    } catch (error) {
      console.error("PDF processing failed:", error);
    } finally {
      setProcessing(false);
    }
  }
  async function rotatePdf() {
    if (!pdf || !base64) return;
    try {
      setProcessing(true);
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const inputBytes = bytes;

      const rotated = await pdf.rotate(inputBytes, { angle: 90 });
      onResult(byteArrayToBase64(rotated));
    } catch (error) {
      console.error("PDF processing failed:", error);
    } finally {
      setProcessing(false);
    }
  }
  async function deletePages() {
    if (!pdf || !base64) return;
    try {
      setProcessing(true);
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const inputBytes = bytes;
      const deleted = await pdf.deletePages(inputBytes, { pages: functionData });
      onResult(byteArrayToBase64(deleted));
    } catch (error) {
      console.error("PDF processing failed:", error);
    } finally {
      setProcessing(false);
    }
  }

  return <View></View>;
}
