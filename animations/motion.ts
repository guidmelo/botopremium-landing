import { Variants, Transition } from 'framer-motion';

export const easing = {
  premium: [0.16, 1, 0.3, 1] as [number, number, number, number],
  cinematic: [0.76, 0, 0.24, 1] as [number, number, number, number],
  outExpo: [0.19, 1, 0.22, 1] as [number, number, number, number],
  inOutCubic: [0.65, 0, 0.35, 1] as [number, number, number, number],
};

export const transitions = {
  slow: { duration: 1.2, ease: easing.premium } as Transition,
  medium: { duration: 0.8, ease: easing.premium } as Transition,
  fast: { duration: 0.5, ease: easing.premium } as Transition,
  cinematic: { duration: 1.6, ease: easing.cinematic } as Transition,
  spring: { type: 'spring', stiffness: 80, damping: 20 } as Transition,
  springFast: { type: 'spring', stiffness: 120, damping: 25 } as Transition,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easing.premium },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: easing.premium },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, ease: easing.premium },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, ease: easing.premium },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: easing.premium },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const staggerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2,
    },
  },
};

export const textReveal: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 1, ease: easing.premium },
  },
};

export const textRevealFast: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 0.7, ease: easing.premium },
  },
};

export const blurReveal: Variants = {
  hidden: { opacity: 0, filter: 'blur(12px)', y: 20 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: 1.1, ease: easing.premium },
  },
};

export const lineReveal: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, ease: easing.cinematic, delay: 0.3 },
  },
};

export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: easing.premium },
  },
};

export const heroTextContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.6,
    },
  },
};

export const floatAnimation = {
  y: [0, -18, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export const glowPulse = {
  boxShadow: [
    '0 0 20px rgba(214, 190, 138, 0.1)',
    '0 0 60px rgba(214, 190, 138, 0.3)',
    '0 0 20px rgba(214, 190, 138, 0.1)',
  ],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export const successAnimation: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easing.premium },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.4, ease: easing.premium },
  },
};

export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.6, ease: easing.premium },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.4, ease: easing.premium },
  },
};
