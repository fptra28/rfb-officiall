import { useTranslation } from "next-i18next";
import MarketCard from "../moleculs/MarketCard";
import Header1 from "../moleculs/Header1";
import { useMarketQuotes } from "@/hooks/useMarketQuotes";

type MarketProps = {
    showHeader?: boolean;
    className?: string;
};

interface MarketItem {
    symbol: string;
    last: number;
    percentChange: number;
    direction?: 'up' | 'down' | 'neutral';
}

export default function Market({ showHeader = true, className }: MarketProps) {
    const { t } = useTranslation('market');
    const { quotes: marketData, errorMessage } = useMarketQuotes();

    const normalizeSymbol = (symbol: string) => symbol.split("_")[0]?.toUpperCase?.() ?? symbol.toUpperCase();

    const featuredGroups: Array<{ name: string; candidates: string[] }> = [
        { name: "Gold", candidates: ["XUL10"] },
        { name: "BCO", candidates: ["BCO10"] },
        { name: "Hanseng", candidates: ["HKK50"] },
        { name: "Nikkei", candidates: ["JPK50"] },
        { name: "AUD/USD", candidates: ["AU10F", "AU1010"] },
        { name: "EUR/USD", candidates: ["EU10F", "EU1010"] },
        { name: "GBP/USD", candidates: ["GU10F", "GU1010"] },
        { name: "USD/CHF", candidates: ["UC10F", "UC1010"] },
        { name: "USD/JPY", candidates: ["UJ10F", "UJ1010"] },
    ];

    const quoteByBaseSymbol = new Map<string, MarketItem>();
    for (const item of marketData) {
        const baseSymbol = normalizeSymbol(item.symbol);
        if (!quoteByBaseSymbol.has(baseSymbol)) quoteByBaseSymbol.set(baseSymbol, item);
    }

    const filteredMarketData = featuredGroups
        .map((group) => {
            const quote =
                group.candidates.map((candidate) => quoteByBaseSymbol.get(candidate)).find(Boolean) ?? null;
            if (!quote) return null;
            return { ...quote, __displayName: group.name };
        })
        .filter((item): item is MarketItem & { __displayName: string } => item !== null);

    const formatPrice = (symbol: string, price: number): string => {
        if (symbol.includes('IDR')) return price.toLocaleString('id-ID', { maximumFractionDigits: 0 });
        if (symbol.includes('BTC')) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return price.toFixed(2);
    };

    const formatPercent = (percent: number): string => {
        const formatted = percent?.toFixed(2);
        const sign = percent > 0 ? '+' : '';
        return `${sign}${formatted}%`;
    };

    return (
        <div className={["w-full bg-[#f7e7e7] py-10 flex flex-col items-center space-y-4", className].filter(Boolean).join(" ")}>
            {showHeader && (
                <div className="mb-6">
                    <Header1 title={t('title')} className="text-2xl md:text-3xl" />
                </div>
            )}

            <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-36 2xl:px-52 w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {errorMessage ? (
                        <div className="col-span-full text-center text-red-600 font-semibold text-sm sm:text-base">
                            {errorMessage}
                        </div>
                    ) : filteredMarketData.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 font-medium text-sm sm:text-base animate-pulse">
                            {t('loading')}
                        </div>
                    ) : (
                        filteredMarketData.map((item, index: number) => (
                            <MarketCard
                                key={index}
                                symbol={item.__displayName}
                                last={formatPrice(item.symbol, item.last)}
                                percentChange={formatPercent(item.percentChange)}
                                direction={item.direction || 'neutral'}
                            />
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}
