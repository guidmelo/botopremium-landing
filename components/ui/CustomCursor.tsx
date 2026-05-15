'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [label, setLabel] = useState('');

  const springConfig = { damping: 28, stiffness: 300 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  const trailX = useSpring(cursorX, { damping: 50, stiffness: 150 });
  const trailY = useSpring(cursorY, { damping: 50, stiffness: 150 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onEnterHoverable = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverable = target.closest('[data-cursor]');
      if (hoverable) {
        setIsHovering(true);
        setLabel(hoverable.getAttribute('data-cursor-label') || '');
      }
    };

    const onLeaveHoverable = () => {
      setIsHovering(false);
      setLabel('');
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onEnterHoverable);
    document.addEventListener('mouseout', onLeaveHoverable);
    document.addEventListener('mouseleave', () => setIsVisible(false));
    document.addEventListener('mouseenter', () => setIsVisible(true));

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnterHoverable);
      document.removeEventListener('mouseout', onLeaveHoverable);
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <>
      {/* Trailing glow */}
      <motion.div
        className="pointer-events-none fixed z-[9997] rounded-full"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovering ? 80 : 40,
          height: isHovering ? 80 : 40,
          background: 'radial-gradient(circle, rgba(214,190,138,0.08) 0%, transparent 70%)',
          opacity: isVisible ? 1 : 0,
          transition: 'width 0.4s, height 0.4s, opacity 0.3s',
        }}
      />

      {/* Main cursor dot */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          width: isHovering ? 48 : 10,
          height: isHovering ? 48 : 10,
          background: isHovering
            ? 'rgba(214, 190, 138, 0.15)'
            : 'rgba(214, 190, 138, 0.9)',
          border: isHovering
            ? '1px solid rgba(214, 190, 138, 0.6)'
            : '0px solid transparent',
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center text-[8px] font-body font-medium tracking-[0.15em] uppercase text-champagne whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed z-[9998] rounded-full border border-champagne/20"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? (isHovering ? 0 : 0.5) : 0,
        }}
        animate={{
          width: 32,
          height: 32,
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  );
}
