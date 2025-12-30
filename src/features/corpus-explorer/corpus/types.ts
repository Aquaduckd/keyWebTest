// Types for corpus loading

export interface CorpusLoader {
  loadPreset(name: string): Promise<string>;
  loadCustom(file: File): Promise<string>;
  listPresets(): Promise<string[]>;
}

