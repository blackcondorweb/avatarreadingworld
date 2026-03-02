# 📱 Kids Reading App — Project Plan

## 🎯 Goals
A fun, highly interactive mobile app for a **kindergartener (age ~5–6)** to build foundational reading skills through play — inspired by the colorful, tactile, character-driven world of **Toca Boca / Avatar World**. Every tap, swipe and press should feel alive with sound, animation and personality.

---

## 🎨 Theme & Visual Style — Toca Boca / Avatar World Inspired

- **Bold, flat, chunky cartoon art** — bright saturated colors, thick outlines
- **A cast of cute customizable characters** (the child picks their avatar at first launch)
- **Interactive world map** as the home screen — tap a location (school, playground, library, treehouse) to enter each activity
- **Everything reacts to touch** — wiggling, bouncing, giggling sounds on every tap
- **No reading required to navigate** — icons + audio guide the child through all menus
- **Confetti, stars, and character celebrations** on every win

---

## 👧 Target User
| Detail | Value |
|---|---|
| Age | ~5–6 years old |
| Grade | Kindergarten |
| Reading Level | Beginning reader — letter recognition, phonics, simple CVC words, sight words |
| Device use | Independent (no parent needed to operate) |
| Connectivity | **Fully offline** — all assets bundled in app |
| Login | None — single child profile, no accounts |

---

## 📚 Core Features (by phase)

### Phase 1 — Letters & Sounds
- **Alphabet World** 🔤 — a big colorful grid of letters; tap a letter to hear its sound, see it animate, and meet a character whose name starts with that letter (A = Ava the Alligator 🐊)
- **Letter Tracing** ✏️ — trace uppercase and lowercase letters with your finger; character cheers when done correctly
- **Phonics Sounds** 🔊 — hear the sound, tap the matching letter from 3 choices

### Phase 2 — Words
- **Word Builder** 🧩 — drag letter tiles to build simple 3-letter CVC words (cat, dog, sun, hat); character acts out the word when complete
- **Sight Word Flashcards** 👁️ — Dolch kindergarten sight words (the, and, is, it, a, I, see, we…) shown with audio + picture
- **Match the Word** 🖼️ — tap the word that matches the picture shown (3 choices)

### Phase 3 — Reading
- **Story Corner** 📖 — 5–10 short illustrated stories (4–6 pages each); word-by-word highlighting as the story is read aloud; child can tap any word to hear it again
- **Rhyme Time** 🎵 — hear a word, pick the rhyming match from pictures (cat → hat)

### Phase 4 — Rewards & Motivation
- **Star Collector** ⭐ — earn stars for completing activities; stars fill up a jar on the world map
- **Character Unlock** 🧑‍🎤 — unlock new avatar accessories (hats, clothes, pets) as stars are collected
- **Celebration Moments** 🎉 — big confetti + dancing character animation after each completed activity

---

## 🛠️ Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **React Native + Expo** | Cross-platform iOS + Android, fast iteration |
| Language | **TypeScript** | Type safety, maintainability |
| Audio | `expo-av` | Letter/word/celebration sounds — all bundled locally |
| Animations | `react-native-reanimated` + `Lottie` | Bouncy, delightful Toca Boca-style animations |
| Navigation | `expo-router` | File-based routing, simple screen management |
| Storage | `AsyncStorage` | Save stars, progress, avatar choice — fully offline |
| Fonts | `expo-font` — rounded playful font (e.g. Fredoka One, Nunito) | Child-friendly, easy to read |
| Offline | All audio, images & Lottie JSON **bundled in app** | Zero network dependency |
| Gestures | `react-native-gesture-handler` | Drag-and-drop for word builder, letter tracing |

---

## 🗺️ World Map — Home Screen Layout

```
🏡 Home World Map
├── 🏫 School House      → Alphabet World + Phonics
├── 🧩 Puzzle Corner     → Word Builder + Sight Words
├── 📚 Story Library     → Story Reader
├── 🎮 Game Zone         → Rhyme Time + Match the Word
└── ⭐ Trophy Room       → Stars + Unlocked accessories
```

---

## 🗂️ App Screen Structure

```
app/
├── index.tsx                  → Avatar selection (first launch) / World Map
├── alphabet/
│   ├── index.tsx              → Letter grid
│   └── [letter].tsx           → Individual letter screen (sound + tracing)
├── phonics/
│   └── index.tsx              → Phonics sound quiz
├── words/
│   ├── builder.tsx            → CVC word builder drag game
│   ├── sightwords.tsx         → Sight word flashcards
│   └── match.tsx              → Word-to-picture matching
├── stories/
│   ├── index.tsx              → Story selection shelf
│   └── [story].tsx            → Story reader with audio
├── games/
│   └── rhyme.tsx              → Rhyme Time game
├── rewards/
│   └── index.tsx              → Stars jar + unlockable accessories
└── _layout.tsx                → Root layout + font/audio loading
```

---

## ✅ Development Roadmap

| Step | Task | Status |
|---|---|---|
| 1 | Scaffold Expo + TypeScript project | ⬜ Not started |
| 2 | Build World Map home screen with interactive locations | ⬜ Not started |
| 3 | Avatar picker (first-launch character selection) | ⬜ Not started |
| 4 | Build Alphabet World screen with letter grid | ⬜ Not started |
| 5 | Individual letter screen — sound + animation + tracing | ⬜ Not started |
| 6 | Phonics quiz (hear sound → tap letter) | ⬜ Not started |
| 7 | CVC Word Builder drag-and-drop game | ⬜ Not started |
| 8 | Sight Word Flashcards | ⬜ Not started |
| 9 | Word-to-picture matching game | ⬜ Not started |
| 10 | Story Reader with audio + word highlighting | ⬜ Not started |
| 11 | Rhyme Time game | ⬜ Not started |
| 12 | Star reward system + character accessory unlocks | ⬜ Not started |
| 13 | Bundle all audio/image assets for offline use | ⬜ Not started |
| 14 | Polish animations, sounds & UI | ⬜ Not started |
| 15 | Test on real device (iOS + Android) | ⬜ Not started |
| 16 | Publish to App Store / Google Play | ⬜ Not started |

---

## ✅ Decisions Made
- ✅ Age: Kindergarten (~5–6 years old)
- ✅ Theme: Toca Boca / Avatar World style
- ✅ Fully interactive — every element responds to touch
- ✅ Works fully offline — all assets bundled
- ✅ No parent login required
- ✅ Platform: Android (primary), iOS later
- ✅ Framework: Expo (React Native + TypeScript)

---

## 📝 Notes

_Add notes here as the project progresses._

---

## 📝 Notes

_Add notes here as the project progresses._
