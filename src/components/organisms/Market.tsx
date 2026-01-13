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

    const featuredQuotes: Array<{ symbol: string; name: string }> = [
        { symbol: "HKK50", name: "Hanseng" },
        { symbol: "JPK50", name: "Nikkei" },
        { symbol: "XUL10", name: "Gold" },
        { symbol: "BCO10", name: "BCO" },
        { symbol: "AU1010", name: "AUD/USD" },
        { symbol: "EU1010", name: "EUR/USD" },
        { symbol: "GU1010", name: "GBP/USD" },
        { symbol: "UC1010", name: "USD/CHF" },
        { symbol: "UJ1010", name: "USD/JPY" },
    ];

    const featuredIndex = new Map<string, number>(featuredQuotes.map((item, index) => [item.symbol, index]));
    const featuredName = new Map<string, string>(featuredQuotes.map((item) => [item.symbol, item.name]));

    const filteredMarketData = marketData
        .map((item) => ({ ...item, __baseSymbol: normalizeSymbol(item.symbol) }))
        .filter((item) => featuredIndex.has(item.__baseSymbol))
        .sort((a, b) => (featuredIndex.get(a.__baseSymbol) ?? 0) - (featuredIndex.get(b.__baseSymbol) ?? 0));

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
                        filteredMarketData.map((item: MarketItem & { __baseSymbol?: string }, index: number) => (
                            <MarketCard
                                key={index}
                                symbol={featuredName.get(item.__baseSymbol ?? normalizeSymbol(item.symbol)) ?? item.symbol}
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
