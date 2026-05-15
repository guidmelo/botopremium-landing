import { NextRequest, NextResponse } from 'next/server';
import { appendLeadToSheet } from '@/lib/google-sheets';
import { LeadPayload } from '@/types';

const MAX_BODY_SIZE = 4096;
const RATE_LIMIT_MAP = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(ip);

  if (!entry || now > entry.resetAt) {
    RATE_LIMIT_MAP.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_MAX) return true;
  entry.count++;
  return false;
}

function sanitize(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>'"\\]/g, '').slice(0, 500);
}

function validatePayload(body: unknown): LeadPayload | null {
  if (typeof body !== 'object' || body === null) return null;
  const b = body as Record<string, unknown>;

  const name = sanitize(b.name);
  const whatsapp = sanitize(b.whatsapp);
  const neighborhood = sanitize(b.neighborhood);
  const goal = sanitize(b.goal);

  if (!name || name.length < 2) return null;
  if (!whatsapp || !/^\d{10,13}$/.test(whatsapp.replace(/\D/g, ''))) return null;
  if (!neighborhood || neighborhood.length < 2) return null;
  if (!goal) return null;

  return {
    name,
    whatsapp,
    neighborhood,
    goal,
    timestamp: new Date().toISOString(),
    source: sanitize(b.source),
    device: sanitize(b.device),
    utmSource: sanitize(b.utmSource),
    utmMedium: sanitize(b.utmMedium),
    utmCampaign: sanitize(b.utmCampaign),
    page: sanitize(b.page),
  };
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    if (checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: 'Muitas requisições. Tente novamente em alguns minutos.' },
        { status: 429 }
      );
    }

    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
      return NextResponse.json({ success: false, message: 'Requisição inválida.' }, { status: 413 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Dados inválidos.' }, { status: 400 });
    }

    const payload = validatePayload(body);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Preencha todos os campos corretamente.' },
        { status: 422 }
      );
    }

    await appendLeadToSheet(payload);

    return NextResponse.json(
      { success: true, message: 'Solicitação recebida com sucesso.' },
      { status: 200 }
    );
  } catch (err) {
    console.error('[API/leads] Error:', err);
    return NextResponse.json(
      { success: false, message: 'Erro interno. Tente novamente.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}
