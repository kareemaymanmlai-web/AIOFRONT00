import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  Calendar,
  CreditCard,
  Files,
  Gauge,
  Globe2,
  HelpCircle,
  Home,
  LogOut,
  Moon,
  Search,
  Settings,
  Shield,
  UserPlus,
  Users
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

const icons = {
  dashboard: Gauge,
  home: Home,
  rooms: Building2,
  files: BookOpen,
  members: Users,
  notifications: Bell,
  calendar: Calendar,
  analytics: BarChart3,
  security: Shield,
  subscription: CreditCard,
  settings: Settings,
  locked: Shield,
  invites: UserPlus
};

export function AppLayout({ appTitle, user, nav, children }) {
  const { logout } = useAuth();
  const { t, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [accountOpen, setAccountOpen] = useState(false);
  const workspaceName = user.company || "AIN SaaS";

  const handleLogout = () => {
    logout();
    window.location.replace("/choose");
  };

  return (
    <div className="stitch-shell" dir="rtl">
      <aside className="stitch-sidebar">
        <div className="stitch-brand">
          <div className="stitch-brand-icon"><Building2 size={23} /></div>
          <div>
            <strong>AIN SaaS</strong>
            <span>{workspaceName}</span>
          </div>
        </div>

        <nav className="stitch-nav" aria-label={`${appTitle} navigation`}>
          {nav.map((item) => {
            const Icon = icons[item.icon] || Gauge;
            return (
              <NavLink className={({ isActive }) => isActive ? "stitch-nav-item active" : "stitch-nav-item"} key={item.id} to={item.path}>
                <Icon size={22} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="stitch-sidebar-bottom">
          <NavLink className="stitch-nav-item" to={nav.find((item) => item.id === "settings")?.path || "#"}>
            <HelpCircle size={22} />
            <span>Help Center</span>
          </NavLink>
          {appTitle !== "End User" && <button className="stitch-upgrade" type="button">Upgrade Plan</button>}
        </div>
      </aside>

      <main className="stitch-main">
        <header className="stitch-topbar">
          <div className="stitch-search">
            <Search size={22} />
            <input placeholder="ابحث عن الغرف، الملفات، أو الأعضاء..." />
          </div>

          <div className="stitch-top-actions">
            <button className="stitch-lang-toggle" onClick={toggleLanguage} type="button" aria-label="Change language">{t.language}<Globe2 size={18} /></button>
            <button className="stitch-icon-button" onClick={toggleTheme} type="button" aria-label="Toggle theme"><Moon size={22} /></button>
            <button className="stitch-icon-button has-dot" type="button" aria-label="Notifications"><Bell size={22} /></button>
            <span className="stitch-divider" />
            <button className="stitch-profile" onClick={() => setAccountOpen((value) => !value)} type="button">
              <i>{user.name.slice(0, 2).toUpperCase()}</i>
              <span>
                <strong>{user.name}</strong>
                <small>{user.role}</small>
              </span>
            </button>
          </div>

          {accountOpen && (
            <div className="stitch-account-menu">
              <div className="stitch-account-head">
                <i>{user.name.slice(0, 2).toUpperCase()}</i>
                <div>
                  <strong>{user.name}</strong>
                  <span>{theme === "dark" ? "Dark mode" : "Light mode"} / Online</span>
                </div>
              </div>
              <NavLink to={nav.find((item) => item.id === "settings")?.path || "#"}>Settings</NavLink>
              <button onClick={toggleTheme} type="button">Themes</button>
              <button onClick={handleLogout} type="button"><LogOut size={16} /> Log out</button>
            </div>
          )}
        </header>

        <div className="stitch-content">
          {children}
        </div>

        <footer className="stitch-footer">
          <div>
            <strong>AIN SaaS</strong>
            <span>© 2026 AIN SaaS Solutions. جميع الحقوق محفوظة.</span>
          </div>
          <nav>
            <a href="/privacy">سياسة الخصوصية</a>
            <a href="/terms">شروط الخدمة</a>
            <a href="/support">الدعم الفني</a>
          </nav>
        </footer>
      </main>
    </div>
  );
}
