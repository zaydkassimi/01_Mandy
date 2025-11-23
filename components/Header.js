import { useEffect, useState } from "react";
import { Home, Calendar, LogOut, DownloadCloud, LogIn } from "lucide-react";
import Button from "./ui/Button";
import Card from "./ui/Card";

export default function Header() {
  const [settings, setSettings] = useState({ siteTitle: "Staff Scheduler", logo: null });
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => { if (d.ok) setSettings(d.settings || {}); });
    fetch("/api/me").then((r) => r.json()).then((d) => { if (d.ok) setUser(d.user); });
  }, []);

  return (
    <header className="site-header">
      <div className="site-container">
        {settings.logo ? <img src={settings.logo} alt="logo" className="site-logo" /> : <img src="/logo.webp" alt="logo" className="site-logo" />}
        <div className="site-title">{settings.siteTitle || "Staff Scheduler"}</div>

        <nav className="site-nav" aria-label="Main navigation">
          {user && user.role === "admin" ? (
            <>
              <a href="/admin" className="nav-link inline-flex items-center gap-2">Dashboard</a>
              <a href="/admin/availability" className="nav-link inline-flex items-center gap-2">Availability</a>
              <a href="/admin/staff" className="nav-link inline-flex items-center gap-2">Staff</a>
              <a href="/admin/shifts" className="nav-link inline-flex items-center gap-2">Shifts</a>
              <a href="/admin/expenses" className="nav-link inline-flex items-center gap-2">Expenses</a>
              <a href="/admin/reports" className="nav-link inline-flex items-center gap-2">Reports</a>
              <a href="/admin/export" className="nav-link inline-flex items-center gap-2"><DownloadCloud size={16} />Export</a>
            </>
          ) : (
            <>
              <a href="/calendar" className="nav-link inline-flex items-center gap-2"><Calendar size={16} />Calendar</a>
              <a href="/checkin" className="nav-link inline-flex items-center gap-2"><DownloadCloud size={16} />Check In</a>
              <a href="/expenses" className="nav-link inline-flex items-center gap-2">Expenses</a>
            </>
          )}
          {user ? (
            <Button as="a" href="/api/auth/logout" className="nav-signout inline-flex items-center gap-2"><LogOut size={16} /> Logout</Button>
          ) : (
            <a href="/login" className="nav-link inline-flex items-center gap-2"><LogIn size={16} />Sign in</a>
          )}
        </nav>
      </div>
    </header>
  );
}


