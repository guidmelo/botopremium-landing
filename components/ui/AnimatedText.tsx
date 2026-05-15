'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

const wordVariants: Variants = {
  hidden: { y: '115%', opacity: 0 },
  visible: (i: number) => ({
    y: '0%',
    opacity: 1,
    transition: {
      delay: i * 0.06,
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function AnimatedText({
  text,
  className = '',
  delay = 0,
  once = true,
  as: Tag = 'p',
}: AnimatedTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.3 });
  const words = text.split(' ');

  return (
    <Tag ref={ref} className={`overflow-hidden ${className}`}>
      <span className="flex flex-wrap gap-x-[0.25em] gap-y-1">
        {words.map((word, i) => (
          <span key={i} className="overflow-hidden inline-block">
            <motion.span
              className="inline-block"
              variants={wordVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={i + delay / 0.06}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

interface AnimatedLineProps {
  className?: string;
  delay?: number;
}

export function AnimatedLine({ className = '', delay = 0 }: AnimatedLineProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      className={`h-px origin-left ${className}`}
      initial={{ scaleX: 0 }}
      animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
      transition={{ delay, duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
    />
  );
}

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  once?: boolean;
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  once = true,
}: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  const offsets = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...offsets[direction] }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...offsets[direction] }
      }
      transition={{ delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
