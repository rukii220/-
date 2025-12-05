export interface PersonaSettings {
  myPersona: string;
  targetPersona: string;
  relationship: string;
}

export enum ResponseType {
  STANDARD = 'Standard',
  INTENSE = 'Intense',
  SHORT = 'Short',
}

export interface GeneratedOption {
  type: ResponseType;
  content: string;
  label: string; // e.g. "完美符合人设", "情绪更强烈"
  explanation?: string; // Optional reasoning
}

export interface GenerationResult {
  options: GeneratedOption[];
}
