type MarketPayloadItem = Record<string, unknown>;

export type NormalizedMarketItem = {
  symbol: string;
  last: number;
  percentChange: number;
  bid?: number;
  ask?: number;
  high?: number;
  low?: number;
  open?: number;
  close?: number;
  prevClose?: number;
  valueChange?: number;
};

const MARKET_ARRAY_KEYS = ["data", "result", "quotes", "payload", "items"];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const coerceNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const normalized = value.replace(/[%\s,]/g, "");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeItem = (item: MarketPayloadItem): NormalizedMarketItem | null => {
  const symbol = typeof item.symbol === "string" ? item.symbol : "";
  if (!symbol) return null;

  const last = coerceNumber(item.last, Number.NaN);
  const percentChange = coerceNumber(item.percentChange, Number.NaN);
  if (!Number.isFinite(last) || !Number.isFinite(percentChange)) return null;

  const bid = coerceNumber(item.bid ?? item.buy ?? item.bprice);
  const ask = coerceNumber(item.ask ?? item.sell ?? item.aprice);
  const prevClose = coerceNumber(item.prevClose ?? item.prev_close ?? item.pclose);
  const close = coerceNumber(item.close ?? prevClose);

  return {
    symbol,
    last,
    percentChange,
    bid,
    ask,
    high: coerceNumber(item.high),
    low: coerceNumber(item.low),
    open: coerceNumber(item.open),
    close,
    prevClose,
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

  const open = coerceNumber(item.oprice);
  const bid = coerceNumber(item.bprice ?? item.bid ?? item.buy);
  const ask = coerceNumber(item.aprice ?? item.ask ?? item.sell);
  const prevClose = coerceNumber(item.pclose ?? item.prevClose ?? item.prev_close);
  const close = coerceNumber(item.close ?? prevClose);
  let percentChange = coerceNumber(item.price_change, Number.NaN);
  if (!Number.isFinite(percentChange)) {
    if (open > 0) {
      percentChange = ((last - open) / open) * 100;
    } else {
      percentChange = 0;
    }
  }
  return {
    symbol,
    last,
    percentChange,
    bid,
    ask,
    high: coerceNumber(item.hprice),
    low: coerceNumber(item.lprice),
    open,
    close,
    prevClose,
    valueChange: coerceNumber(item.price_change),
  };
};

const unwrapPayloadArray = (payload: unknown): MarketPayloadItem[] | null => {
  if (Array.isArray(payload)) return payload.filter(isRecord);
  if (isRecord(payload)) {
    const entries = Object.entries(payload).filter(
      ([key, value]) => key !== "status" && isRecord(value)
    ) as Array<[string, Record<string, unknown>]>;
    if (entries.length) {
      return entries.map(([key, value]) => ({
        ...value,
        symbol: key,
      }));
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
