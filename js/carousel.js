/* Kiramel Studios Hub – Carousel Functionality */

const Carousel = {
  currentIndex: 0,
  items: [],
  container: null,
  viewport: null,
  prevButton: null,
  nextButton: null,
  indicators: [],
  counter: null,

  init(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.viewport = this.container.querySelector('.carousel-viewport');
    this.prevButton = this.container.querySelector('[data-carousel-prev]');
    this.nextButton = this.container.querySelector('[data-carousel-next]');
    this.counter = this.container.querySelector('[data-carousel-counter]');
    this.items = this.container.querySelectorAll('.carousel-item');
    this.indicators = this.container.querySelectorAll('[data-carousel-indicator]');

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
      if (this.container.classList.contains('active')) {
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      }
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

export { Carousel };
