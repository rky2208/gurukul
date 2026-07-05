import type { ChatMessage, Persona, ProviderName, ProviderStatusMap } from "../../../types";

export interface ChatPanelProps {
  persona: Persona;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  chatDisabled?: boolean;
  providers: ProviderStatusMap;
  provider: ProviderName | null;
  onProviderChange: (provider: ProviderName) => void;
}
