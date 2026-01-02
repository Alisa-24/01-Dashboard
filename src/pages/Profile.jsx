import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import EarnedXPChart from "../components/graphs/EarnedXP";
import XpByProjectList from "../components/graphs/XpByProjectList";
import AuditRatio from "../components/graphs/AuditRatio";
import ProjectPassFail from "../components/graphs/ProjectPassFail";
import PiscineStats from "../components/graphs/PiscineStats";

function Profile({ user }) {
    const [activeSection, setActiveSection] = useState(() => {
        return localStorage.getItem("profileSection") || "progress";
    });
    useEffect(() => {
        localStorage.setItem("profileSection", activeSection);
    }, [activeSection]);
    


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
                    <PiscineStats />
                </section>
            )}
        </Layout>
    );
}

export default Profile;