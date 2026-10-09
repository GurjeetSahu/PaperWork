# PaperWork

PaperWork is a mobile-first PDF toolkit built with Expo and React Native. It helps users work with PDF documents directly on a phone or tablet, including password protection, page operations, compression, and image-to-PDF conversion.

## Overview

This app is designed for quick document workflows on-device:

- Lock and unlock PDFs
- Merge multiple PDFs
- Split and extract pages
- Rotate and delete pages
- Compress PDF files
- Convert images into a PDF
- Save the output locally and share it to other apps

The project uses the `pdfstudio` WebAssembly PDF engine for processing and stores generated files in the app document directory.

## Tech Stack

- Expo SDK 57
- React Native 0.86
- Expo Router
- TypeScript
- NativeWind
- Gluestack UI
- `pdfstudio` for PDF processing
- `expo-document-picker`, `expo-file-system`, and `expo-sharing`

## Features

### PDF operations

- Lock PDFs with user and owner passwords
- Remove PDF passwords
- Merge multiple selected PDFs in order
- Split a PDF into multiple files
- Extract specific pages
- Rotate pages by angle
- Delete selected pages
- Compress PDF files
- Convert images to a single PDF

### Mobile workflow

- Pick files from the device
- Manage selected PDFs in a local list
- Save processed output to the app documents folder
- Share final files through native share dialogs

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Expo CLI (optional, but available via `npx expo`)
- Android Studio or Xcode for running emulators/simulators

### Install dependencies

```bash
npm install
```

### Run the app

Start the development server:

```bash
npx expo start
```

Then choose one of the available options:

```bash
npm run android
npm run ios
npm run web
```

### Linting

```bash
npm run lint
```

## Project Structure

```text
.
├── android/                 # Android native project
├── ios/                     # iOS native project
├── public/
│   └── qpdf.wasm            # PDF engine WebAssembly asset used by pdfstudio
├── src/
│   ├── app/                 # Expo Router screens
│   ├── components/          # Reusable UI and tool forms
│   ├── types/               # TypeScript models for tool forms
│   └── store/               # App state/store code
├── app.json                 # Expo app config
├── babel.config.js          # Babel config
├── eslint.config.js         # ESLint config
├── metro.config.js          # Metro bundler config
├── package.json             # Scripts and dependencies
├── tailwind.config.js      # Tailwind setup
├── tsconfig.json            # TypeScript config
├── README.md                # Project documentation
└── global.css              # Global styles
```

## Notes

- The app loads the PDF engine from `public/qpdf.wasm`.
- Processed files are saved into the app document directory using `expo-file-system`.
- If you are serving the app from a custom base URL, make sure the `EXPO_PUBLIC_BASE_URL` environment variable is set appropriately for the PDF engine to load correctly.

## Useful Commands

```bash
npm install
npx expo start
npm run android
npm run ios
npm run web
npm run lint
```

## License

This project is currently unlicensed unless you add a license file for your own distribution or publishing workflow.
