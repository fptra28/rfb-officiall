export const normalizeSymbolBase = (symbol: string) =>
  symbol.split("_")[0]?.toUpperCase?.() ?? symbol.toUpperCase();

export const decimalsForSymbol = (symbol: string): number => {
  const base = normalizeSymbolBase(symbol);

  if (base.includes("IDR")) return 0;
  if (base.includes("BTC")) return 2;

  if (base.startsWith("HKK") || base.startsWith("JPK")) return 0;
  if (base.startsWith("UJ")) return 2;
  if (base.startsWith("AU") || base.startsWith("EU") || base.startsWith("GU") || base.startsWith("UC")) return 4;

  return 2;
};

export const roundTo = (value: number, decimals: number): number => {
  if (!Number.isFinite(value)) return value;
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

export const formatQuoteNumber = (symbol: string, value?: number): string => {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  const decimals = decimalsForSymbol(symbol);
  return roundTo(value, decimals).toFixed(decimals);
};

export const formatPercent = (value?: number, decimals = 2): string => {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  const rounded = roundTo(value, decimals);
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toFixed(decimals)}%`;
};

