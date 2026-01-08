import { useEffect, useState, useRef } from "react";
import MarketCard from "../moleculs/MarketCard";
import Header1 from "../moleculs/Header1";
import { useTranslation } from "next-i18next";
import { parseMarketWsMessage, NormalizedMarketItem } from "@/utils/marketWs";

interface MarketItem {
    symbol: string;
    last: number;
    percentChange: number;
    direction?: 'up' | 'down' | 'neutral';
}

const WS_URL = "wss://wsprc.royalassetindo.co.id";

export default function Market() {
    const { t } = useTranslation('market');
    const [marketData, setMarketData] = useState<MarketItem[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const prevDataRef = useRef<MarketItem[]>([]);

    useEffect(() => {
        let isActive = true;
        let reconnectTimer: number | null = null;
        let socket: WebSocket | null = null;

        const clearReconnectTimer = () => {
            if (reconnectTimer !== null) {
                window.clearTimeout(reconnectTimer);
                reconnectTimer = null;
            }
        };

        const handlePayload = (payload: NormalizedMarketItem[]) => {
            if (!payload.length || !isActive) return;

            const updatedData: MarketItem[] = payload.map((item) => {
                const prevItem = prevDataRef.current.find((p: MarketItem) => p.symbol === item.symbol);
                let direction: 'up' | 'down' | 'neutral';

                if (prevItem) {
                    if (item.last > prevItem.last) direction = 'up';
                    else if (item.last < prevItem.last) direction = 'down';
                    else direction = item.percentChange === 0 ? 'neutral' : (item.percentChange > 0 ? 'up' : 'down');
                } else {
                    direction = item.percentChange > 0 ? 'up' : (item.percentChange < 0 ? 'down' : 'neutral');
                }

                return { ...item, direction };
            });

            setMarketData(updatedData);
            prevDataRef.current = payload;
            setErrorMessage("");
        };

        const handleMessageData = (raw: unknown) => {
            const parsed = parseMarketWsMessage(raw);
            handlePayload(parsed);
        };

        const connect = () => {
            if (!isActive) return;
            clearReconnectTimer();

            socket = new WebSocket(WS_URL);

            socket.onopen = () => {
                if (!isActive) return;
                setErrorMessage("");
            };

            socket.onmessage = (event) => {
                if (typeof event.data === "string") {
                    handleMessageData(event.data);
                    return;
                }

                if (event.data instanceof Blob) {
                    event.data.text().then(handleMessageData).catch(() => {});
                    return;
                }

                if (event.data instanceof ArrayBuffer) {
                    const text = new TextDecoder().decode(event.data);
                    handleMessageData(text);
                }
            };

            socket.onerror = () => {
                if (!isActive) return;
                setErrorMessage("Gagal menghubungkan live quotes");
            };

            socket.onclose = () => {
                if (!isActive) return;
                setErrorMessage("Koneksi live quotes terputus");
                reconnectTimer = window.setTimeout(connect, 3000);
            };
        };

        connect();

        return () => {
            isActive = false;
            clearReconnectTimer();
            socket?.close();
        };
    }, []);

    const formatPrice = (symbol: string, price: number): string => {
        if (symbol.includes('IDR')) return `Rp${price.toLocaleString('id-ID')}`;
        if (symbol.includes('BTC')) return `$${price.toLocaleString('en-US')}`;
        return `$${price.toFixed(2)}`;
    };

    const formatPercent = (percent: number): string => {
        const formatted = percent?.toFixed(2);
        const sign = percent > 0 ? '+' : '';
        return `${sign}${formatted}%`;
    };

    return (
        <div className="w-full bg-[#f7e7e7] py-10 flex flex-col items-center space-y-4">
            <div className="mb-6">
                <Header1 title={t('title')} className="text-2xl md:text-3xl" />
            </div>

            <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-36 2xl:px-52 w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {errorMessage ? (
                        <div className="col-span-full text-center text-red-600 font-semibold text-sm sm:text-base">
                            {errorMessage}
                        </div>
                    ) : marketData.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 font-medium text-sm sm:text-base animate-pulse">
                            {t('loading')}
                        </div>
                    ) : (
                        marketData.map((item: MarketItem, index: number) => (
                            <MarketCard
                                key={index}
                                symbol={item.symbol}
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
