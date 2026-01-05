import React, { useEffect, useState } from "react";
import { graphqlRequest } from "../../lib/api";
import { AUDIT_RATIO_QUERY } from "../../lib/queries";

export default function AuditRatio() {
  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await graphqlRequest(AUDIT_RATIO_QUERY);        
        if (data.user && data.user.length > 0) {
          setAuditData(data.user[0]);
        }
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
        <h3 className="text-base font-medium text-slate-300 mb-3">Audit Ratio</h3>
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

  if (!auditData) {
    return (
      <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-5">
        <h3 className="text-base font-medium text-slate-300 mb-3">Audit Ratio</h3>
        <div className="text-sm text-slate-400">No audit data available</div>
      </div>
    );
  }

  const { auditRatio, totalUp, totalDown } = auditData;
  const ratio = parseFloat(auditRatio).toFixed(2);
  
  const total = totalUp + totalDown;
  const upPercentage = total > 0 ? (totalUp / total) * 100 : 50;
  const downPercentage = total > 0 ? (totalDown / total) * 100 : 50;

  const getRatioColor = (ratio) => {
    if (ratio >= 1) return "text-emerald-500";
    if (ratio >= 0.6) return "text-amber-500";
    return "text-red-500";
  };

  const formatBytes = (bytes) => {
    return (bytes / 1000000).toFixed(2);
  };

  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-5">
      <h3 className="text-base font-medium text-slate-300 mb-4">Audit Ratio</h3>

      <div className="text-center mb-6">
        <div className={`text-5xl font-bold ${getRatioColor(ratio)}`}>
          {ratio}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {ratio >= 1 ? "Great! You're giving back" : ratio >= 0.6 ? "Almost there" : "Need more audits done"}
        </div>
      </div>

      <svg width="100%" height="120" className="mb-4">
        <g>
          <text x="0" y="20" className="text-xs fill-slate-400">
            Done (You audited)
          </text>
          <rect
            x="0"
            y="30"
            width={`${upPercentage}%`}
            height="25"
            className="fill-cyan-500"
            rx="4"
          />
          <text x="10" y="48" className="text-xs fill-slate-950 font-semibold">
            {formatBytes(totalUp)} MB
          </text>
        </g>

        <g>
          <text x="0" y="80" className="text-xs fill-slate-400">
            Received (Others audited you)
          </text>
          <rect
            x="0"
            y="90"
            width={`${downPercentage}%`}
            height="25"
            className="fill-violet-500"
            rx="4"
          />
          <text x="10" y="108" className="text-xs fill-slate-950 font-semibold">
            {formatBytes(totalDown)} MB
          </text>
        </g>
      </svg>

      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-700/40">
        <div className="text-center">
          <div className="text-xs text-slate-500 mb-1">Audits Done</div>
          <div className="text-lg font-semibold text-cyan-400">
            {formatBytes(totalUp)} MB
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500 mb-1">Audits Received</div>
          <div className="text-lg font-semibold text-violet-400">
            {formatBytes(totalDown)} MB
          </div>
        </div>
      </div>
    </div>
  );
}