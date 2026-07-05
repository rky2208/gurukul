export interface PromptChipsProps {
  suggestions: string[];
  onPick: (text: string) => void;
  accent?: string;
  disabled?: boolean;
}
