# Kiramel Studios Hub

An interactive digital studio and narrative portal for a multidisciplinary artist working across music, film, and live performance.

## Project Structure

```
kiramelstudios/
├── index.html                 # Threshold (entry page)
├── css/
│   ├── fonts.css             # Google Fonts with premium font variable swaps
│   ├── global.css            # Typography, colors, base styles, utility classes
│   ├── threshold.css         # Threshold page styles
│   ├── cinema-gate.css       # Cinema Gate (trailer) page styles
│   └── viewing-room.css      # Viewing Room (current world) styles
├── js/
│   ├── main.js               # Core app logic, gating, carousel, navigation
│   ├── utils.js              # Utility functions for storage, DOM, routing
│   └── carousel.js           # Modular carousel (for future use)
├── pages/
│   ├── cinema-gate.html      # Trailer gate (requires 90% watch to unlock)
│   ├── viewing-room.html     # Current world display (Chasing the Sun era)
│   ├── archive.html          # Lore Pack (unlocked after world exploration)
│   ├── community.html        # Thoughtful discussion space
│   ├── writers-room.html     # Fan-written content (account required)
│   └── casting-wing.html     # Professional casting calls
├── media/
│   ├── trailers/             # Placeholder for video files
│   ├── films/                # Placeholder for film files
│   ├── music/                # Placeholder for audio files
│   └── images/               # Placeholder for image assets
└── assets/
    └── placeholders/         # Placeholder content files
```

## Key Features

### 1. Threshold (Entry Page)
- **Path:** `index.html`
- **Design:** Pure black and white, no color accents
- **Purpose:** Ritualized entry point with stark contrast
- **Interaction:** "Begin" button navigates to Cinema Gate

### 2. Cinema Gate (Trailer Gate)
- **Path:** `pages/cinema-gate.html`
- **Design:** Near-black background, soft off-white text
- **Gating:** Requires 90% video watch before "Proceed" button unlocks
- **Storage:** Marks trailer as watched in localStorage
- **Access Control:** Directs back to cinema-gate if user hasn't watched

### 3. Viewing Room (Current World)
- **Path:** `pages/viewing-room.html`
- **Design:** Deep burgundy background (#3d1a24) with bone white accents
- **Content:**
  - Primary film section
  - Interactive carousel with 4 curated content items
  - Information sections
- **Carousel:** Supports arrow navigation, dot indicators, keyboard nav (← →)
- **Access Control:** Checks if trailer was watched; redirects if not

### 4. Support Pages (Stubs)
- **Archive** (`pages/archive.html`) - Lore Pack (unlocked after world exploration)
- **Community** (`pages/community.html`) - Thoughtful discussion space
- **Writers' Room** (`pages/writers-room.html`) - Fan-written content (account required)
- **Casting Wing** (`pages/casting-wing.html`) - Professional casting calls

## Typography System

### Fonts (Google Fonts)
- **Display Font (Headings):** Playfair Display (alternative to Canela/Recoleta)
- **Accent Font (UI):** Space Grotesk (alternative to Neue Montreal)
- **Body Font (Text):** Inter (alternative to Source Sans 3)

### Font Variables
Font families are defined as CSS variables in `css/fonts.css`:
```css
:root {
  --font-display: 'Playfair Display', 'Noe Display', 'Recoleta', serif;
  --font-accent: 'Space Grotesk', 'Neue Montreal', sans-serif;
  --font-body: 'Inter', 'Source Sans 3', sans-serif;
}
```

To swap for premium fonts, simply update the first font name in the variable while keeping fallbacks.

## Color System

### Threshold
- Background: `#000000` (pure black)
- Text: `#ffffff` (pure white)
- No gradients or accents

### Cinema Gate
- Background: `#0a0a0a` (near-black)
- Text: `#f5f5f0` (soft off-white)

### Viewing Room (Chasing the Sun Era)
- Background: `#3d1a24` (deep burgundy)
- Primary Accent: `#f5f1ed` (bone white)
- Secondary Accent: `#d4af8e` (soft metallic/cream)

### Neon Accents (Chasing the Sun Only)
- Neon Pink: `#ff006e`
- Neon Blue: `#00d9ff`
- Neon Purple: `#b700ff`
- Neon Orange: `#ff9500`

### Community
- Warm colors: soft amber, muted clay, warm taupe, gentle olive

### Casting Wing
- Background: `#2a2a2a` (charcoal grey)
- Text: `#f5f5f5` (off-white)

## JavaScript Architecture

### Storage Manager
Tracks user progression with localStorage:
```javascript
StorageManager.setTrailerWatched(true/false)
StorageManager.isTrailerWatched() // boolean
StorageManager.unlockWorld(worldId)
StorageManager.isWorldUnlocked(worldId)
```

### Gating Logic
- **Cinema Gate:** Enforces 90% video watch before proceeding
- **Viewing Room:** Blocks access if trailer not watched
- **Archive/Community:** Can be unlocked after world exploration (expandable)

### Carousel
Four-item carousel with:
- Arrow button navigation (prev/next)
- Dot indicators (clickable)
- Keyboard support (← →)
- Counter display (e.g., "1 / 4")
- Disabled state on boundaries

### Page Detection
`main.js` automatically detects current page and initializes appropriate logic:
```javascript
if (path.includes('cinema-gate')) CinemaGate.init();
else if (path.includes('viewing-room')) ViewingRoom.init();
else Threshold.init();
```

## Placeholder Content
All media paths point to placeholder locations:
- Videos: `/media/trailers/`, `/media/films/`
- Audio: `/media/music/`
- Real files can be added to these directories without code changes

## Responsive Design
All pages use CSS media queries for mobile/tablet optimization:
- Container padding adjusts
- Font sizes scale
- Button sizes reduce on small screens
- Carousel remains functional on mobile

## Future Enhancements

### Premium Font Integration
Update `css/fonts.css` to use premium fonts like Canela or Recoleta:
```css
@import url('https://fonts.adobe.com/...');
:root {
  --font-display: 'Canela', 'Recoleta', serif;
  /* fallbacks unchanged */
}
```

### Account System
Writers' Room and user-specific features can be added with:
- Modal-based account creation/login
- Server-side user session management
- Content submission forms

### Advanced Animations
- Page transitions with fade/slide effects
- Video playback progress indicators
- Neon glitch effects on Chasing the Sun pages
- Hover animations on interactive elements

### Multi-World Support
The system is architected for multiple worlds:
- Each world gets its own `viewingRoom-[worldId].html`
- Color schemes stored separately per world
- Archive/community filtering by world
- Navigation bar updates to show available worlds

## Usage

### Local Development
1. Open `index.html` in a modern browser
2. Navigate through: Threshold → Cinema Gate → Viewing Room
3. Use browser developer tools to inspect localStorage under Application > Storage

### Testing Gating
- **Clear progress:** Run in browser console: `KiramelStorage.reset()`
- **Force unlock:** `KiramelStorage.setTrailerWatched(true)`
- **Check state:** `KiramelStorage.isTrailerWatched()`

### Modifying Content
- **Edit text:** Update HTML in relevant page files
- **Update colors:** Modify CSS variables in `css/global.css`
- **Add videos:** Place media files in corresponding `/media/` folders
- **Adjust fonts:** Update CSS variable definitions in `css/fonts.css`

## Design Philosophy

- **Progression is intentional:** Users earn access through completion
- **Mystery is preserved:** No spoilers in UI, gating enforces narrative flow
- **Authority remains centralized:** All content is curated, not user-generated (except Writers' Room)
- **Visual restraint:** Neon and glitch effects confined to Chasing the Sun era
- **Meaningful interaction:** Each click or navigation serves the experience, no clutter

## Browser Support
Tested on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

**Last Updated:** February 5, 2026
