import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Zap } from "lucide-react";

const BG_IMAGE =
  "https://images.pexels.com/photos/7230895/pexels-photo-7230895.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ full_name: "", email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regForm.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(regForm.email, regForm.password, regForm.full_name);
      navigate("/dashboard");
      toast.success("Welcome to Job Hunt Duo!");
    } catch (err) {
      const errs = err?.response?.data;
      const msg = errs?.email?.[0] || errs?.password?.[0] || errs?.non_field_errors?.[0] || "Registration failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg text-white text-sm outline-none transition-colors duration-200 placeholder-slate-500";
  const inputStyle = {
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.1)",
  };
  const inputFocusHandler = (e) => {
    e.target.style.border = "1px solid rgba(0,122,255,0.6)";
    e.target.style.boxShadow = "0 0 0 1px rgba(0,122,255,0.2)";
  };
  const inputBlurHandler = (e) => {
    e.target.style.border = "1px solid rgba(255,255,255,0.1)";
    e.target.style.boxShadow = "none";
  };

  return (
    <div data-testid="auth-page" className="min-h-screen flex" style={{ background: "#0B0F19" }}>
      {/* Left – hero panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(11,15,25,0.9) 0%, rgba(11,15,25,0.6) 100%)" }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#007AFF" }}>
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-white font-semibold text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>
              Job Hunt Duo
            </span>
          </div>
          <div>
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: "#007AFF", letterSpacing: "0.2em" }}
            >
              AI-Powered Job Search
            </p>
            <h2
              className="text-white font-light mb-4"
              style={{ fontFamily: "Outfit, sans-serif", fontSize: "2.25rem", lineHeight: 1.2 }}
            >
              Two AI agents.<br />One smarter job search.
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
              Agent 1 finds and scores relevant listings across multiple job boards.
              Agent 2 tailors your CV and writes cover letters for each application.
            </p>
          </div>
        </div>
      </div>

      {/* Right – auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#007AFF" }}>
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-white font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>
              Job Hunt Duo
            </span>
          </div>

          {/* Tab switcher */}
          <div
            className="flex rounded-xl p-1 mb-8"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <button
              data-testid="tab-login"
              onClick={() => setTab("login")}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
              style={
                tab === "login"
                  ? { background: "#007AFF", color: "#fff" }
                  : { color: "#64748B" }
              }
            >
              Sign In
            </button>
            <button
              data-testid="tab-register"
              onClick={() => setTab("register")}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
              style={
                tab === "register"
                  ? { background: "#007AFF", color: "#fff" }
                  : { color: "#64748B" }
              }
            >
              Create Account
            </button>
          </div>

          {/* Login form */}
          {tab === "login" && (
            <form data-testid="login-form" onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#94A3B8" }}>
                  Email address
                </label>
                <input
                  data-testid="login-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className={inputClass}
                  style={inputStyle}
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  onFocus={inputFocusHandler}
                  onBlur={inputBlurHandler}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#94A3B8" }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    data-testid="login-password"
                    type={showPw ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className={inputClass}
                    style={{ ...inputStyle, paddingRight: "3rem" }}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    onFocus={inputFocusHandler}
                    onBlur={inputBlurHandler}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#64748B" }}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                data-testid="login-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
                style={{ background: loading ? "#1A3A6B" : "#007AFF" }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}

          {/* Register form */}
          {tab === "register" && (
            <form data-testid="register-form" onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#94A3B8" }}>
                  Full name
                </label>
                <input
                  data-testid="register-name"
                  type="text"
                  required
                  placeholder="Jane Smith"
                  className={inputClass}
                  style={inputStyle}
                  value={regForm.full_name}
                  onChange={(e) => setRegForm({ ...regForm, full_name: e.target.value })}
                  onFocus={inputFocusHandler}
                  onBlur={inputBlurHandler}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#94A3B8" }}>
                  Email address
                </label>
                <input
                  data-testid="register-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className={inputClass}
                  style={inputStyle}
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  onFocus={inputFocusHandler}
                  onBlur={inputBlurHandler}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#94A3B8" }}>
                  Password <span style={{ color: "#64748B" }}>(min 8 chars)</span>
                </label>
                <div className="relative">
                  <input
                    data-testid="register-password"
                    type={showPw ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className={inputClass}
                    style={{ ...inputStyle, paddingRight: "3rem" }}
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    onFocus={inputFocusHandler}
                    onBlur={inputBlurHandler}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#64748B" }}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                data-testid="register-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
                style={{ background: loading ? "#1A3A6B" : "#007AFF" }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
