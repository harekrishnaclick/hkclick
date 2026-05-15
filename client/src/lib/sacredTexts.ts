export interface SacredVerse {
  id: string;
  label: string;
  lines: string[][];
}

export interface SacredTextConfig {
  key: string;
  title: string;
  subtitle: string;
  route: string;
  storageKey: string;
  icon: string;
  completionText: string;
  completionSub: string;
  verses: SacredVerse[];
}
