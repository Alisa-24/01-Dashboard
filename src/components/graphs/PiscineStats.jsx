import React, { useEffect, useState } from "react";
import { graphqlRequest } from "../../lib/api";
import { PISCINE_STATS_QUERY } from "../../lib/queries";

export default function PiscineStats() {
    const [activeTab, setActiveTab] = useState("js");
    const [stats, setStats] = useState({ pass: 0, fail: 0, attempts: [] });
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        loadPiscineData(activeTab);
    }, [activeTab]);

    async function loadPiscineData(piscine) {
        setLoading(true);
        setErr("");

        try {
            const pathPatterns = piscine === "js"
                ? ["%bh-module/piscine-js%", "%piscine-js%", "%piscine_js%", "%javascript%", "%js-piscine%"]
                : ["%bh-piscine%", "%bh_piscine%"];

            let allProgress = [];

            for (const piscinePath of pathPatterns) {
                const data = await graphqlRequest(PISCINE_STATS_QUERY, { piscinePath });
                if (!data || !data.progress) {
                    logout();
                    setErr("Unauthorized access. Logging out.");
                    setLoading(false);
                    return;
                }
                if (data.progress && data.progress.length > 0) {
                    allProgress = data.progress;
                    break;
                }
            }

            if (allProgress.length === 0) {
                console.log(`No data found for ${piscine} piscine with any pattern`);
            }

            const calculatedStats = calculatePiscineStats(allProgress);
            setStats(calculatedStats);
        } catch (e) {
            console.error("Piscine error:", e);
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-5">
                <div className="flex justify-center gap-2 mb-4">
                    <button className="px-3 py-1.5 rounded text-xs font-medium bg-slate-700 text-white">
                        JavaScript
                    </button>
                    <button className="px-3 py-1.5 rounded text-xs font-medium text-slate-400">
                        Go
                    </button>
                </div>
                <div className="h-48 bg-slate-800/60 rounded animate-pulse" />
            </div>
        );
    }

    if (err) {
        return (
            <div className="rounded-lg border border-red-900/30 bg-red-900/10 p-4 text-red-400">
                {err}
            </div>
        );
    }

    const total = stats.pass + stats.fail;
    const passPercentage = total > 0 ? (stats.pass / total) * 100 : 0;
    const failPercentage = total > 0 ? (stats.fail / total) * 100 : 0;
    const successRate = total > 0 ? ((stats.pass / total) * 100).toFixed(1) : 0;

    return (
        <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-5">
            {/* Tab Buttons */}
            <div className="flex justify-center gap-2 mb-6">
                <button
                    onClick={() => setActiveTab("js")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "js"
                        ? "bg-slate-700 text-white"
                        : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
                        }`}
                >
                    JavaScript
                </button>
                <button
                    onClick={() => setActiveTab("go")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "go"
                        ? "bg-slate-700 text-white"
                        : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
                        }`}
                >
                    Go
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PASS/FAIL Ratio Chart */}
                <div>
                    <h3 className="text-base font-medium text-slate-300 mb-4">PASS/FAIL Ratio</h3>

                    {total === 0 ? (
                        <div className="text-sm text-slate-500 text-center py-8">
                            No {activeTab === "js" ? "JavaScript" : "Go"} piscine data available
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            {/* SVG Pie Chart */}
                            <svg width="180" height="180" className="mb-4">
                                <PieChart
                                    passPercentage={passPercentage}
                                    failPercentage={failPercentage}
                                />
                            </svg>

                            {/* Legend */}
                            <div className="flex gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                    <span className="text-xs text-slate-400">
                                        PASS: <span className="text-slate-200 font-semibold">{stats.pass}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <span className="text-xs text-slate-400">
                                        FAIL: <span className="text-slate-200 font-semibold">{stats.fail}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Success Rate */}
                            <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-400">{successRate}%</div>
                                <div className="text-xs text-slate-500">Success Rate</div>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-base font-medium text-slate-300 mb-4">
                        Attempts for Each Exercise
                    </h3>

                    {stats.attempts.length === 0 ? (
                        <div className="text-sm text-slate-500 text-center py-8">
                            No exercise attempts found
                        </div>
                    ) : (
                        <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2">
                            {stats.attempts.map((attempt, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30 hover:bg-slate-800/50 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-slate-500 bg-slate-700/50 px-1.5 py-0.5 rounded">
                                                {attempt.quest.startsWith('CP') ? attempt.quest : !isNaN(attempt.quest) ? `Q${attempt.quest}` : attempt.quest}
                                            </span>
                                            <div className="text-sm font-medium text-slate-200 truncate">
                                                {attempt.name}
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            {attempt.passed ? (
                                                <span className="text-emerald-400">✓ Passed</span>
                                            ) : (
                                                <span className="text-red-400">✗ Failed</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right ml-4">
                                        <div className="text-sm font-semibold text-slate-300">
                                            {attempt.attempts}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {attempt.attempts === 1 ? "attempt" : "attempts"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function PieChart({ passPercentage, failPercentage }) {
    const size = 180;
    const center = size / 2;
    const radius = 70;

    const passAngle = (passPercentage / 100) * 360;
    const failAngle = (failPercentage / 100) * 360;

    const passRadians = (passAngle * Math.PI) / 180;

    const passX = center + radius * Math.sin(passRadians);
    const passY = center - radius * Math.cos(passRadians);
    const passLargeArc = passAngle > 180 ? 1 : 0;

    const passPath = `
    M ${center} ${center}
    L ${center} ${center - radius}
    A ${radius} ${radius} 0 ${passLargeArc} 1 ${passX} ${passY}
    Z
  `;

    const failX = center;
    const failY = center - radius;
    const failLargeArc = failAngle > 180 ? 1 : 0;

    const failPath = `
    M ${center} ${center}
    L ${passX} ${passY}
    A ${radius} ${radius} 0 ${failLargeArc} 1 ${failX} ${failY}
    Z
  `;

    return (
        <g>
            <path d={passPath} fill="#10b981" opacity="0.9" />
            <path d={failPath} fill="#ef4444" opacity="0.9" />
            <circle cx={center} cy={center} r={45} fill="#0f172a" />
        </g>
    );
}

function calculatePiscineStats(progressData) {
    const exerciseMap = new Map();

    progressData.forEach(({ grade, object, path }) => {
        if (!object?.name) return;

        if (object.type && object.type !== "exercise") return;

        const exerciseName = object.name;

        let questNumber = "?";

        const checkpointMatch = path?.match(/checkpoint-(\d+)/);
        if (checkpointMatch) {
            questNumber = `CP${checkpointMatch[1]}`;
        } else {
            const questMatch = path?.match(/quest-(\d+)/);
            if (questMatch) {
                questNumber = questMatch[1];
            } else {
                const moduleMatch = path?.match(/piscine-js\/([^\/]+)\//);
                if (moduleMatch && moduleMatch[1] && !moduleMatch[1].startsWith('checkpoint')) {
                    questNumber = moduleMatch[1];
                }
            }
        }

        if (!exerciseMap.has(exerciseName)) {
            exerciseMap.set(exerciseName, {
                name: exerciseName,
                quest: questNumber,
                attempts: 0,
                passed: false,
                grades: []
            });
        }

        const exercise = exerciseMap.get(exerciseName);
        exercise.attempts++;
        exercise.grades.push(grade);

        if (grade === 1 || grade > 0) {
            exercise.passed = true;
        }
    });

    let pass = 0;
    let fail = 0;
    const attempts = [];

    exerciseMap.forEach((exercise) => {
        if (exercise.passed) {
            pass++;
        } else {
            fail++;
        }
        attempts.push(exercise);
    });

    attempts.sort((a, b) => b.attempts - a.attempts);

    return { pass, fail, attempts };
}