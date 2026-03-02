export type Story = {
  id: string;
  title: string;
  emoji: string;
  color: string;
  pages: StoryPage[];
};

export type StoryPage = {
  text: string;
  sceneEmoji: string;
};

export const STORIES: Story[] = [
  {
    id: 'the-red-ball',
    title: 'The Red Ball',
    emoji: '🔴',
    color: '#FF6B6B',
    pages: [
      { text: 'Sam has a red ball.', sceneEmoji: '👦🔴' },
      { text: 'Sam can toss the ball up.', sceneEmoji: '👦⬆️🔴' },
      { text: 'The ball goes up, up, up!', sceneEmoji: '🔴🔴🔴' },
      { text: 'The ball comes back down.', sceneEmoji: '⬇️🔴' },
      { text: 'Sam got the ball. Yay!', sceneEmoji: '👦🎉🔴' },
    ],
  },
  {
    id: 'the-big-dog',
    title: 'The Big Dog',
    emoji: '🐶',
    color: '#A8E063',
    pages: [
      { text: 'I see a big dog.', sceneEmoji: '👧🐶' },
      { text: 'The big dog wags its tail.', sceneEmoji: '🐶💛' },
      { text: 'The dog can jump!', sceneEmoji: '🐶⬆️' },
      { text: 'I pat the dog.', sceneEmoji: '👧🤝🐶' },
      { text: 'The dog is my friend.', sceneEmoji: '👧❤️🐶' },
    ],
  },
  {
    id: 'the-yellow-sun',
    title: 'The Yellow Sun',
    emoji: '☀️',
    color: '#FFC300',
    pages: [
      { text: 'The sun comes up.', sceneEmoji: '🌅' },
      { text: 'It is a big, hot sun.', sceneEmoji: '☀️🔥' },
      { text: 'We go out to play.', sceneEmoji: '👧👦🌳' },
      { text: 'We run and jump and hop!', sceneEmoji: '🏃💨' },
      { text: 'The sun makes us happy.', sceneEmoji: '😊☀️😊' },
    ],
  },
  {
    id: 'the-little-fish',
    title: 'The Little Fish',
    emoji: '🐟',
    color: '#56CCF2',
    pages: [
      { text: 'A little fish swims in the sea.', sceneEmoji: '🐟🌊' },
      { text: 'The fish swims up.', sceneEmoji: '🐟⬆️' },
      { text: 'The fish swims down.', sceneEmoji: '🐟⬇️' },
      { text: 'The fish sees a friend!', sceneEmoji: '🐟👀🐠' },
      { text: 'They swim together. The end!', sceneEmoji: '🐟🐠❤️' },
    ],
  },
  {
    id: 'my-cat-nap',
    title: 'My Cat Nap',
    emoji: '😴',
    color: '#6C63FF',
    pages: [
      { text: 'My cat is fat.', sceneEmoji: '🐱' },
      { text: 'My cat sat on a mat.', sceneEmoji: '🐱🟫' },
      { text: 'My cat had a nap.', sceneEmoji: '🐱😴' },
      { text: 'I sat by my cat.', sceneEmoji: '👧🐱' },
      { text: 'We had a nap on the mat!', sceneEmoji: '👧😴🐱' },
    ],
  },
];
