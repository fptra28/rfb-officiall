import React, { useMemo } from 'react';

type TradingViewAdvancedChartProps = {
  symbol?: string;
  theme?: 'light' | 'dark';
  className?: string;
  locale?: string;
  interval?: string;
  timezone?: string;
  title?: string;
  backgroundColor?: string;
  gridColor?: string;
};

export default function TradingViewAdvancedChart({
  symbol = 'OANDA:XAUUSD',
  theme = 'dark',
  className,
  locale = 'en',
  interval = 'D',
  timezone = 'Etc/UTC',
  title = 'nm-chart',
  backgroundColor = '#0F0F0F',
  gridColor = 'rgba(242,242,242,0.06)',
}: TradingViewAdvancedChartProps) {
  const src = useMemo(() => {
    const query = new URLSearchParams({
      symbol,
      interval,
      theme,
      style: '1',
      locale,
      allow_symbol_change: 'true',
      hide_side_toolbar: 'true',
      hide_top_toolbar: 'false',
      hide_legend: 'false',
      hide_volume: 'true',
      exclude_studies: 'STD;Volume',
      details: 'true',
      autosize: 'true',
      backgroundColor,
      gridColor,
      timezone,
      studies: 'STD;Stochastic_RSI',
    });

    return `https://s.tradingview.com/embed-widget/advanced-chart/?${query.toString()}`;
  }, [backgroundColor, gridColor, interval, locale, symbol, theme, timezone]);

  return (
    <iframe
      allowFullScreen
      className={className}
      src={src}
      style={{ width: '100%', height: '100%', border: 0 }}
      title={title}
    />
  );
}
