import React, { useEffect, useState } from "react";
import { graphqlRequest } from "../../lib/api";
import { PROJECT_PASS_FAIL_QUERY } from "../../lib/queries";
import { logout } from "../../lib/auth";

export default function ProjectPassFail() {
  const [stats, setStats] = useState({ pass: 0, fail: 0, passedProjects: [], failedProjects: [] });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await graphqlRequest(PROJECT_PASS_FAIL_QUERY);
        
        const passFailStats = calculatePassFail(data.result || []);
        setStats(passFailStats);
      } catch (e) {
        logout();
        setErr(e.message);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-5">
        <h3 className="text-base font-medium text-slate-300 mb-3">Projects PASS/FAIL Ratio</h3>
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

  const size = 200;
  const strokeWidth = 30;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const passOffset = circumference - (passPercentage / 100) * circumference;
  const failOffset = circumference - (failPercentage / 100) * circumference;

  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-5">
      <h3 className="text-base font-medium text-slate-300 mb-4">Projects PASS/FAIL Ratio</h3>

      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(51, 65, 85, 0.3)"
              strokeWidth={strokeWidth}
            />
            
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#ef4444"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={failOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#10b981"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={passOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-slate-200">
              {successRate}%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Success Rate
            </div>
          </div>
        </div>

        <div className="flex gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <div className="text-sm">
              <span className="text-slate-400">PASS:</span>
              <span className="text-slate-200 font-semibold ml-1">{stats.pass}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="text-sm">
              <span className="text-slate-400">FAIL:</span>
              <span className="text-slate-200 font-semibold ml-1">{stats.fail}</span>
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-700/40">
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">Total Projects</div>
            <div className="text-xl font-semibold text-slate-300">{total}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">Success Rate</div>
            <div className="text-xl font-semibold text-emerald-400">{successRate}%</div>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-4 px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-300 transition-colors"
        >
          {showDetails ? "Hide Details" : "Show Project Details"}
        </button>

        {showDetails && (
          <div className="w-full mt-4 space-y-4 custom-scrollbar">
            {stats.passedProjects.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-emerald-400 mb-2">
                  Passed Projects ({stats.passedProjects.length})
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {stats.passedProjects.map((project, i) => (
                    <div
                      key={i}
                      className="text-xs text-slate-300 px-3 py-1.5 bg-emerald-500/10 rounded border border-emerald-500/20"
                    >
                      {project}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats.failedProjects.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-400 mb-2">
                  Failed Projects ({stats.failedProjects.length})
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {stats.failedProjects.map((project, i) => (
                    <div
                      key={i}
                      className="text-xs text-slate-300 px-3 py-1.5 bg-red-500/10 rounded border border-red-500/20"
                    >
                      {project}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function calculatePassFail(resultData) {
  const projectResults = new Map();

  resultData.forEach(({ grade, objectId, object }) => {
    if (!object?.name || objectId === null) return;
    
    if (!projectResults.has(objectId)) {
      projectResults.set(objectId, { name: object.name, grade });
    } else {
      const current = projectResults.get(objectId);
      if (grade > current.grade) {
        projectResults.set(objectId, { name: object.name, grade });
      }
    }
  });

  let pass = 0;
  let fail = 0;
  const passedProjects = [];
  const failedProjects = [];

  projectResults.forEach(({ name, grade }) => {
    if (grade >= 1) {
      pass++;
      passedProjects.push(name);
    } else {
      fail++;
      failedProjects.push(name);
    }
  });

  passedProjects.sort();
  failedProjects.sort();

  return { pass, fail, passedProjects, failedProjects };
}