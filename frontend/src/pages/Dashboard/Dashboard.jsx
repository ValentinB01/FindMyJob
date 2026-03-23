import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppLayout from "../../components/layout/AppLayout";
import api from "../../services/api";
import { FileText, Settings, CheckCircle, Circle, ArrowRight, Briefcase, Wand2 } from "lucide-react";

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div
      data-testid={`stat-card-${label.toLowerCase().replace(/\s/g, "-")}`}
      className="rounded-xl p-5 flex items-center gap-4"
      style={{ background: "#12141D", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15` }}
      >
        <Icon size={20} style={{ color }} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "#64748B" }}>
          {label}
        </p>
        <p className="text-white font-semibold text-lg mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function SetupStep({ done, icon: Icon, title, description, action, to, testId }) {
  const navigate = useNavigate();
  return (
    <div
      data-testid={testId}
      className="flex items-start gap-4 p-4 rounded-xl transition-colors duration-200"
      style={{
        background: done ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${done ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)"}`,
      }}
    >
      <div className="flex-shrink-0 mt-0.5">
        {done ? (
          <CheckCircle size={20} style={{ color: "#10B981" }} />
        ) : (
          <Circle size={20} style={{ color: "#64748B" }} />
        )}
      </div>
      <div className="flex-1">
        <p className="text-white text-sm font-medium">{title}</p>
        <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{description}</p>
      </div>
      {!done && (
        <button
          onClick={() => navigate(to)}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg flex-shrink-0 transition-colors duration-200"
          style={{ background: "rgba(0,122,255,0.15)", color: "#60A5FA" }}
        >
          {action}
          <ArrowRight size={12} />
        </button>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [cvExists, setCvExists] = useState(false);
  const [prefsExist, setPrefsExist] = useState(false);
  const [sourcesReady, setSourcesReady] = useState(false);

  useEffect(() => {
    api.get("/cv/profile/").then(() => setCvExists(true)).catch(() => {});
    api.get("/preferences/").then((r) => {
      setPrefsExist(!!r.data.preferred_title);
    }).catch(() => {});
    api.get("/preferences/sources/").then((r) => {
      setSourcesReady(r.data.some((s) => s.is_enabled));
    }).catch(() => {});
  }, []);

  const setupDone = [cvExists, prefsExist, sourcesReady].filter(Boolean).length;

  return (
    <AppLayout>
      <div data-testid="dashboard-page" className="max-w-4xl">
        {/* Welcome */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#007AFF", letterSpacing: "0.2em" }}>
            Welcome back
          </p>
          <h2
            className="text-3xl font-light text-white"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {user?.full_name?.split(" ")[0] || "there"}
          </h2>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>
            Let's get your job search set up.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={FileText} label="CV Status" value={cvExists ? "Uploaded" : "Not uploaded"} color="#007AFF" />
          <StatCard icon={Settings} label="Preferences" value={prefsExist ? "Configured" : "Not set"} color="#00E5FF" />
          <StatCard icon={Briefcase} label="Job Matches" value="Coming soon" color="#10B981" />
        </div>

        {/* Setup checklist */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{ background: "#12141D", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>
                Setup Checklist
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>
                {setupDone} of 3 steps complete
              </p>
            </div>
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-colors duration-300"
                  style={{ background: i < setupDone ? "#10B981" : "rgba(255,255,255,0.1)" }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <SetupStep
              testId="setup-cv"
              done={cvExists}
              icon={FileText}
              title="Upload your CV"
              description="Upload a PDF – we'll extract your skills and experience automatically."
              action="Upload now"
              to="/cv"
            />
            <SetupStep
              testId="setup-prefs"
              done={prefsExist}
              icon={Settings}
              title="Set job preferences"
              description="Tell us your target role, location, and seniority level."
              action="Set preferences"
              to="/preferences"
            />
            <SetupStep
              testId="setup-sources"
              done={sourcesReady}
              icon={Briefcase}
              title="Configure job sources"
              description="Choose which job boards Agent 1 should search."
              action="Configure sources"
              to="/preferences"
            />
          </div>
        </div>

        {/* Agents preview (stubs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: Briefcase,
              title: "Agent 1 – Job Finder",
              desc: "Searches Adzuna, RemoteOK, Arbeitnow & HN daily. Coming in Epic 4.",
              color: "#007AFF",
            },
            {
              icon: Wand2,
              title: "Agent 2 – CV Tailor",
              desc: "Rewrites your CV and writes cover letters per listing. Coming in Epic 5.",
              color: "#00E5FF",
            },
          ].map((a) => (
            <div
              key={a.title}
              data-testid={`agent-card-${a.title.split("–")[0].trim().toLowerCase().replace(/\s/g, "-")}`}
              className="rounded-xl p-5"
              style={{ background: "#12141D", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${a.color}15` }}
              >
                <a.icon size={18} style={{ color: a.color }} strokeWidth={1.5} />
              </div>
              <p className="text-white font-semibold text-sm mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
                {a.title}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
