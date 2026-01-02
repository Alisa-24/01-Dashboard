import { useState } from "react";
import Layout from "../components/Layout";
import EarnedXPChart from "../components/graphs/EarnedXP";
import XpByProjectList from "../components/graphs/XpByProjectList";
import AuditRatio from "../components/graphs/AuditRatio";
import ProjectPassFail from "../components/graphs/ProjectPassFail";

function Profile({ user }) {
    const [activeSection, setActiveSection] = useState("progress");

    return (
        <Layout user={user}>
            <div className="flex justify-center gap-3 mb-6">
                <button
                    onClick={() => setActiveSection("progress")}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === "progress"
                        ? "bg-slate-700 text-white"
                        : "bg-slate-800/50 text-slate-400 hover:text-slate-300 hover:bg-slate-800"
                        }`}
                >
                    Progress Over Time
                </button>
                <button
                    onClick={() => setActiveSection("audit")}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === "audit"
                        ? "bg-slate-700 text-white"
                        : "bg-slate-800/50 text-slate-400 hover:text-slate-300 hover:bg-slate-800"
                        }`}
                >
                    Audit & Projects
                </button>
                <button
                    onClick={() => setActiveSection("piscine")}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === "piscine"
                        ? "bg-slate-700 text-white"
                        : "bg-slate-800/50 text-slate-400 hover:text-slate-300 hover:bg-slate-800"
                        }`}
                >
                    Piscine Stats
                </button>
            </div>

            {activeSection === "progress" && (
                <section className="space-y-6">
                    <EarnedXPChart />
                    <XpByProjectList />
                </section>
            )}

            {activeSection === "audit" && (
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        <AuditRatio />
                        <ProjectPassFail />
                    </div>
                </section>
            )}

            {activeSection === "piscine" && (
                <section>
                    <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-5">
                        <div className="flex justify-center gap-2 mb-4">
                            <button className="px-3 py-1.5 rounded text-xs font-medium transition-colors bg-slate-700 text-white">
                                JavaScript
                            </button>
                            <button className="px-3 py-1.5 rounded text-xs font-medium transition-colors text-slate-400 hover:text-slate-300">
                                Go
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-base font-medium text-slate-300 mb-3">PASS/FAIL Ratio</h3>
                                <div className="text-sm text-slate-400">Piscine ratio chart will go here</div>
                            </div>

                            <div>
                                <h3 className="text-base font-medium text-slate-300 mb-3">Attempts for Each Exercise</h3>
                                <div className="text-sm text-slate-400">Attempts list will go here</div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </Layout>
    );
}

export default Profile;