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

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Tokens ─── */
const T = {
  gold: '#C6A769',
  champagne: '#D6BE8A',
  goldLight: '#E8D5A3',
  white: '#F7F4EF',
  bg: '#0F0C08',
  inputBg: 'rgba(24, 18, 12, 0.96)',
  inputBorder: 'rgba(214, 190, 138, 0.16)',
  inputBorderFocus: 'rgba(214, 190, 138, 0.48)',
  iconIdle: 'rgba(214, 190, 138, 0.42)',
  iconActive: 'rgba(214, 190, 138, 0.88)',
  textDim: 'rgba(247, 244, 239, 0.5)',
  textDimmer: 'rgba(247, 244, 239, 0.27)',
  goldDim: 'rgba(214, 190, 138, 0.65)',
  goldDimmer: 'rgba(214, 190, 138, 0.38)',
  separator: 'rgba(214, 190, 138, 0.14)',
} as const;

/* ─── Animation helper ─── */
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.8, ease: EASE },
});

/* ─── Diamond Divider ─── */
function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <div style={{
        flex: 1, height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(214,190,138,0.38) 100%)',
      }} />
      <div style={{ margin: '0 12px', lineHeight: 0 }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M5 0L10 5L5 10L0 5L5 0Z" fill="rgba(214,190,138,0.58)" />
        </svg>
      </div>
      <div style={{
        flex: 1, height: '1px',
        background: 'linear-gradient(90deg, rgba(214,190,138,0.38) 0%, transparent 100%)',
      }} />
    </div>
  );
}

/* ─── Input Field ─── */
function Field({
  id, placeholder, value, onChange, error, type = 'text', disabled,
  icon,
}: {
  id: string; placeholder: string; value: string;
  onChange: (v: string) => void; error?: string;
  type?: string; disabled?: boolean; icon: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        height: '64px',
        padding: '0 20px',
        background: T.inputBg,
        border: `1px solid ${error ? 'rgba(239,68,68,0.35)' : active ? T.inputBorderFocus : T.inputBorder}`,
        borderRadius: '8px',
        boxShadow: active && !error ? '0 0 0 3px rgba(214,190,138,0.055)' : 'none',
        transition: 'border-color 0.35s, box-shadow 0.35s',
      }}>
        <span style={{
          color: active ? T.iconActive : T.iconIdle,
          transition: 'color 0.3s',
          flexShrink: 0,
          display: 'flex',
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
          placeholder={placeholder}
          autoComplete="off"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: T.white,
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            fontWeight: 300,
            letterSpacing: '0.02em',
            opacity: disabled ? 0.4 : 1,
            caretColor: T.champagne,
          }}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            style={{
              marginTop: '6px',
              marginLeft: '4px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.6rem',
              letterSpacing: '0.06em',
              color: 'rgba(248,113,113,0.7)',
            }}
          >{error}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Select Field ─── */
function SelectField({
  id, placeholder, value, onChange, error, disabled,
}: {
  id: string; placeholder: string; value: string;
  onChange: (v: string) => void; error?: string; disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        height: '64px',
        padding: '0 20px',
        background: T.inputBg,
        border: `1px solid ${error ? 'rgba(239,68,68,0.35)' : active ? T.inputBorderFocus : T.inputBorder}`,
        borderRadius: '8px',
        boxShadow: active && !error ? '0 0 0 3px rgba(214,190,138,0.055)' : 'none',
        transition: 'border-color 0.35s, box-shadow 0.35s',
      }}>
        <span style={{ color: active ? T.iconActive : T.iconIdle, transition: 'color 0.3s', flexShrink: 0, display: 'flex' }}>
          {/* Target/crosshair */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </span>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
            color: value ? T.white : 'rgba(247,244,239,0.32)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            fontWeight: 300,
            letterSpacing: '0.02em',
            opacity: disabled ? 0.4 : 1,
            cursor: 'default',
          }}
        >
          <option value="" disabled style={{ background: '#120D08', color: 'rgba(247,244,239,0.3)' }}>{placeholder}</option>
          {goals.map((g) => (
            <option key={g} value={g} style={{ background: '#120D08', color: T.white }}>{g}</option>
          ))}
        </select>
        <span style={{ flexShrink: 0, pointerEvents: 'none', display: 'flex' }}>
          <svg width="11" height="7" viewBox="0 0 11 7" fill="none">
            <path d="M1 1l4.5 4.5L10 1" stroke="rgba(214,190,138,0.38)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            style={{
              marginTop: '6px',
              marginLeft: '4px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.6rem',
              letterSpacing: '0.06em',
              color: 'rgba(248,113,113,0.7)',
            }}
          >{error}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Success Screen ─── */
function Success() {
  return (
    <motion.div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 8px' }}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div style={{ position: 'relative', marginBottom: '32px' }}>
        <motion.div
          style={{ width: 72, height: 72, borderRadius: '50%', border: '1px solid rgba(214,190,138,0.28)' }}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ duration: 0.55, ease: EASE }}
        />
        <motion.div
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(214,190,138,0.07) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="26" height="26" viewBox="0 0 36 36" fill="none">
            <path d="M8 18l7 7 13-13" stroke="rgba(214,190,138,0.9)" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" className="check-path" />
          </svg>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        style={{
          fontFamily: 'var(--font-body)', fontSize: '0.6rem',
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: T.goldDimmer, marginBottom: '14px',
        }}
      >
        Solicitação Confirmada
      </motion.p>

      <motion.h3
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7, ease: EASE }}
        style={{
          fontFamily: 'var(--font-display)', fontWeight: 300,
          fontSize: 'clamp(1.6rem, 5vw, 2rem)',
          letterSpacing: '-0.02em', lineHeight: 1.1,
          color: T.white, marginBottom: '16px',
        }}
      >
        Seu atendimento prioritário foi{' '}
        <span style={{
          background: `linear-gradient(135deg, ${T.goldLight}, ${T.gold})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          solicitado com sucesso.
        </span>
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.78, duration: 0.5 }}
        style={{
          fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 300,
          color: T.textDimmer, lineHeight: 1.65, marginBottom: '32px', maxWidth: '280px',
        }}
      >
        Nossa equipe entrará em contato em breve para confirmar sua avaliação exclusiva.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.6, ease: EASE }}
        style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}
      >
        <a href="https://wa.me/5571999999999" target="_blank" rel="noopener noreferrer"
          className="btn-gold w-full justify-center" data-cursor>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
          <span>Falar no WhatsApp</span>
        </a>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="https://www.instagram.com/botopremium/" target="_blank" rel="noopener noreferrer"
            className="btn-premium flex-1 justify-center" style={{ fontSize: '0.6rem' }} data-cursor>
            Instagram
          </a>
          <a href="https://www.botopremium.com.br" target="_blank" rel="noopener noreferrer"
            className="btn-premium flex-1 justify-center" style={{ fontSize: '0.6rem' }} data-cursor>
            Site Oficial
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main ─── */
export function LeadForm() {
  const [form, setForm] = useState<LeadFormData>({ name: '', whatsapp: '', neighborhood: '', goal: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const setField = (field: keyof LeadFormData) => (v: string) =>
    setForm((p) => ({ ...p, [field]: field === 'whatsapp' ? formatWhatsApp(v) : v }));

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

  return (
    <section style={{
      position: 'relative',
      minHeight: '100svh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: T.bg,
      padding: '56px 22px 52px',
      overflowX: 'hidden',
    }}>

      {/* ── Atmospheric background ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden>
        {/* Upper center glow */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '720px',
          height: '560px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(198,167,105,0.075) 0%, rgba(198,167,105,0.028) 35%, transparent 68%)',
          filter: 'blur(8px)',
        }} />
        {/* Center ambient */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(198,167,105,0.03) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }} />
        {/* Bottom subtle */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(198,167,105,0.025) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }} />
      </div>

      {/* ── Content ── */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '480px' }}>

        {/* ══ LOGO ══ */}
        <motion.div {...fadeUp(0)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          {/* Brand name */}
          <div style={{ marginBottom: '7px' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 6vw, 2rem)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: T.white,
              lineHeight: 1,
            }}>
              Boto
            </span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 6vw, 2rem)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              lineHeight: 1,
              background: `linear-gradient(135deg, ${T.goldLight} 0%, ${T.gold} 55%, ${T.champagne} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Premium
            </span>
          </div>

          {/* Sub-brand */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.55rem',
            fontWeight: 400,
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: T.goldDim,
            marginBottom: '16px',
          }}>
            Harmonização Facial
          </p>

          {/* Divider */}
          <Divider />
        </motion.div>

        {/* ══ EYEBROW ══ */}
        <motion.p {...fadeUp(0.1)} style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.58rem',
          fontWeight: 400,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: T.goldDim,
          textAlign: 'center',
          marginBottom: '14px',
        }}>
          Avaliação Exclusiva
        </motion.p>

        {/* ══ HEADLINE ══ */}
        <div style={{ textAlign: 'center', marginBottom: '22px', overflow: 'hidden' }}>
          <motion.h1
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ delay: 0.16, duration: 1.0, ease: EASE }}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: 'clamp(3.2rem, 13.5vw, 5rem)',
              letterSpacing: '-0.025em',
              lineHeight: 1.02,
            }}
          >
            <span style={{ display: 'block', color: T.white }}>Inicie sua</span>
            <span style={{
              display: 'block',
              fontStyle: 'italic',
              background: `linear-gradient(135deg, ${T.goldLight} 0%, ${T.gold} 50%, ${T.champagne} 85%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              transformação.
            </span>
          </motion.h1>
        </div>

        {/* ══ DESCRIPTION ══ */}
        <motion.p {...fadeUp(0.32)} style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.93rem',
          fontWeight: 300,
          color: T.textDim,
          lineHeight: 1.72,
          letterSpacing: '0.005em',
          textAlign: 'center',
          marginBottom: '36px',
        }}>
          Preencha o formulário e nossa equipe entrará em contato para agendar sua avaliação personalizada sem compromisso.
        </motion.p>

        {/* ══ BENEFITS ══ */}
        <motion.div {...fadeUp(0.42)} style={{ marginBottom: '26px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>

            {/* 1 – Avaliação personalizada */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '4px 6px', position: 'relative' }}>
              <div style={{ color: T.goldDim, marginBottom: '10px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.63rem', fontWeight: 300, color: 'rgba(247,244,239,0.72)', lineHeight: 1.42 }}>
                Avaliação<br />personalizada
              </span>
            </div>

            {/* 2 – Atendimento prioritário */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '4px 6px', position: 'relative', borderLeft: `1px solid ${T.separator}` }}>
              <div style={{ color: T.goldDim, marginBottom: '10px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.63rem', fontWeight: 300, color: 'rgba(247,244,239,0.72)', lineHeight: 1.42 }}>
                Atendimento<br />prioritário
              </span>
            </div>

            {/* 3 – Protocolos exclusivos */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '4px 6px', position: 'relative', borderLeft: `1px solid ${T.separator}` }}>
              <div style={{ color: T.goldDim, marginBottom: '10px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.63rem', fontWeight: 300, color: 'rgba(247,244,239,0.72)', lineHeight: 1.42 }}>
                Protocolos<br />exclusivos
              </span>
            </div>

            {/* 4 – Resultados naturais */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '4px 6px', position: 'relative', borderLeft: `1px solid ${T.separator}` }}>
              <div style={{ color: T.goldDim, marginBottom: '10px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3h12l4 6-10 13L2 9Z" />
                  <path d="M11 3 8 9l4 13 4-13-3-6" />
                  <path d="M2 9h20" />
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.63rem', fontWeight: 300, color: 'rgba(247,244,239,0.72)', lineHeight: 1.42 }}>
                Resultados<br />naturais
              </span>
            </div>

          </div>
        </motion.div>

        {/* ══ DIVIDER ══ */}
        <motion.div {...fadeUp(0.48)} style={{ marginBottom: '26px' }}>
          <Divider />
        </motion.div>

        {/* ══ FORM / SUCCESS ══ */}
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <Success key="success" />
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              noValidate
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {/* Fields */}
              <motion.div {...fadeUp(0.52)}>
                <Field id="name" placeholder="Nome completo" value={form.name}
                  onChange={setField('name')} error={errors.name} disabled={isDisabled}
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  }
                />
              </motion.div>

              <motion.div {...fadeUp(0.58)}>
                <Field id="whatsapp" placeholder="WhatsApp" type="tel" value={form.whatsapp}
                  onChange={setField('whatsapp')} error={errors.whatsapp} disabled={isDisabled}
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                    </svg>
                  }
                />
              </motion.div>

              <motion.div {...fadeUp(0.64)}>
                <Field id="neighborhood" placeholder="Bairro / Cidade" value={form.neighborhood}
                  onChange={setField('neighborhood')} error={errors.neighborhood} disabled={isDisabled}
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  }
                />
              </motion.div>

              <motion.div {...fadeUp(0.70)}>
                <SelectField id="goal" placeholder="Objetivo estético" value={form.goal}
                  onChange={setField('goal')} error={errors.goal} disabled={isDisabled} />
              </motion.div>

              {/* API error */}
              <AnimatePresence>
                {status === 'error' && errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{
                      padding: '12px 16px', borderRadius: '8px',
                      border: '1px solid rgba(239,68,68,0.14)',
                      background: 'rgba(239,68,68,0.05)',
                    }}
                  >
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(248,113,113,0.75)' }}>{errorMsg}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── CTA BUTTON ── */}
              <motion.div {...fadeUp(0.76)} style={{ marginTop: '8px' }}>
                <button
                  type="submit"
                  disabled={isDisabled}
                  data-cursor
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '11px',
                    height: '64px',
                    borderRadius: '8px',
                    border: 'none',
                    background: status === 'loading'
                      ? 'rgba(198,167,105,0.5)'
                      : `linear-gradient(135deg, ${T.goldLight} 0%, ${T.gold} 52%, ${T.champagne} 100%)`,
                    backgroundSize: '200% auto',
                    color: T.bg,
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.64rem',
                    fontWeight: 600,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    cursor: isDisabled ? 'default' : 'none',
                    opacity: isDisabled && status !== 'loading' ? 0.5 : 1,
                    boxShadow: '0 4px 32px rgba(198,167,105,0.22), 0 1px 0 rgba(255,255,255,0.06) inset',
                    transition: 'box-shadow 0.4s, transform 0.4s, background-position 0.6s',
                  }}
                  onMouseEnter={(e) => {
                    if (isDisabled) return;
                    const b = e.currentTarget;
                    b.style.boxShadow = '0 8px 48px rgba(198,167,105,0.38), 0 1px 0 rgba(255,255,255,0.06) inset';
                    b.style.transform = 'translateY(-2px)';
                    b.style.backgroundPosition = 'right center';
                  }}
                  onMouseLeave={(e) => {
                    const b = e.currentTarget;
                    b.style.boxShadow = '0 4px 32px rgba(198,167,105,0.22), 0 1px 0 rgba(255,255,255,0.06) inset';
                    b.style.transform = 'none';
                    b.style.backgroundPosition = 'left center';
                  }}
                >
                  {status === 'loading' ? (
                    <span style={{ display: 'flex', gap: '5px' }}>
                      <span className="loading-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(15,12,8,0.55)', display: 'inline-block' }} />
                      <span className="loading-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(15,12,8,0.55)', display: 'inline-block' }} />
                      <span className="loading-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(15,12,8,0.55)', display: 'inline-block' }} />
                    </span>
                  ) : (
                    <>
                      <span>Solicitar Avaliação Exclusiva</span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.7"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Sub-label */}
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.57rem',
                  fontWeight: 400,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: T.goldDimmer,
                  textAlign: 'center',
                  marginTop: '12px',
                }}>
                  Atendimento Prioritário · Sem Compromisso
                </p>
              </motion.div>

              {/* ── PRIVACY ── */}
              <motion.div {...fadeUp(0.84)} style={{ marginTop: '22px' }}>
                <Divider />
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '13px',
                  marginTop: '20px',
                }}>
                  <div style={{ flexShrink: 0, marginTop: '1px', color: 'rgba(214,190,138,0.32)' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.77rem',
                    fontWeight: 300,
                    color: T.textDimmer,
                    lineHeight: 1.62,
                    letterSpacing: '0.008em',
                  }}>
                    Seus dados são tratados com total segurança e privacidade. Não compartilhamos suas informações com terceiros.
                  </p>
                </div>
              </motion.div>

            </motion.form>
          )}
        </AnimatePresence>

        {/* ══ FOOTER ══ */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.6rem',
            letterSpacing: '0.07em',
            color: 'rgba(247,244,239,0.16)',
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
