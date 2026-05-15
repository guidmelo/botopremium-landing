'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── SVG Icons ─── */
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconWhatsApp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const IconPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconTarget = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

/* ─── Decorative Diamond Divider ─── */
function DiamondDivider() {
  return (
    <div className="flex items-center justify-center gap-0 w-full">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(214,190,138,0.35))' }} />
      <div className="mx-3 flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 0L12 6L6 12L0 6L6 0Z" fill="rgba(214,190,138,0.55)" />
        </svg>
      </div>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(214,190,138,0.35), transparent)' }} />
    </div>
  );
}

/* ─── Box Input Field ─── */
function BoxInput({
  id, label, value, onChange, error, type = 'text', disabled, icon,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; error?: string;
  type?: string; disabled?: boolean;
  icon: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <div
        className="relative flex items-center gap-3.5 rounded-lg transition-all duration-300"
        style={{
          background: 'rgba(18, 15, 10, 0.85)',
          border: `1px solid ${error ? 'rgba(239,68,68,0.35)' : focused ? 'rgba(214,190,138,0.45)' : 'rgba(214,190,138,0.14)'}`,
          boxShadow: focused ? '0 0 0 3px rgba(214,190,138,0.05)' : 'none',
          padding: '0 18px',
          height: '62px',
        }}
      >
        <span style={{ color: focused || value ? 'rgba(214,190,138,0.8)' : 'rgba(214,190,138,0.35)', transition: 'color 0.3s', flexShrink: 0 }}>
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder={label}
          className="flex-1 bg-transparent outline-none disabled:opacity-40"
          style={{
            color: 'rgba(247,244,239,0.85)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            fontWeight: 300,
            letterSpacing: '0.03em',
          }}
          autoComplete="off"
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-1.5 ml-1 text-[0.6rem] text-red-400/70 font-body tracking-[0.06em]"
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Box Select Field ─── */
function BoxSelect({
  id, label, value, onChange, error, disabled,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; error?: string; disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  const goals = [
    'Suavizar linhas de expressão (Botox)',
    'Harmonização facial completa',
    'Definir e realçar lábios',
    'Rejuvenescimento e firmeza',
    'Hidratação profunda (Skinbooster)',
    'Quero uma avaliação completa',
  ];

  return (
    <div>
      <div
        className="relative flex items-center gap-3.5 rounded-lg transition-all duration-300"
        style={{
          background: 'rgba(18, 15, 10, 0.85)',
          border: `1px solid ${error ? 'rgba(239,68,68,0.35)' : focused ? 'rgba(214,190,138,0.45)' : 'rgba(214,190,138,0.14)'}`,
          boxShadow: focused ? '0 0 0 3px rgba(214,190,138,0.05)' : 'none',
          padding: '0 18px',
          height: '62px',
        }}
      >
        <span style={{ color: focused || value ? 'rgba(214,190,138,0.8)' : 'rgba(214,190,138,0.35)', transition: 'color 0.3s', flexShrink: 0 }}>
          <IconTarget />
        </span>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none appearance-none disabled:opacity-40"
          style={{
            color: value ? 'rgba(247,244,239,0.85)' : 'rgba(247,244,239,0.3)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            fontWeight: 300,
            letterSpacing: '0.03em',
            cursor: 'default',
          }}
        >
          <option value="" disabled style={{ background: '#0D0B07', color: 'rgba(247,244,239,0.3)' }}>{label}</option>
          {goals.map((g) => (
            <option key={g} value={g} style={{ background: '#0D0B07', color: '#F7F4EF' }}>{g}</option>
          ))}
        </select>
        <span className="flex-shrink-0 pointer-events-none">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="rgba(214,190,138,0.4)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-1.5 ml-1 text-[0.6rem] text-red-400/70 font-body tracking-[0.06em]"
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
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
      className="flex flex-col items-center text-center py-10 px-2"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease }}
    >
      <div className="relative mb-8">
        <motion.div
          className="w-[72px] h-[72px] rounded-full"
          style={{ border: '1px solid rgba(214,190,138,0.3)' }}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ duration: 0.55, ease }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(214,190,138,0.07) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 36 36" fill="none">
            <path d="M8 18l7 7 13-13" stroke="rgba(214,190,138,0.9)"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="check-path" />
          </svg>
        </div>
      </div>

      <motion.p className="text-eyebrow text-champagne/50 mb-4"
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}>
        Solicitação Confirmada
      </motion.p>

      <motion.h3
        className="font-display font-light text-warm-white leading-[1.1] mb-4"
        style={{ fontSize: 'clamp(1.6rem, 5vw, 2rem)' }}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7, ease }}
      >
        Seu atendimento prioritário foi<br />
        <span style={{
          background: 'linear-gradient(135deg, #E8D5A3, #C6A769)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          solicitado com sucesso.
        </span>
      </motion.h3>

      <motion.p className="font-body font-light text-warm-white/35 text-sm leading-relaxed mb-8 max-w-[280px]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.78, duration: 0.5 }}>
        Nossa equipe entrará em contato em breve para confirmar sua avaliação exclusiva.
      </motion.p>

      <motion.div className="flex flex-col gap-3 w-full"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.6, ease }}>
        <a href="https://wa.me/5571999999999" target="_blank" rel="noopener noreferrer"
          className="btn-gold w-full justify-center" data-cursor>
          <IconWhatsApp />
          <span>Falar no WhatsApp</span>
        </a>
        <div className="flex gap-3">
          <a href="https://www.instagram.com/botopremium/" target="_blank" rel="noopener noreferrer"
            className="btn-premium flex-1 justify-center text-[0.6rem]" data-cursor>
            Instagram
          </a>
          <a href="https://www.botopremium.com.br" target="_blank" rel="noopener noreferrer"
            className="btn-premium flex-1 justify-center text-[0.6rem]" data-cursor>
            Site Oficial
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Benefit Item ─── */
const benefits = [
  {
    label: 'Avaliação\npersonalizada',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    label: 'Atendimento\nprioritário',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    label: 'Protocolos\nexclusivos',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M8 8h.01M16 8h.01" />
        <path d="M5 20a7 7 0 0 1 14 0" />
        <path d="M12 4v2M12 14v2" />
        <circle cx="12" cy="19" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Resultados\nnaturais',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l4 6-10 13L2 9Z" />
        <path d="M11 3 8 9l4 13 4-13-3-6" />
        <path d="M2 9h20" />
      </svg>
    ),
  },
];

/* ─── Main Page ─── */
export function LeadForm() {
  const [form, setForm] = useState<LeadFormData>({ name: '', whatsapp: '', neighborhood: '', goal: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const setField = (field: keyof LeadFormData) => (value: string) =>
    setForm((p) => ({ ...p, [field]: field === 'whatsapp' ? formatWhatsApp(value) : value }));

  const validate = () => {
    const e: typeof errors = {
      name: validateName(form.name) ?? undefined,
      whatsapp: validateWhatsApp(form.whatsapp) ?? undefined,
      neighborhood: validateNeighborhood(form.neighborhood) ?? undefined,
      goal: validateGoal(form.goal) ?? undefined,
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
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
      (window as any).gtag?.('event', 'lead_submit', { event_category: 'form', event_label: form.goal });
      (window as any).fbq?.('track', 'Lead');
    } else {
      setStatus('error');
      setErrorMsg(result.message);
    }
  };

  const isDisabled = status === 'loading' || status === 'success';
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.7, ease },
  });

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-5 py-14"
      style={{ background: '#07060A' }}
    >
      {/* ── Background glows ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="ambient-glow w-[600px] h-[400px] -top-32 left-1/2 -translate-x-1/2"
          style={{ background: 'radial-gradient(ellipse, rgba(198,167,105,0.07) 0%, transparent 70%)' }} />
        <div className="ambient-glow w-[500px] h-[350px] bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4"
          style={{ background: 'radial-gradient(ellipse, rgba(214,190,138,0.04) 0%, transparent 70%)' }} />
      </div>

      {/* ── Content wrapper ── */}
      <div className="relative z-10 w-full" style={{ maxWidth: '440px' }}>

        {/* ── Logo ── */}
        <motion.div {...fadeUp(0)} className="flex flex-col items-center mb-7">
          <h2
            className="font-display font-light mb-1.5"
            style={{ fontSize: '1.75rem', letterSpacing: '0.08em', color: '#F7F4EF' }}
          >
            Boto
            <span style={{
              background: 'linear-gradient(135deg, #E8D5A3, #C6A769)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Premium
            </span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.58rem',
            letterSpacing: '0.32em',
            color: 'rgba(214,190,138,0.7)',
            textTransform: 'uppercase',
            fontWeight: 400,
          }}>
            Harmonização Facial
          </p>
          {/* Diamond ornament */}
          <div className="flex items-center gap-3 mt-4 w-full max-w-[180px]">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(214,190,138,0.35))' }} />
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 0L10 5L5 10L0 5L5 0Z" fill="rgba(214,190,138,0.55)" />
            </svg>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(214,190,138,0.35), transparent)' }} />
          </div>
        </motion.div>

        {/* ── Eyebrow ── */}
        <motion.p {...fadeUp(0.12)} className="text-center mb-4" style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.6rem',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(214,190,138,0.65)',
          fontWeight: 400,
        }}>
          Avaliação Exclusiva
        </motion.p>

        {/* ── Headline ── */}
        <div className="text-center mb-5 overflow-hidden">
          <motion.h1
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ delay: 0.22, duration: 0.95, ease }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.6rem, 10vw, 3.4rem)',
              fontWeight: 300,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#F7F4EF',
            }}
          >
            Inicie sua{' '}
            <span style={{
              background: 'linear-gradient(135deg, #E8D5A3 0%, #C6A769 45%, #D6BE8A 80%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
            }}>
              transformação.
            </span>
          </motion.h1>
        </div>

        {/* ── Description ── */}
        <motion.p {...fadeUp(0.38)} className="text-center mb-8" style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.88rem',
          fontWeight: 300,
          color: 'rgba(247,244,239,0.45)',
          lineHeight: 1.75,
          letterSpacing: '0.01em',
        }}>
          Preencha o formulário e nossa equipe entrará em contato para agendar sua avaliação personalizada sem compromisso.
        </motion.p>

        {/* ── Benefits (4 columns) ── */}
        <motion.div {...fadeUp(0.48)} className="mb-7">
          <div className="grid grid-cols-4" style={{ gap: 0 }}>
            {benefits.map((b, i) => (
              <div key={i} className="flex flex-col items-center text-center px-1 py-1 relative">
                {/* Vertical separator */}
                {i > 0 && (
                  <div
                    className="absolute left-0 top-2 bottom-2"
                    style={{ width: '1px', background: 'rgba(214,190,138,0.12)' }}
                  />
                )}
                <div className="mb-2.5" style={{ color: 'rgba(214,190,138,0.75)' }}>
                  {b.icon}
                </div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.62rem',
                  fontWeight: 300,
                  color: 'rgba(247,244,239,0.5)',
                  lineHeight: 1.45,
                  whiteSpace: 'pre-line',
                }}>
                  {b.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Diamond divider ── */}
        <motion.div {...fadeUp(0.52)} className="mb-7">
          <DiamondDivider />
        </motion.div>

        {/* ── Form / Success ── */}
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <SuccessScreen key="success" />
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-3"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              noValidate
            >
              <motion.div {...fadeUp(0.56)}>
                <BoxInput id="name" label="Nome completo" value={form.name}
                  onChange={setField('name')} error={errors.name} disabled={isDisabled}
                  icon={<IconUser />} />
              </motion.div>

              <motion.div {...fadeUp(0.62)}>
                <BoxInput id="whatsapp" label="WhatsApp" type="tel" value={form.whatsapp}
                  onChange={setField('whatsapp')} error={errors.whatsapp} disabled={isDisabled}
                  icon={<IconWhatsApp />} />
              </motion.div>

              <motion.div {...fadeUp(0.68)}>
                <BoxInput id="neighborhood" label="Bairro / Cidade" value={form.neighborhood}
                  onChange={setField('neighborhood')} error={errors.neighborhood} disabled={isDisabled}
                  icon={<IconPin />} />
              </motion.div>

              <motion.div {...fadeUp(0.74)}>
                <BoxSelect id="goal" label="Objetivo estético" value={form.goal}
                  onChange={setField('goal')} error={errors.goal} disabled={isDisabled} />
              </motion.div>

              {/* API error */}
              <AnimatePresence>
                {status === 'error' && errorMsg && (
                  <motion.div className="px-4 py-3 rounded-lg border border-red-500/15 bg-red-500/5"
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <p className="text-red-400/70 text-xs font-body">{errorMsg}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA Button */}
              <motion.div {...fadeUp(0.8)} className="mt-2">
                <button
                  type="submit"
                  disabled={isDisabled}
                  className="w-full flex items-center justify-center gap-3 disabled:opacity-50 transition-all duration-500"
                  style={{
                    background: status === 'loading' ? 'rgba(198,167,105,0.6)' : 'linear-gradient(135deg, #D6BE8A 0%, #C6A769 50%, #D6BE8A 100%)',
                    backgroundSize: '200% auto',
                    color: '#07060A',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.26em',
                    textTransform: 'uppercase',
                    height: '62px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 24px rgba(198,167,105,0.22), 0 1px 0 rgba(255,255,255,0.08) inset',
                    cursor: isDisabled ? 'default' : 'none',
                  }}
                  onMouseEnter={(e) => { if (!isDisabled) { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 40px rgba(198,167,105,0.4), 0 1px 0 rgba(255,255,255,0.08) inset'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; } }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(198,167,105,0.22), 0 1px 0 rgba(255,255,255,0.08) inset'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
                  data-cursor
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-1.5">
                      <span className="loading-dot w-1.5 h-1.5 rounded-full bg-obsidian/70" />
                      <span className="loading-dot w-1.5 h-1.5 rounded-full bg-obsidian/70" />
                      <span className="loading-dot w-1.5 h-1.5 rounded-full bg-obsidian/70" />
                    </span>
                  ) : (
                    <>
                      <span>Solicitar Avaliação Exclusiva</span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Subtext below button */}
                <p className="text-center mt-3" style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(214,190,138,0.4)',
                  fontWeight: 400,
                }}>
                  Atendimento Prioritário · Sem Compromisso
                </p>
              </motion.div>

              {/* Privacy notice */}
              <motion.div {...fadeUp(0.88)} className="mt-4">
                <DiamondDivider />
                <div className="flex items-start gap-3 mt-5">
                  <div className="flex-shrink-0 mt-0.5" style={{ color: 'rgba(214,190,138,0.3)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.72rem',
                    fontWeight: 300,
                    color: 'rgba(247,244,239,0.25)',
                    lineHeight: 1.65,
                    letterSpacing: '0.01em',
                  }}>
                    Seus dados são tratados com total segurança e privacidade. Não compartilhamos suas informações com terceiros.
                  </p>
                </div>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* ── Footer ── */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="text-center mt-9"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.58rem',
            letterSpacing: '0.1em',
            color: 'rgba(247,244,239,0.16)',
          }}
        >
          © {new Date().getFullYear()} BotoPremium · Todos os direitos reservados
        </motion.p>
      </div>
    </section>
  );
}
