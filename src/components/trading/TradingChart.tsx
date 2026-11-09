import React, { useState, useEffect, useRef } from 'react';
import { Candle, generateHistoricalCandles } from '../../data/markets';

interface TradingChartProps {
  symbol: string;
  currentPrice: number;
  change24hPct: number;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  symbol,
  currentPrice,
  change24hPct,
}) => {
  const [interval, setInterval] = useState<'1m' | '5m' | '15m' | '1h' | '1D'>('5m');
  const [candles, setCandles] = useState<Candle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);

  // Generate / refresh candles when symbol or interval changes
  useEffect(() => {
    setCandles(generateHistoricalCandles(currentPrice, 42));
  }, [symbol, interval]);

  // Update latest candle with live price
  useEffect(() => {
    if (candles.length === 0) return;
    setCandles(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      const last = { ...updated[updated.length - 1] };
      last.close = currentPrice;
      if (currentPrice > last.high) last.high = currentPrice;
      if (currentPrice < last.low) last.low = currentPrice;
      updated[updated.length - 1] = last;
      return updated;
    });
  }, [currentPrice]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Padding
    const padTop = 20;
    const padBottom = 35;
    const padRight = 65;
    const chartHeight = height - padTop - padBottom;
    const chartWidth = width - padRight;

    // Find min and max price
    let minP = Math.min(...candles.map(c => c.low));
    let maxP = Math.max(...candles.map(c => c.high));
    const pricePadding = (maxP - minP) * 0.08 || currentPrice * 0.01;
    minP -= pricePadding;
    maxP += pricePadding;
    const priceRange = maxP - minP || 1;

    // Max volume for volume bars
    const maxVol = Math.max(...candles.map(c => c.volume)) || 1;

    // Grid lines (horizontal)
    ctx.strokeStyle = document.documentElement.classList.contains('dark') ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)';
    ctx.lineWidth = 1;
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b';

    const gridSteps = 5;
    for (let i = 0; i <= gridSteps; i++) {
      const p = minP + (priceRange * (i / gridSteps));
      const y = padTop + chartHeight - (chartHeight * (i / gridSteps));
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      // Price label on right axis
      ctx.fillText(`$${p.toFixed(p > 1000 ? 1 : 2)}`, chartWidth + 6, y + 3);
    }

    // Candle geometry
    const candleWidth = Math.max(3, (chartWidth / candles.length) * 0.7);
    const candleSpacing = chartWidth / candles.length;

    candles.forEach((c, i) => {
      const x = i * candleSpacing + candleSpacing / 2;
      const isGreen = c.close >= c.open;

      const openY = padTop + chartHeight - (((c.open - minP) / priceRange) * chartHeight);
      const closeY = padTop + chartHeight - (((c.close - minP) / priceRange) * chartHeight);
      const highY = padTop + chartHeight - (((c.high - minP) / priceRange) * chartHeight);
      const lowY = padTop + chartHeight - (((c.low - minP) / priceRange) * chartHeight);

      const color = isGreen ? '#10b981' : '#f43f5e';
      ctx.strokeStyle = color;
      ctx.fillStyle = color;

      // Draw wick
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Draw body
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(2, Math.abs(openY - closeY));
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);

      // Draw volume bar at bottom
      const volHeight = (c.volume / maxVol) * 35;
      ctx.fillStyle = isGreen ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)';
      ctx.fillRect(x - candleWidth / 2, height - padBottom - volHeight, candleWidth, volHeight);
    });

    // Current price dashed line
    const currentY = padTop + chartHeight - (((currentPrice - minP) / priceRange) * chartHeight);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(chartWidth, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Current price pill on right axis
    ctx.fillStyle = '#10b981';
    ctx.fillRect(chartWidth + 2, currentY - 9, 58, 18);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.fillText(`$${currentPrice.toFixed(currentPrice > 1000 ? 1 : 2)}`, chartWidth + 5, currentY + 3);

  }, [candles, currentPrice]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
      
      {/* Chart Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
            {symbol}
          </span>
          <span className="font-mono text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`text-xs font-mono font-semibold ${change24hPct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {change24hPct >= 0 ? '+' : ''}{change24hPct.toFixed(2)}%
          </span>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
          {(['1m', '5m', '15m', '1h', '1D'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setInterval(tf)}
              className={`px-2 py-0.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
                interval === tf
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div ref={containerRef} className="relative flex-1 min-h-[320px] w-full p-2">
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-crosshair"
        />
      </div>

      {/* Chart Footer Sub-Bar */}
      <div className="px-4 py-1.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <span>Veritas Real-Time Sequencer Feed</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Sub-5ms Latency</span>
        </div>
        <div className="font-mono">
          Vol: ${(candles.reduce((acc, c) => acc + c.volume, 0) * 1000).toLocaleString()}
        </div>
      </div>

    </div>
  );
};
