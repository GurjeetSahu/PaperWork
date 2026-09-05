"use dom";
import { createPdfToolkit } from "pdfstudio";

export default async function MyComponent() {
  const pdf = await createPdfToolkit();
  return (
    <div>
      <h1>Hello, {}</h1>
    </div>
  );
}
