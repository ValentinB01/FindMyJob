import { useState, useEffect } from "react";
import AppLayout from "../../components/layout/AppLayout";
import api from "../../services/api";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

const SOURCES = [
  { key: "adzuna", label: "Adzuna", description: "UK-origin global job board with rich metadata including salary ranges.", url: "adzuna.com" },
  { key: "remoteok", label: "RemoteOK", description: "Focused on fully remote tech jobs worldwide. Free public API.", url: "remoteok.com" },
  { key: "arbeitnow", label: "Arbeitnow", description: "EU-focused job board with structured JSON feed. Visa-friendly listings.", url: "arbeitnow.com" },
  { key: "hn_hiring", label: "HN Who's Hiring", description: "Monthly Hacker News thread – early-stage startups and engineering roles.", url: "news.ycombinator.com" },
];

const WORK_TYPES = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];
const SENIORITY = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid-level" },
  { value: "senior", label: "Senior" },
];

const inputClass = "w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none transition-colors duration-200 placeholder-slate-500";
const inputStyle = { background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)" };
const inputFocus = (e) => { e.target.style.border = "1px solid rgba(0,122,255,0.6)"; };
const inputBlur = (e) => { e.target.style.border = "1px solid rgba(255,255,255,0.1)"; };

export default function PreferencesPage() {
  const [prefs, setPrefs] = useState({ preferred_title: "", location: "", work_type: "remote", seniority: "junior" });
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    Promise.all([api.get("/preferences/"), api.get("/preferences/sources/")])
      .then(([p, s]) => {
        setPrefs(p.data);
        setSources(s.data);
      })
      .catch(() => toast.error("Failed to load preferences."))
      .finally(() => setLoading(false));
  }, []);

  const savePrefs = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await api.put("/preferences/", prefs);
      setPrefs(r.data);
      toast.success("Preferences saved!");
    } catch {
      toast.error("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  const toggleSource = async (sourceKey) => {
    setToggling(sourceKey);
    try {
      const r = await api.patch(`/preferences/sources/${sourceKey}/toggle/`);
      setSources((prev) => prev.map((s) => (s.source === sourceKey ? r.data : s)));
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Cannot disable this source.");
    } finally {
      setToggling(null);
    }
  };

  const upd = (k, v) => setPrefs((p) => ({ ...p, [k]: v }));

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 size={24} className="animate-spin" style={{ color: "#007AFF" }} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div data-testid="preferences-page" className="max-w-3xl space-y-8">
        {/* Job Preferences */}
        <div className="rounded-2xl p-6" style={{ background: "#12141D", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h3 className="text-white font-semibold mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
            Job Preferences
          </h3>
          <p className="text-xs mb-6" style={{ color: "#64748B" }}>
            These settings guide Agent 1 when searching for relevant listings.
          </p>

          <form data-testid="preferences-form" onSubmit={savePrefs} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#94A3B8" }}>
                  Preferred Job Title
                </label>
                <input
                  data-testid="pref-title"
                  className={inputClass}
                  style={inputStyle}
                  value={prefs.preferred_title}
                  onChange={(e) => upd("preferred_title", e.target.value)}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  placeholder="e.g. Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#94A3B8" }}>
                  Location
                </label>
                <input
                  data-testid="pref-location"
                  className={inputClass}
                  style={inputStyle}
                  value={prefs.location}
                  onChange={(e) => upd("location", e.target.value)}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  placeholder="e.g. London, UK or Remote"
                />
              </div>
            </div>

            {/* Work type */}
            <div>
              <label className="block text-xs font-medium mb-3" style={{ color: "#94A3B8" }}>
                Work Type
              </label>
              <div className="flex gap-3 flex-wrap" data-testid="work-type-group">
                {WORK_TYPES.map((wt) => (
                  <button
                    type="button"
                    key={wt.value}
                    data-testid={`work-type-${wt.value}`}
                    onClick={() => upd("work_type", wt.value)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    style={
                      prefs.work_type === wt.value
                        ? { background: "#007AFF", color: "#fff" }
                        : { background: "rgba(255,255,255,0.04)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.08)" }
                    }
                  >
                    {wt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Seniority */}
            <div>
              <label className="block text-xs font-medium mb-3" style={{ color: "#94A3B8" }}>
                Seniority Level
              </label>
              <div className="flex gap-3 flex-wrap" data-testid="seniority-group">
                {SENIORITY.map((s) => (
                  <button
                    type="button"
                    key={s.value}
                    data-testid={`seniority-${s.value}`}
                    onClick={() => upd("seniority", s.value)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    style={
                      prefs.seniority === s.value
                        ? { background: "#007AFF", color: "#fff" }
                        : { background: "rgba(255,255,255,0.04)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.08)" }
                    }
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              data-testid="save-preferences-btn"
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
              style={{ background: saving ? "#1A3A6B" : "#007AFF", color: "#fff" }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </form>
        </div>

        {/* Job Sources */}
        <div className="rounded-2xl p-6" style={{ background: "#12141D", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h3 className="text-white font-semibold mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
            Job Sources
          </h3>
          <p className="text-xs mb-6" style={{ color: "#64748B" }}>
            Choose which job boards Agent 1 searches. At least one must stay active.
          </p>

          <div data-testid="sources-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SOURCES.map((src) => {
              const srcData = sources.find((s) => s.source === src.key);
              const enabled = srcData?.is_enabled ?? true;
              const isToggling = toggling === src.key;

              return (
                <div
                  key={src.key}
                  data-testid={`source-card-${src.key}`}
                  className="rounded-xl p-4 transition-colors duration-200"
                  style={{
                    background: enabled ? "rgba(0,122,255,0.05)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${enabled ? "rgba(0,122,255,0.2)" : "rgba(255,255,255,0.05)"}`,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white text-sm font-semibold">{src.label}</p>
                        <span className="text-xs" style={{ color: "#64748B" }}>
                          {src.url}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>
                        {src.description}
                      </p>
                    </div>

                    {/* Toggle */}
                    <button
                      data-testid={`toggle-${src.key}`}
                      onClick={() => toggleSource(src.key)}
                      disabled={isToggling}
                      className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
                      style={{ background: enabled ? "#007AFF" : "rgba(255,255,255,0.1)" }}
                    >
                      {isToggling ? (
                        <Loader2 size={12} className="animate-spin absolute inset-0 m-auto text-white" />
                      ) : (
                        <span
                          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200"
                          style={{ transform: enabled ? "translateX(20px)" : "translateX(0)" }}
                        />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
