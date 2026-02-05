/* Kiramel Studios Hub – Main App Logic */

/**
 * Storage Manager for user progression
 */
const StorageManager = {
  KEY_TRAILER_WATCHED: 'ks-trailer-watched',
  KEY_CURRENT_ERA: 'ks-current-era',
  KEY_UNLOCKED_WORLDS: 'ks-unlocked-worlds',

  setTrailerWatched(watched = true) {
    localStorage.setItem(this.KEY_TRAILER_WATCHED, JSON.stringify(watched));
  },

  isTrailerWatched() {
    return JSON.parse(localStorage.getItem(this.KEY_TRAILER_WATCHED) || 'false');
  },

  setCurrentEra(era) {
    localStorage.setItem(this.KEY_CURRENT_ERA, era);
  },

  getCurrentEra() {
    return localStorage.getItem(this.KEY_CURRENT_ERA) || 'chasing-the-sun';
  },

  setUnlockedWorlds(worlds) {
    localStorage.setItem(this.KEY_UNLOCKED_WORLDS, JSON.stringify(worlds));
  },

  getUnlockedWorlds() {
    return JSON.parse(localStorage.getItem(this.KEY_UNLOCKED_WORLDS) || '["chasing-the-sun"]');
  },

  unlockWorld(worldId) {
    const unlocked = this.getUnlockedWorlds();
    if (!unlocked.includes(worldId)) {
      unlocked.push(worldId);
      this.setUnlockedWorlds(unlocked);
    }
  },

  isWorldUnlocked(worldId) {
    return this.getUnlockedWorlds().includes(worldId);
  },

  KEY_EXPLORED_WORLDS: 'ks-explored-worlds',
  KEY_ACCOUNT_CREATED: 'ks-account-created',

  markWorldExplored(worldId) {
    const explored = JSON.parse(localStorage.getItem(this.KEY_EXPLORED_WORLDS) || '[]');
    if (!explored.includes(worldId)) {
      explored.push(worldId);
      localStorage.setItem(this.KEY_EXPLORED_WORLDS, JSON.stringify(explored));
    }
  },

  isWorldExplored(worldId) {
    const explored = JSON.parse(localStorage.getItem(this.KEY_EXPLORED_WORLDS) || '[]');
    return explored.includes(worldId);
  },

  getAnyWorldExplored() {
    const explored = JSON.parse(localStorage.getItem(this.KEY_EXPLORED_WORLDS) || '[]');
    return explored.length > 0;
  },

  createAccount() {
    localStorage.setItem(this.KEY_ACCOUNT_CREATED, 'true');
  },

  hasAccount() {
    return localStorage.getItem(this.KEY_ACCOUNT_CREATED) === 'true';
  },

  reset() {
    localStorage.removeItem(this.KEY_TRAILER_WATCHED);
    localStorage.removeItem(this.KEY_CURRENT_ERA);
    localStorage.removeItem(this.KEY_UNLOCKED_WORLDS);
    localStorage.removeItem(this.KEY_EXPLORED_WORLDS);
    localStorage.removeItem(this.KEY_ACCOUNT_CREATED);
  }
};

/**
 * Threshold Page Logic
 * Entry point to the experience
 */
const Threshold = {
  init() {
    const enterBtn = document.querySelector('[data-action="enter"]');
    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        this.enter();
      });
    }
  },

  enter() {
    // Mark that user has acknowledged threshold
    // Navigate to cinema gate
    window.location.href = './pages/cinema-gate.html';
  }
};

/**
 * Cinema Gate (Trailer Gate) Logic
 * Enforce full viewing before proceeding
 */
const CinemaGate = {
  watchProgress: 0,
  watchThreshold: 90, // 90% watched to unlock
  videoElement: null,
  continueButton: null,
  progressBar: null,
  playbackTimer: null,
  countdownTimer: null,
  countdownElement: null,
  isTestMode: true, // Enable test mode for demo playback

  init() {
    this.videoElement = document.querySelector('[data-cinema-video]');
    this.continueButton = document.querySelector('.cinema-button');
    this.progressBar = document.querySelector('.watch-progress-bar');
    this.countdownElement = document.querySelector('#countdown-timer');

    // Start countdown timer
    this.startCountdown();

    if (this.videoElement) {
      // Check if it's a real video element or test mode
      if (this.videoElement.tagName === 'VIDEO') {
        this.setupVideoTracking();
      } else {
        this.setupTestPlayback();
      }
    }

    // Check if already watched
    if (StorageManager.isTrailerWatched()) {
      this.completeCountdown();
    }
  },

  startCountdown() {
    let timeRemaining = 60; // 60 seconds
    if (this.countdownElement) {
      this.countdownElement.textContent = this.formatTime(timeRemaining);
    }

    this.countdownTimer = setInterval(() => {
      timeRemaining--;
      if (this.countdownElement) {
        this.countdownElement.textContent = this.formatTime(timeRemaining);
      }

      if (timeRemaining <= 0) {
        this.completeCountdown();
      }
    }, 1000);
  },

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  completeCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
    if (this.countdownElement) {
      this.countdownElement.textContent = '00:00';
    }
  },

  setupTestPlayback() {
    // Simulate 1-minute playback (60 seconds)
    const testDuration = 60000; // 60 seconds in milliseconds
    const startTime = Date.now();

    this.playbackTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      this.watchProgress = (elapsed / testDuration) * 100;

      // Complete at 100%
      if (this.watchProgress >= 100) {
        clearInterval(this.playbackTimer);
        this.watchProgress = 100;
        StorageManager.setTrailerWatched(true);
      }
    }, 100); // Update every 100ms
  },

  setupVideoTracking() {
    this.videoElement.addEventListener('timeupdate', () => {
      this.updateProgress();
    });

    this.videoElement.addEventListener('ended', () => {
      this.onVideoEnded();
    });
  },

  updateProgress() {
    if (this.videoElement.duration > 0) {
      this.watchProgress = (this.videoElement.currentTime / this.videoElement.duration) * 100;
    }
  },

  onVideoEnded() {
    StorageManager.setTrailerWatched(true);
  },

  proceedToViewingRoom() {
    // Clear timers if running
    if (this.playbackTimer) {
      clearInterval(this.playbackTimer);
    }
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
    // Mark trailer as watched and proceed
    StorageManager.setTrailerWatched(true);
    window.location.href = './viewing-room.html';
  },
};

/**
 * Viewing Room (Current World Display) Logic
 */
const ViewingRoom = {
  currentIndex: 0,
  items: [],
  container: null,
  viewport: null,
  prevButton: null,
  nextButton: null,
  indicators: [],
  counter: null,

  init() {
    this.container = document.querySelector('[data-carousel-container]');
    if (!this.container) return;

    this.viewport = this.container.querySelector('.carousel-viewport');
    this.prevButton = this.container.querySelector('[data-carousel-prev]');
    this.nextButton = this.container.querySelector('[data-carousel-next]');
    this.counter = this.container.querySelector('[data-carousel-counter]');
    this.items = this.container.querySelectorAll('.carousel-item');
    this.indicators = this.container.querySelectorAll('[data-carousel-indicator]');

    // Check access
    if (!StorageManager.isTrailerWatched()) {
      window.location.href = './cinema-gate.html';
      return;
    }

    this.attachEventListeners();
    this.updateUI();
  },

  attachEventListeners() {
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.prev());
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.next());
    }

    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goTo(index));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  },

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateUI();
    }
  },

  next() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
      this.updateUI();
    }
  },

  goTo(index) {
    if (index >= 0 && index < this.items.length) {
      this.currentIndex = index;
      this.updateUI();
    }
  },

  updateUI() {
    // Update viewport position
    if (this.viewport) {
      const offset = -this.currentIndex * 100;
      this.viewport.style.transform = `translateX(${offset}%)`;
    }

    // Update active states
    this.items.forEach((item, index) => {
      if (index === this.currentIndex) {
        item.classList.remove('inactive');
      } else {
        item.classList.add('inactive');
      }
    });

    // Update indicators
    this.indicators.forEach((indicator, index) => {
      if (index === this.currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });

    // Update counter
    if (this.counter) {
      this.counter.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
    }

    // Update button states
    if (this.prevButton) {
      this.prevButton.disabled = this.currentIndex === 0;
    }
    if (this.nextButton) {
      this.nextButton.disabled = this.currentIndex === this.items.length - 1;
    }
  }
};

/**
 * Access Control Logic
 */
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

/**
 * Hub Navigation Logic
 */
const HubNav = {
  init() {
    // Check if user has access to hub
    if (!AccessControl.canAccessHub()) {
      window.location.href = './cinema-gate.html';
      return;
    }

    // Setup navigation links with access control
    this.setupLinks();
    this.updateLockStates();
  },

  setupLinks() {
    // Viewing Room
    const viewingLink = document.querySelector('[data-nav="viewing-room"]');
    if (viewingLink) {
      viewingLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = './viewing-room.html';
      });
    }

    // Lore Pack
    const loreLink = document.querySelector('[data-nav="lore-pack"]');
    if (loreLink) {
      loreLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (AccessControl.canAccessLorePack()) {
          window.location.href = './archive.html';
        } else {
          this.showLockMessage('lore-pack');
        }
      });
    }

    // Community
    const communityLink = document.querySelector('[data-nav="community"]');
    if (communityLink) {
      communityLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (AccessControl.canAccessCommunity()) {
          window.location.href = './community.html';
        } else {
          this.showLockMessage('community');
        }
      });
    }

    // Writers' Room
    const writersLink = document.querySelector('[data-nav="writers-room"]');
    if (writersLink) {
      writersLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (AccessControl.canAccessWritersRoom()) {
          window.location.href = './writers-room.html';
        } else {
          this.showLockMessage('writers-room');
        }
      });
    }

    // Casting Wing
    const castingLink = document.querySelector('[data-nav="casting-wing"]');
    if (castingLink) {
      castingLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = './casting-wing.html';
      });
    }
  },

  updateLockStates() {
    // Update visual lock states
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => {
      const sectionType = section.getAttribute('data-section');
      const lockIcon = section.querySelector('.lock-icon');
      const lockText = section.querySelector('.lock-text');

      let isLocked = false;
      let lockReason = '';

      if (sectionType === 'viewing-room') {
        isLocked = !AccessControl.canAccessViewingRoom();
        lockReason = 'Complete the trailer';
      } else if (sectionType === 'lore-pack') {
        isLocked = !AccessControl.canAccessLorePack();
        lockReason = 'Explore a world first';
      } else if (sectionType === 'community') {
        isLocked = !AccessControl.canAccessCommunity();
        lockReason = 'Explore a world first';
      } else if (sectionType === 'writers-room') {
        isLocked = !AccessControl.canAccessWritersRoom();
        lockReason = 'Create an account';
      }

      if (isLocked) {
        section.classList.add('locked');
        if (lockIcon) lockIcon.style.display = 'inline';
        if (lockText) lockText.textContent = lockReason;
      } else {
        section.classList.remove('locked');
        if (lockIcon) lockIcon.style.display = 'none';
      }
    });
  },

  showLockMessage(section) {
    let message = '';
    if (section === 'lore-pack' || section === 'community') {
      message = 'This section unlocks after exploring a world.\n\nVisit the Viewing Room first to explore Chasing the Sun.';
    } else if (section === 'writers-room') {
      message = 'Create an account to access the Writers\' Room.';
    }
    alert(message);
  }
};

/**
 * General Page Logic
 */
const PageLogic = {
  detectCurrentPage() {
    const path = window.location.pathname;

    if (path.includes('cinema-gate')) {
      CinemaGate.init();
    } else if (path.includes('/hub')) {
      HubNav.init();
    } else if (path.includes('viewing-room')) {
      ViewingRoom.init();
      // Mark world as explored when viewing room is accessed
      StorageManager.markWorldExplored('chasing-the-sun');
    } else if (path === '/' || path.includes('index.html')) {
      Threshold.init();
    }
  }
};

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  PageLogic.detectCurrentPage();
});

// Expose StorageManager globally for debugging/admin
window.KiramelStorage = StorageManager;
