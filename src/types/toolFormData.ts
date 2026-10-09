import type { PageSelection } from "pdfstudio";

export type LockPdfFormData = {
  userPassword: string;
  ownerPassword?: string;
};

export type RemovePasswordFormData = {
  password: string;
};

export type SplitPdfFormData = {
  pagesPerFile?: number;
  password?: string;
};

export type PagesFormData = {
  pages: PageSelection;
  password?: string;
};

export type RotatePdfFormData = {
  angle: 90 | 180 | 270 | -90 | -180 | -270;
  pages?: PageSelection;
  password?: string;
  absolute?: boolean;
};

export type CompressPdfFormData = {
  password?: string;
  compressionLevel?: number;
};

export type ImagesToPdfFormData = {
  /** Base64-encoded JPEG bytes (no data-URL prefix). */
  imagesBase64: string[];
  dpi?: number;
};

export type MergePdfFormData = Record<string, never>;

export type ToolFormData =
  | LockPdfFormData
  | RemovePasswordFormData
  | SplitPdfFormData
  | PagesFormData
  | RotatePdfFormData
  | CompressPdfFormData
  | ImagesToPdfFormData
  | MergePdfFormData;
