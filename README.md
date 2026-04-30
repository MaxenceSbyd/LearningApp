# LearningApp

A small language learning app — Japanese (for me) + French (for my wife, A1–A2).

**Live:** https://maxencesbyd.github.io/LearningApp/

## Features

- 🇫🇷 **French** — A1/A2 vocabulary, basic grammar (gender, pronouns, -er verbs)
- 🇯🇵 **Japanese** — beginner vocabulary, hiragana intro, sentence structure, polite/plain forms
- **Vocabulary** — flashcards with examples and notes
- **Grammar** — rules + the **why** behind them, plus example sentences
- **Quiz** — multiple-choice test at the end of each session, score saved locally

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- React Router (HashRouter for static deploy)
- localStorage for progress
- GitHub Pages via GitHub Actions

## Local development

```bash
bun install
bun dev          # http://localhost:5173
```

## Build

```bash
bun run build    # outputs to dist/
bun run preview  # serves the build locally
```

## Adding content

Edit the language packs directly:

- `src/data/fr.ts` — French vocabulary, grammar lessons, quiz
- `src/data/ja.ts` — Japanese vocabulary, grammar lessons, quiz

Each pack has the same shape (`LanguagePack` in `src/types.ts`). Add items to the
arrays and they'll show up automatically.
