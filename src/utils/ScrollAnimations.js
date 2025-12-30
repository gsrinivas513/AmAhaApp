// Scroll Animation Utilities and Hooks
// Provides scroll-triggered animations matching PuzzleFree.game style

import { useEffect, useRef, useState } from 'react';

/**
 * Intersection Observer Hook for scroll animations
 * Triggers animations when elements enter viewport
 */
export function useScrollAnimation(threshold = 0.1) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return { ref, isVisible };
}

/**
 * Parallax scroll effect hook
 * Creates depth with different scroll speeds
 */
export function useParallax(speed = 0.5) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrollPosition = window.scrollY;
        setOffset(scrollPosition * speed);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { ref, offset };
}

/**
 * Animated number counter hook
 * Counts from 0 to target value
 */
export function useCountUp(target = 100, duration = 1000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startValue = 0;
    const increment = target / (duration / 16);
    let animationId;

    const animate = () => {
      startValue += increment;
      if (startValue < target) {
        setCount(Math.floor(startValue));
        animationId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isVisible, target, duration]);

  return { ref, count };
}

/**
 * CSS animation keyframes
 */
export const ScrollAnimationStyles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}
`;

/**
 * Scroll animation component wrapper
 * Applies animation when element enters viewport
 */
export function ScrollAnimated({
  children,
  animationType = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  ...props
}) {
  const { ref, isVisible } = useScrollAnimation();

  const animationStyle = {
    animation: isVisible
      ? `${animationType} ${duration}s ease-out ${delay}s both`
      : 'none',
    willChange: 'transform, opacity'
  };

  return (
    <div ref={ref} style={animationStyle} {...props}>
      {children}
    </div>
  );
}

/**
 * Staggered animation for lists
 * Delays each child element
 */
export function ScrollAnimatedList({
  children,
  animationType = 'fadeInUp',
  staggerDelay = 0.1,
  duration = 0.6
}) {
  return (
    <>
      {Array.isArray(children) &&
        children.map((child, index) => (
          <ScrollAnimated
            key={index}
            animationType={animationType}
            delay={index * staggerDelay}
            duration={duration}
          >
            {child}
          </ScrollAnimated>
        ))}
    </>
  );
}

/**
 * Page transition animation component
 * Smooth fade-in on page load
 */
export function PageTransition({ children, duration = 0.4 }) {
  return (
    <div
      style={{
        animation: `fadeInUp ${duration}s ease-out`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
}

/**
 * Example usage in component:
 * 
 * import { ScrollAnimated, useCountUp, useParallax } from './ScrollAnimations';
 * 
 * function MyComponent() {
 *   const { ref: countRef, count } = useCountUp(500, 1500);
 *   const { ref: parallaxRef, offset } = useParallax(0.5);
 * 
 *   return (
 *     <>
 *       <ScrollAnimated animationType="fadeInUp" delay={0.2}>
 *         <h2>Animated heading</h2>
 *       </ScrollAnimated>
 * 
 *       <div ref={parallaxRef} style={{ transform: `translateY(${offset}px)` }}>
 *         <img src="background.jpg" alt="parallax" />
 *       </div>
 * 
 *       <div ref={countRef}>
 *         <h3>{count}+</h3>
 *       </div>
 *     </>
 *   );
 * }
 */
