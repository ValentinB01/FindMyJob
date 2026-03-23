import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Briefcase,
  Wand2,
  LogOut,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/cv", icon: FileText, label: "My CV" },
  { to: "/preferences", icon: Settings, label: "Preferences" },
  { divider: true },
  { to: "/jobs", icon: Briefcase, label: "Job Listings", soon: true },
  { to: "/tailor", icon: Wand2, label: "CV Tailor", soon: true },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <aside
      data-testid="sidebar"
      className="w-64 h-screen fixed left-0 top-0 flex flex-col z-20"
      style={{
        background: "#0B0F19",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#007AFF" }}>
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
            Job Hunt Duo
          </p>
          <p className="text-xs" style={{ color: "#64748B" }}>AI-Powered Search</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item, i) => {
          if (item.divider) {
            return (
              <div
                key={`div-${i}`}
                className="my-3 mx-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              />
            );
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-white"
                    : item.soon
                    ? "text-slate-600 cursor-not-allowed pointer-events-none"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`
              }
              style={({ isActive }) =>
                isActive ? { background: "rgba(0,122,255,0.15)", color: "#60A5FA" } : {}
              }
              onClick={(e) => item.soon && e.preventDefault()}
            >
              <item.icon size={18} strokeWidth={1.5} />
              <span>{item.label}</span>
              {item.soon && (
                <span
                  className="ml-auto text-xs px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#64748B" }}
                >
                  Soon
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
            style={{ background: "rgba(0,122,255,0.2)", color: "#60A5FA" }}
          >
            {user?.full_name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.full_name}</p>
            <p className="text-xs truncate" style={{ color: "#64748B" }}>{user?.email}</p>
          </div>
        </div>
        <button
          data-testid="logout-button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-200"
          style={{ color: "#64748B" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#EF4444";
            e.currentTarget.style.background = "rgba(239,68,68,0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#64748B";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
