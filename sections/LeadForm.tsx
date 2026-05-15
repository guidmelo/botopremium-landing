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

/* ─── Floating Input ─── */
function FloatingInput({
  id, label, value, onChange, error, type = 'text', disabled,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; error?: string;
  type?: string; disabled?: boolean;
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
          className={`input-field w-full ${error ? 'border-red-500/40' : ''} ${disabled ? 'opacity-40' : ''}`}
          autoComplete="off"
        />
        <label htmlFor={id} className="float-label">{label}</label>
        <motion.span
          className="absolute bottom-0 left-0 h-px block origin-left"
          style={{ background: 'linear-gradient(90deg, rgba(214,190,138,0.7), transparent)' }}
          animate={{ scaleX: value ? 1 : 0 }}
          transition={{ duration: 0.55, ease }}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-2 text-[0.6rem] text-red-400/70 font-body tracking-[0.06em]"
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

/* ─── Floating Select ─── */
function FloatingSelect({
  id, label, value, onChange, error, disabled,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; error?: string; disabled?: boolean;
}) {
  const goals = [
    'Suavizar linhas de expressão (Botox)',
    'Harmonização facial completa',
    'Definir e realçar lábios',
    'Rejuvenescimento e firmeza',
    'Hidratação profunda (Skinbooster)',
    'Quero uma avaliação completa',
  ];
  return (
    <div className="relative">
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`input-field w-full appearance-none bg-transparent ${disabled ? 'opacity-40' : ''} ${error ? 'border-red-500/40' : ''}`}
          style={{ color: value ? 'var(--warm-white)' : 'transparent', cursor: 'none' }}
        >
          <option value="" disabled hidden> </option>
          {goals.map((g) => (
            <option key={g} value={g} style={{ background: '#111', color: '#F7F4EF' }}>{g}</option>
          ))}
        </select>
        <label
          htmlFor={id}
          className={`float-label ${value ? 'top-[0.3rem] !text-[0.55rem] !tracking-[0.22em] uppercase !text-champagne/65' : ''}`}
        >
          {label}
        </label>
        <span className="absolute right-0 bottom-4 pointer-events-none opacity-40">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 3l4 4 4-4" stroke="rgba(214,190,138,0.9)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <motion.span
          className="absolute bottom-0 left-0 h-px block origin-left"
          style={{ background: 'linear-gradient(90deg, rgba(214,190,138,0.7), transparent)' }}
          animate={{ scaleX: value ? 1 : 0 }}
          transition={{ duration: 0.55, ease }}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-2 text-[0.6rem] text-red-400/70 font-body tracking-[0.06em]"
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
      className="flex flex-col items-center text-center py-12 px-4"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease }}
    >
      {/* Icon */}
      <div className="relative mb-10">
        <motion.div
          className="w-[72px] h-[72px] rounded-full"
          style={{ border: '1px solid rgba(214,190,138,0.25)' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, ease }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(214,190,138,0.06) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 36 36" fill="none">
            <path d="M8 18l7 7 13-13" stroke="rgba(214,190,138,0.85)"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="check-path" />
          </svg>
        </div>
      </div>

      <motion.span
        className="text-eyebrow text-champagne/50 mb-5"
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Solicitação Confirmada
      </motion.span>

      <motion.h3
        className="font-display text-[1.75rem] md:text-[2.25rem] font-light leading-[1.1] text-warm-white mb-5"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.62, duration: 0.7, ease }}
      >
        Seu atendimento prioritário
        <br />
        <span style={{
          background: 'linear-gradient(135deg, #E8D5A3, #C6A769)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          foi solicitado com sucesso.
        </span>
      </motion.h3>

      <motion.p
        className="text-warm-white/35 font-body font-light text-sm leading-[1.8] max-w-[280px] mb-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        Nossa equipe entrará em contato em breve para confirmar sua avaliação exclusiva.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6, ease }}
      >
        <a href="https://wa.me/5571999999999" target="_blank" rel="noopener noreferrer"
          className="btn-gold w-full sm:w-auto" data-cursor>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="opacity-80 flex-shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span>WhatsApp</span>
        </a>
        <a href="https://www.instagram.com/botopremium/" target="_blank" rel="noopener noreferrer"
          className="btn-premium w-full sm:w-auto justify-center" data-cursor>
          <span>Instagram</span>
        </a>
        <a href="https://www.botopremium.com.br" target="_blank" rel="noopener noreferrer"
          className="btn-premium w-full sm:w-auto justify-center" data-cursor>
          <span>Site Oficial</span>
        </a>
      </motion.div>
    </motion.div>
  );
}

/* ─── Page ─── */
export function LeadForm() {
  const [form, setForm] = useState<LeadFormData>({ name: '', whatsapp: '', neighborhood: '', goal: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const setField = (field: keyof LeadFormData) => (value: string) => {
    setForm((p) => ({ ...p, [field]: field === 'whatsapp' ? formatWhatsApp(value) : value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

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
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-obsidian overflow-hidden px-5 py-16 md:py-20">

      {/* ── Ambient background ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Top glow */}
        <div className="ambient-glow w-[800px] h-[500px] -top-48 left-1/2 -translate-x-1/2"
          style={{ background: 'rgba(198,167,105,0.04)' }} />
        {/* Bottom glow */}
        <div className="ambient-glow w-[600px] h-[400px] bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3"
          style={{ background: 'rgba(214,190,138,0.025)' }} />
        {/* Subtle grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(214,190,138,0.016) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(214,190,138,0.016) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }} />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-[960px] flex flex-col items-center">

        {/* ── Logo ── */}
        <motion.div
          className="flex flex-col items-center mb-14 md:mb-16"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <span className="font-display text-[1.6rem] md:text-[1.9rem] font-light tracking-[0.12em] text-warm-white mb-1.5">
            Boto
            <span style={{
              background: 'linear-gradient(135deg, #E8D5A3, #C6A769)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Premium
            </span>
          </span>
          <div className="h-px w-10 mt-1" style={{
            background: 'linear-gradient(90deg, transparent, rgba(214,190,138,0.4), transparent)',
          }} />
        </motion.div>

        {/* ── Eyebrow ── */}
        <motion.span
          className="text-eyebrow text-champagne/55 mb-6 md:mb-7"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.7, ease }}
        >
          Avaliação Exclusiva
        </motion.span>

        {/* ── Headline ── */}
        <div className="overflow-hidden mb-2 text-center">
          <motion.h1
            className="font-display font-light text-warm-white text-center"
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 4rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1.06,
            }}
            initial={{ y: '105%' }}
            animate={{ y: '0%' }}
            transition={{ delay: 0.28, duration: 1, ease }}
          >
            Inicie sua
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-8 md:mb-9 text-center">
          <motion.h1
            className="font-display font-light text-center"
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 4rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1.06,
              background: 'linear-gradient(135deg, #E8D5A3 0%, #C6A769 45%, #D6BE8A 75%, #E8D5A3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% auto',
            }}
            initial={{ y: '105%' }}
            animate={{ y: '0%' }}
            transition={{ delay: 0.4, duration: 1, ease }}
          >
            transformação.
          </motion.h1>
        </div>

        {/* ── Description ── */}
        <motion.p
          className="font-body font-light text-center text-warm-white/38 leading-[1.85] mb-12 md:mb-14"
          style={{ fontSize: '0.9rem', maxWidth: '360px' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7, ease }}
        >
          Preencha o formulário e nossa equipe entrará em contato para agendar sua avaliação personalizada sem compromisso.
        </motion.p>

        {/* ── Card ── */}
        <motion.div
          className="w-full glass-card overflow-hidden"
          style={{ borderRadius: '2px' }}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.9, ease }}
        >
          {/* Top accent */}
          <div className="h-px w-full" style={{
            background: 'linear-gradient(90deg, transparent, rgba(214,190,138,0.45) 50%, transparent)',
          }} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr]">

            {/* ── Left: Benefits ── */}
            <div
              className="px-8 pt-10 pb-8 md:px-10 md:pt-12 md:pb-10 lg:px-12 lg:py-14 flex flex-col justify-between gap-10 border-b lg:border-b-0 lg:border-r"
              style={{ borderColor: 'rgba(214,190,138,0.07)' }}
            >
              {/* Benefits */}
              <div>
                <motion.p
                  className="text-eyebrow text-warm-white/22 mb-8"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.85, duration: 0.5 }}
                >
                  Por que BotoPremium
                </motion.p>

                <div className="flex flex-col gap-6">
                  {[
                    { label: 'Avaliação personalizada e sem compromisso', n: '01' },
                    { label: 'Protocolo exclusivo para seu perfil', n: '02' },
                    { label: 'Tecnologia e produtos premium certificados', n: '03' },
                    { label: 'Resultados naturais e duradouros', n: '04' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-5"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + i * 0.08, duration: 0.55, ease }}
                    >
                      <span className="font-mono text-[0.58rem] text-champagne/25 mt-0.5 flex-shrink-0 tabular-nums">
                        {item.n}
                      </span>
                      <div className="flex items-start gap-3.5">
                        <div className="mt-[5px] w-[5px] h-[5px] rounded-full flex-shrink-0"
                          style={{ background: 'rgba(214,190,138,0.45)' }} />
                        <p className="font-body font-light text-warm-white/40 text-[0.82rem] leading-[1.7]">
                          {item.label}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Social proof */}
              <motion.div
                className="pt-8 border-t"
                style={{ borderColor: 'rgba(214,190,138,0.07)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.25, duration: 0.6 }}
              >
                <div className="flex items-center gap-1 mb-2.5">
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} width="11" height="11" viewBox="0 0 10 10">
                      <path d="M5 1l1.03 2.09L8.5 3.4l-1.75 1.7.41 2.4L5 6.46 2.84 7.5l.41-2.4L1.5 3.4l2.47-.31L5 1z"
                        fill="rgba(214,190,138,0.45)" />
                    </svg>
                  ))}
                </div>
                <p className="font-body font-light text-[0.72rem] text-warm-white/22 leading-[1.6]">
                  50.000+ pacientes atendidas<br />
                  80+ unidades · Desde 2020
                </p>
              </motion.div>
            </div>

            {/* ── Right: Form ── */}
            <div className="px-8 pt-10 pb-8 md:px-10 md:pt-12 md:pb-10 lg:px-12 lg:py-14">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <SuccessScreen key="success" />
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="flex flex-col h-full"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    noValidate
                  >
                    {/* Fields */}
                    <div className="flex flex-col gap-3 flex-1">
                      <FloatingInput id="name" label="Nome completo" value={form.name}
                        onChange={setField('name')} error={errors.name} disabled={isDisabled} />
                      <FloatingInput id="whatsapp" label="WhatsApp" type="tel" value={form.whatsapp}
                        onChange={setField('whatsapp')} error={errors.whatsapp} disabled={isDisabled} />
                      <FloatingInput id="neighborhood" label="Bairro / Cidade" value={form.neighborhood}
                        onChange={setField('neighborhood')} error={errors.neighborhood} disabled={isDisabled} />
                      <FloatingSelect id="goal" label="Objetivo estético" value={form.goal}
                        onChange={setField('goal')} error={errors.goal} disabled={isDisabled} />
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {status === 'error' && errorMsg && (
                        <motion.div
                          className="mt-6 px-4 py-3 border border-red-500/15 bg-red-500/4"
                          style={{ borderRadius: '1px' }}
                          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        >
                          <p className="text-red-400/65 text-[0.72rem] font-body">{errorMsg}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Spacer */}
                    <div className="mt-9">
                      <button
                        type="submit"
                        disabled={isDisabled}
                        className="btn-gold w-full disabled:opacity-45"
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
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 opacity-70">
                              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5"
                                strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </>
                        )}
                      </button>

                      <p className="text-center mt-5 font-body text-[0.57rem] text-warm-white/16 tracking-[0.07em] leading-[1.7]">
                        Seus dados são tratados com total segurança e privacidade.<br className="hidden sm:block" />
                        Não compartilhamos suas informações com terceiros.
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── Footer micro ── */}
        <motion.p
          className="mt-8 md:mt-10 text-center font-body text-[0.57rem] tracking-[0.12em] text-warm-white/16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          © {new Date().getFullYear()} BotoPremium · Todos os direitos reservados
        </motion.p>
      </div>
    </section>
  );
}
