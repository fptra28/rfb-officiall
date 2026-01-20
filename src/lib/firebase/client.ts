import type { FirebaseApp } from "firebase/app";
import { getApp, getApps, initializeApp } from "firebase/app";
import type { Analytics } from "firebase/analytics";

type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

const analyticsLogEnabled =
  process.env.NEXT_PUBLIC_FIREBASE_ANALYTICS_LOG === "true";

const getFirebaseConfig = (): FirebaseWebConfig | null => {
  const NEXT_PUBLIC_FIREBASE_API_KEY =
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN =
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const NEXT_PUBLIC_FIREBASE_PROJECT_ID =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID =
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const NEXT_PUBLIC_FIREBASE_APP_ID =
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID =
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  if (
    !NEXT_PUBLIC_FIREBASE_API_KEY ||
    !NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    !NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    !NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    !NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    !NEXT_PUBLIC_FIREBASE_APP_ID
  ) {
    if (analyticsLogEnabled) {
      const missing = [
        ["NEXT_PUBLIC_FIREBASE_API_KEY", NEXT_PUBLIC_FIREBASE_API_KEY],
        ["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN],
        ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", NEXT_PUBLIC_FIREBASE_PROJECT_ID],
        [
          "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        ],
        [
          "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        ],
        ["NEXT_PUBLIC_FIREBASE_APP_ID", NEXT_PUBLIC_FIREBASE_APP_ID],
      ]
        .filter(([, v]) => !v)
        .map(([k]) => k);
      // eslint-disable-next-line no-console
      console.warn("[firebase] Missing env:", missing.join(", "));
    }
    return null;
  }

  return {
    apiKey: NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
};

export const getFirebaseApp = (): FirebaseApp | null => {
  const config = getFirebaseConfig();
  if (!config) return null;

  return getApps().length ? getApp() : initializeApp(config);
};

let analyticsPromise: Promise<Analytics | null> | null = null;

export const initFirebaseAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === "undefined") return null;

  const app = getFirebaseApp();
  if (!app) {
    if (analyticsLogEnabled) {
      // eslint-disable-next-line no-console
      console.warn("[firebase] App not initialized (missing config).");
    }
    return null;
  }

  const config = getFirebaseConfig();
  if (!config?.measurementId) {
    if (analyticsLogEnabled) {
      // eslint-disable-next-line no-console
      console.warn("[firebase] Missing measurementId; Analytics disabled.");
    }
    return null;
  }

  const enabled = process.env.NEXT_PUBLIC_FIREBASE_ANALYTICS_ENABLED !== "false";
  if (!enabled) {
    if (analyticsLogEnabled) {
      // eslint-disable-next-line no-console
      console.info("[firebase] Analytics disabled by env.");
    }
    return null;
  }

  if (!analyticsPromise) {
    analyticsPromise = (async () => {
      try {
        const {
          getAnalytics,
          isSupported,
          setAnalyticsCollectionEnabled,
        } = await import("firebase/analytics");
        const supported = await isSupported();
        if (!supported) {
          if (analyticsLogEnabled) {
            // eslint-disable-next-line no-console
            console.warn("[firebase] Analytics not supported in this browser.");
          }
          return null;
        }
        const analytics = getAnalytics(app);
        setAnalyticsCollectionEnabled(analytics, true);
        if (analyticsLogEnabled) {
          // eslint-disable-next-line no-console
          console.info("[firebase] Analytics initialized.");
        }
        return analytics;
      } catch {
        // Ignore analytics initialization failures (e.g. blocked cookies/adblock).
        if (analyticsLogEnabled) {
          // eslint-disable-next-line no-console
          console.warn("[firebase] Analytics init failed (blocked/adblock?).");
        }
        return null;
      }
    })();
  }

  return analyticsPromise;
};

export const trackPageView = async (url: string): Promise<void> => {
  if (typeof window === "undefined") return;

  const analytics = await initFirebaseAnalytics();
  if (!analytics) return;

  const { logEvent } = await import("firebase/analytics");
  const debugMode =
    process.env.NEXT_PUBLIC_FIREBASE_ANALYTICS_DEBUG === "true" ||
    process.env.NODE_ENV !== "production";
  logEvent(analytics, "page_view", {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
    debug_mode: debugMode ? 1 : undefined,
  });
};
