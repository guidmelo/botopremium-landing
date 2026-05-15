import { LeadPayload } from '@/types';

export async function appendLeadToSheet(lead: LeadPayload): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) throw new Error('GOOGLE_SHEETS_WEBHOOK_URL not configured');

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Apps Script returned ${res.status}: ${text}`);
  }

  const json = await res.json().catch(() => ({ success: false }));
  if (!json.success) throw new Error(`Apps Script error: ${json.error ?? 'unknown'}`);
}
