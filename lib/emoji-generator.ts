// Pool of emojis to use
const EMOJI_POOL = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
  '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
  '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
  '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
  '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
  '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓',
  '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺',
  '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣',
  '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈',
  '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾',
  '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿',
  '😾', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨',
  '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤',
];

export function generateGameEmojis(): {
  allThreeEmojis: string[];
  missingEmoji: string;
  displayEmojis: string[];
} {
  // Shuffle and pick 3 unique emojis
  const shuffled = [...EMOJI_POOL].sort(() => Math.random() - 0.5);
  const allThreeEmojis = shuffled.slice(0, 3);

  // Pick one to be missing
  const missingIndex = Math.floor(Math.random() * 3);
  const missingEmoji = allThreeEmojis[missingIndex];

  // Create array of 50 emojis with only 2 of the 3 present
  const presentEmojis = allThreeEmojis.filter((_, i) => i !== missingIndex);
  const otherEmojis = shuffled.slice(3);

  const displayEmojis: string[] = [];

  // Add the 2 present emojis
  displayEmojis.push(presentEmojis[0], presentEmojis[1]);

  // Fill rest with random emojis from pool (excluding all 3 game emojis)
  while (displayEmojis.length < 50) {
    const randomEmoji = otherEmojis[Math.floor(Math.random() * otherEmojis.length)];
    displayEmojis.push(randomEmoji);
  }

  // Shuffle display emojis
  displayEmojis.sort(() => Math.random() - 0.5);

  return {
    allThreeEmojis,
    missingEmoji,
    displayEmojis,
  };
}

// Fisher-Yates shuffle with seeded random
function seededShuffle<T>(array: T[], random: () => number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Create a seeded random number generator
function createSeededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  // Make sure we start with a positive number
  hash = Math.abs(hash);

  return () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return hash / 0x7fffffff;
  };
}

export function generateSeededGameEmojis(seed: string, round: number = 1): {
  allThreeEmojis: string[];
  missingEmoji: string;
  displayEmojis: string[];
} {
  // Include round number in the seed to get different games per round
  const fullSeed = `${seed}-round-${round}`;
  const seededRandom = createSeededRandom(fullSeed);

  // Shuffle emoji pool using Fisher-Yates (consistent results)
  const shuffled = seededShuffle(EMOJI_POOL, seededRandom);
  const allThreeEmojis = shuffled.slice(0, 3);

  // Pick one to be missing
  const missingIndex = Math.floor(seededRandom() * 3);
  const missingEmoji = allThreeEmojis[missingIndex];

  // Get the two present emojis
  const presentEmojis = allThreeEmojis.filter((_, i) => i !== missingIndex);
  const otherEmojis = shuffled.slice(3);

  // Build display emojis array
  const displayEmojis: string[] = [];

  // Add the 2 present emojis
  displayEmojis.push(presentEmojis[0], presentEmojis[1]);

  // Fill rest with random emojis from pool (excluding all 3 game emojis)
  while (displayEmojis.length < 50) {
    const idx = Math.floor(seededRandom() * otherEmojis.length);
    displayEmojis.push(otherEmojis[idx]);
  }

  // Shuffle display emojis
  const shuffledDisplay = seededShuffle(displayEmojis, seededRandom);

  return {
    allThreeEmojis,
    missingEmoji,
    displayEmojis: shuffledDisplay,
  };
}
