import { useMemo } from "react";
import { useMarketQuotes } from "@/hooks/useMarketQuotes";
import { formatPercent, formatQuoteNumber, normalizeSymbolBase } from "@/utils/marketFormat";

interface MarketItem {
  symbol: string;
  last: number;
  percentChange: number;
}

export default function MarketUpdate() {
  const { quotes, errorMessage } = useMarketQuotes();

  const allowedSymbols = useMemo(
    () => [
      "XUL10",
      "BCO10_BBJ",
      "HKK50_BBJ",
      "JPK50_BBJ",
      "AU10F_BBJ",
      "EU10F_BBJ",
      "GU10F_BBJ",
      "UC10F_BBJ",
      "UJ10F_BBJ",
    ],
    []
  );

  const symbolOrder = useMemo(
    () => new Map<string, number>(allowedSymbols.map((s, i) => [normalizeSymbolBase(s), i])),
    [allowedSymbols]
  );

  const marketData: MarketItem[] = useMemo(() => {
    return quotes
      .filter((item) => symbolOrder.has(normalizeSymbolBase(item.symbol)))
      .sort((a, b) => (symbolOrder.get(normalizeSymbolBase(a.symbol)) ?? 0) - (symbolOrder.get(normalizeSymbolBase(b.symbol)) ?? 0))
      .map((item) => ({
        symbol: item.symbol,
        last: item.last,
        percentChange: item.percentChange,
      }));
  }, [quotes, symbolOrder]);

  return (
    <div className="bg-zinc-900 text-white overflow-hidden shadow group">
      <div className="flex items-center h-12">
        <div className="bg-red-600 px-4 h-full flex items-center font-bold text-xs sm:text-sm md:text-base whitespace-nowrap">
          Market Update
        </div>

        <div className="relative overflow-hidden w-full bg-green-500 h-full flex items-center min-w-0">
          {errorMessage ? (
            <div className="px-4 text-xs sm:text-sm md:text-base font-semibold text-white">
              {errorMessage}
            </div>
          ) : marketData.length === 0 ? (
            <div className="px-4 text-xs sm:text-sm md:text-base font-semibold text-white">
              Memuat data...
            </div>
          ) : (
            <div className="flex animate-marquee whitespace-nowrap items-center text-xs sm:text-sm md:text-base group-hover:[animation-play-state:paused]">
              {[...marketData, ...marketData].map((item, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="flex items-center gap-2 px-4">
                    <span className="font-semibold">{item.symbol}:</span>
                    <span>{formatQuoteNumber(item.symbol, item.last)}</span>
                    <span
                      className={`font-medium ${item.percentChange > 0
                        ? 'text-green-800'
                        : item.percentChange < 0
                          ? 'text-red-500'
                          : 'text-white/60'
                        }`}
                    >
                      ({formatPercent(item.percentChange, 2)})
                    </span>
                  </div>
                  <span className="mx-4 h-full text-white/50">|</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
