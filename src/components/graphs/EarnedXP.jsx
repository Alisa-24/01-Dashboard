import React, { useEffect, useMemo, useState } from "react";
import { XP_OVER_TIME_QUERY } from "../../lib/queries";
import { graphqlRequest } from "../../lib/api";

function toISODateOnly(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function daysAgoISO(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString();
}

function buildDailySeries(transactions, days) {
    const map = new Map();
    for (const t of transactions) {
        const dateKey = toISODateOnly(new Date(t.createdAt));
        map.set(dateKey, (map.get(dateKey) || 0) + Number(t.amount || 0));
    }

    const series = [];
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));

    for (let i = 0; i < days; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const key = toISODateOnly(d);
        series.push({ label: key, value: map.get(key) || 0 });
    }

    return series;
}

function makePolylinePoints(data, w, h, padding) {
    const innerW = w - padding.left - padding.right;
    const innerH = h - padding.top - padding.bottom;

    const maxVal = Math.max(1, ...data.map((d) => d.value)); // avoid /0
    const xStep = data.length > 1 ? innerW / (data.length - 1) : 0;

    return data
        .map((d, i) => {
            const x = padding.left + i * xStep;
            const y = padding.top + (1 - d.value / maxVal) * innerH;
            return `${x.toFixed(2)},${y.toFixed(2)}`;
        })
        .join(" ");
}

export default function EarnedXPChart() {
    const [rangeDays, setRangeDays] = useState(180);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        async function load() {
            setLoading(true);
            setErr("");

            try {
                const data = await graphqlRequest(XP_OVER_TIME_QUERY, {
                    since: daysAgoISO(rangeDays),
                });

                setTransactions(data?.transaction || []);
            } catch (e) {
                setErr(e.message || "Failed to load XP data");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [rangeDays]);

    const series = useMemo(
        () => buildDailySeries(transactions, rangeDays),
        [transactions, rangeDays]
    );

    const width = 860;
    const height = 260;
    const padding = { top: 20, right: 80, bottom: 40, left: 50 };

    const points = useMemo(
        () => makePolylinePoints(series, width, height, padding),
        [series]
    );

    const maxVal = Math.max(1, ...series.map((d) => d.value));
    const total = series.reduce((sum, d) => sum + d.value, 0);

    const yTicks = 4;
    const tickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
        Math.round((maxVal * i) / yTicks)
    );

    if (loading) {
        return (
            <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-5 text-white">
                <div className="flex items-center justify-between mb-5">
                    <div className="h-4 w-40 rounded bg-slate-800/60" />
                    <div className="flex gap-2">
                        <div className="h-6 w-16 rounded bg-slate-800/60" />
                        <div className="h-6 w-16 rounded bg-slate-800/60" />
                        <div className="h-6 w-20 rounded bg-slate-800/60" />
                    </div>
                </div>

                <div className="relative rounded bg-slate-950/40 h-65">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                            className="h-8 w-8 animate-spin text-slate-400"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            <path
                                className="opacity-75"
                                d="M22 12a10 10 0 00-10-10"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-5 text-white">
            <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                    <div className="text-base font-medium text-slate-300">XP Progression</div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setRangeDays(180)}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${rangeDays === 180
                            ? "bg-slate-700 text-white"
                            : "text-slate-400 hover:text-slate-300"
                            }`}
                    >
                        6 months
                    </button>
                    <button
                        onClick={() => setRangeDays(365)}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${rangeDays === 365
                            ? "bg-slate-700 text-white"
                            : "text-slate-400 hover:text-slate-300"
                            }`}
                    >
                        1 year
                    </button>
                    <button
                        onClick={() => setRangeDays(547)}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${rangeDays === 547
                            ? "bg-slate-700 text-white"
                            : "text-slate-400 hover:text-slate-300"
                            }`}
                    >
                        1.5 years
                    </button>
                    <button
                        onClick={() => setRangeDays(730)}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${rangeDays === 730
                            ? "bg-slate-700 text-white"
                            : "text-slate-400 hover:text-slate-300"
                            }`}
                    >
                        2 years
                    </button>
                </div>
            </div>

            {err ? (
                <div className="text-red-400 text-sm p-3 rounded border border-red-900/30">{err}</div>
            ) : (
                <svg
                    width="100%"
                    viewBox={`0 0 ${width} ${height}`}
                    className="rounded bg-slate-950/40"
                >

                    {tickValues.map((v, i) => {
                        const y =
                            padding.top +
                            (1 - v / maxVal) * (height - padding.top - padding.bottom);
                        return (
                            <g key={i}>
                                <line
                                    x1={padding.left}
                                    y1={y}
                                    x2={width - padding.right}
                                    y2={y}
                                    stroke="#334155"
                                    strokeWidth="1"
                                />
                                <text
                                    x={padding.left - 10}
                                    y={y + 4}
                                    textAnchor="end"
                                    fontSize="10"
                                    fill="#64748b"
                                >
                                    {v}
                                </text>
                            </g>
                        );
                    })}

                    <line
                        x1={padding.left}
                        y1={padding.top}
                        x2={padding.left}
                        y2={height - padding.bottom}
                        stroke="#475569"
                        strokeWidth="1"
                    />
                    <line
                        x1={padding.left}
                        y1={height - padding.bottom}
                        x2={width - padding.right}
                        y2={height - padding.bottom}
                        stroke="#475569"
                        strokeWidth="1"
                    />

                    {(() => {
                        let cumulative = 0;
                        const cumulativeSeries = series.map(d => {
                            cumulative += d.value;
                            return { ...d, cumulative };
                        });
                        const maxCumulative = Math.max(1, cumulative);

                        return (
                            <path
                                d={cumulativeSeries.map((d, i) => {
                                    const innerW = width - padding.left - padding.right;
                                    const innerH = height - padding.top - padding.bottom;
                                    const xStep = series.length > 1 ? innerW / (series.length - 1) : 0;
                                    const x = padding.left + i * xStep;
                                    const y = padding.top + (1 - d.cumulative / maxCumulative) * innerH;

                                    if (i === 0) return `M ${x} ${y}`;

                                    const prevX = padding.left + (i - 1) * xStep;
                                    return `L ${prevX} ${y} L ${x} ${y}`;
                                }).join(' ')}
                                fill="none"
                                stroke="#8b9dc3"
                                strokeWidth="2"
                            />
                        );
                    })()}

                    {series.map((d, i) => {
                        const innerW = width - padding.left - padding.right;
                        const innerH = height - padding.top - padding.bottom;
                        const xStep = series.length > 1 ? innerW / (series.length - 1) : 0;
                        const x = padding.left + i * xStep;
                        let cumulative = 0;
                        for (let j = 0; j <= i; j++) {
                            cumulative += series[j].value;
                        }
                        const maxCumulative = series.reduce((sum, s) => sum + s.value, 0);
                        const y = padding.top + (1 - cumulative / Math.max(1, maxCumulative)) * innerH;

                        const showDot = false;

                        return showDot ? (
                            <g key={d.label}>
                                <circle
                                    cx={x}
                                    cy={y}
                                    r="6"
                                    fill="#0891b2"
                                    stroke="#fff"
                                    strokeWidth="2"
                                    filter="drop-shadow(0 0 4px rgba(6, 182, 212, 0.6))"
                                >
                                    <title>{`${d.label}: ${d.value.toLocaleString()} XP`}</title>
                                </circle>
                            </g>
                        ) : null;
                    })}

                    {series.map((d, i) => {
                        let show = false;
                        if (rangeDays <= 180) {
                            show = i % 30 === 0;
                        } else if (rangeDays <= 365) {
                            show = i % 60 === 0;
                        } else {
                            show = i % 90 === 0;
                        }
                        if (!show) return null;

                        const innerW = width - padding.left - padding.right;
                        const xStep = series.length > 1 ? innerW / (series.length - 1) : 0;
                        const x = padding.left + i * xStep;

                        return (
                            <text
                                key={`x-${d.label}`}
                                x={x}
                                y={height - 15}
                                textAnchor="middle"
                                fontSize="10"
                                fill="#64748b"
                            >
                                {d.label.slice(5)} {/* MM-DD */}
                            </text>
                        );
                    })}

                    {(() => {
                        const innerW = width - padding.left - padding.right;
                        const innerH = height - padding.top - padding.bottom;
                        const lastIndex = series.length - 1;
                        const xStep = series.length > 1 ? innerW / (series.length - 1) : 0;
                        const x = padding.left + lastIndex * xStep;

                        let cumulative = 0;
                        series.forEach(s => cumulative += s.value);
                        const maxCumulative = Math.max(1, cumulative);
                        const y = padding.top + (1 - cumulative / maxCumulative) * innerH;

                        return (
                            <g>
                                <text
                                    x={x + 10}
                                    y={y - 8}
                                    fontSize="10"
                                    fill="#94a3b8"
                                >
                                    Total
                                </text>
                                <text
                                    x={x + 10}
                                    y={y + 4}
                                    fontSize="10"
                                    fill="#94a3b8"
                                    fontWeight="bold"
                                >
                                    {(cumulative / 1000).toFixed(0)} kB
                                </text>
                            </g>
                        );
                    })()}
                </svg>
            )}
        </div>
    );
}
