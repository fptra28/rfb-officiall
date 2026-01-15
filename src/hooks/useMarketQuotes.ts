import { useMemo, useSyncExternalStore } from "react";
import {
  getMarketQuotesServerSnapshot,
  getMarketQuotesSnapshot,
  subscribeMarketQuotes,
} from "@/utils/marketQuotesStore";

type UseMarketQuotesOptions = {
  hiddenSymbols?: string[];
  wsUrl?: string;
  reconnectDelayMs?: number;
};

export function useMarketQuotes(options: UseMarketQuotesOptions = {}) {
  const { hiddenSymbols = ["XAG10_BBJ", "XAGF_BBJ"] } = options;

  const state = useSyncExternalStore(
    subscribeMarketQuotes,
    getMarketQuotesSnapshot,
    getMarketQuotesServerSnapshot
  );

  const hiddenSet = useMemo(() => new Set(hiddenSymbols), [hiddenSymbols]);
  const quotes = useMemo(() => state.quotes.filter((item) => !hiddenSet.has(item.symbol)), [hiddenSet, state.quotes]);

  return { quotes, errorMessage: state.errorMessage };
}
