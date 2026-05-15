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

/* ─── SVG Icons (form fields) ─── */
const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconWhatsApp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const IconPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconTarget = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

/* ─── Diamond Divider ─── */
function DiamondDivider() {
  return (
    <div className="flex items-center w-full">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(214,190,138,0.4))' }} />
      <div className="mx-3">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M5 0L10 5L5 10L0 5L5 0Z" fill="rgba(214,190,138,0.6)" />
        </svg>
      </div>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(214,190,138,0.4), transparent)' }} />
    </div>
  );
}

/* ─── Box Input ─── */
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
        className="relative flex items-center gap-4 rounded-lg transition-all duration-300"
        style={{
          background: 'rgba(22, 17, 11, 0.92)',
          border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : focused ? 'rgba(214,190,138,0.5)' : 'rgba(214,190,138,0.18)'}`,
          boxShadow: focused ? '0 0 0 3px rgba(214,190,138,0.06)' : 'none',
          padding: '0 20px',
          height: '64px',
        }}
      >
        <span style={{
          color: focused || value ? 'rgba(214,190,138,0.9)' : 'rgba(214,190,138,0.45)',
          transition: 'color 0.3s',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
        }}>
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
            color: 'rgba(247,244,239,0.9)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            fontWeight: 300,
            letterSpacing: '0.02em',
          }}
          autoComplete="off"
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-1.5 ml-1 text-[0.6rem] text-red-400/70 tracking-[0.06em]"
            style={{ fontFamily: 'var(--font-body)' }}
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

/* ─── Box Select ─── */
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
        className="relative flex items-center gap-4 rounded-lg transition-all duration-300"
        style={{
          background: 'rgba(22, 17, 11, 0.92)',
          border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : focused ? 'rgba(214,190,138,0.5)' : 'rgba(214,190,138,0.18)'}`,
          boxShadow: focused ? '0 0 0 3px rgba(214,190,138,0.06)' : 'none',
          padding: '0 20px',
          height: '64px',
        }}
      >
        <span style={{
          color: focused || value ? 'rgba(214,190,138,0.9)' : 'rgba(214,190,138,0.45)',
          transition: 'color 0.3s',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
        }}>
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
            color: value ? 'rgba(247,244,239,0.9)' : 'rgba(247,244,239,0.35)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            fontWeight: 300,
            letterSpacing: '0.02em',
            cursor: 'default',
          }}
        >
          <option value="" disabled style={{ background: '#120E09', color: 'rgba(247,244,239,0.3)' }}>{label}</option>
          {goals.map((g) => (
            <option key={g} value={g} style={{ background: '#120E09', color: '#F7F4EF' }}>{g}</option>
          ))}
        </select>
        <span className="flex-shrink-0 pointer-events-none">
          <svg width="11" height="7" viewBox="0 0 11 7" fill="none">
            <path d="M1 1l4.5 4.5L10 1" stroke="rgba(214,190,138,0.45)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-1.5 ml-1 text-[0.6rem] text-red-400/70 tracking-[0.06em]"
            style={{ fontFamily: 'var(--font-body)' }}
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

      <motion.p className="text-eyebrow mb-4" style={{ color: 'rgba(214,190,138,0.5)' }}
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}>
        Solicitação Confirmada
      </motion.p>

      <motion.h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.7rem, 5vw, 2.1rem)',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          color: '#F7F4EF',
          marginBottom: '1rem',
        }}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7, ease }}
      >
        Seu atendimento prioritário foi{' '}
        <span style={{
          background: 'linear-gradient(135deg, #E8D5A3, #C6A769)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          solicitado com sucesso.
        </span>
      </motion.h3>

      <motion.p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.85rem',
        fontWeight: 300,
        color: 'rgba(247,244,239,0.35)',
        lineHeight: 1.65,
        marginBottom: '2rem',
        maxWidth: '280px',
      }}
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

/* ─── Benefit Icons ─── */
const BenefitShield = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const BenefitLock = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const BenefitMedal = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="6" />
    <path d="M8.56 16.9l-1.56 5.1 5-3 5 3-1.56-5.1" />
  </svg>
);

const BenefitDiamond = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 6-10 13L2 9Z" />
    <path d="M11 3 8 9l4 13 4-13-3-6" />
    <path d="M2 9h20" />
  </svg>
);

const benefits = [
  { label: 'Avaliação\npersonalizada', icon: <BenefitShield /> },
  { label: 'Atendimento\nprioritário', icon: <BenefitLock /> },
  { label: 'Protocolos\nexclusivos', icon: <BenefitMedal /> },
  { label: 'Resultados\nnaturais', icon: <BenefitDiamond /> },
];

/* ─── Main Component ─── */
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
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.75, ease },
  });

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#0D0B08', padding: '56px 20px 48px' }}
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute w-[700px] h-[500px] -top-40 left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(198,167,105,0.065) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div className="absolute w-[600px] h-[400px] bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(214,190,138,0.04) 0%, transparent 65%)', filter: 'blur(60px)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full" style={{ maxWidth: '480px' }}>

        {/* ── LOGO ── */}
        <motion.div {...fadeUp(0)} className="flex flex-col items-center" style={{ marginBottom: '28px' }}>
          <div className="flex flex-col items-center" style={{ marginBottom: '14px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.9rem',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: '#F7F4EF',
              lineHeight: 1,
              marginBottom: '6px',
            }}>
              Boto<span style={{
                background: 'linear-gradient(135deg, #E8D5A3, #C6A769)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Premium</span>
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.56rem',
              letterSpacing: '0.36em',
              color: 'rgba(214,190,138,0.75)',
              textTransform: 'uppercase',
              fontWeight: 400,
            }}>
              Harmonização Facial
            </p>
          </div>

          {/* Full-width diamond divider under logo */}
          <DiamondDivider />
        </motion.div>

        {/* ── EYEBROW ── */}
        <motion.p {...fadeUp(0.1)} style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.6rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(214,190,138,0.7)',
          fontWeight: 400,
          textAlign: 'center',
          marginBottom: '18px',
        }}>
          Avaliação Exclusiva
        </motion.p>

        {/* ── HEADLINE ── */}
        <div style={{ textAlign: 'center', marginBottom: '24px', overflow: 'hidden' }}>
          <motion.h1
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ delay: 0.18, duration: 1, ease }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.4rem, 13vw, 4.5rem)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              color: '#F7F4EF',
            }}
          >
            Inicie sua{' '}
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #E8D5A3 0%, #C6A769 50%, #D6BE8A 85%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
            }}>
              transformação.
            </span>
          </motion.h1>
        </div>

        {/* ── DESCRIPTION ── */}
        <motion.p {...fadeUp(0.34)} style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          fontWeight: 300,
          color: 'rgba(247,244,239,0.55)',
          lineHeight: 1.7,
          letterSpacing: '0.01em',
          textAlign: 'center',
          marginBottom: '36px',
        }}>
          Preencha o formulário e nossa equipe entrará em contato para agendar sua avaliação personalizada sem compromisso.
        </motion.p>

        {/* ── BENEFITS ── */}
        <motion.div {...fadeUp(0.44)} style={{ marginBottom: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {benefits.map((b, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '4px 8px',
                position: 'relative',
              }}>
                {i > 0 && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '8px',
                    bottom: '8px',
                    width: '1px',
                    background: 'rgba(214,190,138,0.15)',
                  }} />
                )}
                <div style={{ color: 'rgba(214,190,138,0.8)', marginBottom: '10px' }}>
                  {b.icon}
                </div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.65rem',
                  fontWeight: 300,
                  color: 'rgba(247,244,239,0.75)',
                  lineHeight: 1.4,
                  whiteSpace: 'pre-line',
                }}>
                  {b.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── DIAMOND DIVIDER ── */}
        <motion.div {...fadeUp(0.5)} style={{ marginBottom: '28px' }}>
          <DiamondDivider />
        </motion.div>

        {/* ── FORM / SUCCESS ── */}
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <SuccessScreen key="success" />
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              noValidate
            >
              <motion.div {...fadeUp(0.54)}>
                <BoxInput id="name" label="Nome completo" value={form.name}
                  onChange={setField('name')} error={errors.name} disabled={isDisabled}
                  icon={<IconUser />} />
              </motion.div>

              <motion.div {...fadeUp(0.60)}>
                <BoxInput id="whatsapp" label="WhatsApp" type="tel" value={form.whatsapp}
                  onChange={setField('whatsapp')} error={errors.whatsapp} disabled={isDisabled}
                  icon={<IconWhatsApp />} />
              </motion.div>

              <motion.div {...fadeUp(0.66)}>
                <BoxInput id="neighborhood" label="Bairro / Cidade" value={form.neighborhood}
                  onChange={setField('neighborhood')} error={errors.neighborhood} disabled={isDisabled}
                  icon={<IconPin />} />
              </motion.div>

              <motion.div {...fadeUp(0.72)}>
                <BoxSelect id="goal" label="Objetivo estético" value={form.goal}
                  onChange={setField('goal')} error={errors.goal} disabled={isDisabled} />
              </motion.div>

              {/* Error message */}
              <AnimatePresence>
                {status === 'error' && errorMsg && (
                  <motion.div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(239,68,68,0.15)',
                      background: 'rgba(239,68,68,0.05)',
                    }}
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <p style={{ color: 'rgba(248,113,113,0.75)', fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}>{errorMsg}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── CTA BUTTON ── */}
              <motion.div {...fadeUp(0.78)} style={{ marginTop: '8px' }}>
                <button
                  type="submit"
                  disabled={isDisabled}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    height: '64px',
                    borderRadius: '8px',
                    background: status === 'loading'
                      ? 'rgba(198,167,105,0.55)'
                      : 'linear-gradient(135deg, #D6BE8A 0%, #C6A769 50%, #D6BE8A 100%)',
                    backgroundSize: '200% auto',
                    color: '#0D0B08',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: isDisabled ? 'default' : 'none',
                    opacity: isDisabled && status !== 'loading' ? 0.5 : 1,
                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 4px 28px rgba(198,167,105,0.25)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled) {
                      const b = e.currentTarget as HTMLButtonElement;
                      b.style.boxShadow = '0 8px 48px rgba(198,167,105,0.42)';
                      b.style.transform = 'translateY(-1px)';
                      b.style.backgroundPosition = 'right center';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.boxShadow = '0 4px 28px rgba(198,167,105,0.25)';
                    b.style.transform = 'none';
                    b.style.backgroundPosition = 'left center';
                  }}
                  data-cursor
                >
                  {status === 'loading' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="loading-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(13,11,8,0.6)' }} />
                      <span className="loading-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(13,11,8,0.6)' }} />
                      <span className="loading-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(13,11,8,0.6)' }} />
                    </span>
                  ) : (
                    <>
                      <span>Solicitar Avaliação Exclusiva</span>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M1 7.5h13M9 2l5.5 5.5L9 13" stroke="currentColor" strokeWidth="1.6"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Sub-label */}
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.57rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(214,190,138,0.45)',
                  fontWeight: 400,
                  textAlign: 'center',
                  marginTop: '12px',
                }}>
                  Atendimento Prioritário · Sem Compromisso
                </p>
              </motion.div>

              {/* ── PRIVACY ── */}
              <motion.div {...fadeUp(0.86)} style={{ marginTop: '20px' }}>
                <DiamondDivider />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginTop: '20px' }}>
                  <div style={{ flexShrink: 0, marginTop: '2px', color: 'rgba(214,190,138,0.35)' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.78rem',
                    fontWeight: 300,
                    color: 'rgba(247,244,239,0.28)',
                    lineHeight: 1.6,
                    letterSpacing: '0.01em',
                  }}>
                    Seus dados são tratados com total segurança e privacidade. Não compartilhamos suas informações com terceiros.
                  </p>
                </div>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* ── FOOTER ── */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.6rem',
            letterSpacing: '0.08em',
            color: 'rgba(247,244,239,0.18)',
            textAlign: 'center',
            marginTop: '36px',
          }}
        >
          © {new Date().getFullYear()} BotoPremium · Todos os direitos reservados
        </motion.p>

      </div>
    </section>
  );
}
