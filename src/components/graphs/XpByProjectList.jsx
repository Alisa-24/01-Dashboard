import React, { useEffect, useMemo, useState } from "react";
import { XP_BY_PROJECT_QUERY } from "../../lib/queries";
import { graphqlRequest } from "../../lib/api";
import { data } from "react-router-dom";

export default function XpByProjectList() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const data = await graphqlRequest(XP_BY_PROJECT_QUERY);
                setProjects(groupXpByProject(data.transaction || []));
            } catch (e) {
                setErr(e.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-5">
                <div className="h-4 w-48 bg-slate-800/60 rounded mb-4" />
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-6 bg-slate-800/60 rounded" />
                    ))}
                </div>
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

    const maxXP = Math.max(1, ...projects.map(p => p.xp));

    return (
        <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-5">
            <div className="text-base font-medium text-slate-300 mb-4 text-center">
                XP Earned by Projects
            </div>

            <ul className="divide-y divide-slate-700/40 max-h-105 custom-scrollbar overflow-y-auto pr-2">
                {projects.map((p, i) => (
                    <li
                        key={`${p.name}-${i}`}
                        className="flex items-center gap-4 py-3 rounded transition-colors hover:bg-slate-800/40"
                    >
                        <div className="w-8 text-right text-xs font-medium text-slate-500">
                            {i + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-200 truncate">
                                {p.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                                {formatDate(p.latest)}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-sm font-semibold text-slate-300">
                                {(p.xp / 1000).toFixed(1)} kB
                            </div>
                        </div>
                    </li>
                ))}
            </ul>


        </div>
    );
}


function groupXpByProject(transactions) {
  const map = new Map();

  transactions.forEach(({ amount, createdAt, object }) => {
    if (!object?.name || !createdAt) return;
    
    if (object.type !== "project") return;

    const projectName = object.name;
    const xp = Number(amount || 0);
    const date = new Date(createdAt);

    if (!map.has(projectName)) {
      map.set(projectName, {
        name: projectName,
        xp,
        latest: date,
      });
    } else {
      const p = map.get(projectName);
      p.xp += xp;
      if (date > p.latest) p.latest = date;
    }
  });

  return [...map.values()].sort((a, b) => b.latest - a.latest);
}

function formatDate(date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
