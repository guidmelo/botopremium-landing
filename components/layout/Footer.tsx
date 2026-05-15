'use client';

import { motion } from 'framer-motion';
import { Reveal, AnimatedLine } from '@/components/ui/AnimatedText';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-champagne/10 bg-obsidian">
      <div className="container-premium py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <Reveal delay={0}>
            <div className="flex flex-col gap-4">
              <span className="font-display text-2xl font-light tracking-[0.08em] text-warm-white">
                Boto<span className="gradient-text font-normal">Premium</span>
              </span>
              <p className="text-warm-white/40 text-sm font-body font-light leading-relaxed max-w-xs">
                Excelência em harmonização facial e estética premium para mulheres que valorizam sofisticação e resultados naturais.
              </p>
            </div>
          </Reveal>

          {/* Links */}
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-4">
              <span className="text-eyebrow">Links</span>
              {[
                { label: 'Procedimentos', href: '#procedimentos' },
                { label: 'Nossa Experiência', href: '#experiencia' },
                { label: 'Depoimentos', href: '#depoimentos' },
                { label: 'Solicitar Avaliação', href: '#contato' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm font-body font-light text-warm-white/40 hover:text-champagne transition-colors duration-300 text-left"
                  data-cursor
                >
                  {item.label}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Contact */}
          <Reveal delay={0.2}>
            <div className="flex flex-col gap-4">
              <span className="text-eyebrow">Contato</span>
              <a
                href="https://wa.me/5571999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-body font-light text-warm-white/40 hover:text-champagne transition-colors duration-300"
                data-cursor
              >
                WhatsApp
              </a>
              <a
                href="https://www.instagram.com/botopremium/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-body font-light text-warm-white/40 hover:text-champagne transition-colors duration-300"
                data-cursor
              >
                @botopremium
              </a>
              <a
                href="https://www.botopremium.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-body font-light text-warm-white/40 hover:text-champagne transition-colors duration-300"
                data-cursor
              >
                botopremium.com.br
              </a>
            </div>
          </Reveal>
        </div>

        <AnimatedLine className="my-10 divider-gold" delay={0.3} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Reveal>
            <p className="text-[0.65rem] text-warm-white/25 font-body tracking-[0.1em]">
              © {year} BotoPremium. Todos os direitos reservados.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[0.65rem] text-warm-white/20 font-body tracking-[0.08em]">
              Clínica de Estética Facial e Corporal Premium · Brasil
            </p>
          </Reveal>
        </div>
      </div>
    </footer>
  );
}
