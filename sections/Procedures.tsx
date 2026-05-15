'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Reveal } from '@/components/ui/AnimatedText';

interface Procedure {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
}

const procedures: Procedure[] = [
  {
    id: 'botox',
    title: 'Botox Premium',
    subtitle: 'Toxina Botulínica',
    description: 'Suavização precisa de linhas de expressão com protocolo personalizado. Resultados naturais e duradouros que preservam a expressividade do rosto.',
    duration: '30 min · Resultado em 7 dias',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="6" stroke="currentColor" strokeWidth="1" />
        <path d="M14 2v4M14 22v4M2 14h4M22 14h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <circle cx="14" cy="14" r="2" fill="currentColor" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: 'harmonizacao',
    title: 'Harmonização Facial',
    subtitle: 'Full Face Protocol',
    description: 'Protocolo completo de harmonização que equilibra proporções, restaura volumes e realça a beleza natural com ácido hialurônico de última geração.',
    duration: '60–90 min · Resultado imediato',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4C8.5 4 5 8.5 5 14s3.5 10 9 10 9-4.5 9-10S19.5 4 14 4z" stroke="currentColor" strokeWidth="1" />
        <path d="M10 13c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M14 9v2M14 17v2M9 14H7M21 14h-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'bioestimulador',
    title: 'Bioestimuladores',
    subtitle: 'Sculptra · Radiesse',
    description: 'Estímulo natural de colágeno para restaurar volumes perdidos e melhorar a qualidade da pele progressivamente. Resultado gradual e ultra natural.',
    duration: '45 min · Resultado em 4–6 semanas',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M7 21l7-14 7 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 16h9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <circle cx="14" cy="7" r="2" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: 'fullface',
    title: 'Full Face',
    subtitle: 'Protocolo Premium',
    description: 'Tratamento global que combina múltiplas técnicas para uma transformação completa e harmoniosa. O protocolo mais exclusivo da BotoPremium.',
    duration: '90–120 min · Resultado global',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="10" stroke="currentColor" strokeWidth="1" />
        <path d="M14 8v12M8 14h12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <circle cx="14" cy="14" r="3" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: 'skinbooster',
    title: 'Skinbooster',
    subtitle: 'Hidratação Profunda',
    description: 'Microinjeções de ácido hialurônico não reticulado para hidratação intensa e melhora da qualidade e luminosidade da pele.',
    duration: '45 min · Glow imediato',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 5C14 5 7 12 7 17a7 7 0 0014 0c0-5-7-12-7-12z" stroke="currentColor" strokeWidth="1" />
        <path d="M11 18a3 3 0 006 0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'labial',
    title: 'Preenchimento Labial',
    subtitle: 'Lábios Definidos',
    description: 'Contorno e volume labial com técnica personalizada que preserva naturalidade. Lábios mais definidos, simétricos e sensuais.',
    duration: '30 min · Resultado imediato',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M6 12c0 0 2-3 8-3s8 3 8 3v1c0 4-3.6 7-8 7s-8-3-8-7v-1z" stroke="currentColor" strokeWidth="1" />
        <path d="M6 13c2 1.5 5 2 8 2s6-.5 8-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M11 12c1-1.5 2-2 3-2s2 .5 3 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
];

interface ProcedureCardProps {
  procedure: Procedure;
  index: number;
}

function ProcedureCard({ procedure, index }: ProcedureCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative glass-card rounded-sm overflow-hidden cursor-none group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{
        y: -8,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      }}
      data-cursor
      data-cursor-label="Ver"
    >
      {/* Dynamic glow on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(214, 190, 138, 0.08) 0%, transparent 70%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* Top border animation */}
      <motion.div
        className="absolute top-0 left-0 h-px origin-left"
        style={{ background: 'linear-gradient(90deg, rgba(214, 190, 138, 0.9), transparent)' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Border glow */}
      <motion.div
        className="absolute inset-0 rounded-sm pointer-events-none"
        style={{ border: '1px solid rgba(214, 190, 138, 0)' }}
        animate={{
          borderColor: hovered ? 'rgba(214, 190, 138, 0.2)' : 'rgba(214, 190, 138, 0)',
          boxShadow: hovered
            ? '0 0 40px rgba(198, 167, 105, 0.1), inset 0 1px 0 rgba(255,255,255,0.04)'
            : 'none',
        }}
        transition={{ duration: 0.4 }}
      />

      <div className="p-8 md:p-9">
        {/* Icon */}
        <div className="mb-6 flex items-start justify-between">
          <motion.div
            className="text-champagne/50 group-hover:text-champagne/90 transition-colors duration-500"
            animate={{ rotate: hovered ? 5 : 0 }}
            transition={{ duration: 0.4 }}
          >
            {procedure.icon}
          </motion.div>

          <motion.div
            className="text-[0.55rem] font-body tracking-[0.2em] uppercase text-champagne/30 group-hover:text-champagne/60 transition-colors duration-500"
          >
            0{index + 1}
          </motion.div>
        </div>

        {/* Content */}
        <div>
          <p className="text-eyebrow mb-2 text-champagne/50 text-[0.55rem]">{procedure.subtitle}</p>
          <h3 className="font-display text-xl md:text-2xl font-light text-warm-white mb-3 tracking-[-0.01em] group-hover:text-champagne/90 transition-colors duration-500">
            {procedure.title}
          </h3>
          <p className="text-warm-white/40 font-body text-sm font-light leading-relaxed mb-6 group-hover:text-warm-white/55 transition-colors duration-500">
            {procedure.description}
          </p>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 pt-4 border-t border-champagne/8">
          <div className="w-1 h-1 rounded-full bg-champagne/50" />
          <span className="text-[0.62rem] font-body tracking-[0.1em] text-warm-white/30 group-hover:text-champagne/50 transition-colors duration-500">
            {procedure.duration}
          </span>
        </div>
      </div>

      {/* Bottom arrow reveal */}
      <motion.div
        className="absolute bottom-0 right-0 p-4"
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 10 }}
        transition={{ duration: 0.3 }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-champagne/60">
          <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export function Procedures() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="procedimentos" className="section-padding bg-graphite relative overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(198, 167, 105, 0.03) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(214, 190, 138, 0.02) 0%, transparent 50%)`,
        }}
      />

      <div className="container-premium">
        {/* Header */}
        <div ref={ref} className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-8">
          <div>
            <Reveal>
              <span className="text-eyebrow mb-4 block">Procedimentos</span>
            </Reveal>
            <div className="overflow-hidden">
              <motion.h2
                className="text-display-xl text-warm-white"
                initial={{ y: '100%' }}
                animate={isInView ? { y: '0%' } : { y: '100%' }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                Protocolos
              </motion.h2>
            </div>
            <div className="overflow-hidden">
              <motion.h2
                className="text-display-xl"
                style={{
                  background: 'linear-gradient(135deg, #E8D5A3, #C6A769)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                initial={{ y: '100%' }}
                animate={isInView ? { y: '0%' } : { y: '100%' }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              >
                de Luxo.
              </motion.h2>
            </div>
          </div>

          <Reveal delay={0.3} className="max-w-xs">
            <p className="text-warm-white/40 font-body font-light text-sm leading-relaxed">
              Cada procedimento é personalizado para realçar sua beleza natural com o mais alto padrão de segurança e tecnologia.
            </p>
          </Reveal>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {procedures.map((p, i) => (
            <ProcedureCard key={p.id} procedure={p} index={i} />
          ))}
        </div>

        {/* CTA */}
        <Reveal delay={0.2} className="mt-14 flex justify-center">
          <button
            onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-premium"
            data-cursor
          >
            <span>Solicitar Avaliação Personalizada</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
