# LumenNotes

A modern, cross-platform note-taking app built with Expo and React Native. LumenNotes focuses on simplicity, elegant design, and an offline-first experience.

## Overview

- **Platforms**: iOS, Android, Web (Expo)
- **Routing**: Expo Router (file-based)
- **Language**: TypeScript
- **Storage**: AsyncStorage (local, offline-first)

## Features

- Create, update, soft-delete, restore, and duplicate notes
- Pin and favorite important notes
- Search across title, content, tags, and category
- Filter by category and tags; optional pinned-only view
- Sort by created/updated date or title (asc/desc)

## Tech Stack

- Expo `~54.0.1`, React `19.1.0`, React Native `0.81.4`
- Expo Router `~6.0.0`
- `@react-native-async-storage/async-storage` for persistence
- `@expo/vector-icons` for icons
- React Context + `useReducer` for state

## Project Structure

```
LumenNotes/
├─ app/                 # Expo Router pages & layouts
│  └─ (tabs)/
│     └─ _layout.tsx
├─ components/
│  └─ notes/
│     ├─ note-card.tsx
│     └─ search-bar.tsx
├─ context/
│  └─ notes-context.tsx
├─ services/
│  └─ notes-service.ts
├─ constants/
├─ types/
│  └─ note.ts
├─ utils/
├─ PLAN.md
└─ package.json
```

## Getting Started

1) Install dependencies

```bash
npm install
```

2) Start the dev server

```bash
npm run start
# or
npx expo start
```

3) Open the app from the Expo CLI UI on:
- Development build
- Android emulator
- iOS simulator (macOS)
- Expo Go (limited sandbox)

> Windows users: Ensure Android SDK/emulator is installed for local Android runs.

## NPM Scripts

- `npm run start` — Start the Expo dev server
- `npm run android` — Launch on Android
- `npm run ios` — Launch on iOS (macOS required)
- `npm run web` — Run the web build
- `npm run lint` — Lint with Expo config
- `npm run reset-project` — Reset the starter app structure

## Development Notes

- State is provided via `NotesProvider` with actions like `createNote`, `updateNote`, `deleteNote`, `togglePinNote`, `toggleFavoriteNote`, `duplicateNote`, plus search/filter/sort helpers.
- Notes are persisted with AsyncStorage; keys live under `constants/storage-keys.ts`.
- Theming utilities live under `constants/theme.ts` and are used by UI components in `components/`.

## Building

For production builds, use EAS (optional):

```bash
eas build -p android
# or
eas build -p ios
```

## License

MIT License

Copyright (c) 2023 Yassen Ibrahim

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
