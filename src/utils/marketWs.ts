type MarketPayloadItem = Record<string, unknown>;

export type NormalizedMarketItem = {
  symbol: string;
  last: number;
  percentChange: number;
  high?: number;
  low?: number;
  open?: number;
  prevClose?: number;
  valueChange?: number;
};

const MARKET_ARRAY_KEYS = ["data", "result", "quotes", "payload", "items"];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const coerceNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeItem = (item: MarketPayloadItem): NormalizedMarketItem | null => {
  const symbol = typeof item.symbol === "string" ? item.symbol : "";
  if (!symbol) return null;

  const last = coerceNumber(item.last, Number.NaN);
  const percentChange = coerceNumber(item.percentChange, Number.NaN);
  if (!Number.isFinite(last) || !Number.isFinite(percentChange)) return null;

  return {
    symbol,
    last,
    percentChange,
    high: coerceNumber(item.high),
    low: coerceNumber(item.low),
    open: coerceNumber(item.open),
    prevClose: coerceNumber(item.prevClose),
    valueChange: coerceNumber(item.valueChange),
  };
};

const normalizeMapItem = (
  symbol: string,
  item: MarketPayloadItem
): NormalizedMarketItem | null => {
  if (!symbol) return null;
  const last = coerceNumber(item.price, Number.NaN);
  if (!Number.isFinite(last)) return null;

  const percentChange = coerceNumber(item.price_change, 0);

  return {
    symbol,
    last,
    percentChange,
    high: coerceNumber(item.hprice),
    low: coerceNumber(item.lprice),
    open: coerceNumber(item.oprice),
    valueChange: coerceNumber(item.price_change),
  };
};

const unwrapPayloadArray = (payload: unknown): MarketPayloadItem[] | null => {
  if (Array.isArray(payload)) return payload.filter(isRecord);
  if (isRecord(payload)) {
    const entries = Object.entries(payload).filter(
      ([key, value]) => key !== "status" && isRecord(value)
    );
    if (entries.length) {
      return entries
        .map(([key, value]) => ({
          ...value,
          symbol: key,
        }))
        .filter(isRecord);
    }
    if (payload.symbol) {
      return [payload];
    }
    for (const key of MARKET_ARRAY_KEYS) {
      const value = payload[key];
      if (Array.isArray(value)) {
        return value.filter(isRecord);
      }
    }
  }
  return null;
};

const safeJsonParse = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const parseMarketWsMessage = (raw: unknown): NormalizedMarketItem[] => {
  const payload = typeof raw === "string" ? safeJsonParse(raw) ?? raw : raw;
  const items = unwrapPayloadArray(payload);
  if (!items) return [];
  return items
    .map((item) => {
      if (typeof item.symbol === "string" && "price" in item) {
        return normalizeMapItem(item.symbol, item);
      }
      return normalizeItem(item);
    })
    .filter((item): item is NormalizedMarketItem => item !== null);
};
