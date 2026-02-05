# Kiramel Studios Hub – Quick Start Guide

## Getting Started

1. **Open the site:** Open `index.html` in a web browser
2. **Experience the flow:**
   - **Threshold** (black & white gate) → Click "Begin"
   - **Cinema Gate** (watch trailer) → Watch 90% of video, then "Proceed"
   - **Viewing Room** (burgundy world) → Browse carousel, explore content

## File Structure at a Glance

```
kiramelstudios/
├── index.html                    ← Start here (Threshold)
├── pages/
│   ├── cinema-gate.html         ← Trailer gate
│   ├── viewing-room.html        ← Current world (Chasing the Sun)
│   ├── archive.html             ← Lore Pack
│   ├── community.html           ← Discussion
│   ├── writers-room.html        ← Fan content
│   └── casting-wing.html        ← Professional calls
├── css/
│   ├── fonts.css                ← Google Fonts + premium font swaps
│   ├── global.css               ← Typography, colors, utilities
│   ├── threshold.css            ← Entry page styles
│   ├── cinema-gate.css          ← Trailer gate styles
│   └── viewing-room.css         ← World display styles
├── js/
│   ├── main.js                  ← Core app logic & gating
│   ├── utils.js                 ← Storage & utilities
│   └── carousel.js              ← Modular carousel
├── media/                       ← Placeholder folders for videos, audio
└── README.md                    ← Full documentation
```

## How Progression Works

```
index.html (Threshold)
    ↓ [Click "Begin"]
pages/cinema-gate.html (Trailer Gate)
    ↓ [Watch 90% of video]
pages/viewing-room.html (Chasing the Sun World)
    ↓ [Explore content]
pages/archive.html (Archive - unlockable)
pages/community.html (Community - unlockable)
pages/writers-room.html (Writers' Room - account required)
pages/casting-wing.html (Casting - always accessible)
```

## Key Features

### 1. Gating System
- Cinema Gate requires 90% video watch before proceeding
- Viewing Room checks if user watched trailer
- Uses browser localStorage to track progress
- Test: Open console and run `KiramelStorage.reset()` to clear progress

### 2. Responsive Carousel
- 4 content items in Viewing Room
- Click arrows or dots to navigate
- Keyboard support (← →)
- Displays counter (e.g., "1 / 4")

### 3. Color-Coded Pages
- **Threshold:** Pure black & white
- **Cinema Gate:** Near-black with soft white
- **Viewing Room:** Deep burgundy with cream accents
- **Community:** Warm tones (amber, clay, olive)
- **Writers' Room:** Dark with metallic accents
- **Casting Wing:** Professional charcoal

### 4. Typography System
- **Display headings:** Playfair Display (swap for Canela/Recoleta)
- **Accent/UI:** Space Grotesk (swap for Neue Montreal)
- **Body text:** Inter (swap for Source Sans 3)

**To use premium fonts:** Update top line of each `--font-*` variable in `css/fonts.css`

## Testing Checklist

- [ ] Open `index.html` → see black & white Threshold
- [ ] Click "Begin" → navigate to Cinema Gate
- [ ] Drag video slider to ~90% → "Proceed" button unlocks
- [ ] Click "Proceed" → see burgundy Viewing Room
- [ ] Use arrow buttons / dots / keyboard to navigate carousel
- [ ] Click footer links to visit Archive, Community, etc.
- [ ] Open browser DevTools → Application > Storage > localStorage
  - Should see: `ks-trailer-watched: true`

## Customization Quick Links

| Want to... | Edit... |
|---|---|
| Change fonts | `css/fonts.css` (update `--font-*` variables) |
| Adjust colors | `css/global.css` (update `:root` color vars) |
| Modify Threshold text | `index.html` |
| Update Viewing Room title | `pages/viewing-room.html` |
| Add carousel items | `pages/viewing-room.html` (duplicate `.carousel-item` div) |
| Change watch threshold | `js/main.js` line: `watchThreshold: 90` |

## Adding Content Later

### Videos
1. Place `.mp4` files in `media/trailers/`, `media/films/`, or `media/music/`
2. Update `<source>` tags in HTML pages

### New Worlds
1. Duplicate `pages/viewing-room.html`
2. Create new `.css` file with world-specific colors
3. Add new page to navigation
4. Update gating logic in `js/main.js`

### Custom Neon Effects (Chasing the Sun)
Already set up! Use CSS classes:
```html
<span class="neon-accent">Pink text</span>
<span class="neon-accent-secondary">Blue text</span>
```

## Browser Console Commands

```javascript
// Check if trailer was watched
KiramelStorage.isTrailerWatched()

// Mark trailer as watched
KiramelStorage.setTrailerWatched(true)

// Reset all progress
KiramelStorage.reset()

// Get unlocked worlds
KiramelStorage.getUnlockedWorlds()

// Unlock a world
KiramelStorage.unlockWorld('chasing-the-sun')
```

## Storage Structure

The site uses browser `localStorage` with these keys:
- `ks-trailer-watched` ← Boolean (true/false)
- `ks-current-era` ← String (default: "chasing-the-sun")
- `ks-unlocked-worlds` ← Array of world IDs

## Common Issues

**Q: Videos not loading?**
A: Replace paths in `<source src="">` tags with actual video files

**Q: Carousel not working?**
A: Ensure `.carousel-viewport`, buttons with `data-carousel-prev/next`, and indicators with `data-carousel-indicator` exist

**Q: Typography looks different?**
A: Google Fonts might take a moment to load. Hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)

**Q: "Proceed" button won't unlock?**
A: Make sure video watch is tracked. Check that `<video>` tag has `data-cinema-video` attribute

## Next Steps

1. Add real video/audio files to `media/` folders
2. Replace placeholder text with actual content
3. Implement premium fonts in `css/fonts.css`
4. Design additional worlds following same pattern
5. Add account system (if Writers' Room needs authentication)
6. Set up backend for submission forms (Writers' Room, Casting Wing)

---

**Questions?** Refer to the full `README.md` for detailed documentation.
