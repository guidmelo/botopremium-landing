export function sanitizeString(value: string): string {
  return value.trim().replace(/[<>'"]/g, '');
}

export function validateName(name: string): string | null {
  const clean = sanitizeString(name);
  if (!clean || clean.length < 2) return 'Nome inválido';
  if (clean.length > 100) return 'Nome muito longo';
  if (!/^[\p{L}\s'-]+$/u.test(clean)) return 'Nome contém caracteres inválidos';
  return null;
}

export function validateWhatsApp(phone: string): string | null {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 13) return 'WhatsApp inválido';
  return null;
}

export function validateNeighborhood(value: string): string | null {
  const clean = sanitizeString(value);
  if (!clean || clean.length < 2) return 'Bairro inválido';
  if (clean.length > 100) return 'Nome muito longo';
  return null;
}

export function validateGoal(value: string): string | null {
  if (!value || value === '') return 'Selecione um objetivo';
  return null;
}

export function formatWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 11)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return digits;
}

export function isRateLimited(key: string, maxAttempts = 3, windowMs = 60000): boolean {
  if (typeof window === 'undefined') return false;
  const now = Date.now();
  const stored = localStorage.getItem(key);
  const data = stored ? JSON.parse(stored) : { attempts: 0, firstAttempt: now };

  if (now - data.firstAttempt > windowMs) {
    localStorage.setItem(key, JSON.stringify({ attempts: 1, firstAttempt: now }));
    return false;
  }

  if (data.attempts >= maxAttempts) return true;

  localStorage.setItem(key, JSON.stringify({ ...data, attempts: data.attempts + 1 }));
  return false;
}
