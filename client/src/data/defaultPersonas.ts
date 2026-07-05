// defaultPersonas.ts
// Fallback persona metadata used ONLY when the backend can't be reached
// (e.g. server isn't running). This keeps the sidebar, avatars, and prompt
// chips fully functional offline — only the actual chat reply (which needs
// the server + an LLM key) will fail, with a clear error shown in-chat.
//
// This mirrors server/src/services/persona.service.ts metadata but
// intentionally does not include any system prompt text — prompts are
// server-only.

import type { Persona } from "../types";

const defaultPersonas: Persona[] = [
  {
    id: "hitesh",
    name: "Hitesh Choudhary",
    label: "Chai-Powered Code Guru ☕",
    avatarEmoji: "☕",
    accent: "amber",
    suggestions: [
      "Sir, backend seekhna hai, kaha se start karu?",
      "React vs Next.js — beginner ke liye kya better hai?",
      "Career switch karna hai non-tech se tech mein, guide karo",
      "Chai ka best time code karte waqt kya hai? 😄",
    ],
  },
  {
    id: "piyush",
    name: "Piyush Garg",
    label: "Ships Fast, Explains Faster 🚀",
    avatarEmoji: "🚀",
    accent: "teal",
    suggestions: [
      "How do I get out of tutorial hell?",
      "Best tech stack for a SaaS MVP right now?",
      "How do I make my portfolio project stand out?",
      "Roast my project idea before I build it 😅",
    ],
  },
];

export default defaultPersonas;
