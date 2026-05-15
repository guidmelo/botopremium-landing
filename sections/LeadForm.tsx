'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { submitLead } from '@/services/leads';
import { LeadFormData } from '@/types';
import {
  validateName,
  validateWhatsApp,
  validateNeighborhood,
  validateGoal,
  formatWhatsApp,
  isRateLimited,
} from '@/utils/validators';
import { Reveal } from '@/components/ui/AnimatedText';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

/* ─── Floating Input ─── */
function FloatingInput({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder=" "
          className={`input-field w-full ${error ? 'border-red-500/50' : ''} ${disabled ? 'opacity-50' : ''}`}
          autoComplete="off"
        />
        <label htmlFor={id} className="float-label">
          {label}
        </label>
        <motion.div
          className="absolute bottom-0 left-0 h-px origin-left"
          style={{ background: 'linear-gradient(90deg, rgba(214, 190, 138, 0.8), transparent)' }}
          animate={{ scaleX: value ? 1 : 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-1.5 text-[0.62rem] text-red-400/80 font-body tracking-[0.05em]"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Custom Select ─── */
function FloatingSelect({
  id,
  label,
  value,
  onChange,
  error,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  disabled?: boolean;
}) {
  const goals = [
    'Suavizar linhas de expressão (Botox)',
    'Harmonização facial completa',
    'Definir e realçar lábios',
    'Rejuvenescimento e firmeza',
    'Hidratação profunda (Skinbooster)',
    'Quero fazer uma avaliação completa',
  ];

  return (
    <div className="relative">
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`input-field w-full appearance-none bg-transparent cursor-none ${value ? '' : 'text-transparent'} ${error ? 'border-red-500/50' : ''} ${disabled ? 'opacity-50' : ''}`}
          style={{ color: value ? 'var(--warm-white)' : 'transparent' }}
        >
          <option value="" disabled hidden> </option>
          {goals.map((g) => (
            <option key={g} value={g} style={{ background: '#1A1A1A', color: '#F7F4EF' }}>
              {g}
            </option>
          ))}
        </select>
        <label
          htmlFor={id}
          className={`float-label ${value ? 'top-[0.25rem] text-[0.58rem] tracking-[0.2em] uppercase text-champagne/75' : ''}`}
        >
          {label}
        </label>
        <div className="absolute right-0 bottom-3 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-champagne/40">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <motion.div
          className="absolute bottom-0 left-0 h-px origin-left"
          style={{ background: 'linear-gradient(90deg, rgba(214, 190, 138, 0.8), transparent)' }}
          animate={{ scaleX: value ? 1 : 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-1.5 text-[0.62rem] text-red-400/80 font-body tracking-[0.05em]"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Success Screen ─── */
function SuccessScreen() {
  return (
    <motion.div
      className="text-center py-10 md:py-14"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Animated check */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <motion.div
            className="w-24 h-24 rounded-full"
            style={{ border: '1px solid rgba(214, 190, 138, 0.3)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(214, 190, 138, 0.08) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path
                d="M8 18l7 7 13-13"
                stroke="rgba(214, 190, 138, 0.9)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="check-path"
              />
            </svg>
          </div>
        </div>
      </div>

      <motion.p
        className="text-eyebrow text-champagne/60 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        Solicitação Confirmada
      </motion.p>

      <motion.h3
        className="font-display text-2xl md:text-3xl font-light text-warm-white mb-4 leading-snug"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        Seu atendimento prioritário foi<br />
        <span
          style={{
            background: 'linear-gradient(135deg, #E8D5A3, #C6A769)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          solicitado com sucesso.
        </span>
      </motion.h3>

      <motion.p
        className="text-warm-white/40 font-body font-light text-sm max-w-sm mx-auto leading-relaxed mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85, duration: 0.6 }}
      >
        Nossa equipe entrará em contato em breve para confirmar sua avaliação exclusiva. Prepare-se para uma experiência premium.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <a
          href="https://wa.me/5571999999999?text=Ol%C3%A1%21+Acabei+de+solicitar+minha+avalia%C3%A7%C3%A3o+na+BotoPremium."
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold"
          data-cursor
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span>WhatsApp</span>
        </a>

        <a
          href="https://www.instagram.com/botopremium/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-premium"
          data-cursor
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-70">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
          </svg>
          <span>Instagram</span>
        </a>

        <a
          href="https://www.botopremium.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-premium"
          data-cursor
        >
          <span>Site Oficial</span>
        </a>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Form ─── */
export function LeadForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const [form, setForm] = useState<LeadFormData>({
    name: '',
    whatsapp: '',
    neighborhood: '',
    goal: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const setField = (field: keyof LeadFormData) => (value: string) => {
    setForm((p) => ({ ...p, [field]: field === 'whatsapp' ? formatWhatsApp(value) : value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {
      name: validateName(form.name) ?? undefined,
      whatsapp: validateWhatsApp(form.whatsapp) ?? undefined,
      neighborhood: validateNeighborhood(form.neighborhood) ?? undefined,
      goal: validateGoal(form.goal) ?? undefined,
    };
    const hasErrors = Object.values(newErrors).some(Boolean);
    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;

    if (isRateLimited('botopremium_lead', 3, 60000)) {
      setErrorMsg('Muitas tentativas. Aguarde alguns minutos.');
      setStatus('error');
      return;
    }

    if (!validate()) return;

    setStatus('loading');
    setErrorMsg('');

    const result = await submitLead(form);

    if (result.success) {
      setStatus('success');
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'lead_submit', {
          event_category: 'form',
          event_label: form.goal,
        });
      }
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead');
      }
    } else {
      setStatus('error');
      setErrorMsg(result.message);
    }
  };

  const isDisabled = status === 'loading' || status === 'success';

  return (
    <section id="contato" className="section-padding bg-obsidian relative overflow-hidden">
      {/* BG elements */}
      <div
        className="ambient-glow w-[900px] h-[600px] -top-40 left-1/2 -translate-x-1/2"
        style={{ background: 'rgba(198, 167, 105, 0.04)' }}
      />

      <div className="container-premium">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start" ref={ref}>
          {/* Left: info */}
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <span className="text-eyebrow mb-4 block">Avaliação Exclusiva</span>
            </Reveal>
            <div className="overflow-hidden">
              <motion.h2
                className="text-display-xl text-warm-white mb-2"
                initial={{ y: '100%' }}
                animate={isInView ? { y: '0%' } : { y: '100%' }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                Inicie sua
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
                transformação.
              </motion.h2>
            </div>

            <Reveal delay={0.3}>
              <p className="text-warm-white/40 font-body font-light text-sm md:text-base leading-relaxed mb-10 max-w-sm">
                Preencha o formulário e nossa equipe entrará em contato para agendar sua avaliação personalizada sem compromisso.
              </p>
            </Reveal>

            {/* Benefits */}
            <div className="flex flex-col gap-4">
              {[
                'Avaliação personalizada e sem compromisso',
                'Protocolo exclusivo para seu perfil',
                'Tecnologia e produtos premium certificados',
                'Resultados naturais e duradouros',
              ].map((item, i) => (
                <Reveal key={i} delay={0.35 + i * 0.07}>
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ border: '1px solid rgba(214, 190, 138, 0.35)' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-champagne/70" />
                    </div>
                    <p className="text-warm-white/40 font-body font-light text-sm">{item}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right: form card */}
          <Reveal delay={0.1} direction="right">
            <div className="glass-card rounded-sm p-8 md:p-10 lg:p-12 relative overflow-hidden">
              {/* Top gradient */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(214, 190, 138, 0.4), transparent)' }}
              />

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <SuccessScreen key="success" />
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-8"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    noValidate
                  >
                    <div>
                      <p className="font-display text-xl font-light text-warm-white/80 mb-1">
                        Solicitar Avaliação
                      </p>
                      <p className="text-[0.65rem] font-body tracking-[0.1em] text-warm-white/25">
                        Atendimento prioritário · Sem compromisso
                      </p>
                    </div>

                    <div className="flex flex-col gap-7">
                      <FloatingInput
                        id="name"
                        label="Nome completo"
                        value={form.name}
                        onChange={setField('name')}
                        error={errors.name}
                        disabled={isDisabled}
                      />
                      <FloatingInput
                        id="whatsapp"
                        label="WhatsApp"
                        type="tel"
                        value={form.whatsapp}
                        onChange={setField('whatsapp')}
                        error={errors.whatsapp}
                        disabled={isDisabled}
                      />
                      <FloatingInput
                        id="neighborhood"
                        label="Bairro / Cidade"
                        value={form.neighborhood}
                        onChange={setField('neighborhood')}
                        error={errors.neighborhood}
                        disabled={isDisabled}
                      />
                      <FloatingSelect
                        id="goal"
                        label="Objetivo estético"
                        value={form.goal}
                        onChange={setField('goal')}
                        error={errors.goal}
                        disabled={isDisabled}
                      />
                    </div>

                    {/* Error message */}
                    <AnimatePresence>
                      {status === 'error' && errorMsg && (
                        <motion.div
                          className="px-4 py-3 rounded-sm border border-red-500/20 bg-red-500/5"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          <p className="text-red-400/80 text-xs font-body">{errorMsg}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isDisabled}
                      className="btn-gold w-full justify-center disabled:opacity-50"
                      data-cursor
                    >
                      {status === 'loading' ? (
                        <span className="flex items-center gap-1.5">
                          <span className="loading-dot w-1.5 h-1.5 rounded-full bg-obsidian" />
                          <span className="loading-dot w-1.5 h-1.5 rounded-full bg-obsidian" />
                          <span className="loading-dot w-1.5 h-1.5 rounded-full bg-obsidian" />
                        </span>
                      ) : (
                        <>
                          <span>Solicitar Avaliação Exclusiva</span>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </>
                      )}
                    </button>

                    <p className="text-[0.6rem] text-warm-white/20 font-body text-center tracking-[0.06em] leading-relaxed">
                      Seus dados são tratados com total segurança e privacidade. Não compartilhamos suas informações com terceiros.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
