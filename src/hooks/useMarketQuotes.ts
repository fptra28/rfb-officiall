import { useEffect, useRef, useState } from "react";
import { parseMarketWsMessage, NormalizedMarketItem } from "@/utils/marketWs";

export type MarketQuote = NormalizedMarketItem & {
  direction?: "up" | "down" | "neutral";
};

type UseMarketQuotesOptions = {
  hiddenSymbols?: string[];
  wsUrl?: string;
  reconnectDelayMs?: number;
};

const DEFAULT_WS_URL = "wss://wsprc.royalassetindo.co.id";

export function useMarketQuotes(options: UseMarketQuotesOptions = {}) {
  const { hiddenSymbols = ["XAG10_BBJ", "XAGF_BBJ"], wsUrl = DEFAULT_WS_URL, reconnectDelayMs = 3000 } = options;

  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const prevDataRef = useRef<NormalizedMarketItem[]>([]);
  const hiddenSetRef = useRef<Set<string>>(new Set(hiddenSymbols));

  useEffect(() => {
    hiddenSetRef.current = new Set(hiddenSymbols);
  }, [hiddenSymbols]);

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

      const filteredPayload = payload.filter((item) => !hiddenSetRef.current.has(item.symbol));
      if (!filteredPayload.length) return;

      const updatedData: MarketQuote[] = filteredPayload.map((item) => {
        const prevItem = prevDataRef.current.find((previous) => previous.symbol === item.symbol);

        let direction: "up" | "down" | "neutral";
        if (prevItem) {
          if (item.last > prevItem.last) direction = "up";
          else if (item.last < prevItem.last) direction = "down";
          else direction = item.percentChange === 0 ? "neutral" : item.percentChange > 0 ? "up" : "down";
        } else {
          direction = item.percentChange > 0 ? "up" : item.percentChange < 0 ? "down" : "neutral";
        }

        return { ...item, direction };
      });

      setQuotes(updatedData);
      prevDataRef.current = filteredPayload;
      setErrorMessage("");
    };

    const handleMessageData = (raw: unknown) => {
      const parsed = parseMarketWsMessage(raw);
      handlePayload(parsed);
    };

    const connect = () => {
      if (!isActive) return;
      clearReconnectTimer();

      socket = new WebSocket(wsUrl);

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
        reconnectTimer = window.setTimeout(connect, reconnectDelayMs);
      };
    };

    connect();

    return () => {
      isActive = false;
      clearReconnectTimer();
      socket?.close();
    };
  }, [reconnectDelayMs, wsUrl]);

  return { quotes, errorMessage };
}

