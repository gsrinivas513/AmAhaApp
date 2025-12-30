// Micro-Interactions Library
// Reusable components for common interactive patterns

export const MicroInteractions = {
  /**
   * Ripple effect on click
   * Creates Material Design-style ripple
   */
  RippleEffect: `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    }
  `,

  /**
   * Smooth button transitions
   */
  ButtonTransition: `
    button {
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    button:active {
      transform: translateY(0);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `,

  /**
   * Card hover effects
   */
  CardHover: `
    .card {
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    .card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
    }
  `,

  /**
   * Loading skeleton animation
   */
  Skeleton: `
    @keyframes skeleton-loading {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
    
    .skeleton {
      background: linear-gradient(
        90deg,
        #e5e7eb 25%,
        #f3f4f6 50%,
        #e5e7eb 75%
      );
      background-size: 1000px 100%;
      animation: skeleton-loading 2s infinite;
    }
  `,

  /**
   * Smooth color transitions
   */
  ColorTransition: `
    * {
      transition: color 0.2s ease, background-color 0.2s ease;
    }
  `,

  /**
   * Tap feedback for touch devices
   */
  TapFeedback: `
    @media (hover: none) and (pointer: coarse) {
      button, a {
        transition: all 0.15s ease;
      }
      
      button:active, a:active {
        opacity: 0.8;
        transform: scale(0.98);
      }
    }
  `,

  /**
   * Smooth scroll behavior
   */
  SmoothScroll: `
    html {
      scroll-behavior: smooth;
    }
  `,

  /**
   * Focus states for accessibility
   */
  FocusStates: `
    button:focus,
    a:focus,
    input:focus {
      outline: 2px solid #0284c7;
      outline-offset: 2px;
    }
  `,

  /**
   * Text selection styling
   */
  TextSelection: `
    ::selection {
      background: #0284c7;
      color: white;
    }
  `,

  /**
   * Smooth opacity transitions
   */
  FadeTransition: `
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,

  /**
   * Success, warning, error states
   */
  StateTransitions: `
    .success {
      color: #059669;
      background: #d1fae5;
      border-color: #059669;
      animation: slideUp 0.3s ease;
    }
    
    .warning {
      color: #d97706;
      background: #fed7aa;
      border-color: #d97706;
      animation: slideUp 0.3s ease;
    }
    
    .error {
      color: #dc2626;
      background: #fecaca;
      border-color: #dc2626;
      animation: slideUp 0.3s ease;
    }
  `,

  /**
   * Expand/collapse animation
   */
  Collapse: `
    @keyframes expand {
      from {
        max-height: 0;
        opacity: 0;
        overflow: hidden;
      }
      to {
        max-height: 1000px;
        opacity: 1;
        overflow: hidden;
      }
    }
    
    @keyframes collapse {
      from {
        max-height: 1000px;
        opacity: 1;
        overflow: hidden;
      }
      to {
        max-height: 0;
        opacity: 0;
        overflow: hidden;
      }
    }
  `,

  /**
   * Notification entrance
   */
  NotificationSlide: `
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `,

  /**
   * Modal entrance
   */
  ModalFade: `
    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `,

  /**
   * Tooltip animation
   */
  TooltipAppear: `
    @keyframes tooltipAppear {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,

  /**
   * Checkbox animation
   */
  CheckboxAnimation: `
    @keyframes checkmark {
      0% {
        stroke-dashoffset: 24px;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }
  `,

  /**
   * Input focus animation
   */
  InputFocus: `
    input:focus {
      border-color: #0284c7;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
      transition: all 0.2s ease;
    }
  `
};

/**
 * Inject all micro-interaction styles into document
 */
export function injectMicroInteractions() {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  const css = Object.values(MicroInteractions).join('\n\n');
  style.textContent = css;
  document.head.appendChild(style);
}

/**
 * Usage:
 * 
 * // In your main App.js or index.js
 * import { injectMicroInteractions } from './utils/MicroInteractions';
 * 
 * useEffect(() => {
 *   injectMicroInteractions();
 * }, []);
 */

/**
 * Easing functions for smooth animations
 */
export const EasingFunctions = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
  easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
  easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
  easeInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
  easeOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
  easeInOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)',
  easeInCirc: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
  easeOutCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
  easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
  easeInExpo: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
  easeOutExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
  easeInOutExpo: 'cubic-bezier(1, 0, 0, 1)',
  easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  easeInElastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  easeOutElastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  easeInOutElastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};

/**
 * Animation duration constants
 */
export const AnimationDurations = {
  instant: '0.05s',
  fast: '0.15s',
  smooth: '0.3s',
  normal: '0.5s',
  slow: '0.8s',
  verySlow: '1.2s'
};

/**
 * Delay increments for staggered animations
 */
export const StaggerDelays = {
  tiny: '0.05s',
  small: '0.1s',
  medium: '0.15s',
  normal: '0.2s',
  large: '0.3s'
};
