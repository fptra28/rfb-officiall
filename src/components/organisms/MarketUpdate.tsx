import { useEffect, useState } from "react";
import { parseMarketWsMessage, NormalizedMarketItem } from "@/utils/marketWs";

interface MarketItem {
  symbol: string;
  last: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  valueChange: number;
}

export default function MarketUpdate() {
  const [marketData, setMarketData] = useState<MarketItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

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

      const normalized = payload.map((item) => ({
        symbol: item.symbol,
        last: item.last,
        percentChange: item.percentChange,
        high: item.high ?? 0,
        low: item.low ?? 0,
        open: item.open ?? 0,
        prevClose: item.prevClose ?? 0,
        valueChange: item.valueChange ?? 0,
      }));

      setMarketData(normalized);
      setErrorMessage("");
    };

    const handleMessageData = (raw: unknown) => {
      const parsed = parseMarketWsMessage(raw);
      handlePayload(parsed);
    };

    const connect = () => {
      if (!isActive) return;
      clearReconnectTimer();

      socket = new WebSocket("wss://wsprc.royalassetindo.co.id");

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

  const formatPrice = (symbol: string, price: number) => {
    if (symbol.includes('IDR')) return `Rp${price.toLocaleString('id-ID')}`;
    if (symbol.includes('BTC')) return `$${price.toLocaleString('en-US')}`;
    return `$${price.toFixed(2)}`;
  };

  const formatPercent = (percent?: number) => {
    if (percent == null) return "-";
    const formatted = percent.toFixed(2);
    const sign = percent > 0 ? '+' : '';
    return `${sign}${formatted}%`;
  };

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
                    <span>{formatPrice(item.symbol, item.last)}</span>
                    <span
                      className={`font-medium ${item.percentChange > 0
                        ? 'text-green-800'
                        : item.percentChange < 0
                          ? 'text-red-500'
                          : 'text-white/60'
                        }`}
                    >
                      ({formatPercent(item.percentChange)})
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
