import { useLocation } from "react-router-dom";

const PAGE_TITLES = {
  "/dashboard": { title: "Dashboard", subtitle: "Your job search overview" },
  "/cv": { title: "My CV", subtitle: "Upload and manage your CV" },
  "/preferences": { title: "Preferences", subtitle: "Job search settings & sources" },
  "/jobs": { title: "Job Listings", subtitle: "AI-matched opportunities" },
  "/tailor": { title: "CV Tailor", subtitle: "Tailor your CV for each role" },
};

export default function TopBar() {
  const { pathname } = useLocation();
  const page = PAGE_TITLES[pathname] || { title: "Job Hunt Duo", subtitle: "" };

  return (
    <header
      data-testid="topbar"
      className="h-16 flex items-center px-8"
      style={{
        background: "rgba(11,15,25,0.8)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div>
        <h1
          className="text-white font-semibold text-lg leading-tight"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>
            {page.subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
