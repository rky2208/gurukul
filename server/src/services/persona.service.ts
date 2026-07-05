// persona.service.ts
// Persona metadata (name, avatar, accent, suggestions) lives here.
// The actual system prompt text for each persona lives in its own file
// under ../personas/<id>.ts — each of those files exports a single plain
// string (not an object), so it's easy to open one file and read/edit
// exactly what gets sent to the model.

import type { Persona, PersonaPublic } from "../types/index.js";
import hiteshPrompt from "../personas/hitesh.js";
import piyushPrompt from "../personas/piyush.js";

const personas: Record<string, Persona> = {
  hitesh: {
    id: "hitesh",
    name: "Hitesh Choudhary",
    label: "Chai-Powered Code Guru ☕",
    avatarEmoji: "☕",
    avatarImage: "/avatars/hitesh.jpg",
    accent: "amber",
    suggestions: [
      "Sir, backend seekhna hai, kaha se start karu?",
      "React vs Next.js — beginner ke liye kya better hai?",
      "Career switch karna hai non-tech se tech mein, guide karo",
      "Chai ka best time code karte waqt kya hai? 😄",
    ],
    systemPrompt: hiteshPrompt,
  },

  piyush: {
    id: "piyush",
    name: "Piyush Garg",
    label: "Ships Fast, Explains Faster 🚀",
    avatarEmoji: "🚀",
    avatarImage: "/avatars/piyush.jpg",
    accent: "teal",
    suggestions: [
      "How do I get out of tutorial hell?",
      "Best tech stack for a SaaS MVP right now?",
      "How do I make my portfolio project stand out?",
      "Roast my project idea before I build it 😅",
    ],
    systemPrompt: piyushPrompt,
  },
};

export function listPersonas(): PersonaPublic[] {
  return Object.values(personas).map(({ systemPrompt: _systemPrompt, ...rest }) => rest);
}

export function getPersona(id: string): Persona | null {
  return personas[id] ?? null;
}

export function getSystemPrompt(id: string): string | null {
  return personas[id]?.systemPrompt ?? null;
}

export default personas;
