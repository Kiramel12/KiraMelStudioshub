/* Kiramel Studios Hub – Utility Functions */

/**
 * Local Storage Manager
 * Simple wrapper for managing user progression state
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

  reset() {
    localStorage.removeItem(this.KEY_TRAILER_WATCHED);
    localStorage.removeItem(this.KEY_CURRENT_ERA);
    localStorage.removeItem(this.KEY_UNLOCKED_WORLDS);
  }
};

/**
 * Page Route Manager
 * Manages navigation between pages
 */
const Router = {
  routes: {
    threshold: '/',
    'cinema-gate': '/pages/cinema-gate.html',
    'viewing-room': '/pages/viewing-room.html',
    archive: '/pages/archive.html',
    community: '/pages/community.html',
    'writers-room': '/pages/writers-room.html',
    'casting-wing': '/pages/casting-wing.html'
  },

  getCurrentRoute() {
    const path = window.location.pathname;
    if (path === '/' || path.includes('index.html')) return 'threshold';
    if (path.includes('cinema-gate')) return 'cinema-gate';
    if (path.includes('viewing-room')) return 'viewing-room';
    if (path.includes('archive')) return 'archive';
    if (path.includes('community')) return 'community';
    if (path.includes('writers-room')) return 'writers-room';
    if (path.includes('casting-wing')) return 'casting-wing';
    return 'threshold';
  },

  navigate(routeName) {
    const route = this.routes[routeName];
    if (route) {
      window.location.href = route;
    }
  }
};

/**
 * DOM Utilities
 */
const DOM = {
  query(selector) {
    return document.querySelector(selector);
  },

  queryAll(selector) {
    return document.querySelectorAll(selector);
  },

  addClass(element, className) {
    if (element) element.classList.add(className);
  },

  removeClass(element, className) {
    if (element) element.classList.remove(className);
  },

  toggleClass(element, className) {
    if (element) element.classList.toggle(className);
  },

  hasClass(element, className) {
    return element ? element.classList.contains(className) : false;
  },

  setAttr(element, attr, value) {
    if (element) element.setAttribute(attr, value);
  },

  getAttr(element, attr) {
    return element ? element.getAttribute(attr) : null;
  },

  setText(element, text) {
    if (element) element.textContent = text;
  },

  setHTML(element, html) {
    if (element) element.innerHTML = html;
  },

  show(element) {
    if (element) element.classList.remove('hidden');
  },

  hide(element) {
    if (element) element.classList.add('hidden');
  },

  on(element, event, handler) {
    if (element) element.addEventListener(event, handler);
  },

  off(element, event, handler) {
    if (element) element.removeEventListener(event, handler);
  }
};

/**
 * Deep link navigation (internal)
 */
function navigateTo(routeName) {
  const baseUrl = window.location.origin + '/kiramelstudios';
  const routes = {
    'threshold': baseUrl + '/index.html',
    'cinema-gate': baseUrl + '/pages/cinema-gate.html',
    'viewing-room': baseUrl + '/pages/viewing-room.html',
    'archive': baseUrl + '/pages/archive.html',
    'community': baseUrl + '/pages/community.html',
    'writers-room': baseUrl + '/pages/writers-room.html',
    'casting-wing': baseUrl + '/pages/casting-wing.html'
  };

  const url = routes[routeName];
  if (url) {
    window.location.href = url;
  }
}

export { StorageManager, Router, DOM, navigateTo };
