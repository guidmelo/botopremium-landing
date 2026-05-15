'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

const navItems = [
  { label: 'Procedimentos', href: '#procedimentos' },
  { label: 'Experiência', href: '#experiencia' },
  { label: 'Depoimentos', href: '#depoimentos' },
  { label: 'Contato', href: '#contato' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > 60));
    return unsub;
  }, [scrollY]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.querySelector(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Background blur on scroll */}
        <motion.div
          className="absolute inset-0 border-b border-champagne/5"
          style={{
            opacity: headerOpacity,
            background: 'rgba(5, 5, 5, 0.85)',
            backdropFilter: 'blur(24px)',
          }}
        />

        <div className="container-premium relative flex items-center justify-between py-5 md:py-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/" className="flex flex-col items-start gap-0.5 group" data-cursor data-cursor-label="">
              <span className="font-display text-xl md:text-2xl font-light tracking-[0.08em] text-warm-white group-hover:text-champagne transition-colors duration-500">
                Boto<span className="gradient-text font-normal">Premium</span>
              </span>
              <span className="text-eyebrow text-[0.5rem] opacity-60 tracking-[0.3em]">Harmonização Facial</span>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item, i) => (
              <motion.button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-[0.7rem] font-body font-300 tracking-[0.18em] uppercase text-warm-white/50 hover:text-champagne transition-colors duration-400 relative group"
                data-cursor
              >
                {item.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-champagne/60 transition-all duration-400 group-hover:w-full" />
              </motion.button>
            ))}
          </nav>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => scrollTo('#contato')}
            className="hidden md:flex btn-gold text-[0.62rem]"
            data-cursor
          >
            Avaliação Exclusiva
          </motion.button>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            data-cursor
          >
            <span className={`w-6 h-px bg-champagne transition-all duration-400 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-4 h-px bg-champagne/60 transition-all duration-400 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-px bg-champagne transition-all duration-400 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <motion.div
        className="fixed inset-0 z-40 md:hidden flex flex-col pt-24 pb-12 px-8"
        style={{
          background: 'rgba(5, 5, 5, 0.98)',
          backdropFilter: 'blur(40px)',
        }}
        initial={{ opacity: 0, clipPath: 'circle(0% at 95% 5%)' }}
        animate={
          menuOpen
            ? { opacity: 1, clipPath: 'circle(150% at 95% 5%)' }
            : { opacity: 0, clipPath: 'circle(0% at 95% 5%)' }
        }
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        aria-hidden={!menuOpen}
      >
        <div className="flex flex-col gap-2 mt-8">
          {navItems.map((item, i) => (
            <motion.button
              key={item.label}
              onClick={() => scrollTo(item.href)}
              className="text-left py-4 text-3xl font-display font-light text-warm-white/70 hover:text-champagne transition-colors border-b border-champagne/10"
              initial={{ opacity: 0, x: -20 }}
              animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: i * 0.06 + 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {item.label}
            </motion.button>
          ))}
        </div>
        <motion.button
          onClick={() => scrollTo('#contato')}
          className="btn-gold mt-10 justify-center"
          initial={{ opacity: 0 }}
          animate={menuOpen ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4 }}
        >
          Solicitar Avaliação
        </motion.button>
      </motion.div>
    </>
  );
}
