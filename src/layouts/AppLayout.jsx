import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  Calendar,
  CreditCard,
  Gauge,
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
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationsContext";
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
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markRead } = useNotifications();
  const navigate = useNavigate();
  const [accountOpen, setAccountOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const workspaceName = user.company || "AIN SaaS";
  const notificationsPath = nav.find((item) => item.id === "notifications")?.path;

  const handleLogout = () => {
    logout();
    window.location.replace("/choose");
  };

  const openNotifications = () => {
    setAccountOpen(false);
    setNotifOpen((value) => !value);
  };

  const openAccount = () => {
    setNotifOpen(false);
    setAccountOpen((value) => !value);
  };

  const handleNotificationClick = (item) => {
    markRead(item.id);
    setNotifOpen(false);
    navigate(item.target);
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
            <button className="stitch-icon-button" onClick={toggleTheme} type="button" aria-label="Toggle theme"><Moon size={22} /></button>
            <button
              className={unreadCount > 0 ? "stitch-icon-button has-dot" : "stitch-icon-button"}
              onClick={openNotifications}
              type="button"
              aria-label="Notifications"
              aria-expanded={notifOpen}
            >
              <Bell size={22} />
            </button>
            <span className="stitch-divider" />
            <button className="stitch-profile" onClick={openAccount} type="button" aria-expanded={accountOpen}>
              <i>{user.name.slice(0, 2).toUpperCase()}</i>
              <span>
                <strong>{user.name}</strong>
                <small>{user.role}</small>
              </span>
            </button>
          </div>

          {notifOpen && (
            <div className="stitch-notification-menu">
              <div className="stitch-notification-menu-head">
                <strong>الإشعارات</strong>
                {unreadCount > 0 && <span className="stitch-unread-pill">{unreadCount} غير مقروء</span>}
              </div>
              {notifications.length === 0 ? (
                <div className="stitch-notification-menu-empty">لا توجد إشعارات حالياً</div>
              ) : (
                <div className="stitch-notification-menu-list">
                  {notifications.slice(0, 5).map((item) => (
                    <button
                      className={item.unread ? "stitch-notification-menu-item is-unread" : "stitch-notification-menu-item"}
                      key={item.id}
                      type="button"
                      onClick={() => handleNotificationClick(item)}
                    >
                      <span className="stitch-notification-menu-dot" aria-hidden="true" />
                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.body}</small>
                        <small className="stitch-notification-menu-time">{item.time}</small>
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {notificationsPath && (
                <NavLink className="stitch-notification-menu-viewall" to={notificationsPath} onClick={() => setNotifOpen(false)}>
                  عرض كل الإشعارات
                </NavLink>
              )}
            </div>
          )}

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
