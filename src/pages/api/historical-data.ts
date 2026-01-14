import { NextApiRequest, NextApiResponse } from 'next';

interface HistoricalDataItem {
  id: number;
  symbol: string;
  date: string;
  event: string | null;
  open: string | null;
  high: string | null;
  low: string | null;
  close: string | null;
  change: string | null;
  volume: string | null;
  openInterest: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SymbolData {
  symbol: string;
  data: HistoricalDataItem[];
  updatedAt: string;
}

interface ApiResponse {
  status: string;
  totalSymbols?: number;
  data: SymbolData[];
}

type PivotHistoryItem = {
  id: number;
  tanggal: string;
  open: string | number | null;
  high: string | number | null;
  low: string | number | null;
  close: string | number | null;
  chg: string | number | null;
  category: string;
  created_at: string;
  updated_at: string;
  volume: string | number | null;
  open_interest: string | number | null;
};

async function fetchPivotHistory(baseUrl: string, token: string) {
  const url = `${baseUrl.replace(/\/$/, '')}/api/v1/pivot-history`;
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store' as RequestCache,
  });

  return { url, response };
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function toStringOrNull(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;
  return typeof value === 'string' ? value : String(value);
}

function toChangeString(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;
  return String(value);
}

function formatDateDDMMMYYYY(dateStr: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return dateStr;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = months[month - 1];
  if (!monthName) return dateStr;
  return `${String(day).padStart(2, '0')} ${monthName} ${year}`;
}

function normalizeApiResponse(raw: any): ApiResponse {
  if (
    raw &&
    typeof raw === 'object' &&
    raw.status === 'success' &&
    Array.isArray(raw.data) &&
    raw.data.length > 0 &&
    raw.data[0] &&
    typeof raw.data[0] === 'object' &&
    typeof raw.data[0].symbol === 'string' &&
    Array.isArray(raw.data[0].data)
  ) {
    return raw as ApiResponse;
  }

  const pivotItems: PivotHistoryItem[] = Array.isArray(raw?.data) ? raw.data : [];
  const grouped = new Map<string, PivotHistoryItem[]>();
  for (const item of pivotItems) {
    if (!item || typeof item !== 'object') continue;
    const symbol = typeof item.category === 'string' && item.category.trim() ? item.category.trim() : 'Unknown';
    const list = grouped.get(symbol) ?? [];
    list.push(item);
    grouped.set(symbol, list);
  }

  const nowIso = new Date().toISOString();
  const data: SymbolData[] = Array.from(grouped.entries()).map(([symbol, items]) => {
    let latestUpdatedAt = '';
    const normalizedItems: HistoricalDataItem[] = items.map((item) => {
      const updatedAt = typeof item.updated_at === 'string' ? item.updated_at : nowIso;
      if (updatedAt > latestUpdatedAt) latestUpdatedAt = updatedAt;
      return {
        id: item.id,
        symbol,
        date: formatDateDDMMMYYYY(item.tanggal),
        event: null,
        open: toStringOrNull(item.open),
        high: toStringOrNull(item.high),
        low: toStringOrNull(item.low),
        close: toStringOrNull(item.close),
        change: toChangeString(item.chg),
        volume: toStringOrNull(item.volume),
        openInterest: toStringOrNull(item.open_interest),
        createdAt: typeof item.created_at === 'string' ? item.created_at : nowIso,
        updatedAt,
      };
    });

    return {
      symbol,
      data: normalizedItems,
      updatedAt: latestUpdatedAt || nowIso,
    };
  });

  return {
    status: 'success',
    totalSymbols: data.length,
    data,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const portalApiUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'https://portalnews.newsmaker.id';
    const portalApiToken = process.env.NEXT_PUBLIC_PORTAL_API_TOKEN || 'RFB-115886a7f25067f3';

    let { url, response } = await fetchPivotHistory(portalApiUrl, portalApiToken);

    // Endpoint ini butuh HTTPS; beberapa environment masih ngeset base URL ke HTTP.
    if (
      response.status === 401 &&
      /^http:\/\//i.test(portalApiUrl) &&
      /portalnews\.newsmaker\.id/i.test(portalApiUrl)
    ) {
      ({ url, response } = await fetchPivotHistory(
        portalApiUrl.replace(/^http:\/\//i, 'https://'),
        portalApiToken,
      ));
    }
    
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `API request failed with status ${response.status} (${response.statusText}) from ${url}${body ? ` - ${body}` : ''}`,
      );
    }
    
    const raw = await response.json();
    const data: ApiResponse = normalizeApiResponse(raw);
    
    // Kembalikan data dalam format yang diharapkan
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Error in historical-data API:', error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Gagal mengambil data historis',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
