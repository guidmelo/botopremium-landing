'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Reveal } from '@/components/ui/AnimatedText';

const pillars = [
  {
    number: '01',
    title: 'Atendimento Exclusivo',
    text: 'Cada paciente é recebida com atenção total. Consultoria personalizada, anamnese detalhada e plano de tratamento único — desenvolvido especialmente para você.',
    accent: 'Personalizado',
  },
  {
    number: '02',
    title: 'Tecnologia de Vanguarda',
    text: 'Equipamentos de última geração e produtos premium de procedência internacional garantem segurança e resultados superiores em cada sessão.',
    accent: 'Inovação',
  },
  {
    number: '03',
    title: 'Ambiente Premium',
    text: 'Clínicas projetadas para oferecer conforto, privacidade e sofisticação. Uma experiência sensorial completa do primeiro ao último momento.',
    accent: 'Sofisticação',
  },
  {
    number: '04',
    title: 'Resultados Naturais',
    text: 'Nossa filosofia é realçar sua beleza sem exageros. Resultados discretos e naturais que transformam sem artificialidade — a essência da harmonização premium.',
    accent: 'Naturalidade',
  },
];

function ParallaxPillar({
  pillar,
  index,
}: {
  pillar: (typeof pillars)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col md:flex-row gap-8 md:gap-12 items-start"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
    >
      {/* Number column */}
      <div className="flex-shrink-0 flex flex-col items-start gap-3">
        <span
          className="font-display text-6xl md:text-7xl font-light leading-none"
          style={{
            background: 'linear-gradient(135deg, rgba(214, 190, 138, 0.2), rgba(198, 167, 105, 0.1))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {pillar.number}
        </span>

        {/* Vertical line */}
        <motion.div
          className="w-px origin-top ml-3"
          style={{ background: 'linear-gradient(180deg, rgba(214, 190, 138, 0.4), transparent)', height: '60px' }}
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: index * 0.08 + 0.4 }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 pb-10 md:pb-12 border-b border-champagne/8 last:border-0">
        <span className="text-eyebrow mb-3 block text-champagne/60">{pillar.accent}</span>
        <h3 className="font-display text-2xl md:text-3xl font-light text-warm-white mb-4 tracking-[-0.01em]">
          {pillar.title}
        </h3>
        <p className="text-warm-white/40 font-body font-light text-sm md:text-base leading-relaxed max-w-lg">
          {pillar.text}
        </p>
      </div>
    </motion.div>
  );
}

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { once: true, amount: 0.4 });

  return (
    <section
      id="experiencia"
      ref={containerRef}
      className="section-padding bg-obsidian relative overflow-hidden"
    >
      {/* Parallax background glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
      >
        <div
          className="ambient-glow w-[1000px] h-[600px] top-0 right-0 translate-x-1/3 -translate-y-1/4"
          style={{ background: 'rgba(198, 167, 105, 0.025)' }}
        />
        <div
          className="ambient-glow w-[800px] h-[500px] bottom-0 left-0 -translate-x-1/3 translate-y-1/4"
          style={{ background: 'rgba(214, 190, 138, 0.02)' }}
        />
      </motion.div>

      <div className="container-premium">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Sticky header */}
          <div className="lg:sticky lg:top-28">
            <div ref={titleRef}>
              <Reveal>
                <span className="text-eyebrow mb-4 block">A Experiência</span>
              </Reveal>

              <div className="overflow-hidden mb-2">
                <motion.h2
                  className="text-display-xl text-warm-white"
                  initial={{ y: '100%' }}
                  animate={isInView ? { y: '0%' } : { y: '100%' }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                >
                  Uma nova
                </motion.h2>
              </div>
              <div className="overflow-hidden mb-8">
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
                  dimensão de cuidado.
                </motion.h2>
              </div>

              <Reveal delay={0.3}>
                <p className="text-warm-white/40 font-body font-light text-sm md:text-base leading-relaxed mb-10 max-w-sm">
                  Da recepção ao pós-procedimento, cada detalhe é cuidadosamente orquestrado para que você viva uma experiência verdadeiramente única.
                </p>
              </Reveal>

              {/* Decorative element */}
              <Reveal delay={0.4}>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-sm flex items-center justify-center"
                    style={{ border: '1px solid rgba(214, 190, 138, 0.15)' }}
                  >
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-champagne/60">
                      <path d="M14 4C8.5 4 5 8.5 5 14s3.5 10 9 10 9-4.5 9-10S19.5 4 14 4z" stroke="currentColor" strokeWidth="1" />
                      <path d="M14 8v6l4 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-warm-white/60 font-body text-xs font-light">Atendimento personalizado</p>
                    <p className="text-champagne/70 font-body text-xs font-light">desde 2020 transformando vidas</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Right: Pillars */}
          <div className="flex flex-col gap-0">
            {pillars.map((pillar, i) => (
              <ParallaxPillar key={pillar.number} pillar={pillar} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
