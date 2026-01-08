/**
 * Accessibility & WCAG Compliance Module
 * Ensures application meets WCAG 2.1 AA standards
 */

/**
 * ARIA attributes for common patterns
 */
export const ariaAttributes = {
  // Button with icon
  iconButton: (ariaLabel, ariaPressed = null) => ({
    'aria-label': ariaLabel,
    ...(ariaPressed !== null && { 'aria-pressed': ariaPressed }),
    role: 'button',
  }),

  // Interactive section
  interactiveSection: (ariaLabel) => ({
    'aria-label': ariaLabel,
    role: 'region',
  }),

  // Progress indicator
  progressBar: (current, total, ariaLabel) => ({
    role: 'progressbar',
    'aria-valuenow': current,
    'aria-valuemin': 0,
    'aria-valuemax': total,
    'aria-label': ariaLabel,
  }),

  // Alert/notification
  alert: (type = 'polite') => ({
    role: 'alert',
    'aria-live': type,
  }),

  // Expandable section
  expandable: (isExpanded, ariaLabel) => ({
    'aria-expanded': isExpanded,
    'aria-label': ariaLabel,
  }),

  // Dialog/modal
  dialog: (ariaLabel) => ({
    role: 'dialog',
    'aria-labelledby': ariaLabel,
  }),
};

/**
 * Semantic HTML structure helpers
 */
export const semanticStructure = {
  heading: (level, text, id = null) => {
    const Tag = `h${Math.min(Math.max(level, 1), 6)}`;
    return {
      tag: Tag,
      text: text,
      ...(id && { id }),
    };
  },

  landmark: (type, content) => {
    const landmarks = {
      main: 'main',
      navigation: 'nav',
      sidebar: 'aside',
      footer: 'footer',
      header: 'header',
    };

    return {
      tag: landmarks[type] || 'div',
      content: content,
    };
  },

  button: (text, onClick, disabled = false, icon = null) => ({
    tag: 'button',
    text: text,
    onClick: onClick,
    disabled: disabled,
    icon: icon,
    type: 'button',
  }),

  link: (text, href, external = false) => ({
    tag: 'a',
    text: text,
    href: href,
    ...(external && { target: '_blank', rel: 'noopener noreferrer' }),
  }),
};

/**
 * Color contrast checker - WCAG AA compliance
 */
export function checkColorContrast(foreground, background) {
  // Convert hex to RGB
  const getRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ] : null;
  };

  const rgb1 = getRgb(foreground);
  const rgb2 = getRgb(background);

  if (!rgb1 || !rgb2) return null;

  // Calculate relative luminance
  const getLuminance = (rgb) => {
    const [r, g, b] = rgb.map(val => {
      const v = val / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);

  const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio: contrast.toFixed(2),
    AA: contrast >= 4.5, // Normal text
    AALarge: contrast >= 3, // Large text (18pt+)
    AAA: contrast >= 7, // Enhanced
  };
}

/**
 * Accessible focus management
 */
export class FocusManager {
  constructor(containerRef) {
    this.containerRef = containerRef;
    this.focusableElements = [
      'button',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ];
  }

  getFocusableElements() {
    if (!this.containerRef) return [];
    return Array.from(
      this.containerRef.querySelectorAll(this.focusableElements.join(','))
    );
  }

  focusFirst() {
    const elements = this.getFocusableElements();
    if (elements.length > 0) {
      elements[0].focus();
    }
  }

  focusLast() {
    const elements = this.getFocusableElements();
    if (elements.length > 0) {
      elements[elements.length - 1].focus();
    }
  }

  moveToNext(currentElement) {
    const elements = this.getFocusableElements();
    const index = elements.indexOf(currentElement);
    if (index < elements.length - 1) {
      elements[index + 1].focus();
    }
  }

  moveToPrevious(currentElement) {
    const elements = this.getFocusableElements();
    const index = elements.indexOf(currentElement);
    if (index > 0) {
      elements[index - 1].focus();
    }
  }

  trapFocus(event) {
    if (event.key !== 'Tab') return;

    const elements = this.getFocusableElements();
    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  }
}

/**
 * Keyboard navigation handler
 */
export class KeyboardNavigator {
  constructor(options = {}) {
    this.options = {
      arrowKeysMove: options.arrowKeysMove !== false,
      enterActivates: options.enterActivates !== false,
      escapeCloses: options.escapeCloses !== false,
      ...options,
    };
  }

  handleKeyDown(event, handlers = {}) {
    const { onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onEnter, onEscape } = handlers;

    switch (event.key) {
      case 'ArrowUp':
        if (this.options.arrowKeysMove && onArrowUp) {
          onArrowUp(event);
          event.preventDefault();
        }
        break;
      case 'ArrowDown':
        if (this.options.arrowKeysMove && onArrowDown) {
          onArrowDown(event);
          event.preventDefault();
        }
        break;
      case 'ArrowLeft':
        if (this.options.arrowKeysMove && onArrowLeft) {
          onArrowLeft(event);
          event.preventDefault();
        }
        break;
      case 'ArrowRight':
        if (this.options.arrowKeysMove && onArrowRight) {
          onArrowRight(event);
          event.preventDefault();
        }
        break;
      case 'Enter':
        if (this.options.enterActivates && onEnter) {
          onEnter(event);
          event.preventDefault();
        }
        break;
      case 'Escape':
        if (this.options.escapeCloses && onEscape) {
          onEscape(event);
          event.preventDefault();
        }
        break;
    }
  }
}

/**
 * Screen reader announcements
 */
export class ScreenReaderAnnouncer {
  constructor() {
    this.container = null;
  }

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'sr-announcer';
      this.container.setAttribute('aria-live', 'polite');
      this.container.setAttribute('aria-atomic', 'true');
      this.container.style.position = 'absolute';
      this.container.style.left = '-10000px';
      this.container.style.width = '1px';
      this.container.style.height = '1px';
      this.container.style.overflow = 'hidden';
      document.body.appendChild(this.container);
    }
  }

  announce(message, priority = 'polite') {
    this.init();
    this.container.setAttribute('aria-live', priority);
    this.container.textContent = message;
    setTimeout(() => {
      this.container.textContent = '';
    }, 1000);
  }

  announcePriority(message) {
    this.announce(message, 'assertive');
  }
}

/**
 * Text sizing utilities for readability
 */
export const textSizeAccessibility = {
  baseFont: 16, // px
  minFont: 12, // px

  getScaleFactor(userPreference = 'normal') {
    const factors = {
      small: 0.85,
      normal: 1,
      large: 1.2,
      xlarge: 1.4,
      xxlarge: 1.6,
    };
    return factors[userPreference] || 1;
  },

  getComputedSize(baseSize, userPreference) {
    const computed = baseSize * this.getScaleFactor(userPreference);
    return Math.max(this.minFont, computed);
  },

  getLineHeight(fontSize) {
    // WCAG recommendation: 1.5x font size
    return Math.round(fontSize * 1.5);
  },

  getLetterSpacing(fontSize) {
    // WCAG recommendation: 0.12x font size
    return Math.round(fontSize * 0.12);
  },

  getWordSpacing(fontSize) {
    // WCAG recommendation: 0.16x font size
    return Math.round(fontSize * 0.16);
  },
};

/**
 * Motion and animation safety (respects prefers-reduced-motion)
 */
export const motionSafety = {
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  getAnimationDuration(normalDuration = 300) {
    return this.prefersReducedMotion() ? 0 : normalDuration;
  },

  getTransitionStyles(normalDuration = 300, properties = 'all') {
    const duration = this.getAnimationDuration(normalDuration);
    return {
      transition: duration > 0 ? `${properties} ${duration}ms ease` : 'none',
    };
  },
};

/**
 * Form accessibility helpers
 */
export const formAccessibility = {
  createLabel: (htmlFor, text, required = false) => ({
    htmlFor: htmlFor,
    text: text,
    required: required,
    ariaRequired: required,
  }),

  createInput: (id, type = 'text', required = false, describedBy = null) => ({
    id: id,
    type: type,
    required: required,
    ...(describedBy && { 'aria-describedby': describedBy }),
  }),

  createError: (id, message) => ({
    id: id,
    text: message,
    role: 'alert',
  }),

  createHint: (id, hint) => ({
    id: id,
    text: hint,
  }),
};
