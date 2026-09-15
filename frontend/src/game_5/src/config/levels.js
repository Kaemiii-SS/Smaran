// Each category has 8 distinct animals (image paths served from /animals/ public folder).
// The value shape is still a plain string — just an image path instead of an emoji.
export const CATEGORIES = {
  ANIMALS: [
  '/game5/animals/panda.png', '/game5/animals/bear.png', '/game5/animals/rabbit.png',
  '/game5/animals/cat.png', '/game5/animals/elephant.png', '/game5/animals/monkey.png',
  '/game5/animals/dog.png', '/game5/animals/cow.png'],

  HOUSEHOLD: [
  '/game5/animals/sheep.png', '/game5/animals/fox.png', '/game5/animals/turtle.png',
  '/game5/animals/octopus.png', '/game5/animals/penguin.png', '/game5/animals/horse.png',
  '/game5/animals/pig.png', '/game5/animals/chick.png'],

  FOOD: [
  '/game5/animals/frog.png', '/game5/animals/snake.png', '/game5/animals/dolphin.png',
  '/game5/animals/camel.png', '/game5/animals/zebra.png', '/game5/animals/tiger.png',
  '/game5/animals/deer.png', '/game5/animals/owl.png'],

  NATURE: [
  '/game5/animals/bird.png', '/game5/animals/butterfly.png', '/game5/animals/ladybug.png',
  '/game5/animals/snail.png', '/game5/animals/ant.png', '/game5/animals/crocodile.png',
  '/game5/animals/hippo.png', '/game5/animals/chicken.png']

};

// ── Level table (exactly 20 levels, matching the spec) ─────────────────────
// Difficulty levers used within same pair-count:
//   - delay      : ms the flipped cards stay visible before flipping back
//                  (null = cards stay up until player acts, ~3 s effective)
//   - layout     : 'ordered' = pairs placed together; 'scattered' = shuffled
//   - categories : widening pool introduces more visual variety / confusion
export const LEVELS = [
// ── 2 pairs, 4 cards, 2×2 ──────────────────────────────────────────────
{ level: 1, grid: [2, 2], pairs: 2, categories: ['ANIMALS'], delay: null, layout: 'ordered' },
{ level: 2, grid: [2, 2], pairs: 2, categories: ['ANIMALS'], delay: 1500, layout: 'scattered' },

// ── 3 pairs, 6 cards, 3×2 ──────────────────────────────────────────────
{ level: 3, grid: [3, 2], pairs: 3, categories: ['ANIMALS'], delay: 2500, layout: 'ordered' },
{ level: 4, grid: [3, 2], pairs: 3, categories: ['ANIMALS'], delay: 1000, layout: 'scattered' },

// ── 4 pairs, 8 cards, 4×2 ──────────────────────────────────────────────
{ level: 5, grid: [4, 2], pairs: 4, categories: ['ANIMALS', 'HOUSEHOLD'], delay: 2000, layout: 'ordered' },
{ level: 6, grid: [4, 2], pairs: 4, categories: ['ANIMALS', 'HOUSEHOLD'], delay: 800, layout: 'scattered' },

// ── 5 pairs, 10 cards, 5×2 ─────────────────────────────────────────────
{ level: 7, grid: [5, 2], pairs: 5, categories: ['ANIMALS', 'HOUSEHOLD'], delay: 1500, layout: 'ordered' },
{ level: 8, grid: [5, 2], pairs: 5, categories: ['ANIMALS', 'HOUSEHOLD'], delay: 600, layout: 'scattered' },

// ── 6 pairs, 12 cards, 4×3 ─────────────────────────────────────────────
{ level: 9, grid: [4, 3], pairs: 6, categories: ['HOUSEHOLD', 'FOOD'], delay: 1500, layout: 'ordered' },
{ level: 10, grid: [4, 3], pairs: 6, categories: ['HOUSEHOLD', 'FOOD'], delay: 500, layout: 'scattered' },

// ── 7 pairs, 14 cards, 7×2 ─────────────────────────────────────────────
{ level: 11, grid: [7, 2], pairs: 7, categories: ['FOOD', 'NATURE'], delay: 1200, layout: 'ordered' },
{ level: 12, grid: [7, 2], pairs: 7, categories: ['FOOD', 'NATURE'], delay: 400, layout: 'scattered' },

// ── 8 pairs, 16 cards, 4×4 ─────────────────────────────────────────────
{ level: 13, grid: [4, 4], pairs: 8, categories: ['ANIMALS', 'FOOD', 'NATURE'], delay: 1000, layout: 'ordered' },
{ level: 14, grid: [4, 4], pairs: 8, categories: ['ANIMALS', 'FOOD', 'NATURE'], delay: 300, layout: 'scattered' },

// ── 9 pairs, 18 cards, 6×3 ─────────────────────────────────────────────
{ level: 15, grid: [6, 3], pairs: 9, categories: ['ANIMALS', 'HOUSEHOLD', 'NATURE'], delay: 800, layout: 'ordered' },
{ level: 16, grid: [6, 3], pairs: 9, categories: ['ANIMALS', 'HOUSEHOLD', 'NATURE'], delay: 200, layout: 'scattered' },

// ── 10 pairs, 20 cards, 5×4 ────────────────────────────────────────────
{ level: 17, grid: [5, 4], pairs: 10, categories: ['ANIMALS', 'HOUSEHOLD', 'FOOD', 'NATURE'], delay: 600, layout: 'ordered' },
{ level: 18, grid: [5, 4], pairs: 10, categories: ['ANIMALS', 'HOUSEHOLD', 'FOOD', 'NATURE'], delay: 0, layout: 'scattered' },

// ── 11 pairs, 22 cards, scattered (no clean grid) ──────────────────────
{ level: 19, grid: [6, 4], pairs: 11, categories: ['ANIMALS', 'HOUSEHOLD', 'FOOD', 'NATURE'], delay: 0, layout: 'scattered' },

// ── 12 pairs, 24 cards, 6×4 ────────────────────────────────────────────
{ level: 20, grid: [6, 4], pairs: 12, categories: ['ANIMALS', 'HOUSEHOLD', 'FOOD', 'NATURE'], delay: 0, layout: 'scattered' }];
