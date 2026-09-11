---
name: smaran-dementia-care
description: Guidelines, design philosophy, Ghibli visual system, shared components, game mechanics, and cognitive analytics for the Smaran Dementia Care Game Suite.
---

# Smaran — Dementia Care Game Suite

## 1. Design Philosophy

### Core Principles
- **Zero Failure Shame**: No red X's, no buzzers, no punishing timers. Gentle visual feedback (soft shake, warm retry prompt).
- **Emotional Payoff First**: Personal, nostalgic, or immediately useful interactions.
- **Voice-First, Touch-Second**: All instructions spoken aloud. Text is large (min 18-24px), high-contrast.
- **Flow State Target**: 70–85% success rate per session.
- **No Motor Frustration**: Large tap targets (min 72×72px), no precision dragging.
- **Session Brevity**: 3–5 minutes per game session; break suggestions after 15 minutes.

### Visual & Art Direction: Studio Ghibli Style
- Hand-painted watercolor textures, warm cream paper background (`#fefce8`), soft sage (`#a3c0a2`), gentle rose (`#ffe4e6`), warm amber (`#fbbf24`), deep forest (`#293237`).
- Whimsical nature integration (leaves, vines, dust motes in sunlight rays, floating particles).
- Soft, warm lighting; gentle float animations (`ghibliFloat`), scale blooms, soft glows.

## 2. 6 Core Games
1. **Photo / Face Matching**: Match spoken name to caregiver photos in rose-bordered Ghibli frames.
2. **Simple Pairs**: Card matching with Ghibli animals, household objects, food, nature with Kodama peek animations.
3. **Constellation**: Spatial memory path drawing on twilight starfield with glowing orb nodes.
4. **Find It**: Visual search in warm watercolor Ghibli rooms with firefly hint auras.
5. **Complete the Story**: Sequence 3–5 illustrated panels into daily routines or memories.
6. **Follow the Rhythm**: Simon-style pattern repeat with warm felt piano notes and ripple water drops.

## 3. Cognitive Profile & Caregiver Dashboard
- Track 6 cognitive domains: Visual Attention, Working Memory, Face Recognition, Sequential Memory, Auditory Memory, Semantic Memory.
- Adaptive level engine (+1 level on >85% accuracy, -1 on <50%, fatigue prompts).
- Caregiver dashboard with radar charts, trend analytics, photo uploads, alert triggers.
