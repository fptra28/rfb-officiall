import React, { useEffect, useRef } from 'react';

type TradingViewAdvancedChartProps = {
  symbol?: string;
  theme?: 'light' | 'dark';
  className?: string;
  locale?: string;
  interval?: string;
  timezone?: string;
};

export default function TradingViewAdvancedChart({
  symbol = 'OANDA:XAUUSD',
  theme = 'dark',
  className,
  locale = 'en',
  interval = 'D',
  timezone = 'Etc/UTC',
}: TradingViewAdvancedChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const existingScript = container.querySelector('script[data-tradingview-widget="advanced-chart"]');
    existingScript?.remove();

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.dataset.tradingviewWidget = 'advanced-chart';
    const backgroundColor = theme === 'dark' ? 'rgba(15, 23, 42, 1)' : 'rgba(255, 255, 255, 1)';
    const gridColor = theme === 'dark' ? 'rgba(148, 163, 184, 0.08)' : 'rgba(255, 255, 255, 0.04)';
    script.innerHTML = JSON.stringify({
      allow_symbol_change: true,
      calendar: false,
      details: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      hotlist: false,
      interval,
      locale,
      save_image: true,
      style: '1',
      symbol,
      theme,
      timezone,
      backgroundColor,
      gridColor,
      watchlist: [],
      withdateranges: false,
      compareSymbols: [],
      studies: ['STD;Stochastic_RSI'],
      autosize: true,
    });

    container.appendChild(script);

    return () => {
      script.remove();
    };
  }, [interval, locale, symbol, theme, timezone]);

  return (
    <div
      ref={containerRef}
      className={['tradingview-widget-container', className].filter(Boolean).join(' ')}
      style={{ height: '100%', width: '100%' }}
    >
      <div className="tradingview-widget-container__widget" style={{ height: 'calc(100% - 32px)', width: '100%' }} />
      <div className="tradingview-widget-copyright">
        <a href={`https://www.tradingview.com/symbols/${symbol?.split(':')?.[1] ?? ''}/?exchange=${symbol?.split(':')?.[0] ?? ''}`} rel="noopener nofollow" target="_blank">
          <span className="blue-text">{symbol} chart</span>
        </a>
        <span className="trademark"> by TradingView</span>
      </div>
    </div>
  );
}
