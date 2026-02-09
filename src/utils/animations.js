import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const EASE = "expo.out";
export const EASE_SMOOTH = "power2.out";

export function fadeInUp(element, { delay = 0, duration = 1, y = 40, trigger } = {}) {
  return gsap.from(element, {
    y,
    opacity: 0,
    duration,
    delay,
    ease: EASE,
    scrollTrigger: trigger ? {
      trigger: trigger,
      start: "top 85%",
      toggleActions: "play none none none",
    } : undefined,
  });
}

export function fadeInLeft(element, { delay = 0, duration = 1, x = -40, trigger } = {}) {
  return gsap.from(element, {
    x,
    opacity: 0,
    duration,
    delay,
    ease: EASE,
    scrollTrigger: trigger ? {
      trigger,
      start: "top 85%",
      toggleActions: "play none none none",
    } : undefined,
  });
}

export function staggerChildren(parent, childSelector, { stagger = 0.15, y = 30, duration = 0.8 } = {}) {
  return gsap.from(`${parent} ${childSelector}`, {
    y,
    opacity: 0,
    duration,
    stagger,
    ease: EASE,
    scrollTrigger: {
      trigger: parent,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });
}

export function parallaxY(element, { speed = 0.3, trigger } = {}) {
  return gsap.to(element, {
    yPercent: speed * 100,
    ease: "none",
    scrollTrigger: {
      trigger: trigger || element,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}
