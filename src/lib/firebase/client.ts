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

const getFirebaseConfig = (): FirebaseWebConfig | null => {
  const {
    NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  } = process.env;

  if (
    !NEXT_PUBLIC_FIREBASE_API_KEY ||
    !NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    !NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    !NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    !NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    !NEXT_PUBLIC_FIREBASE_APP_ID
  ) {
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
  if (!app) return null;

  const config = getFirebaseConfig();
  if (!config?.measurementId) return null;

  const enabled = process.env.NEXT_PUBLIC_FIREBASE_ANALYTICS_ENABLED !== "false";
  if (!enabled) return null;

  if (!analyticsPromise) {
    analyticsPromise = (async () => {
      try {
        const { getAnalytics, isSupported } = await import("firebase/analytics");
        if (!(await isSupported())) return null;
        return getAnalytics(app);
      } catch {
        // Ignore analytics initialization failures (e.g. blocked cookies/adblock).
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
