'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Reveal } from '@/components/ui/AnimatedText';

const testimonials = [
  {
    id: 1,
    name: 'Ana Carolina M.',
    location: 'São Paulo, SP',
    procedure: 'Harmonização Facial',
    rating: 5,
    text: 'A experiência na BotoPremium foi transformadora. O atendimento é impecável, o ambiente transmite sofisticação em cada detalhe e os resultados superaram minhas expectativas. Minha autoestima está em outro nível.',
    initials: 'AC',
  },
  {
    id: 2,
    name: 'Fernanda R.',
    location: 'Rio de Janeiro, RJ',
    procedure: 'Botox Premium',
    rating: 5,
    text: 'Finalmente encontrei uma clínica que entende o que é atendimento de alto padrão. O resultado ficou completamente natural — exatamente o que eu queria. Indico para todas as minhas amigas sem hesitar.',
    initials: 'FR',
  },
  {
    id: 3,
    name: 'Juliana P.',
    location: 'Belo Horizonte, MG',
    procedure: 'Skinbooster',
    rating: 5,
    text: 'A pele ficou com uma luminosidade incrível depois do skinbooster. A profissional explicou cada etapa com clareza e cuidado. Me senti especial do início ao fim. Voltarei com certeza.',
    initials: 'JP',
  },
  {
    id: 4,
    name: 'Mariana V.',
    location: 'Brasília, DF',
    procedure: 'Preenchimento Labial',
    rating: 5,
    text: 'O resultado do preenchimento labial ficou absolutamente natural e harmonioso. Nada exagerado, como eu tanto temia. A profissional tem um olhar artístico e técnica impecável. Me apaixonei.',
    initials: 'MV',
  },
  {
    id: 5,
    name: 'Camila S.',
    location: 'Curitiba, PR',
    procedure: 'Full Face Protocol',
    rating: 5,
    text: 'O protocolo Full Face foi a melhor decisão que tomei. Resultados graduais e naturais que me fazem receber elogios toda semana. O investimento vale cada centavo — é saúde e autoestima.',
    initials: 'CS',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: rating }).map((_, i) => (
        <motion.svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className="text-champagne"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <path
            d="M6 1l1.236 2.503L10 3.873l-2 1.95.472 2.752L6 7.25l-2.472 1.325L4 5.823l-2-1.95 2.764-.37L6 1z"
            fill="currentColor"
          />
        </motion.svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [autoplay, setAutoplay] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActive((p) => (p + 1) % testimonials.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [autoplay]);

  const goTo = (i: number) => {
    setDirection(i > active ? 1 : -1);
    setActive(i);
    setAutoplay(false);
  };

  const variants = {
    enter: (d: number) => ({ x: d * 60, opacity: 0, filter: 'blur(8px)' }),
    center: { x: 0, opacity: 1, filter: 'blur(0px)' },
    exit: (d: number) => ({ x: d * -60, opacity: 0, filter: 'blur(8px)' }),
  };

  const t = testimonials[active];

  return (
    <section id="depoimentos" className="section-padding bg-graphite relative overflow-hidden">
      {/* BG texture */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, rgba(214, 190, 138, 0.03) 0%, transparent 100%)`,
        }}
      />

      <div className="container-premium" ref={ref}>
        {/* Header */}
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <Reveal>
              <span className="text-eyebrow mb-4 block">Depoimentos</span>
            </Reveal>
            <div className="overflow-hidden">
              <motion.h2
                className="text-display-xl text-warm-white"
                initial={{ y: '100%' }}
                animate={isInView ? { y: '0%' } : { y: '100%' }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                Histórias reais
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
                de transformação.
              </motion.h2>
            </div>
          </div>

          {/* Navigation */}
          <Reveal delay={0.2}>
            <div className="flex items-center gap-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`transition-all duration-500 ${
                    i === active
                      ? 'w-8 h-1 bg-champagne rounded-full'
                      : 'w-1 h-1 bg-warm-white/20 rounded-full hover:bg-champagne/40'
                  }`}
                  data-cursor
                />
              ))}
            </div>
          </Reveal>
        </div>

        {/* Main testimonial */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-sm p-8 md:p-12 lg:p-16 relative overflow-hidden"
            >
              {/* Quote mark */}
              <div
                className="absolute top-6 right-8 font-display text-8xl leading-none text-champagne/5 select-none pointer-events-none"
                aria-hidden
              >
                &#8220;
              </div>

              {/* Top accent */}
              <div
                className="absolute top-0 left-0 h-px w-full"
                style={{ background: 'linear-gradient(90deg, rgba(214, 190, 138, 0.5) 0%, transparent 60%)' }}
              />

              <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-16 items-start">
                {/* Author */}
                <div className="flex lg:flex-col items-start gap-5 lg:min-w-[180px]">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(214, 190, 138, 0.15), rgba(198, 167, 105, 0.08))',
                        border: '1px solid rgba(214, 190, 138, 0.25)',
                      }}
                    >
                      <span className="font-display text-lg text-champagne/80">{t.initials}</span>
                    </div>
                    <div
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(214, 190, 138, 0.9)' }}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4l2 2 3-3" stroke="#050505" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <StarRating rating={t.rating} />
                    <p className="font-body text-warm-white/80 text-sm font-light mt-2">{t.name}</p>
                    <p className="text-[0.62rem] font-body tracking-[0.1em] text-warm-white/30 mt-0.5">{t.location}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-champagne/40" />
                      <p className="text-[0.58rem] font-body tracking-[0.1em] text-champagne/50 uppercase">{t.procedure}</p>
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div>
                  <p className="font-display text-lg md:text-xl lg:text-2xl font-light text-warm-white/75 leading-relaxed italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel mini cards */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
          {testimonials.map((item, i) => (
            <motion.button
              key={item.id}
              onClick={() => goTo(i)}
              className={`text-left p-4 rounded-sm border transition-all duration-500 ${
                i === active
                  ? 'border-champagne/30 bg-champagne/5'
                  : 'border-champagne/8 bg-warm-white/2 hover:border-champagne/15'
              }`}
              whileHover={{ y: -2 }}
              data-cursor
            >
              <p className="text-[0.65rem] font-body text-warm-white/40 truncate">{item.name}</p>
              <p className="text-[0.55rem] font-body text-champagne/40 tracking-[0.08em] mt-0.5 truncate">{item.procedure}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
