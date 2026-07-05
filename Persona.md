# Gurukul — Persona Design & Prompt Engineering Documentation

This document explains how the two AI gurus in Gurukul (**Hitesh Choudhary** and **Piyush Garg**) were
designed: where their persona data comes from, how their prompts are engineered, how conversational
context is managed across the client/server boundary, and sample conversations that show the two voices
side by side.

It reflects what's actually implemented in this repo:
- `server/src/personas/hitesh.ts`, `server/src/personas/piyush.ts` — the system prompts
- `server/src/services/persona.service.ts` — persona metadata
- `server/src/services/chat.service.ts` — context assembly + response parsing
- `server/src/providers/*.provider.ts` — per-LLM message formatting
- `server/src/middleware/validate.ts`, `server/src/config/env.ts` — limits and guardrails

---

## 1. How the persona data was collected and prepared

Gurukul is a **fan-made, clearly-labeled learning project** — it does not use any private data about
either individual, and it isn't affiliated with or endorsed by them. That constraint shaped how persona
data was gathered:

**What was used (public, observable teaching style only):**
- Public channel/brand identity — Hitesh's *"Chai aur Code"* channel and chaicode.com; Piyush's
  build-along tutorial channel and piyushgarg.dev.
- Widely-known, publicly stated teaching philosophy (e.g. Hitesh's fundamentals-first, patient,
  Hinglish mentoring style; Piyush's fast, project-first, ship-it energy).
- Public avatar images already hosted on each person's own site (`chaicode.com`, `piyushgarg.dev`),
  linked directly rather than copied/stored, so the app always reflects their current public photo.

**What was deliberately excluded:**
- No scraped video transcripts, no private communications, no biographical claims that aren't public
  knowledge, no "as told to" quotes attributed to the real people.
- No fabricated personal/relationship/life-event details. The prompts explicitly forbid inventing
  private claims about the real individuals.

**Preparation process, per persona:**
1. **Distill the public voice into structured fields** — background summary, tone & voice traits,
   and 2–3 recurring verbal habits (e.g. Hitesh's chai metaphors and Hinglish; Piyush's emoji-punctuated,
   checklist-driven replies).
2. **Separate identity from presentation.** Everything a component needs to *render* a persona (name,
   label, emoji, avatar URL, accent color, starter-prompt chips) lives in `persona.service.ts` as plain
   metadata. Everything that defines how the model *talks* lives in its own prompt file
   (`personas/hitesh.ts` / `personas/piyush.ts`), which is a single exported string — deliberately not
   wrapped in an object — so a contributor can open one file and read (or edit) exactly what gets sent
   to the LLM, with nothing else mixed in.
3. **Write few-shot examples by hand**, in the target output format (see §2), rather than pulling real
   quotes — they demonstrate the *style*, not a transcript of anything either person actually said.
4. **Bake the ethical guardrails into the prompt text itself** (not just into app copy), so every
   provider/model that reads the system prompt sees the same disclaimer and boundary, regardless of
   which LLM answers:

   > *"You are an AI persona created as a fan-made, clearly-labeled learning project — not the real
   > person... Never invent private/personal claims about the real individual."*

5. **Keep the system prompt server-only.** The `Persona` type carries `systemPrompt`; the client only
   ever receives `PersonaPublic` (`Omit<Persona, "systemPrompt">`) from `GET /api/personas` — the full
   prompt text (including the few-shot examples) never reaches the browser.

---

## 2. Prompt engineering strategy

Each persona file follows the same four-part template, in this order:

```
1. Guardrail preamble   — fan-project disclaimer, no private claims, stay in the teaching domain
2. Persona description  — who they are, background, what they're known for
3. Tone & voice         — a short bullet list of concrete, repeatable speech habits
4. Response format      — a strict <thinking>/<answer> contract
5. Few-shot examples    — 3 worked Q&A pairs, written in that exact format
```

**Why `<thinking>` / `<answer>` tags.** Every reply is required to start with a few sentences of
private reasoning ("how would this persona approach this specific question") before the in-character
answer:

```
<thinking>
2-4 sentences of private reasoning about how {persona} would approach this specific question —
consider the asker's likely level, what {persona} usually emphasizes, and the most useful angle.
</thinking>
<answer>
The actual in-character reply...
</answer>
```

This buys two things:
- **A lightweight chain-of-thought.** Asking the model to plan in-character *before* answering tends to
  produce more consistent, on-persona replies than asking for the answer directly — the persona's
  priorities get made explicit first.
- **An optional debug view.** `chat.service.ts` parses out both blocks with `parseChainOfThought()`
  (via `<thinking>...</thinking>` / `<answer>...</answer>` regex matches). The `thinking` block is only
  returned to the client when the request sets `showThinking: true` — surfaced in the UI via the
  dev-only "show thinking" toggle in `ChatPanel`. End users never see it unless that flag is on; the
  answer is always shown.
- **Graceful degradation.** If a model doesn't follow the tag format exactly, `parseChainOfThought()`
  strips any stray `<thinking>` tag and falls back to using the raw output as the answer — a
  malformed response never breaks the chat.

**Why few-shot examples, not just a description.** The tone bullet list alone ("uses chai metaphors",
"high-energy, uses emojis") is a description a model can drift from over a long conversation. The
three worked examples per persona pin down *both* the voice *and* the exact `<thinking>/<answer>`
structure simultaneously, so the model has a concrete pattern to match rather than an abstract
instruction to interpret.

**Model settings.** All three providers (`openai.provider.ts`, `anthropic.provider.ts`,
`gemini.provider.ts`) default `temperature` to `0.8` — high enough for natural, non-repetitive
personality, low enough to stay coherent and on-topic for an educational tool.

**Provider-agnostic by design.** The persona prompt itself has zero provider-specific content — it's
just a system-prompt string. Formatting it for OpenAI's `system` role, Anthropic's `system` param, or
Gemini's `systemInstruction` is handled entirely inside each provider adapter (§3), so the same prompt
text produces a consistent persona regardless of which LLM answers, and a switch between providers in
the UI never requires touching the prompt.

---

## 3. Context management approach

Context is deliberately **stateless on the server and short-lived on the client** — there's no
database, no session store, and no server memory of a conversation between requests.

**Where history lives:**
- The browser is the source of truth. `usePersistedMessages()` keeps a `Record<personaId, ChatMessage[]>`
  in React state and mirrors it to `localStorage` under the key `gurukul:messages:v1` on every change
  (best-effort — a private-browsing tab or full storage quota degrades to "history doesn't survive a
  refresh," never to a crash).
- History is **kept per persona**, not globally. Switching from Hitesh to Piyush shows Piyush's own
  thread — the two never bleed into each other, and the model for one guru never sees turns addressed
  to the other.

**What travels to the server, and what happens to it there:**
1. On send, the client posts the *entire* stored history for that persona plus the new message to
   `POST /api/chat`.
2. `middleware/validate.ts` caps this at the door regardless of what the client sends: `history` max
   40 entries, each `content` max 4000 characters, `message` max 4000 characters — defense against a
   tampered or runaway client inflating LLM cost.
3. `chat.service.ts` then trims further for the model call itself: **only the last ~10 turns** are
   forwarded to the LLM (`history.slice(-10)`), deliberately keeping prompts small for this MVP rather
   than sending an ever-growing transcript. The system prompt (full persona definition) is re-sent in
   full on *every* request — there's no persistent thread on the provider's side, so persona identity
   has to travel with each call.
4. The new user message is appended after the trimmed history, and that combined array — never the
   full untrimmed client history — is what actually reaches the model.

**Reconciling three different provider APIs behind one interface.** `ProviderChatParams` gives every
provider the same shape (`systemPrompt`, `messages`, `temperature`, `signal`), but each adapter has to
translate it to that provider's own history format:
- **OpenAI** — flattens straight to a `messages` array with an injected `{ role: "system", ... }` entry
  in front.
- **Anthropic** — passes `systemPrompt` via the dedicated `system` param, and `messages` as-is
  (Claude's Messages API already expects alternating user/assistant turns).
- **Gemini** — needs the odd one out: `systemInstruction` is passed when creating the model, and the
  history has to be split — everything *except* the newest message becomes `startChat({ history })`,
  while the newest message is sent separately via `sendMessage()`. This split is handled entirely
  inside `gemini.provider.ts` so `chat.service.ts` never needs to know about it.

**Timeouts, on both ends.** A hung LLM call is bounded from two directions: `chat.service.ts` wraps
every provider call in `withTimeout(..., env.LLM_TIMEOUT_MS)` (default 30s) and turns a timeout into a
clean `504`-style `ChatServiceError` instead of hanging; independently, the client's own `sendMessage()`
aborts after `CHAT_TIMEOUT_MS` (35s) via `AbortController`, so the UI never waits forever even if the
server-side timeout somehow didn't fire.

**Net effect:** conversational continuity is an illusion maintained entirely by the client replaying a
capped window of recent turns alongside a freshly-sent persona definition — which keeps the server
trivially horizontally-scalable (any instance can handle any request) at the cost of the model only
ever "remembering" the last ~10 exchanges.

---

## 4. Sample conversations demonstrating both personas

### Shipped examples (from the actual system prompts)

These are the few-shot examples baked into each persona's prompt file — they're what the model itself
is shown as its calibration examples, so they're the most literal illustration of each voice.

**Hitesh Choudhary** (`personas/hitesh.ts`)

> **User:** Sir, mujhe coding boring lagti hai, kya karu?
>
> **Hitesh:** Haanji, ye feeling bilkul normal hai — jab tak sirf theory padhoge, boring hi lagega. Ek
> chota sa project uthao jo tumhe khud use karna ho, jaise ek to-do app ya expense tracker. Jab code se
> kuch real bante dikhta hai na, tab maza aana start hota hai. Chai banao, 30 min do isko roz, dekhna
> momentum khud aa jayega.

**Piyush Garg** (`personas/piyush.ts`)

> **User:** Bhai I'm stuck in tutorial hell, what do I do?
>
> **Piyush:** Classic trap 🔥 — the fix is simple but uncomfortable: close the tutorial and build
> something small WITHOUT one. Pick a project you can finish in a weekend, like a link-shortener or a
> notes app. You'll get stuck, google specific errors instead of watching a full course, and that's
> exactly how real skill builds. Tutorials teach you to follow; projects teach you to think.

Two more shipped examples per persona (career/tech-opinion territory) live in the same files and follow
the identical `<thinking>/<answer>` pattern.

### Additional illustrative exchanges (same question, both personas)

Written fresh for this document — not part of the shipped prompts — to show how differently the two
gurus handle the *exact same* question, which is the clearest way to see the persona design working:

**Q: "Is it worth learning TypeScript, or is plain JavaScript enough?"**

> **Hitesh:**
> <br>*(thinking: fundamentals-first framing, gentle, ties it back to what problem TS actually solves rather than hype)*
> <br>Dekho, JavaScript se kaam chal jayega, especially chhote projects mein — but jaise hi project
> bada hota hai, ya team mein kaam karna padta hai, TypeScript bahut time bachata hai kyunki bugs
> compile time pe hi pakad leta hai, runtime tak nahi jaate. Meri salah rahegi: JS ke fundamentals pehle
> pakka karo, phir TypeScript seekhna sirf naya syntax lagega, naya language nahi. Chai ke saath dono
> comfortable ho jayenge, patience rakho.

> **Piyush:**
> <br>*(thinking: direct recommendation, industry-reality framing, push toward adopting it now rather than "eventually")*
> <br>Just learn TS now, honestly 🚀 — almost every serious job/project uses it in 2026, and retrofitting
> types onto a JS codebase later is way more painful than starting with them. You don't need to be a
> types wizard on day one; just add basic types as you go and let it flag mistakes for you. Two weeks
> in you'll wonder how you ever shipped anything without autocomplete catching your typos.

**Q: "Should I build a personal portfolio site or focus only on projects?"**

> **Hitesh:**
> <br>Portfolio site zaroor banao, lekin usse project samajh kar banao, decoration nahi. Ismein apna
> journey dikhao — kya seekha, kya struggle hua, kya bana. Recruiters ko genuine growth story attract
> karti hai, sirf flashy design nahi. Aur haan, apna khud ka domain lelo, chhota investment hai lekin
> professional impression deta hai.

> **Piyush:**
> <br>Do both, but in the right order 💡 — ship 2-3 solid projects first, THEN build the portfolio
> around them, not before. An empty portfolio with pretty animations impresses nobody. Once you have
> real projects with live demos, the portfolio site becomes a 20-minute wrapper around work that
> already speaks for itself.

Notice the consistent, structural differences across every example: Hitesh answers in Hinglish with a
patient, fundamentals-first arc and a closing encouragement; Piyush answers mostly in English, opens
with a blunt take, and closes with a concrete, slightly contrarian action item — exactly the tone & voice
rules each persona file specifies.
