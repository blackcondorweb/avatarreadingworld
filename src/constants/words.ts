export type CVCWord = {
  word: string;
  letters: string[];
  emoji: string;
};

export const CVC_WORDS: CVCWord[] = [
  { word: 'cat', letters: ['c', 'a', 't'], emoji: '🐱' },
  { word: 'dog', letters: ['d', 'o', 'g'], emoji: '🐶' },
  { word: 'sun', letters: ['s', 'u', 'n'], emoji: '☀️' },
  { word: 'hat', letters: ['h', 'a', 't'], emoji: '🎩' },
  { word: 'bus', letters: ['b', 'u', 's'], emoji: '🚌' },
  { word: 'pig', letters: ['p', 'i', 'g'], emoji: '🐷' },
  { word: 'fox', letters: ['f', 'o', 'x'], emoji: '🦊' },
  { word: 'hen', letters: ['h', 'e', 'n'], emoji: '🐔' },
  { word: 'cup', letters: ['c', 'u', 'p'], emoji: '☕' },
  { word: 'bed', letters: ['b', 'e', 'd'], emoji: '🛏️' },
  { word: 'map', letters: ['m', 'a', 'p'], emoji: '🗺️' },
  { word: 'log', letters: ['l', 'o', 'g'], emoji: '🪵' },
];

export const SIGHT_WORDS = [
  { word: 'the', emoji: '📖' },
  { word: 'and', emoji: '🔗' },
  { word: 'is', emoji: '✨' },
  { word: 'it', emoji: '👆' },
  { word: 'a', emoji: '🅰️' },
  { word: 'I', emoji: '🙋' },
  { word: 'see', emoji: '👀' },
  { word: 'we', emoji: '👫' },
  { word: 'to', emoji: '➡️' },
  { word: 'can', emoji: '✅' },
  { word: 'go', emoji: '🏃' },
  { word: 'my', emoji: '💛' },
  { word: 'up', emoji: '⬆️' },
  { word: 'in', emoji: '📦' },
  { word: 'at', emoji: '📍' },
  { word: 'me', emoji: '😊' },
  { word: 'on', emoji: '🔛' },
  { word: 'he', emoji: '👦' },
  { word: 'she', emoji: '👧' },
  { word: 'for', emoji: '🎁' },
];

export type RhymePair = {
  word: string;
  emoji: string;
  rhymeGroup: string;
};

export const RHYME_PAIRS: RhymePair[] = [
  { word: 'cat', emoji: '🐱', rhymeGroup: 'at' },
  { word: 'hat', emoji: '🎩', rhymeGroup: 'at' },
  { word: 'bat', emoji: '🦇', rhymeGroup: 'at' },
  { word: 'dog', emoji: '🐶', rhymeGroup: 'og' },
  { word: 'log', emoji: '🪵', rhymeGroup: 'og' },
  { word: 'frog', emoji: '🐸', rhymeGroup: 'og' },
  { word: 'sun', emoji: '☀️', rhymeGroup: 'un' },
  { word: 'bun', emoji: '🍞', rhymeGroup: 'un' },
  { word: 'run', emoji: '🏃', rhymeGroup: 'un' },
  { word: 'cake', emoji: '🎂', rhymeGroup: 'ake' },
  { word: 'lake', emoji: '🏞️', rhymeGroup: 'ake' },
  { word: 'snake', emoji: '🐍', rhymeGroup: 'ake' },
];
