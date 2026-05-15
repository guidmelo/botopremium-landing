import { LeadFormData, ApiResponse } from '@/types';

function getUTMParam(param: string): string {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get(param) || '';
}

function getDevice(): string {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|android/i.test(ua)) return 'mobile';
  return 'desktop';
}

export async function submitLead(formData: LeadFormData): Promise<ApiResponse> {
  const payload = {
    ...formData,
    timestamp: new Date().toISOString(),
    source: document.referrer || 'direct',
    device: getDevice(),
    utmSource: getUTMParam('utm_source'),
    utmMedium: getUTMParam('utm_medium'),
    utmCampaign: getUTMParam('utm_campaign'),
    page: window.location.href,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || 'Erro ao enviar. Tente novamente.',
        error: data.error,
      };
    }

    return { success: true, message: data.message };
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === 'AbortError') {
      return { success: false, message: 'Timeout. Verifique sua conexão.' };
    }
    return { success: false, message: 'Falha na conexão. Tente novamente.' };
  }
}
