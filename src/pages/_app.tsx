import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { appWithTranslation } from "next-i18next";
import nextI18NextConfig from "../../next-i18next.config.js";
import LoadingScreen from "@/components/organisms/LoadingScreen";

function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
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
