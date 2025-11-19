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

export function generateSeededGameEmojis(seed: string): {
  allThreeEmojis: string[];
  missingEmoji: string;
  displayEmojis: string[];
} {
  // Simple seeded random for daily consistency
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }

  const seededRandom = () => {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };

  const shuffled = [...EMOJI_POOL].sort(() => seededRandom() - 0.5);
  const allThreeEmojis = shuffled.slice(0, 3);

  const missingIndex = Math.floor(seededRandom() * 3);
  const missingEmoji = allThreeEmojis[missingIndex];

  const presentEmojis = allThreeEmojis.filter((_, i) => i !== missingIndex);
  const otherEmojis = shuffled.slice(3);

  const displayEmojis: string[] = [];
  displayEmojis.push(presentEmojis[0], presentEmojis[1]);

  while (displayEmojis.length < 50) {
    const randomEmoji = otherEmojis[Math.floor(seededRandom() * otherEmojis.length)];
    displayEmojis.push(randomEmoji);
  }

  displayEmojis.sort(() => seededRandom() - 0.5);

  return {
    allThreeEmojis,
    missingEmoji,
    displayEmojis,
  };
}
