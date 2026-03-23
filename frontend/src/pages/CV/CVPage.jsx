import { useState, useEffect, useRef } from "react";
import AppLayout from "../../components/layout/AppLayout";
import api from "../../services/api";
import { toast } from "sonner";
import { Upload, FileText, X, Plus, Loader2, Save, CheckCircle } from "lucide-react";

const inputClass = "w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none transition-colors duration-200 placeholder-slate-500";
const inputStyle = { background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)" };
const inputFocus = (e) => { e.target.style.border = "1px solid rgba(0,122,255,0.6)"; };
const inputBlur = (e) => { e.target.style.border = "1px solid rgba(255,255,255,0.1)"; };

function TagList({ tags, onAdd, onRemove, placeholder }) {
  const [input, setInput] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (input.trim()) { onAdd(input.trim()); setInput(""); }
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full"
            style={{ background: "rgba(0,122,255,0.15)", color: "#60A5FA", border: "1px solid rgba(0,122,255,0.25)" }}
          >
            {t}
            <button type="button" onClick={() => onRemove(i)}>
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
          style={inputStyle}
          onFocus={inputFocus}
          onBlur={inputBlur}
        />
        <button
          type="submit"
          className="px-3 py-2 rounded-lg text-sm flex items-center gap-1 flex-shrink-0 transition-colors duration-200"
          style={{ background: "rgba(0,122,255,0.15)", color: "#60A5FA" }}
        >
          <Plus size={14} />
        </button>
      </form>
    </div>
  );
}

export default function CVPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    api.get("/cv/profile/")
      .then((r) => setProfile(r.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.name.endsWith(".pdf")) { toast.error("Only PDF files accepted."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("File must be under 5 MB."); return; }
    const fd = new FormData();
    fd.append("file", file);
    setUploading(true);
    try {
      const r = await api.post("/cv/upload/", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setProfile(r.data);
      toast.success("CV uploaded and parsed successfully!");
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await api.patch("/cv/profile/update/", {
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        summary: profile.summary,
        skills: profile.skills,
        work_experience: profile.work_experience,
        education: profile.education,
      });
      setProfile(r.data);
      toast.success("CV saved successfully!");
    } catch {
      toast.error("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const upd = (field, value) => setProfile((p) => ({ ...p, [field]: value }));

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
      <div data-testid="cv-page" className="max-w-5xl">
        {!profile ? (
          /* -------- Upload zone -------- */
          <div>
            <p className="text-xs uppercase tracking-widest mb-6" style={{ color: "#007AFF", letterSpacing: "0.2em" }}>
              Step 1 of 3
            </p>
            <h2 className="text-2xl font-light text-white mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
              Upload your CV
            </h2>
            <p className="text-sm mb-8" style={{ color: "#64748B" }}>
              Upload a PDF (max 5 MB). We'll extract your info automatically.
            </p>
            <div
              data-testid="cv-upload-zone"
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-colors duration-200"
              style={{
                background: dragging ? "rgba(0,122,255,0.08)" : "rgba(0,122,255,0.03)",
                border: `2px dashed ${dragging ? "#007AFF" : "rgba(0,122,255,0.3)"}`,
                padding: "5rem 2rem",
              }}
            >
              <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
              {uploading ? (
                <Loader2 size={40} className="animate-spin mb-4" style={{ color: "#007AFF" }} />
              ) : (
                <Upload size={40} className="mb-4" style={{ color: dragging ? "#007AFF" : "#3B82F6" }} strokeWidth={1.5} />
              )}
              <p className="text-white font-medium mb-1">{uploading ? "Parsing your CV..." : "Drop your PDF here"}</p>
              <p className="text-sm" style={{ color: "#64748B" }}>
                {uploading ? "Extracting skills and experience" : "or click to browse files"}
              </p>
            </div>
          </div>
        ) : (
          /* -------- Edit form -------- */
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={16} style={{ color: "#10B981" }} />
                  <p className="text-xs uppercase tracking-widest" style={{ color: "#10B981", letterSpacing: "0.2em" }}>
                    CV Uploaded
                  </p>
                </div>
                <h2 className="text-2xl font-light text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Edit your CV data
                </h2>
                <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
                  Review and correct any parsing errors.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  data-testid="reupload-btn"
                  onClick={() => setProfile(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  Re-upload
                </button>
                <button
                  data-testid="save-cv-btn"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                  style={{ background: "#007AFF", color: "#fff" }}
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-5">
                <div className="rounded-xl p-5" style={{ background: "#12141D", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h3 className="text-white font-medium text-sm mb-4">Personal Info</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs mb-1.5" style={{ color: "#64748B" }}>Full Name</label>
                      <input data-testid="cv-fullname" className={inputClass} style={inputStyle} value={profile.full_name} onChange={(e) => upd("full_name", e.target.value)} onFocus={inputFocus} onBlur={inputBlur} placeholder="Jane Smith" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1.5" style={{ color: "#64748B" }}>Email</label>
                      <input data-testid="cv-email" type="email" className={inputClass} style={inputStyle} value={profile.email} onChange={(e) => upd("email", e.target.value)} onFocus={inputFocus} onBlur={inputBlur} placeholder="jane@example.com" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1.5" style={{ color: "#64748B" }}>Phone</label>
                      <input data-testid="cv-phone" className={inputClass} style={inputStyle} value={profile.phone} onChange={(e) => upd("phone", e.target.value)} onFocus={inputFocus} onBlur={inputBlur} placeholder="+1 555 0123" />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-5" style={{ background: "#12141D", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h3 className="text-white font-medium text-sm mb-4">Summary</h3>
                  <textarea
                    data-testid="cv-summary"
                    rows={4}
                    className={inputClass}
                    style={{ ...inputStyle, resize: "vertical" }}
                    value={profile.summary}
                    onChange={(e) => upd("summary", e.target.value)}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                    placeholder="Brief professional summary..."
                  />
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-5">
                <div className="rounded-xl p-5" style={{ background: "#12141D", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h3 className="text-white font-medium text-sm mb-4">Skills</h3>
                  <TagList
                    tags={profile.skills || []}
                    onAdd={(t) => upd("skills", [...(profile.skills || []), t])}
                    onRemove={(i) => upd("skills", profile.skills.filter((_, idx) => idx !== i))}
                    placeholder="Add a skill..."
                  />
                </div>

                <div className="rounded-xl p-5" style={{ background: "#12141D", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium text-sm">Work Experience</h3>
                    <button
                      data-testid="add-experience-btn"
                      onClick={() => upd("work_experience", [...(profile.work_experience || []), { role: "", company: "", period: "", description: "" }])}
                      className="text-xs px-2 py-1 rounded-lg transition-colors duration-200"
                      style={{ background: "rgba(0,122,255,0.1)", color: "#60A5FA" }}
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(profile.work_experience || []).map((exp, i) => (
                      <div key={i} className="p-3 rounded-lg space-y-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div className="flex gap-2">
                          <input className={inputClass} style={inputStyle} value={exp.role} onChange={(e) => { const ex = [...profile.work_experience]; ex[i].role = e.target.value; upd("work_experience", ex); }} onFocus={inputFocus} onBlur={inputBlur} placeholder="Role" />
                          <button onClick={() => upd("work_experience", profile.work_experience.filter((_, j) => j !== i))} style={{ color: "#64748B" }}><X size={14} /></button>
                        </div>
                        <input className={inputClass} style={inputStyle} value={exp.company} onChange={(e) => { const ex = [...profile.work_experience]; ex[i].company = e.target.value; upd("work_experience", ex); }} onFocus={inputFocus} onBlur={inputBlur} placeholder="Company" />
                        <input className={inputClass} style={inputStyle} value={exp.period} onChange={(e) => { const ex = [...profile.work_experience]; ex[i].period = e.target.value; upd("work_experience", ex); }} onFocus={inputFocus} onBlur={inputBlur} placeholder="Period (e.g. 2022–2024)" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
