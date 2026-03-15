import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '../../utils/cn.js';

// ─── Shared types ─────────────────────────────────────────

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

const DEFAULT_COLORS = [
  'var(--tokis-color-primary)',
  '#7c3aed',
  '#059669',
  '#d97706',
  '#dc2626',
  '#0284c7',
  '#db2777',
];

function useContainerWidth(ref: React.RefObject<HTMLDivElement>): number {
  const [width, setWidth] = useState(300);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(ref.current);
    setWidth(ref.current.clientWidth);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

// ─── BarChart ─────────────────────────────────────────────

export interface BarChartProps {
  data: ChartDataPoint[];
  height?: number;
  barColor?: string;
  animated?: boolean;
  horizontal?: boolean;
  className?: string;
}

export function BarChart({
  data,
  height = 200,
  barColor,
  animated = true,
  horizontal = false,
  className,
}: BarChartProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { if (animated) setTimeout(() => setMounted(true), 50); }, [animated]);

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  // Two ref arrays — one for vertical bars, one for horizontal bars (both must be called unconditionally)
  const barRefs = useRef<(SVGRectElement | null)[]>([]);
  const hBarRefs = useRef<(SVGRectElement | null)[]>([]);

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const padding = { top: 8, right: 8, bottom: 32, left: 40 };
  const w = containerWidth;
  const h = height;
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;
  const barWidth = (chartW / data.length) * 0.6;
  const barGap = (chartW / data.length) * 0.4;

  const handleBarKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      barRefs.current[(i + 1) % data.length]?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      barRefs.current[(i - 1 + data.length) % data.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      barRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      barRefs.current[data.length - 1]?.focus();
    }
  };

  const ariaLabel = `Bar chart showing: ${data.map((d) => `${d.label} ${d.value}`).join(', ')}`;

  if (!horizontal) {
    return (
      <div ref={containerRef} className={cn('tokis-chart tokis-chart--bar', className)}>
        <svg
          width={w} height={h}
          aria-label={ariaLabel}
          onMouseMove={(e) => {
            const svgRect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - svgRect.left - padding.left;
            const colW = chartW / data.length;
            const idx = Math.floor(mouseX / colW);
            setHoveredBar(idx >= 0 && idx < data.length ? idx : null);
          }}
          onMouseLeave={() => setHoveredBar(null)}
        >
          <g transform={`translate(${padding.left},${padding.top})`}>
            {/* Y axis ticks */}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => (
              <g key={t} transform={`translate(0,${chartH * (1 - t)})`}>
                <line x1={-4} x2={chartW} stroke="var(--tokis-color-border)" strokeWidth="1" />
                <text x={-8} y={4} fontSize="10" fill="var(--tokis-text-tertiary)" textAnchor="end">
                  {Math.round(maxVal * t)}
                </text>
              </g>
            ))}
            {/* Bars */}
            {data.map((d, i) => {
              const x = i * (chartW / data.length) + barGap / 2;
              const barH = (d.value / maxVal) * chartH;
              const y = chartH - (mounted || !animated ? barH : 0);
              const color = d.color ?? barColor ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
              return (
                <g key={i}>
                  <rect
                    ref={(el) => { barRefs.current[i] = el; }}
                    x={x} y={y} width={barWidth}
                    height={mounted || !animated ? barH : 0}
                    fill={color} rx={3}
                    opacity={hoveredBar !== null && hoveredBar !== i ? 0.5 : 1}
                    style={{ transition: animated ? 'y 0.6s ease, height 0.6s ease' : undefined, outline: 'none' }}
                    tabIndex={i === 0 ? 0 : -1}
                    role="img"
                    aria-label={`${d.label}: ${d.value}`}
                    onFocus={() => setHoveredBar(i)}
                    onBlur={() => setHoveredBar(null)}
                    onKeyDown={(e) => handleBarKeyDown(e, i)}
                  />
                  <text x={x + barWidth / 2} y={chartH + 18} fontSize="10" fill="var(--tokis-text-secondary)" textAnchor="middle" aria-hidden="true">
                    {d.label}
                  </text>
                </g>
              );
            })}
            {/* Hover/focus tooltip */}
            {hoveredBar !== null && (() => {
              const d = data[hoveredBar];
              const x = hoveredBar * (chartW / data.length) + barGap / 2 + barWidth / 2;
              const barH = (d.value / maxVal) * chartH;
              const tipY = Math.max(4, chartH - (mounted || !animated ? barH : 0) - 28);
              const txt = String(d.value);
              const tw = Math.max(36, txt.length * 7 + 16);
              return (
                <g style={{ pointerEvents: 'none' }} aria-hidden="true">
                  <rect x={x - tw / 2} y={tipY} width={tw} height={20} rx={4} fill="rgba(17,24,39,0.92)" />
                  <text x={x} y={tipY + 13} fontSize="10" textAnchor="middle" fill="#fff" fontWeight="600">{txt}</text>
                </g>
              );
            })()}
          </g>
        </svg>
      </div>
    );
  }

  // Horizontal
  const hBarH = (chartH / data.length) * 0.6;
  const hBarGap = (chartH / data.length) * 0.4;
  const handleHBarKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      hBarRefs.current[(i + 1) % data.length]?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      hBarRefs.current[(i - 1 + data.length) % data.length]?.focus();
    }
  };

  return (
    <div ref={containerRef} className={cn('tokis-chart tokis-chart--bar', className)}>
      <svg width={w} height={h} aria-label={ariaLabel}>
        <g transform={`translate(${padding.left},${padding.top})`}>
          {data.map((d, i) => {
            const y = i * (chartH / data.length) + hBarGap / 2;
            const barW = (d.value / maxVal) * chartW;
            const color = d.color ?? barColor ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
            return (
              <g key={i}>
                <text x={-8} y={y + hBarH / 2 + 4} fontSize="10" fill="var(--tokis-text-secondary)" textAnchor="end" aria-hidden="true">
                  {d.label}
                </text>
                <rect
                  ref={(el) => { hBarRefs.current[i] = el; }}
                  x={0} y={y} width={mounted || !animated ? barW : 0} height={hBarH}
                  fill={color} rx={3}
                  style={{ transition: animated ? 'width 0.6s ease' : undefined, outline: 'none' }}
                  tabIndex={i === 0 ? 0 : -1}
                  role="img"
                  aria-label={`${d.label}: ${d.value}`}
                  onFocus={() => setHoveredBar(i)}
                  onBlur={() => setHoveredBar(null)}
                  onKeyDown={(e) => handleHBarKeyDown(e, i)}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

BarChart.displayName = 'BarChart';

// ─── LineChart ────────────────────────────────────────────

export interface LineChartDataset {
  label: string;
  data: number[];
  color?: string;
}

export interface LineChartProps {
  labels: string[];
  datasets: LineChartDataset[];
  height?: number;
  smooth?: boolean;
  animated?: boolean;
  className?: string;
}

function toPath(
  points: { x: number; y: number }[],
  smooth: boolean,
): string {
  if (points.length < 2) return '';
  if (!smooth) {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  }
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
  }
  return d;
}

export function LineChart({
  labels,
  datasets,
  height = 200,
  smooth = true,
  animated = true,
  className,
}: LineChartProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);
  const [mounted, setMounted] = useState(false);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const pointRefs = useRef<(SVGCircleElement | null)[][]>([]);
  useEffect(() => { if (animated) setTimeout(() => setMounted(true), 50); }, [animated]);

  const padding = { top: 12, right: 12, bottom: 32, left: 44 };
  const w = containerWidth;
  const h = height;
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  const allValues = datasets.flatMap((d) => d.data);
  const maxVal = Math.max(...allValues, 1);
  const minVal = Math.min(...allValues, 0);
  const range = maxVal - minVal || 1;

  const toPoint = (val: number, idx: number) => ({
    x: (idx / (labels.length - 1 || 1)) * chartW,
    y: chartH - ((val - minVal) / range) * chartH,
  });

  const lineAriaLabel = `Line chart showing ${datasets.map((d) => d.label).join(' and ')} over ${labels.join(', ')}`;

  const handlePointKeyDown = (e: React.KeyboardEvent, colIdx: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(colIdx + 1, labels.length - 1);
      pointRefs.current[0]?.[next]?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = Math.max(colIdx - 1, 0);
      pointRefs.current[0]?.[prev]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      pointRefs.current[0]?.[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      pointRefs.current[0]?.[labels.length - 1]?.focus();
    }
  };

  return (
    <div ref={containerRef} className={cn('tokis-chart tokis-chart--line', className)}>
      <svg
        width={w} height={h}
        aria-label={lineAriaLabel}
        onMouseMove={(e) => {
          const svgRect = e.currentTarget.getBoundingClientRect();
          const mouseX = e.clientX - svgRect.left - padding.left;
          const colW = chartW / (labels.length - 1 || 1);
          const idx = Math.round(mouseX / colW);
          setHoveredCol(idx >= 0 && idx < labels.length ? idx : null);
        }}
        onMouseLeave={() => setHoveredCol(null)}
      >
        <g transform={`translate(${padding.left},${padding.top})`}>
          {/* Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <g key={t} transform={`translate(0,${chartH * (1 - t)})`}>
              <line x1={0} x2={chartW} stroke="var(--tokis-color-border)" strokeWidth="1" />
              <text x={-8} y={4} fontSize="10" fill="var(--tokis-text-tertiary)" textAnchor="end">
                {Math.round(minVal + range * t)}
              </text>
            </g>
          ))}
          {/* X labels */}
          {labels.map((lbl, i) => (
            <text key={i} x={toPoint(0, i).x} y={chartH + 18} fontSize="10" fill="var(--tokis-text-secondary)" textAnchor="middle" aria-hidden="true">
              {lbl}
            </text>
          ))}
          {/* Lines and keyboard-navigable data points */}
          {datasets.map((dataset, di) => {
            const points = dataset.data.map((v, i) => toPoint(v, i));
            const pathD = toPath(points, smooth);
            const color = dataset.color ?? DEFAULT_COLORS[di % DEFAULT_COLORS.length];
            if (!pointRefs.current[di]) pointRefs.current[di] = [];
            return (
              <g key={di}>
                <path
                  d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                  style={animated ? { strokeDasharray: 2000, strokeDashoffset: mounted ? 0 : 2000, transition: 'stroke-dashoffset 1s ease' } : undefined}
                />
                {points.map((p, pi) => {
                  const isFirstDataset = di === 0;
                  return (
                    <circle
                      key={pi}
                      ref={(el) => { pointRefs.current[di][pi] = el; }}
                      cx={p.x} cy={p.y} r={isFirstDataset ? 4 : 3}
                      fill={color}
                      style={{ outline: 'none', ...(animated ? { opacity: mounted ? 1 : 0, transition: `opacity 0.5s ease ${pi * 0.05}s` } : undefined) }}
                      tabIndex={isFirstDataset ? (pi === 0 ? 0 : -1) : -1}
                      role={isFirstDataset ? 'img' : undefined}
                      aria-label={isFirstDataset
                        ? `${labels[pi]}: ${datasets.map((ds) => `${ds.label} ${ds.data[pi]}`).join(', ')}`
                        : undefined}
                      onFocus={isFirstDataset ? () => setHoveredCol(pi) : undefined}
                      onBlur={isFirstDataset ? () => setHoveredCol(null) : undefined}
                      onKeyDown={isFirstDataset ? (e) => handlePointKeyDown(e, pi) : undefined}
                    />
                  );
                })}
              </g>
            );
          })}
          {/* Hover/focus crosshair + tooltip */}
          {hoveredCol !== null && (() => {
            const x = toPoint(0, hoveredCol).x;
            const vals = datasets.map((ds) => ({ val: ds.data[hoveredCol], color: ds.color ?? DEFAULT_COLORS[datasets.indexOf(ds) % DEFAULT_COLORS.length], label: ds.label }));
            const firstVal = vals[0];
            if (!firstVal || firstVal.val === undefined) return null;
            const y = toPoint(firstVal.val, hoveredCol).y;
            const isMulti = vals.length > 1;
            return (
              <g style={{ pointerEvents: 'none' }} aria-hidden="true">
                <line x1={x} x2={x} y1={0} y2={chartH} stroke="var(--tokis-color-border)" strokeWidth="1" strokeDasharray="3,3" />
                {vals.map(({ val, color }, vi) => {
                  if (val === undefined) return null;
                  const py = toPoint(val, hoveredCol).y;
                  return <circle key={vi} cx={x} cy={py} r={4} fill={color} stroke="#fff" strokeWidth="1.5" />;
                })}
                {!isMulti && (
                  (() => {
                    const txt = String(firstVal.val);
                    const tw = Math.max(36, txt.length * 7 + 16);
                    const tipX = Math.min(Math.max(x, tw / 2 + 2), chartW - tw / 2 - 2);
                    const tipY = Math.max(4, y - 30);
                    return (
                      <g>
                        <rect x={tipX - tw / 2} y={tipY} width={tw} height={20} rx={4} fill="rgba(17,24,39,0.92)" />
                        <text x={tipX} y={tipY + 13} fontSize="10" textAnchor="middle" fill="#fff" fontWeight="600">{txt}</text>
                      </g>
                    );
                  })()
                )}
                {isMulti && (
                  (() => {
                    const lines = vals.filter(v => v.val !== undefined);
                    const tw = 90;
                    const th = lines.length * 16 + 8;
                    const tipX = Math.min(Math.max(x + 8, tw / 2 + 2), chartW - tw / 2 - 2);
                    const tipY = Math.max(4, Math.min(y - th / 2, chartH - th - 4));
                    return (
                      <g>
                        <rect x={tipX - tw / 2} y={tipY} width={tw} height={th} rx={4} fill="rgba(17,24,39,0.92)" />
                        {lines.map(({ val, color, label }, li) => (
                          <g key={li}>
                            <circle cx={tipX - tw / 2 + 10} cy={tipY + 12 + li * 16} r={3} fill={color} />
                            <text x={tipX - tw / 2 + 18} y={tipY + 16 + li * 16} fontSize="10" fill="#fff">{label}: {val}</text>
                          </g>
                        ))}
                      </g>
                    );
                  })()
                )}
              </g>
            );
          })()}
        </g>
      </svg>
      {datasets.length > 1 && (
        <div className="tokis-chart__legend">
          {datasets.map((d, i) => (
            <span key={i} className="tokis-chart__legend-item">
              <span className="tokis-chart__legend-dot" style={{ background: d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length] }} />
              {d.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

LineChart.displayName = 'LineChart';

// ─── PieChart ─────────────────────────────────────────────

export interface PieChartProps {
  data: ChartDataPoint[];
  donut?: boolean;
  size?: number;
  animated?: boolean;
  showLegend?: boolean;
  className?: string;
}

export function PieChart({
  data,
  donut = false,
  size = 200,
  animated = true,
  showLegend = true,
  className,
}: PieChartProps): JSX.Element {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { if (animated) setTimeout(() => setMounted(true), 50); }, [animated]);
  const [hovered, setHovered] = useState<number | null>(null);
  const sliceRefs = useRef<(SVGPathElement | null)[]>([]);

  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) * 0.78;
  const innerR = donut ? r * 0.55 : 0;

  let cumAngle = -Math.PI / 2;

  const slices = data.map((d, i) => {
    const angle = (d.value / total) * Math.PI * 2;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;
    const expand = hovered === i ? 6 : 0;
    const midAngle = startAngle + angle / 2;
    const offsetX = expand * Math.cos(midAngle);
    const offsetY = expand * Math.sin(midAngle);

    const x1 = cx + offsetX + r * Math.cos(startAngle);
    const y1 = cy + offsetY + r * Math.sin(startAngle);
    const x2 = cx + offsetX + r * Math.cos(endAngle);
    const y2 = cy + offsetY + r * Math.sin(endAngle);
    const ix1 = cx + offsetX + innerR * Math.cos(endAngle);
    const iy1 = cy + offsetY + innerR * Math.sin(endAngle);
    const ix2 = cx + offsetX + innerR * Math.cos(startAngle);
    const iy2 = cy + offsetY + innerR * Math.sin(startAngle);

    const largeArc = angle > Math.PI ? 1 : 0;
    const pathD = donut
      ? `M${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} L${ix1},${iy1} A${innerR},${innerR} 0 ${largeArc},0 ${ix2},${iy2} Z`
      : `M${cx + offsetX},${cy + offsetY} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`;

    return { ...d, pathD, color: d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length] };
  });

  const pieAriaLabel = `${donut ? 'Donut' : 'Pie'} chart showing: ${data.map((d) => `${d.label} ${d.value} (${((d.value / total) * 100).toFixed(1)}%)`).join(', ')}`;

  const handleSliceKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      sliceRefs.current[(i + 1) % slices.length]?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      sliceRefs.current[(i - 1 + slices.length) % slices.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      sliceRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      sliceRefs.current[slices.length - 1]?.focus();
    }
  };

  return (
    <div className={cn('tokis-chart tokis-chart--pie', className)}>
      <svg width={size} height={size} aria-label={pieAriaLabel}>
        {slices.map((s, i) => (
          <path
            key={i}
            ref={(el) => { sliceRefs.current[i] = el; }}
            d={s.pathD} fill={s.color}
            style={{ opacity: mounted || !animated ? 1 : 0, transition: animated ? `opacity 0.4s ease ${i * 0.07}s` : undefined, cursor: 'pointer', outline: 'none' }}
            tabIndex={i === 0 ? 0 : -1}
            role="img"
            aria-label={`${s.label}: ${s.value} (${((s.value / total) * 100).toFixed(1)}%)`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            onKeyDown={(e) => handleSliceKeyDown(e, i)}
          >
            <title>{s.label}: {s.value} ({((s.value / total) * 100).toFixed(1)}%)</title>
          </path>
        ))}
      </svg>
      {showLegend && (
        <div className="tokis-chart__legend">
          {slices.map((s, i) => (
            <span key={i} className="tokis-chart__legend-item">
              <span className="tokis-chart__legend-dot" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

PieChart.displayName = 'PieChart';

// ─── Sparkline ────────────────────────────────────────────

export type SparklineType = 'line' | 'bar' | 'area';

export interface SparklineProps {
  data: number[];
  type?: SparklineType;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function Sparkline({
  data,
  type = 'line',
  width = 80,
  height = 24,
  color = 'var(--tokis-color-primary)',
  className,
}: SparklineProps): JSX.Element {
  if (data.length < 2) return <span className={cn('tokis-sparkline', className)} />;

  const maxVal = Math.max(...data, 1);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;
  const xStep = width / (data.length - 1);

  const toX = (i: number) => i * xStep;
  const toY = (v: number) => height - ((v - minVal) / range) * (height - 2) - 1;

  if (type === 'bar') {
    const bw = Math.max(1, (width / data.length) * 0.7);
    return (
      <svg width={width} height={height} className={cn('tokis-sparkline', className)} aria-hidden="true">
        {data.map((v, i) => {
          const bh = ((v - minVal) / range) * height;
          return <rect key={i} x={i * (width / data.length)} y={height - bh} width={bw} height={bh} fill={color} rx={1} />;
        })}
      </svg>
    );
  }

  const points = data.map((v, i) => ({ x: toX(i), y: toY(v) }));
  const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD = `${lineD} L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`;

  return (
    <svg width={width} height={height} className={cn('tokis-sparkline', className)} aria-hidden="true">
      {type === 'area' && <path d={areaD} fill={color} opacity={0.2} />}
      <path d={lineD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

Sparkline.displayName = 'Sparkline';
