'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCounter } from '@/hooks/useCounter';
import { Reveal, AnimatedLine } from '@/components/ui/AnimatedText';

interface StatCardProps {
  value: number;
  suffix: string;
  label: string;
  description: string;
  delay: number;
}

function StatCard({ value, suffix, label, description, delay }: StatCardProps) {
  const { count, ref } = useCounter(value, 2800);

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="relative glass-card rounded-sm p-8 md:p-10 group overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -6,
        borderColor: 'rgba(214, 190, 138, 0.28)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(214, 190, 138, 0.18)',
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      }}
    >
      {/* Ambient glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(214, 190, 138, 0.06) 0%, transparent 70%)',
        }}
      />

      {/* Top accent line */}
      <motion.div
        className="absolute top-0 left-0 h-px origin-left"
        style={{ background: 'linear-gradient(90deg, rgba(214, 190, 138, 0.8), transparent)' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.3, duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="absolute top-0 right-0 w-px origin-top"
        style={{ background: 'linear-gradient(180deg, rgba(214, 190, 138, 0.8), transparent)', height: '60%' }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.5, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Counter */}
      <div className="counter-value mb-2">
        {count}
        <span>{suffix}</span>
      </div>

      <div className="h-px mb-4 divider-gold opacity-40" />

      <p className="text-warm-white font-body text-sm font-light tracking-[0.06em] mb-1">
        {label}
      </p>
      <p className="text-warm-white/35 font-body text-xs font-light leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

const stats = [
  {
    value: 80,
    suffix: '+',
    label: 'Unidades no Brasil',
    description: 'Presente nas principais cidades brasileiras com clínicas premium',
  },
  {
    value: 50000,
    suffix: '+',
    label: 'Pacientes Atendidas',
    description: 'Histórico de transformações com excelência e naturalidade',
  },
  {
    value: 5,
    suffix: '★',
    label: 'Avaliação Média',
    description: 'Reconhecida pela qualidade dos resultados e atendimento premium',
  },
  {
    value: 6,
    suffix: '+',
    label: 'Anos de Excelência',
    description: 'Desde 2020 elevando padrões na estética facial premium',
  },
];

export function Authority() {
  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { once: true, amount: 0.4 });

  return (
    <section className="section-padding bg-obsidian relative overflow-hidden">
      {/* Background elements */}
      <div
        className="ambient-glow w-[800px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30"
        style={{ background: 'rgba(198, 167, 105, 0.03)' }}
      />

      <div className="container-premium">
        {/* Section header */}
        <div ref={titleRef} className="mb-16 md:mb-20">
          <Reveal delay={0}>
            <span className="text-eyebrow mb-4 block">Nossos Números</span>
          </Reveal>

          <div className="overflow-hidden mb-4">
            <motion.h2
              className="text-display-xl text-warm-white"
              initial={{ y: '100%' }}
              animate={isInView ? { y: '0%' } : { y: '100%' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              Autoridade que
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
              se comprova.
            </motion.h2>
          </div>

          <AnimatedLine
            className="mt-8 w-20"
            delay={0.4}
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              {...stat}
              delay={i * 0.1}
            />
          ))}
        </div>

        {/* Premium badge */}
        <Reveal delay={0.3} className="mt-16 md:mt-20">
          <div className="flex items-center justify-center">
            <div className="glass-card px-8 py-5 rounded-sm flex items-center gap-6 max-w-xl w-full justify-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ border: '1px solid rgba(214, 190, 138, 0.3)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-champagne">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <span className="text-eyebrow text-[0.5rem]">Excelência</span>
              </div>

              <div className="h-10 w-px bg-champagne/15" />

              <p className="text-warm-white/50 font-body text-xs font-light text-center leading-relaxed max-w-xs">
                Reconhecida como uma das maiores redes de clínicas de estética facial e corporal do Brasil.
              </p>

              <div className="h-10 w-px bg-champagne/15" />

              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ border: '1px solid rgba(214, 190, 138, 0.3)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-champagne">
                    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <span className="text-eyebrow text-[0.5rem]">Certificada</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
