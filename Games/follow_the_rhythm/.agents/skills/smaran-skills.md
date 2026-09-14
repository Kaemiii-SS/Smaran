# Smaran — Dementia Care Game Suite
## Agent Skill Definition | v1.0

---

## 1. Design Philosophy

### Core Principles
| Principle | Implementation |
|---|---|
| **Zero Failure Shame** | No red X's, no buzzers, no punishing timers. Wrong answers get gentle visual feedback (soft shake, warm retry prompt). |
| **Emotional Payoff First** | Every game connects to something personal, nostalgic, or immediately useful. Not abstract puzzles — meaningful interactions. |
| **Voice-First, Touch-Second** | All instructions are spoken aloud. Text is large, high-contrast, and supplementary. |
| **Flow State Target** | 70–85% success rate per session. Challenging enough to stimulate, easy enough to prevent learned helplessness. |
| **No Motor Frustration** | Large tap targets (min 72×72px), no precision dragging, no rapid-tap requirements. |
| **Session Brevity** | 3–5 minutes per game session. Auto-suggest break after 15 minutes of total play. |

### Emotional Tone
- **Warm, not clinical.** Colors are soft pastels and nature tones. No hospital blues or warning reds.
- **Encouraging, not patronizing.** Voice lines: *"You matched Sarah! She looks happy here."* — not *"Good job, you got it right!"*
- **Familiar, not novel.** Game mechanics mirror real-life activities the patient has done for decades (card games, gardening, listening to music, looking at family albums).

### Art Direction: Studio Ghibli Style
**ALL illustrations, animations, backgrounds, characters, and visual assets must follow Studio Ghibli aesthetic principles:**
- **Hand-painted watercolor textures** — soft, organic backgrounds with visible brush strokes and paper grain
- **Warm, lived-in color palettes** — earthy greens, golden ambers, rose creams, soft lavenders
- **Whimsical, gentle character design** — round, soft features; expressive but calm faces; elderly characters with dignity and warmth
- **Nature integration** — leaves, vines, clouds, and natural elements woven into UI elements
- **Soft lighting** — diffused, golden-hour quality; no harsh shadows or neon glows
- **Nostalgic atmosphere** — every scene should feel like a memory from a beloved childhood film
- **Animated elements** — subtle drifting clouds, gently swaying leaves, floating dust particles in light beams
- **No flat vector minimalism** — everything should have depth, texture, and painterly quality

---

## 2. Visual Design System

### Color Palette (Extracted from Brand Image)
```
Primary Green:     #16a34a  (success, progress, nature — use sparingly for CTAs)
Soft Sage:         #a3c0a2  (primary background, cards, nav)
Light Sage:        #b6ceb6  (secondary backgrounds, hover states)
Pale Mint:         #d1e4d0  (card backgrounds, subtle fills)
Warm Cream:        #fefce8  (primary content background — Ghibli paper texture)
Gentle Rose:       #ffe4e6  (accents, photo frames, soft highlights)
Soft Lavender:     #ede9fe  (secondary accents, alternate cards)
Warm Amber:        #fbbf24  (streaks, highlights, celebration elements)
Golden Yellow:     #f6c84e  (character accents, sun rays, warmth)
Peach Skin:        #df9886  (character skin tones, warm accents)
Butter Yellow:     #d4b172  (sweaters, clothing, cozy elements)
Deep Forest:       #293237  (text primary, dark UI elements)
Charcoal:          #374151  (text secondary, descriptions)
Soft Gray:         #6b7280  (disabled states, metadata)
```

### Typography
- **Headings:** Inter or Geist, weight 700–800, size 28–36px
- **Body:** Inter, weight 500, size 18–22px
- **Voice Prompts:** 24px minimum, weight 600, line-height 1.5
- **Game Elements:** 32–48px emoji or Ghibli-style illustrated icons

### Spacing & Layout
- **Border Radius:** 16–24px for cards, 9999px for pills/badges
- **Shadows:** Soft, diffused `0 8px 32px rgba(22, 163, 74, 0.08)`
- **Grid:** Centered single-column layout, max-width 480px (mobile-first, tablet-optimized)
- **Tap Targets:** Minimum 72×72px, with 16px gap between interactive elements

### Animation Language
- **Correct Answer:** Gentle scale-up (1.0 → 1.08 → 1.0), soft green glow, confetti particle burst (8–12 emojis or Ghibli-style sparkles)
- **Wrong Answer:** Subtle horizontal shake (±6px, 0.4s), soft rose tint fade-in/fade-out, warm retry voice prompt
- **Transitions:** 0.3s ease for state changes, 0.5s ease for layout shifts
- **Loading:** Pulsing soft glow, never a spinning wheel
- **Ghibli Ambient:** Subtle parallax backgrounds, floating particles, gentle light rays

---

## 3. Shared UI Components

### `<GameShell />`
```tsx
interface GameShellProps {
  title: string;
  subtitle?: string;
  level: number;
  streak: number;
  round: number;
  maxRounds: number;
  children: React.ReactNode;
  onExit: () => void;
  voiceText: string; // Text-to-speech content
}
```
- Fixed header with game title, level badge, streak counter
- Progress bar (rounded, animated fill with Ghibli leaf motif)
- Voice prompt banner (prominent, tappable to replay audio)
- Safe area padding for bottom nav
- Background: Soft sage gradient with watercolor texture overlay

### `<ChoiceButton />`
```tsx
interface ChoiceButtonProps {
  content: React.ReactNode; // emoji, image, or text
  label?: string;
  onClick: () => void;
  state: 'idle' | 'correct' | 'wrong' | 'disabled';
  size?: 'sm' | 'md' | 'lg'; // lg = 96×96px, md = 72×72px
}
```
- Large rounded square with soft shadow and watercolor border
- Hover: scale(1.04), active: scale(0.98)
- Correct state: green border + glow + checkmark animation with leaf confetti
- Wrong state: soft rose border + gentle shake + Ghibli-style soot sprite comfort animation

### `<FeedbackOverlay />`
```tsx
interface FeedbackOverlayProps {
  type: 'correct' | 'wrong' | 'complete' | 'levelUp';
  message: string;
  subMessage?: string;
  onDismiss?: () => void;
  autoDismissMs?: number;
}
```
- Centered modal-like overlay with backdrop blur and watercolor vignette
- Correct: floating sparkles, warm voice line, Ghibli-style celebration illustration
- Wrong: soft illustration of a gentle creature encouraging retry, no negative scoring
- Complete: full-screen celebration with Totoro-style creature and nature elements

---

## 4. Game 1: Photo / Face Matching

### Overview
Patients match names to faces from a set of family photos uploaded by caregivers. This is the **emotional anchor** of the entire suite.

### Ghibli Art Requirements
- **Photo Frames:** Rounded rectangles (20px radius) with hand-painted rose borders, subtle watercolor shadow, and delicate vine decorations
- **Background:** Warm cream with Ghibli-style watercolor paper texture and floating dust particles
- **Character Placeholders:** If no photo, use Ghibli-style illustrated elderly characters with warm, expressive faces
- **Transitions:** Photos gently slide with a breeze-like motion, leaves drift across screen

### Game Mechanics
1. **Setup:** 2–8 face photos appear on screen in a grid
2. **Prompt:** Voice speaks a name (e.g., *"Where is Sarah?"*)
3. **Action:** Patient taps the correct face
4. **Feedback:** Face "blooms" with a soft golden glow, voice confirms (*"Yes, that's Sarah! She looks happy in this photo."*)
5. **Progress:** Next name prompt, or round complete

### Difficulty Progression

| Level | Faces | Photo Type | Distractors | Response Mode | Familiarity |
|-------|-------|------------|-------------|---------------|-------------|
| 1 | 2 | Recent, clear | None | 2 spoken name choices | Very recent |
| 2 | 2 | Recent | None | Tap face when name spoken | Recent |
| 3 | 3 | Recent | None | 3 spoken choices | Recent |
| 4 | 3 | Mix recent/older | None | Tap face when name spoken | Mixed |
| 5 | 4 | Mix | 1 random face | 4 spoken choices | Mixed |
| 6 | 4 | Older photos | 1 random | Tap face when name spoken | Older |
| 7 | 6 | All eras | 2 random | 6 spoken choices | All eras |
| 8 | 6 | Similar-looking (son/grandson) | 2 random | Tap face when name spoken | Similar |
| 9 | 8 | Group photos cropped | 2 random | 8 spoken choices | Cropped groups |
| 10 | 8 | All types | 3 random | Free recall (speak name) | All |

### Key Animations
- **Photo Bloom:** On correct match, photo scales 1.0 → 1.12 → 1.0 over 0.6s with `box-shadow: 0 0 40px rgba(251, 191, 36, 0.4)` and golden petals burst
- **Photo Shuffle:** When advancing rounds, photos gently slide to new positions (0.4s ease, leaf trail effect)
- **Name Prompt:** Text fades in with a subtle upward drift (translateY 8px → 0, 0.3s) accompanied by floating note particles

---

## 5. Game 2: Simple Pairs

### Overview
A digital card-matching game using familiar, high-contrast images. The **pure dopamine loop**.

### Ghibli Art Requirements
- **Card Backs:** Soft green pattern with hand-painted leaf/flower watermark, rounded 16px, 4px watercolor border
- **Card Fronts:** Full-bleed Ghibli-style illustrations (animals, objects, food, nature), same rounded corners, soft shadow
- **Match Celebration:** When matched, cards reveal a small Ghibli creature (like a Kodama or Totoro) peeking from behind
- **Background:** A cozy room scene with window showing green landscape

### Card Content Categories (Ghibli-Illustrated)
1. **Animals** (Level 1–3): Dog, cat, bird, fish, rabbit — warm, friendly watercolor illustrations
2. **Household Objects** (Level 4–6): Chair, cup, book, clock, phone — daily utility connection
3. **Food** (Level 7–8): Apple, bread, egg, soup — sensory memory trigger, steaming details
4. **Nature** (Level 9–10): Tree, flower, sun, moon, cloud — calming, familiar, Ghibli skies
5. **Mixed** (Level 10+): 2–3 categories combined

### Difficulty Progression

| Level | Grid | Pairs | Categories | Flip-back Speed | Layout | Distractors |
|-------|------|-------|------------|-----------------|--------|-------------|
| 1 | 2×2 | 2 | 1 (animals) | Cards stay up until matched | Ordered | None |
| 2 | 2×3 | 3 | 1 | 3s | Ordered | None |
| 3 | 3×2 | 3 | 1 | 2s | Ordered | None |
| 4 | 3×3 (8 cards + 1 empty) | 4 | 1 | 2s | Ordered | 1 empty slot |
| 5 | 3×4 | 6 | 2 mixed | 2s | Ordered | None |
| 6 | 4×3 | 6 | 2 mixed | 1.5s | Scattered | None |
| 7 | 4×4 | 8 | 2 mixed | 1.5s | Scattered | None |
| 8 | 4×4 | 8 | 3 mixed | 1s | Scattered | None |
| 9 | 4×5 | 10 | 3 mixed | 1s | Scattered | None |
| 10 | 5×4 | 10 | 3 mixed | Immediate | Scattered | Similar-looking pairs |

### Key Animations
- **Card Flip:** 3D CSS transform `rotateY(0deg)` → `rotateY(180deg)`, 0.4s ease-in-out, with `backface-visibility: hidden` and a soft leaf particle burst
- **Match Glow:** Matched cards get `box-shadow: 0 0 24px rgba(251, 191, 36, 0.5)` and scale to 0.95 with a gentle Kodama head-tilt animation
- **Mismatch Shake:** `translateX(-4px)` → `translateX(4px)` × 3 cycles, 0.3s total, then flip back with a soft sigh sound
- **Deal Animation:** Cards appear one-by-one with 0.1s stagger, scaling from 0.8 → 1.0 with fade-in and floating down like leaves

---

## 6. Game 3: Constellation

### Overview
A spatial memory game where a glowing path briefly draws itself across scattered nodes before fading. The **visually impressive** game.

### Ghibli Art Requirements
- **Background:** Deep twilight gradient `#0f172a` → `#1e1b4b`, with Ghibli-style starfield (hand-painted stars, not geometric), subtle aurora effects in soft greens and lavenders
- **Nodes:** Glowing orbs (48px diameter) with inner watercolor core and colored aura — resemble Ghibli spirit orbs or Kodama lights
- **Path Line:** 4px glowing stroke with `filter: blur(2px)` for neon effect, color matches node aura, drawn like a brush stroke
- **Constellation Names:** Whimsical, nature-themed: "The Garden", "The Teapot", "The Family", "The Forest Spirit"
- **Completion Reveal:** Full constellation forms a Ghibli-style creature or nature shape (butterfly, tree, catbus outline)

### Difficulty Progression

| Level | Nodes in Path | Total Nodes on Screen | Path Complexity | Display Duration | Distractors | Path Style |
|-------|---------------|----------------------|-----------------|------------------|-------------|------------|
| 1 | 2 | 3 | Straight line | 3s glow, slow draw | 1 extra node | Simple |
| 2 | 3 | 4 | Gentle curve | 3s glow, slow draw | 1 extra node | Simple |
| 3 | 3 | 5 | Gentle curve | 2.5s glow, normal draw | 2 extra nodes | Simple |
| 4 | 4 | 6 | Zigzag | 2.5s glow, normal draw | 2 extra nodes | Medium |
| 5 | 4 | 7 | Crossing paths | 2s glow, normal draw | 3 extra nodes | Medium |
| 6 | 5 | 8 | Crossing paths | 2s glow, fast draw | 3 extra nodes | Complex |
| 7 | 5 | 10 | Complex weave | 1.5s glow, fast draw | 5 extra nodes | Complex |
| 8 | 6 | 12 | Complex weave | 1.5s glow, fast draw | 6 extra nodes | Complex |
| 9 | 6 | 14 | Self-crossing | 1s brief flash | 8 extra nodes | Expert |
| 10 | 7 | 16 | Self-crossing | 1s brief flash | 9 extra nodes | Expert |

### Key Animations
- **Path Draw:** SVG `stroke-dashoffset` animation from full length → 0 over 1–3s, with `stroke-linecap: round` and a glowing, brush-like texture
- **Path Fade:** After draw completes, opacity fades to 0 over 0.5s, leaving only softly pulsing nodes
- **Node Tap:** On tap, node scales 1.0 → 1.3 → 1.0 with bright flash and releases small sparkle particles
- **Wrong Node:** Node pulses rose (scale 1.0 → 1.2 → 1.0, 0.3s) with soft glow, a gentle Ghibli creature shakes its head
- **Constellation Reveal:** All correct nodes connect with bright lines, name fades in with typewriter effect, background aurora intensifies

---

## 7. Game 4: Find It

### Overview
A visual search game where the patient finds specific objects in a cluttered but familiar scene. Trains **selective attention**.

### Ghibli Art Requirements
- **Scenes:** Warm, hand-painted watercolor rooms with Ghibli-level detail — visible wood grain, fabric textures, potted plants, sunlight through windows
- **Object Style:** Soft, rounded watercolor illustrations with clear silhouettes, each object has a story (worn edges, patina)
- **Scene Transitions:** Gentle cross-fade (0.5s) with floating dust particles and light ray shifts
- **Target Highlight:** Soft golden aura like a Ghibli spirit blessing, never arrow pointers

### Scene Library (Ghibli-Illustrated)
1. **Kitchen Table** — cup, plate, spoon, bread, apple, medicine bottle, glasses, newspaper, potted herbs on windowsill
2. **Garden Bench** — watering can, flower pot, bird, hat, book, keys, sunglasses, overgrown ivy, stone path
3. **Bedroom Dresser** — comb, watch, photo frame, pill box, glasses, book, lamp, lace doily, morning light
4. **Living Room** — TV remote, tea cup, blanket, clock, phone, glasses, book, fireplace, cat sleeping
5. **Bathroom Sink** — toothbrush, toothpaste, soap, towel, medicine, comb, cup, mirror with steam, window plant

### Difficulty Progression

| Level | Objects in Scene | Target Description | Distraction Level | Time Pressure | Scene Complexity |
|-------|------------------|--------------------|-------------------|---------------|------------------|
| 1 | 3 | "The cup" (only cup present) | None | None | Single object type |
| 2 | 5 | "The red cup" (1 cup, other colors) | Color distractors | None | Simple |
| 3 | 6 | "The cup under the book" | Spatial distractors | None | Simple |
| 4 | 8 | "The small red cup" | Size + color distractors | None | Medium |
| 5 | 10 | "The cup next to the spoon" | Relational distractors | Gentle fade hint at 10s | Medium |
| 6 | 12 | "Where is your medicine?" | Semantic distractors | Gentle fade hint at 8s | Medium |
| 7 | 15 | "The thing you drink from" | Functional description | Fade hint at 8s | Complex |
| 8 | 18 | "The object that doesn't belong" | Odd-one-out | Fade hint at 6s | Complex |
| 9 | 20 | "The thing you use in the morning" | Abstract category | Fade hint at 6s | Complex |
| 10 | 25 | "The gift from Sarah" (caregiver-defined) | Personal knowledge | No hints | Expert |

### Key Animations
- **Object Appear:** Objects fade in with 0.05s stagger when scene loads, like morning mist clearing
- **Correct Find:** Object scales 1.0 → 1.15 → 1.0, golden aura expands outward with floating sparkles, name label fades in below
- **Wrong Tap:** Object shakes gently, brief rose tint, then returns to normal with a soft "not quite" sound
- **Hint Pulse:** Target object opacity oscillates 1.0 → 0.6 → 1.0 over 2s, subtle golden glow like a firefly

---

## 8. Game 5: Complete the Story

### Overview
A sequencing game where 3–5 illustrated panels appear scrambled, and the patient taps them in the correct order to tell a coherent story.

### Ghibli Art Requirements
- **Panels:** Rounded rectangles (16px radius), soft shadow, 4:3 aspect ratio, watercolor paper texture
- **Panel Size:** 140×105px (mobile), 180×135px (tablet)
- **Story Strip:** Horizontal bar at top with wooden texture where panels snap into place
- **Scrambled Area:** Below the strip, panels arranged in loose grid with slight rotations (±3°) for a "scattered photos on table" feel
- **Narration Overlay:** On completion, a warm overlay with the full story text and auto-playing voice, background shows a Ghibli-style reading nook

### Story Categories (Ghibli-Illustrated)
1. **Daily Routines** (Level 1–3): Wake up → Brush teeth → Eat breakfast → Go for walk — with Ghibli morning light
2. **Generic Events** (Level 4–6): Plant seed → Water → Sun → Flower grows — Studio Ghibli garden aesthetic
3. **Familiar Stories** (Level 7–8): Cinderella loses shoe → Prince finds it → They marry — Ghibli fairy tale style
4. **Personal Events** (Level 9–10): Caregiver-uploaded photo sequences with custom narration, rendered in Ghibli watercolor style

### Difficulty Progression

| Level | Panels | Story Type | Visual Clues | Time Clues | Missing Panel |
|-------|--------|------------|--------------|------------|---------------|
| 1 | 2 | Daily routine | Very obvious (morning → night) | Strong | None |
| 2 | 3 | Daily routine | Obvious | Strong | None |
| 3 | 3 | Generic event | Obvious | Medium | None |
| 4 | 4 | Generic event | Moderate | Medium | None |
| 5 | 4 | Generic event | Subtle | Weak | None |
| 6 | 4 | Familiar story | Moderate | Weak | None |
| 7 | 5 | Familiar story | Subtle | Weak | None |
| 8 | 5 | Personal event | Photo-based | Contextual | None |
| 9 | 5 | Personal event | Photo-based | Contextual | 1 panel missing (patient recalls) |
| 10 | 5 | Personal event | Photo-based | Contextual | 2 panels missing + free recall narration |

### Key Animations
- **Panel Snap:** When tapped, panel smoothly translates to the story strip (0.4s ease-out, `transform: translate()`) with a soft paper rustle sound
- **Wrong Placement:** Panel bounces back to scrambled area with elastic easing, no penalty, a gentle creature shakes its head
- **Story Strip Fill:** Each added panel slides in from the right, existing panels shift left with a wooden click sound
- **Narration Overlay:** Fades in with backdrop blur, story text types out word-by-word synced with voice, background shows animated Ghibli scenery

---

## 9. Game 6: Follow the Rhythm

### Overview
A "Simon Says" style rhythm game using large colored circles and familiar tunes. Targets **procedural memory**.

### Ghibli Art Requirements
- **Circles:** Large (80–96px diameter), rounded, with inner gradient glow resembling Ghibli spirit orbs or soot sprites
- **Colors:** Soft pastels — Rose `#fca5a5`, Sky `#7dd3fc`, Sage `#86efac`, Lavender `#c4b5fd`, Amber `#fcd34d` — all with watercolor texture
- **Layout:** 2×2 grid (Level 1–4) → 2×3 (Level 5–7) → circle arrangement (Level 8+)
- **Active State:** Circle scales to 1.15, inner glow brightens, subtle ripple ring expands outward like a water drop in a Ghibli pond
- **Background:** Soft gradient that shifts color with music's mood, with floating musical note particles

### Sound Design
- **Tones:** Warm piano notes (C4–G4), not electronic beeps — recorded with felt piano warmth
- **Era Music:** Level 8+ uses actual melody snippets from 1950s–1970s hits (public domain or licensed)
- **Voice Prompts:** Spoken rhythm instructions for Level 1–3: *"Tap red, then blue, then red again."*
- **Ambient:** Soft nature sounds between rounds (wind, birds, distant piano)

### Difficulty Progression

| Level | Sequence Length | Circles | Speed | Audio Cue | Pattern Type |
|-------|-----------------|---------|-------|-----------|--------------|
| 1 | 2 | 2 | Very slow (1.5s per note) | Voice + visual | Simple repeat |
| 2 | 2 | 2 | Slow (1.2s) | Voice + visual | Simple repeat |
| 3 | 3 | 2 | Slow (1.2s) | Voice + visual | Simple repeat |
| 4 | 3 | 3 | Normal (1s) | Visual only | Simple repeat |
| 5 | 3 | 3 | Normal (1s) | Visual only | Simple repeat |
| 6 | 4 | 3 | Normal (0.8s) | Visual only | Simple repeat |
| 7 | 4 | 4 | Normal (0.8s) | Visual only | Simple repeat |
| 8 | 4 | 4 | Fast (0.6s) | Audio only (no visual glow) | Melody snippet |
| 9 | 5 | 4 | Fast (0.6s) | Audio only | Melody snippet |
| 10 | 5 | 5 | Fast (0.5s) | Audio only | Melody snippet |

### Key Animations
- **Circle Glow:** `box-shadow` expands from `0 0 0px` → `0 0 30px [color]` over 0.2s, then fades like a firefly
- **Ripple Effect:** On activation, a ring expands from center with `scale(0)` → `scale(2)`, opacity 0.6 → 0, over 0.6s, like a stone dropped in water
- **Wrong Tap:** Circle shakes horizontally (±8px, 0.3s), brief rose overlay, then returns with a gentle creature comforting animation
- **Sequence Replay:** Circles light up in order with 0.1s stagger for visual confirmation, accompanied by floating note particles

---

## 10. Unified Adaptive Difficulty Engine

### Patient Cognitive Profile
```typescript
interface CognitiveProfile {
  patientId: string;
  lastUpdated: Date;
  domains: {
    visualAttention: number;      // Find It baseline
    workingMemory: number;        // Simple Pairs + Constellation baseline
    faceRecognition: number;      // Photo Matching baseline
    sequentialMemory: number;     // Constellation + Story baseline
    auditoryMemory: number;       // Follow the Rhythm baseline
    semanticMemory: number;       // Story + Find It baseline
    proceduralMemory: number;     // Follow the Rhythm baseline
    processingSpeed: number;      // Cross-game reaction time baseline
  };
  engagement: {
    preferredGame: string;
    avgSessionLengthMin: number;
    bestTimeOfDay: string;
    fatigueThresholdMin: number;
  };
  trends: {
    overallTrajectory: 'improving' | 'stable' | 'gradual_decline' | 'sudden_drop';
    lastSuddenDropDate: Date | null;
    domainChanges: Record<string, number>;
  };
}
```

### Difficulty Adjustment Algorithm
Run after every 3 sessions:
- **Accuracy > 85% + Completion > 80% + Random clicking < 10%** → Level +1
- **Accuracy < 50% OR Random clicking > 30% OR Completion < 30%** → Level -1
- **Sudden drop < 60% of baseline** → Level -2 + High alert
- **Sweet spot (50–85%)** → Maintain level

### Cross-Game Difficulty Linking
| If patient excels at... | Boost these domains... |
|---|---|
| Simple Pairs (working memory) | Constellation, Story |
| Photo Matching (face rec) | Find It (attention) |
| Follow the Rhythm (procedural) | Story (narrative) |
| Find It (attention) | All games |

### Fatigue Detection
- **In-game:** Round-N time > 2× round-1 time → offer break
- **Cross-session:** Accuracy drops >20% in last 5 minutes → auto-suggest ending
- **Daily cap:** Soft limit of 30 minutes total gameplay per day

---

## 11. Cross-Game Analytics Schema

### Per-Session Data
```typescript
interface BaseGameSession {
  sessionId: string;
  patientId: string;
  gameType: 'face_matching' | 'pairs' | 'constellation' | 'find_it' | 'story' | 'rhythm';
  timestamp: Date;
  level: number;
  roundsCompleted: number;
  maxRounds: number;
  accuracy: number;
  timeElapsedMs: number;
  randomClickingRate: number;
  quitPoint: number | null;
  engagementScore: number;
}
```

### Caregiver Dashboard
- **Roster View:** Patient name, last active, today's sessions, overall trend, alert status
- **Cognitive Radar Chart:** 6 domains with Ghibli-style visualization
- **Trend Graphs:** 14-day rolling accuracy, response time, session frequency, engagement
- **Alert Log:** Timestamp, game, alert type, severity, details, auto-action taken

### Alert Triggers
| Severity | Trigger | Auto-Action | Notification |
|----------|---------|-------------|--------------|
| Low | Missed 1 session today | None | Daily digest |
| Medium | 3 consecutive failed sessions OR accuracy <50% for 2 sessions | Auto-reduce difficulty by 1 | Push + email |
| High | Sudden 40%+ accuracy drop from 7-day baseline OR no gameplay for 3 days | Auto-reduce difficulty by 2 + flag profile | Immediate push + SMS |
| Critical | No gameplay for 5 days + missed medication reminders | None (human intervention) | Immediate call + SMS + email |

---

## 12. React / Next.js Architecture

### Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS + shadcn/ui base components
- **Animation:** Framer Motion (primary), CSS transitions (simple states)
- **State Management:** Zustand (global game state) + React Query (server state)
- **Audio:** Web Audio API (tones) + Howler.js (voice/samples)
- **Voice:** Web Speech API (TTS + STT fallback)
- **Charts:** Recharts (caregiver dashboard)
- **Database:** PostgreSQL + Prisma
- **Storage:** Cloudflare R2 / AWS S3 (family photos, audio assets)

### Project Structure
```
dementia-care-platform/
├── app/
│   ├── (patient)/
│   │   ├── dashboard/
│   │   ├── games/
│   │   │   ├── face-matching/
│   │   │   ├── pairs/
│   │   │   ├── constellation/
│   │   │   ├── find-it/
│   │   │   ├── story/
│   │   │   └── rhythm/
│   │   └── layout.tsx
│   ├── (caregiver)/
│   │   ├── dashboard/
│   │   ├── patients/[id]/
│   │   └── layout.tsx
│   └── api/
│       ├── sessions/
│       ├── analytics/
│       └── voice/
├── components/
│   ├── ui/
│   ├── game-shell/
│   ├── games/
│   └── caregiver/
├── hooks/
│   ├── useGameEngine.ts
│   ├── useVoiceFeedback.ts
│   ├── useAdaptiveDifficulty.ts
│   └── useAnalytics.ts
├── lib/
│   ├── game-configs/
│   ├── audio/
│   ├── animations/
│   └── utils.ts
├── types/
└── prisma/
```

### Animation System (Framer Motion)
```typescript
export const cardFlip = {
  hidden: { rotateY: 0 },
  visible: { rotateY: 180, transition: { duration: 0.4, ease: 'easeInOut' } },
};

export const gentleShake = {
  shake: { x: [-4, 4, -4, 4, 0], transition: { duration: 0.4 } }
};

export const bloomGlow = {
  initial: { scale: 1, boxShadow: '0 0 0px rgba(251, 191, 36, 0)' },
  animate: {
    scale: [1, 1.12, 1],
    boxShadow: ['0 0 0px rgba(251, 191, 36, 0)', '0 0 40px rgba(251, 191, 36, 0.4)', '0 0 20px rgba(251, 191, 36, 0.2)'],
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const ghibliFloat = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
  }
};

export const confettiBurst = {
  initial: { opacity: 1, scale: 1, y: 0 },
  animate: (i: number) => ({
    opacity: 0,
    scale: 0,
    x: Math.cos((Math.PI * 2 * i) / 8) * (60 + Math.random() * 40),
    y: Math.sin((Math.PI * 2 * i) / 8) * (60 + Math.random() * 40) - 40,
    transition: { duration: 0.8, ease: 'easeOut' }
  })
};
```

---

## 13. Accessibility & Safety Guardrails

### WCAG-AA Compliance
- **Color Contrast:** All text meets 4.5:1 ratio. Game elements use shape + color (not color alone)
- **Text Size:** Minimum 18px body, 24px prompts, 28px headings
- **Tap Targets:** Minimum 72×72px (44×44px absolute minimum for secondary actions)
- **Focus Indicators:** All interactive elements have visible 3px focus rings
- **Screen Reader:** All game states announced via ARIA live regions
- **Motion:** `prefers-reduced-motion` respected — animations become instant transitions

### Dementia-Specific Accessibility
- **No Timers Visible:** No countdown clocks (creates anxiety). Timing tracked silently for analytics only
- **No Score Penalties:** No lives, no streak breaks on wrong answers, no "game over"
- **Persistent Instructions:** Voice prompt always tappable to replay. Text prompt stays visible
- **Exit Anytime:** Large, always-visible "Rest" button — no pressure to finish
- **Consistent Layout:** Back button always top-left. Home always bottom-center. No navigation surprises
- **High Contrast Mode:** Toggle for patients with visual impairments — increases borders, reduces pastels

### Safety Guardrails
- **Chatbot Isolation:** Games do NOT use LLM generation for real-time content. All prompts, stories, and voice lines are pre-authored or caregiver-uploaded
- **No Navigation in Games:** Games are self-contained. No "Find It" level that asks patient to find "the way home"
- **Photo Consent:** Family photos encrypted at rest. Caregiver must confirm consent before upload. Patient data never leaves jurisdiction
- **Session Limits:** Soft cap of 30 mins/day. After 15 mins, gentle prompt: *"You've done wonderfully. Let's take a break and come back later."*
- **Frustration Detection:** If random clicking rate >40% for 2 consecutive rounds, auto-offer: *"This seems tricky today. Would you like to try a different garden?"*

### Voice Interaction Standards
- **TTS Voice:** Warm, calm, slightly slower than normal (0.9x speed). Female voice preferred in testing
- **Prompt Repetition:** Every voice prompt auto-repeats once after 8 seconds of inactivity
- **STT Fallback:** If voice recognition fails 3 times, automatically switch to tap-based input
- **Volume:** Auto-detect device volume. If muted, show visual prompt: *"Please turn up your volume so I can guide you."*

---

## 14. Asset Specifications

### Image Assets (All Ghibli-Style Watercolor)
| Asset | Format | Size | Quantity | Notes |
|-------|--------|------|----------|-------|
| Pairs cards | PNG | 256×256px | 60 (12 per category × 5 categories) | Hand-painted, high contrast, friendly animals/objects |
| Find It scenes | PNG | 800×600px | 5 scenes | Detailed watercolor rooms with natural light |
| Find It objects | PNG | 128×128px | 100 objects | Clear silhouettes, worn/loved appearance |
| Story panels | PNG | 400×300px | 250 (50 stories × 5 panels) | Daily routines + generic events, Ghibli morning light |
| Game backgrounds | PNG | 1920×1080px | 6 (one per game) | Soft watercolor textures, nature elements |
| UI illustrations | PNG/SVG | Various | 50 | Ghibli creatures, spirit characters, nature accents |
| Character portraits | PNG | 256×256px | 20 | Elderly characters with dignity and warmth |
| Celebration scenes | PNG | 800×600px | 10 | Totoro-style creatures, garden celebrations |
| UI icons | SVG | 24×24px | 30 | Rounded stroke, hand-drawn feel |

### Audio Assets
| Asset | Format | Duration | Quantity | Notes |
|-------|--------|----------|----------|-------|
| UI sounds | MP3/WAV | 0.5–1s | 10 | Correct, wrong, match, complete, tap — soft, warm tones |
| Piano tones | WAV | 1s | 8 notes (C4–G4) | Warm, soft attack, felt piano |
| Melody snippets | MP3 | 5–10s | 10 | Public domain songs from 1950s–70s |
| Voice prompts | Generated | 2–5s | 200+ | TTS-generated, cached, warm female voice |
| Ambient nature | MP3 | 30s loops | 5 | Wind, birds, gentle streams for between rounds |

### Font Assets
- **Primary:** Inter (Google Fonts) — weights 400, 500, 600, 700, 800
- **Display:** Playfair Display for game titles — elegant, storybook feel
- **Fallback:** System UI stack for performance

---

## 15. Ghibli Art Style Guidelines for AI Generation

When generating or describing assets for this project, always specify:

### Character Design
- **Elderly characters:** Round, soft faces; warm smiles; dignified posture; wearing cozy sweaters and cardigans
- **Spirit creatures:** Kodama-style (small, white, rattling heads), Totoro-style (large, fluffy, gentle), or soot sprites (fuzzy, playful)
- **Expressions:** Calm, encouraging, never patronizing. Eyes should be expressive and kind

### Environment Design
- **Lighting:** Golden hour, dappled sunlight through leaves, soft window light
- **Textures:** Visible watercolor paper grain, soft edges, organic brush strokes
- **Nature:** Lush, slightly overgrown, lived-in. Plants in every room, vines on walls
- **Atmosphere:** Gentle mist, floating dust particles in light beams, soft clouds

### Color Application
- **Backgrounds:** Soft sage greens `#a3c0a2`, warm creams `#fefce8`, pale lavenders `#ede9fe`
- **Accents:** Golden ambers `#fbbf24`, gentle roses `#ffe4e6`, peach skins `#df9886`
- **Shadows:** Soft, warm, never harsh. Use `#293237` at 10-20% opacity
- **Highlights:** Warm yellows, like sunlight. Never white or cold blue

### Animation Style
- **Movement:** Gentle, floating, drifting. Like leaves on a breeze or clouds in sky
- **Transitions:** Soft fades, gentle slides, elastic bounces (never sharp or mechanical)
- **Particle Effects:** Floating leaves, dust motes, fireflies, sparkles — all hand-painted style
- **Timing:** Slow, contemplative. Never rushed. 0.4–0.6s for most transitions

### What to Avoid
- ❌ Flat vector graphics
- ❌ Geometric perfection
- ❌ Neon or saturated colors
- ❌ Sharp corners or harsh shadows
- ❌ Clinical or sterile aesthetics
- ❌ Fast, jarring animations
- ❌ Realistic 3D renders
- ✅ Hand-painted watercolor textures
- ✅ Organic, imperfect shapes
- ✅ Warm, muted color palettes
- ✅ Soft, diffused lighting
- ✅ Gentle, flowing animations
- ✅ Nostalgic, memory-like atmosphere

---

*Skill Version: 1.0*
*Platform: Smaran — AI-Powered Dementia Care & Cognitive Rehabilitation*
*Art Direction: Studio Ghibli Inspired Watercolor Aesthetic*
*Status: Ready for Antigravity Agent Implementation*
