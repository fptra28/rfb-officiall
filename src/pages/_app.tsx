import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { appWithTranslation } from "next-i18next";
import nextI18NextConfig from "../../next-i18next.config.js";
import LoadingScreen from "@/components/organisms/LoadingScreen";
import { initFirebaseAnalytics, trackPageView } from "@/lib/firebase/client";

function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    initFirebaseAnalytics();
  }, []);

  useEffect(() => {
    let showTimer: number | null = null;
    let safetyTimer: number | null = null;

    const clearTimers = () => {
      if (showTimer !== null) {
        window.clearTimeout(showTimer);
        showTimer = null;
      }
      if (safetyTimer !== null) {
        window.clearTimeout(safetyTimer);
        safetyTimer = null;
      }
    };

    const handleStart = () => {
      clearTimers();
      showTimer = window.setTimeout(() => setLoading(true), 150);
      safetyTimer = window.setTimeout(() => setLoading(false), 8000);
    };

    const handleStop = () => {
      clearTimers();
      setLoading(false);
    };

    const handleComplete = (url: string) => {
      handleStop();
      trackPageView(url);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleStop);
      clearTimers();
    };
  }, [router]);

  return (
    <>
      <LoadingScreen show={loading} />
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(App, nextI18NextConfig);
