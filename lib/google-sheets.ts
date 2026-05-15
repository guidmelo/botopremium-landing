import { google } from 'googleapis';
import { LeadPayload } from '@/types';

function getAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '{}');

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

export async function appendLeadToSheet(lead: LeadPayload): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) throw new Error('GOOGLE_SHEET_ID not configured');

  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  const row = [
    new Date(lead.timestamp).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    lead.name,
    lead.whatsapp,
    lead.neighborhood,
    lead.goal,
    lead.source,
    lead.device,
    lead.utmSource || '',
    lead.utmMedium || '',
    lead.utmCampaign || '',
    lead.page,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Leads!A:K',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  });
}
