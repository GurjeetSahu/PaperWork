"use dom";

import { createPdfToolkit, imagesToPdf, PdfToolkit } from "pdfstudio";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

import type {
  CompressPdfFormData,
  ImagesToPdfFormData,
  LockPdfFormData,
  PagesFormData,
  RemovePasswordFormData,
  RotatePdfFormData,
  SplitPdfFormData,
  ToolFormData,
} from "@/src/types/toolFormData";

type AllToolsProps = {
  base64: string;
  base64Files?: string[];
  functionName?: string;
  functionData?: ToolFormData | null;
  runId?: number;
  onResult: (value: string | string[]) => void;
};

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64.replace(/^data:.*?;base64,/, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function byteArrayToBase64(bytes: number[] | Uint8Array): string {
  const uint8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < uint8.length; i++) {
    binary += String.fromCharCode(uint8[i]);
  }
  return btoa(binary);
}

export default function AllTools({
  base64,
  base64Files = [],
  functionName,
  functionData,
  runId = 0,
  onResult,
}: AllToolsProps) {
  const [pdf, setPdf] = useState<PdfToolkit | null>(null);
  const [processing, setProcessing] = useState(false);
  const lastRunRef = useRef(0);

  useEffect(() => {
    async function loadData() {
      if (pdf) return;
      try {
        const wasmUrl = `${process.env.EXPO_PUBLIC_BASE_URL ?? ""}/qpdf.wasm`;
        const toolkit = await createPdfToolkit({ wasmUrl });
        setPdf(toolkit);
        console.log("PDF toolkit initialized");
      } catch (error) {
        console.error("Failed to initialize PDF toolkit:", error);
        setPdf(null);
      }
    }
    loadData();
  }, [pdf]);

  useEffect(() => {
    if (!functionName || !runId || runId === lastRunRef.current) return;
    if (!pdf || processing) return;
    if (functionName !== "imagesToPdf" && !base64) return;

    lastRunRef.current = runId;

    const executeSelectedFunction = async () => {
      switch (functionName) {
        case "lockPdf":
          await lockPdf(functionData as LockPdfFormData);
          break;
        case "removePassword":
          await removePassword(functionData as RemovePasswordFormData);
          break;
        case "mergePdf":
          await mergePdf();
          break;
        case "splitPdf":
          await splitPdf(functionData as SplitPdfFormData);
          break;
        case "extractPages":
          await extractPages(functionData as PagesFormData);
          break;
        case "rotatePdf":
          await rotatePdf(functionData as RotatePdfFormData);
          break;
        case "deletePages":
          await deletePages(functionData as PagesFormData);
          break;
        case "compressPdf":
          await compressPdf(functionData as CompressPdfFormData);
          break;
        case "imagesToPdf":
          await buildPdfFromImages(functionData as ImagesToPdfFormData);
          break;
        default:
          console.warn(`No PDF function registered for: ${functionName}`);
      }
    };

    executeSelectedFunction();
  }, [runId, functionName, pdf, base64, processing, functionData, base64Files]);

  async function lockPdf(data: LockPdfFormData) {
    if (!pdf || !base64) return;
    try {
      setProcessing(true);
      const inputBytes = base64ToBytes(base64);
      const locked = await pdf.lock(inputBytes, {
        userPassword: data.userPassword,
        ownerPassword: data.ownerPassword,
      });
      onResult(byteArrayToBase64(locked));
    } catch (error) {
      console.error("PDF processing failed:", error);
    } finally {
      setProcessing(false);
    }
  }

  async function removePassword(data: RemovePasswordFormData) {
    if (!pdf || !base64) return;
    try {
      setProcessing(true);
      const inputBytes = base64ToBytes(base64);
      const unlocked = await pdf.removePassword(inputBytes, { password: data.password });
      onResult(byteArrayToBase64(unlocked));
    } catch (error) {
      console.error("PDF processing failed:", error);
    } finally {
      setProcessing(false);
    }
  }

  async function mergePdf() {
    if (!pdf) return;
    const sources = base64Files.length > 0 ? base64Files : base64 ? [base64] : [];
    if (sources.length === 0) return;
    try {
      setProcessing(true);
      const merged = await pdf.merge(sources.map((b64) => base64ToBytes(b64)));
      onResult(byteArrayToBase64(merged));
    } catch (error) {
      console.error("PDF processing failed:", error);
    } finally {
      setProcessing(false);
    }
  }

  async function splitPdf(data: SplitPdfFormData) {
    if (!pdf || !base64) return;
    try {
      setProcessing(true);
      const inputBytes = base64ToBytes(base64);
      const parts = await pdf.split(inputBytes, {
        pagesPerFile: data.pagesPerFile ?? 1,
        password: data.password,
      });
      if (parts.length <= 1) {
        onResult(byteArrayToBase64(parts[0] ?? new Uint8Array()));
      } else {
        onResult(parts.map((part) => byteArrayToBase64(part)));
      }
    } catch (error) {
      console.error("PDF processing failed:", error);
    } finally {
      setProcessing(false);
    }
  }

  async function extractPages(data: PagesFormData) {
    if (!pdf || !base64) return;
    try {
      setProcessing(true);
      const inputBytes = base64ToBytes(base64);
      const extracted = await pdf.extractPages(inputBytes, {
        pages: data.pages,
        password: data.password,
      });
      onResult(byteArrayToBase64(extracted));
    } catch (error) {
      console.error("PDF processing failed:", error);
    } finally {
      setProcessing(false);
    }
  }

  async function rotatePdf(data: RotatePdfFormData) {
    if (!pdf || !base64) return;
    try {
      setProcessing(true);
      const inputBytes = base64ToBytes(base64);
      const rotated = await pdf.rotate(inputBytes, {
        angle: data.angle,
        pages: data.pages,
        password: data.password,
        absolute: data.absolute,
      });
      onResult(byteArrayToBase64(rotated));
    } catch (error) {
      console.error("PDF processing failed:", error);
    } finally {
      setProcessing(false);
    }
  }

  async function deletePages(data: PagesFormData) {
    if (!pdf || !base64) return;
    try {
      setProcessing(true);
      const inputBytes = base64ToBytes(base64);
      const deleted = await pdf.deletePages(inputBytes, {
        pages: data.pages,
        password: data.password,
      });
      onResult(byteArrayToBase64(deleted));
    } catch (error) {
      console.error("PDF processing failed:", error);
    } finally {
      setProcessing(false);
    }
  }

  async function compressPdf(data: CompressPdfFormData) {
    if (!pdf || !base64) return;
    try {
      setProcessing(true);
      const inputBytes = base64ToBytes(base64);
      const compressed = await pdf.compress(inputBytes, {
        password: data.password,
        compressionLevel: data.compressionLevel,
      });
      onResult(byteArrayToBase64(compressed));
    } catch (error) {
      console.error("PDF processing failed:", error);
    } finally {
      setProcessing(false);
    }
  }

  async function buildPdfFromImages(data: ImagesToPdfFormData) {
    if (!data?.imagesBase64?.length) return;
    try {
      setProcessing(true);
      const images = data.imagesBase64.map((b64) => base64ToBytes(b64));
      const out = await imagesToPdf(images, { dpi: data.dpi });
      onResult(byteArrayToBase64(out));
    } catch (error) {
      console.error("Images to PDF failed:", error);
    } finally {
      setProcessing(false);
    }
  }

  return <View />;
}
