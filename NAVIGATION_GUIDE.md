# Navigation System & Access Control Documentation

## Overview

The Kiramel Studios Hub now includes a comprehensive navigation system with progression-based access control. After users complete the Cinema Gate (trailer), they're directed to the **Hub page** where they can navigate between different sections of the studio.

## Navigation Flow

```
Threshold (index.html)
    ↓ [Click "Begin"]
Cinema Gate (pages/cinema-gate.html)
    ↓ [Watch 90% of trailer / 1-minute test bar]
HUB (pages/hub.html) ← NEW: Main navigation center
    ├─ Viewing Room (pages/viewing-room.html) [Always accessible]
    ├─ Explore Worlds (pages/explore-worlds.html) [Always accessible]
    ├─ Lore Pack/Archive (pages/archive.html) [LOCKED until world explored]
    ├─ Community (pages/community.html) [LOCKED until world explored]
    ├─ Writers' Room (pages/writers-room.html) [LOCKED until account created]
    └─ Casting Wing (pages/casting-wing.html) [Always accessible]
```

## Key Components

### 1. Hub Page (`pages/hub.html`)
The main navigation center that displays all available sections as interactive cards.

**Features:**
- Grid-based card layout (responsive)
- Visual lock icons for unavailable sections
- Descriptive text for each section
- Clickable buttons that respect access control
- Footer explaining progression rules

**Access Check:**
Users automatically redirected to Cinema Gate if they try to access hub without watching trailer.

### 2. Explore Worlds Page (`pages/explore-worlds.html`)
Shows all available worlds/eras with ability to visit them.

**Current Content:**
- Chasing the Sun (visitable)
- Future Worlds (placeholder)

**Purpose:**
- Browse different eras before diving into them
- Future-proof for adding new worlds

### 3. Access Control System (in `js/main.js`)

```javascript
const AccessControl = {
  canAccessViewingRoom() {
    return StorageManager.isTrailerWatched();
  },

  canAccessLorePack() {
    return StorageManager.getAnyWorldExplored();
  },

  canAccessCommunity() {
    return StorageManager.getAnyWorldExplored();
  },

  canAccessWritersRoom() {
    return StorageManager.hasAccount();
  },

  canAccessCastingWing() {
    return true; // Always accessible
  },

  canAccessHub() {
    return StorageManager.isTrailerWatched();
  }
};
```

### 4. Storage Manager Extensions (in `js/main.js`)

New storage keys track progression:

```javascript
KEY_EXPLORED_WORLDS: 'ks-explored-worlds'    // Array of explored world IDs
KEY_ACCOUNT_CREATED: 'ks-account-created'    // Boolean: user has account
```

Methods:
- `markWorldExplored(worldId)` — Mark a world as explored
- `isWorldExplored(worldId)` — Check if world was explored
- `getAnyWorldExplored()` — Check if ANY world has been explored
- `createAccount()` — Create account (for Writers' Room)
- `hasAccount()` — Check if account exists

### 5. Hub Navigation Logic (in `js/main.js`)

```javascript
const HubNav = {
  init() {
    // Check access to hub
    // Setup all links with event listeners
    // Update visual lock states
  },

  setupLinks() {
    // Each section has [data-nav="section-id"]
    // Click handlers check access before routing
  },

  updateLockStates() {
    // Updates visual .locked class on cards
    // Shows/hides lock icons
    // Updates lock reason text
  },

  showLockMessage(section) {
    // Alerts user why section is locked
  }
};
```

## Progression Rules

| Section | Access Requirement | Locked Until |
|---------|-------------------|--------------|
| **Viewing Room** | Watched 90% of trailer | Never (available after cinema gate) |
| **Explore Worlds** | Watched trailer | Never (available after cinema gate) |
| **Casting Wing** | None required | Never (always open) |
| **Lore Pack** | Explored a world | User visits Viewing Room |
| **Community** | Explored a world | User visits Viewing Room |
| **Writers' Room** | Account created | User creates account via modal |

## How Progression Tracking Works

### Trailer Watched
- Set in Cinema Gate when 90% watched
- Unlocks: Hub, Viewing Room, Explore Worlds, Casting Wing

### World Explored
- Automatically set when user visits Viewing Room
- Current implementation: marks "chasing-the-sun" as explored
- Unlocks: Lore Pack, Community

### Account Created
- Set when user clicks "Create Account" in Writers' Room
- Can be triggered by modal/form interaction
- Unlocks: Writers' Room

## HTML Data Attributes

The Hub uses semantic data attributes for linking and access control:

```html
<!-- Navigation link -->
<button data-nav="viewing-room">Enter World</button>

<!-- Section for access control -->
<div data-section="viewing-room" class="section-card"></div>

<!-- Lock elements -->
<span class="lock-icon">🔒</span>
<span class="lock-text">Explore a world first</span>
```

## Adding New Sections (Future-Proof)

### 1. Add HTML to Hub (`pages/hub.html`)
```html
<div class="section-card" data-section="new-section">
  <div class="card-header">
    <h2 class="section-title">New Section</h2>
    <span class="lock-icon">🔒</span>
  </div>
  <p class="section-description">Description</p>
  <button class="section-link-btn" data-nav="new-section">
    Visit
  </button>
  <span class="lock-text">Lock reason</span>
</div>
```

### 2. Add Access Check in `js/main.js`
```javascript
// In AccessControl object:
canAccessNewSection() {
  return StorageManager.isWorldExplored('some-world');
},

// In HubNav setupLinks():
const newLink = document.querySelector('[data-nav="new-section"]');
if (newLink) {
  newLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (AccessControl.canAccessNewSection()) {
      window.location.href = './new-section.html';
    } else {
      this.showLockMessage('new-section');
    }
  });
},

// In HubNav updateLockStates():
else if (sectionType === 'new-section') {
  isLocked = !AccessControl.canAccessNewSection();
  lockReason = 'Your lock reason';
}
```

### 3. Add Page (`pages/new-section.html`)
```html
<!-- Create page with back link to hub -->
<a href="./hub.html">← Back to Hub</a>
```

### 4. Add to Page Detection (`js/main.js`)
```javascript
// In PageLogic.detectCurrentPage():
else if (path.includes('new-section')) {
  // Your page init logic
}
```

## Adding New Worlds

### 1. Update Explore Worlds (`pages/explore-worlds.html`)
```html
<div class="world-item">
  <p class="world-era">New Era</p>
  <h2 class="world-title">World Name</h2>
  <p class="world-description">Description</p>
  <button class="world-action" onclick="window.location.href='./world-page.html'">
    Visit World
  </button>
</div>
```

### 2. Create World Page (`pages/viewing-room-[world-id].html`)
```javascript
// In js/main.js PageLogic:
// Mark world as explored when visited
StorageManager.markWorldExplored('world-id');
```

### 3. Create World Hub Manager (Optional)
For multi-world support, could add:
```javascript
StorageManager.setCurrentWorld('world-id');
StorageManager.getCurrentWorld();
```

## Testing Access Control

### Browser Console Commands

```javascript
// Check if trailer watched
KiramelStorage.isTrailerWatched()

// Check if world explored
KiramelStorage.isWorldExplored('chasing-the-sun')

// Check if any world explored
KiramelStorage.getAnyWorldExplored()

// Check if account exists
KiramelStorage.hasAccount()

// Mark world as explored (for testing)
KiramelStorage.markWorldExplored('chasing-the-sun')

// Create account (for testing)
KiramelStorage.createAccount()

// View all storage
JSON.parse(localStorage.getItem('ks-explored-worlds'))
```

## Page Routing Summary

| Route | Pattern | Requires |
|-------|---------|----------|
| Threshold | `/index.html` | Nothing |
| Cinema Gate | `/pages/cinema-gate.html` | Nothing |
| Hub | `/pages/hub.html` | Trailer watched |
| Viewing Room | `/pages/viewing-room.html` | Trailer watched |
| Explore Worlds | `/pages/explore-worlds.html` | Trailer watched |
| Archive/Lore | `/pages/archive.html` | World explored |
| Community | `/pages/community.html` | World explored |
| Writers' Room | `/pages/writers-room.html` | Account created |
| Casting Wing | `/pages/casting-wing.html` | Nothing |

## CSS Classes

Hub styling defined in `css/hub.css`:

- `.hub` — Main container
- `.hub-header` — Header section
- `.sections-grid` — Grid layout for cards
- `.section-card` — Individual card
- `.section-card.locked` — Visual lock state
- `.lock-icon` — Lock symbol (🔒)
- `.lock-text` — Explanation text
- `.section-link-btn` — Button styling

## Error Handling

Users attempting unauthorized access:
1. Click locked button
2. Access check fails
3. `showLockMessage()` displays alert
4. User remains on hub
5. No page navigation occurs

## Future Enhancements

### Optional: Modal Login for Writers' Room
```javascript
// Instead of alert, show modal:
showAccountModal() {
  // Display form
  // On submit: StorageManager.createAccount()
  // Unlock Writers' Room
}
```

### Optional: Breadcrumb Navigation
Add breadcrumbs to all pages:
```html
<nav class="breadcrumbs">
  <a href="./hub.html">Hub</a> > <span>Current Page</span>
</nav>
```

### Optional: Progress Bar
Show overall completion on Hub:
```javascript
getProgressPercentage() {
  const sections = ['viewing-room', 'lore-pack', 'community', 'writers-room'];
  const unlocked = sections.filter(s => AccessControl.canAccess(s)).length;
  return (unlocked / sections.length) * 100;
}
```

---

## Summary

The navigation system is:
- ✅ **Functional** — All routing works immediately
- ✅ **Extensible** — Easy to add new sections/worlds
- ✅ **Future-Proof** — Data-attribute based, no hard-coded paths
- ✅ **Access-Controlled** — Progression rules enforced
- ✅ **Non-Disruptive** — Users can't bypass, clear feedback on locks
