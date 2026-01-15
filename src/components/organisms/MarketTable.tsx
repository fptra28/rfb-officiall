import { useTranslation } from "next-i18next";
import Header1 from "../moleculs/Header1";
import { useMarketQuotes } from "@/hooks/useMarketQuotes";
import { formatPercent, formatQuoteNumber, normalizeSymbolBase } from "@/utils/marketFormat";

type MarketTableProps = {
  showHeader?: boolean;
  className?: string;
  symbols?: string[];
};

export default function MarketTable({ showHeader = true, className, symbols }: MarketTableProps) {
  const { t } = useTranslation("market");
  const { quotes, errorMessage } = useMarketQuotes();

  const normalizeSymbol = normalizeSymbolBase;

  const symbolOrder = symbols?.length
    ? new Map<string, number>(symbols.map((s, i) => [normalizeSymbol(s), i]))
    : null;

  const visibleQuotes = symbolOrder
    ? quotes
        .filter((item) => symbolOrder.has(normalizeSymbol(item.symbol)))
        .sort((a, b) => (symbolOrder.get(normalizeSymbol(a.symbol)) ?? 0) - (symbolOrder.get(normalizeSymbol(b.symbol)) ?? 0))
    : quotes;

  const formatMaybePrice = (symbol: string, price?: number): string => formatQuoteNumber(symbol, price);

  const getDirectionStyles = (direction?: "up" | "down" | "neutral") => {
    if (direction === "up") return { text: "text-green-700", icon: "fa-arrow-trend-up" };
    if (direction === "down") return { text: "text-red-700", icon: "fa-arrow-trend-down" };
    return { text: "text-gray-700", icon: "fa-minus" };
  };

  const fallbackClose = (symbol: string, close?: number, prevClose?: number, last?: number) => {
    const closeValue = close && close !== 0 ? close : prevClose && prevClose !== 0 ? prevClose : last;
    return formatMaybePrice(symbol, closeValue);
  };

  return (
    <div className={["w-full", className].filter(Boolean).join(" ")}>
      {showHeader && (
        <div className="mb-6">
          <Header1 title={t("title")} className="text-2xl md:text-3xl" />
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-sm md:text-base min-w-[520px]">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3 text-left whitespace-nowrap">{t("table.symbol")}</th>
              <th className="p-3 text-right whitespace-nowrap">{t("table.buy")}</th>
              <th className="p-3 text-right whitespace-nowrap">{t("table.sell")}</th>
              <th className="p-3 text-right whitespace-nowrap">{t("table.open")}</th>
              <th className="p-3 text-right whitespace-nowrap">{t("table.high")}</th>
              <th className="p-3 text-right whitespace-nowrap">{t("table.low")}</th>
              <th className="p-3 text-right whitespace-nowrap">{t("table.close")}</th>
              <th className="p-3 text-right whitespace-nowrap">{t("table.percent")}</th>
            </tr>
          </thead>
          <tbody>
            {errorMessage ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-red-600 font-semibold">
                  {errorMessage}
                </td>
              </tr>
            ) : visibleQuotes.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500 font-medium animate-pulse">
                  {t("loading")}
                </td>
              </tr>
            ) : (
              visibleQuotes.map((item, index) => (
                <tr key={`${item.symbol}-${index}`} className={index % 2 === 0 ? "bg-white" : "bg-zinc-50"}>
                  <td className="p-3 whitespace-nowrap font-medium text-zinc-800">{item.symbol}</td>
                  <td className="p-3 whitespace-nowrap text-right text-zinc-800">{formatMaybePrice(item.symbol, item.bid)}</td>
                  <td className="p-3 whitespace-nowrap text-right text-zinc-800">{formatMaybePrice(item.symbol, item.ask)}</td>
                  <td className="p-3 whitespace-nowrap text-right text-zinc-800">{formatMaybePrice(item.symbol, item.open)}</td>
                  <td className="p-3 whitespace-nowrap text-right text-zinc-800">{formatMaybePrice(item.symbol, item.high)}</td>
                  <td className="p-3 whitespace-nowrap text-right text-zinc-800">{formatMaybePrice(item.symbol, item.low)}</td>
                  <td className="p-3 whitespace-nowrap text-right text-zinc-800">
                    {fallbackClose(item.symbol, item.close, item.prevClose, item.last)}
                  </td>
                  <td
                    className={[
                      "p-3 whitespace-nowrap text-right font-semibold",
                      getDirectionStyles(item.direction).text,
                    ].join(" ")}
                  >
                    <span className="inline-flex items-center justify-end gap-2">
                      <i className={`fa-solid ${getDirectionStyles(item.direction).icon}`} aria-hidden="true" />
                      <span>{formatPercent(item.percentChange, 2)}</span>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
