import { useEffect, useState } from "react";
import { AUDIT_HISTORY_QUERY } from "../../lib/queries";
import { graphqlRequest } from "../../lib/api";
import { logout } from "../../lib/auth";

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

function projectFromPath(path) {
  return path?.split("/").filter(Boolean).pop() || "unknown";
}

export default function AuditHistory() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await graphqlRequest(AUDIT_HISTORY_QUERY);
      if (!data || !data.transaction) {
        setLoading(false);
        logout();
        return;
      }
      setAudits(data.transaction || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-5">
        Loading audit history…
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-5">
      <div className="text-base font-medium text-slate-300 mb-4">
        Audit History
      </div>

      <ul className="divide-y divide-slate-700/40 max-h-105 overflow-y-auto custom-scrollbar pr-2">
        {audits.map((a, i) => (
          <li
            key={i}
            className="flex items-center gap-4 py-3 text-sm"
          >
            <div
              className={`w-6 text-center font-semibold ${
                a.type === "up"
                  ? "text-sky-400"
                  : "text-red-400"
              }`}
            >
              {a.type === "up" ? "↑" : "↓"}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-slate-200 truncate">
                {projectFromPath(a.path)}
              </div>
              <div className="text-[11px] text-slate-500">
                {formatDate(new Date(a.createdAt))}
              </div>
            </div>

            <div
              className={`text-sm font-medium ${
                a.type === "up"
                  ? "text-sky-300"
                  : "text-red-300"
              }`}
            >
              {a.amount.toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
