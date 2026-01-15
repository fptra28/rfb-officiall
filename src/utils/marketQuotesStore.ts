import { parseMarketWsMessage, NormalizedMarketItem } from "@/utils/marketWs";

export type MarketQuote = NormalizedMarketItem & {
  direction?: "up" | "down" | "neutral";
};

type Snapshot = {
  quotes: MarketQuote[];
  errorMessage: string;
};

const WS_URL = "wss://wsprc.royalassetindo.co.id";
const RECONNECT_DELAY_MS = 3000;
const DISCONNECT_GRACE_MS = 5000;
const NOTIFY_THROTTLE_MS = 250;

let socket: WebSocket | null = null;
let reconnectTimer: number | null = null;
let disconnectTimer: number | null = null;

let snapshot: Snapshot = { quotes: [], errorMessage: "" };
const listeners = new Set<() => void>();

const quotesMap = new Map<string, MarketQuote>();
const prevMap = new Map<string, NormalizedMarketItem>();

let notifyScheduled = false;
let lastNotifyAt = 0;

const emit = () => {
  notifyScheduled = false;
  lastNotifyAt = Date.now();
  snapshot = { ...snapshot, quotes: Array.from(quotesMap.values()) };
  for (const listener of listeners) listener();
};

const scheduleEmit = () => {
  if (notifyScheduled) return;
  const elapsed = Date.now() - lastNotifyAt;
  const delay = Math.max(0, NOTIFY_THROTTLE_MS - elapsed);
  notifyScheduled = true;
  window.setTimeout(emit, delay);
};

const clearReconnectTimer = () => {
  if (reconnectTimer !== null) {
    window.clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
};

const clearDisconnectTimer = () => {
  if (disconnectTimer !== null) {
    window.clearTimeout(disconnectTimer);
    disconnectTimer = null;
  }
};

const setError = (message: string) => {
  if (snapshot.errorMessage === message) return;
  snapshot = { ...snapshot, errorMessage: message };
  for (const listener of listeners) listener();
};

const handlePayload = (payload: NormalizedMarketItem[]) => {
  if (!payload.length) return;

  for (const item of payload) {
    const prevItem = prevMap.get(item.symbol);

    let direction: "up" | "down" | "neutral";
    if (prevItem) {
      if (item.last > prevItem.last) direction = "up";
      else if (item.last < prevItem.last) direction = "down";
      else direction = item.percentChange === 0 ? "neutral" : item.percentChange > 0 ? "up" : "down";
    } else {
      direction = item.percentChange > 0 ? "up" : item.percentChange < 0 ? "down" : "neutral";
    }

    quotesMap.set(item.symbol, { ...item, direction });
    prevMap.set(item.symbol, item);
  }

  if (snapshot.errorMessage) snapshot = { ...snapshot, errorMessage: "" };
  scheduleEmit();
};

const handleMessageData = (raw: unknown) => {
  const parsed = parseMarketWsMessage(raw);
  handlePayload(parsed);
};

const connect = () => {
  clearReconnectTimer();
  clearDisconnectTimer();

  if (socket) return;
  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    setError("");
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
    setError("Gagal menghubungkan live quotes");
  };

  socket.onclose = () => {
    socket = null;
    if (!listeners.size) return;
    setError("Koneksi live quotes terputus");
    reconnectTimer = window.setTimeout(connect, RECONNECT_DELAY_MS);
  };
};

const scheduleDisconnect = () => {
  clearDisconnectTimer();
  disconnectTimer = window.setTimeout(() => {
    if (listeners.size) return;
    clearReconnectTimer();
    socket?.close();
    socket = null;
  }, DISCONNECT_GRACE_MS);
};

export const subscribeMarketQuotes = (listener: () => void) => {
  listeners.add(listener);
  connect();
  return () => {
    listeners.delete(listener);
    if (!listeners.size) scheduleDisconnect();
  };
};

export const getMarketQuotesSnapshot = () => snapshot;

export const getMarketQuotesServerSnapshot = (): Snapshot => ({ quotes: [], errorMessage: "" });

