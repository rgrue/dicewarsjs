# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Game

No build system exists. Open `index.html` directly in a browser:

```
file:///path/to/dicewarsjs/index.html
```

All scripts are loaded via `<script>` tags in `index.html`. There are no tests, no linting tools, and no package manager.

## Architecture

The game is a browser-based JavaScript implementation of Dice Wars, rendered on an HTML5 `<canvas>` using [CreateJS](https://createjs.com/).

### File Roles

- **`game.js`** — Core game state and logic. Contains the `Game` constructor with all map generation, area adjacency, player data, and the AI dispatch function `com_thinking()`.
- **`main.js`** — All rendering, UI, event handling, and game flow (title screen → map creation → play → battle → supply → next player). Uses global sprite arrays and a `timer_func` / `click_func` callback pattern to drive game phases.
- **`mc.js`** / **`areadice.js`** — CreateJS animation library exports (generated assets). `mc.js` contains the dice sprites, buttons, player indicator, and all animated symbols. Do not edit manually.
- **`ai_*.js`** — AI strategy functions, one per file.

### Key Data Structures (`game.js`)

- `game.adat[i]` (`AreaData`) — array of up to 32 areas:
  - `.arm` — player index who owns the area
  - `.dice` — number of dice on the area (1–8)
  - `.join[j]` — `1` if area `i` is adjacent to area `j`, `0` otherwise
  - `.size` — `0` means this area slot is unused
- `game.player[i]` (`PlayerData`) — per-player state:
  - `.area_tc` — size of the player's largest connected group of territories (used to calculate reinforcements; `0` means eliminated)
  - `.stock` — stockpile dice waiting to be distributed at end of turn
- `game.jun[]` — shuffled turn order array; `game.jun[game.ban]` is the current player's index
- `game.get_pn()` — returns the current player's index
- `game.area_from` / `game.area_to` — set by an AI function to declare an attack

### Game Flow (main.js)

Phases are driven by assigning global callbacks `timer_func` (called each tick at 60 FPS), `click_func`, and `release_func`:

```
start_title → make_map → start_game → start_player
  → start_man (human) or start_com (AI)
  → start_battle → after_battle
  → start_supply → next_player → start_player (loop)
```

Player colors map to `this.ai` indices in `game.js:42`: index 0 = purple (always human), 1 = lime, 2 = green, 3 = pink, 4 = orange, 5 = cyan, 6 = yellow, 7 = red.

### AI Contract

An AI function receives `game` and must either:
- Set `game.area_from` and `game.area_to` to attack (do **not** return), or
- Return `0` to end the turn.

The function is called repeatedly each tick until it returns `0`.

## Adding a New AI

1. Copy `ai_example.js` to `ai_YourName.js`; rename the function to `ai_YourName`.
2. Add `<script src="ai_YourName.js"></script>` in `index.html` near line 39.
3. Replace an entry in `this.ai` array (`game.js:42–51`) with `ai_YourName`. Index 0 is always the human player.

See `ai_example.js` for a well-commented reference implementation.
