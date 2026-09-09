/** Hand-written types for the Emscripten-generated qpdf glue module. */

export interface QpdfFS {
  writeFile(path: string, data: Uint8Array): void;
  readFile(path: string, opts?: { encoding?: 'binary' }): Uint8Array;
  readdir(path: string): string[];
  mkdir(path: string): void;
  unlink(path: string): void;
  rmdir(path: string): void;
  analyzePath(path: string): { exists: boolean };
  /** Redirect stdio at the byte level; must be called during preRun. */
  init(
    input: (() => number | null) | null,
    output: ((byte: number | null) => void) | null,
    error: ((byte: number | null) => void) | null,
  ): void;
}

export interface QpdfModule {
  callMain(args: string[]): number;
  FS: QpdfFS;
}

export interface QpdfModuleInit {
  print?(text: string): void;
  printErr?(text: string): void;
  locateFile?(path: string, prefix: string): string;
  /** Callbacks run during module startup, after FS exists but before main. */
  preRun?: Array<() => void>;
}

declare function createQpdfModule(init?: QpdfModuleInit): Promise<QpdfModule>;
export default createQpdfModule;
