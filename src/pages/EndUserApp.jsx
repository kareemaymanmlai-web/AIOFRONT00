import { Bell, CalendarDays, CheckCheck, FileText, Lock, MessageSquare, Play, Shield, Video } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AccountSettings } from "../components/AccountSettings";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { useNotifications } from "../contexts/NotificationsContext";
import { AppLayout } from "../layouts/AppLayout";

const nav = [
  { id: "home", label: "Dashboard", icon: "dashboard", path: "/end-user/home" },
  { id: "files", label: "Protected Files", icon: "files", path: "/end-user/files" },
  { id: "calendar", label: "Meetings", icon: "calendar", path: "/end-user/calendar" },
  { id: "notifications", label: "Notifications", icon: "notifications", path: "/end-user/notifications" },
  { id: "settings", label: "Settings", icon: "settings", path: "/end-user/settings" }
];

export function EndUserApp({ data, user }) {
  const { page = "home" } = useParams();
  const appUser = { name: user.name, role: "مستخدم", company: user.company };

  if (!nav.some((item) => item.id === page)) {
    return <Navigate to="/end-user/home" replace />;
  }

  return (
    <AppLayout appTitle="End User" user={appUser} nav={nav}>
      {page === "home" && <UserDashboard data={data} user={user} />}
      {page === "files" && <ProtectedFiles data={data} user={user} />}
      {page === "calendar" && <MeetingsPage />}
      {page === "notifications" && <NotificationsPage />}
      {page === "settings" && <AccountSettings user={user} workspaceLabel="End User workspace" />}
    </AppLayout>
  );
}

function UserDashboard({ data, user }) {
  const { notifications } = useNotifications();
  return (
    <>
      <div className="stitch-page-head">
        <div>
          <h1>مرحباً، {user.name}</h1>
          <p>مساحتك الآمنة للوصول إلى الغرف والملفات المخصصة لك فقط.</p>
        </div>
        <Button as={Link} to="/end-user/files"><Lock size={18} /> فتح الملفات</Button>
      </div>
      <section className="stitch-user-grid">
        <div className="stitch-user-hero">
          <Badge tone="primary">غرفة مخصصة</Badge>
          <h2>فريق تطوير المنتج</h2>
          <p>المحتوى المتاح لك محمي بالكامل، مع تعطيل التحميل والتقاط الشاشة حسب سياسة الشركة.</p>
          <div>
            <span>12 ملف</span>
            <span>3 اجتماعات</span>
            <span>{notifications.filter((item) => item.unread).length} إشعارات</span>
          </div>
        </div>
        <div className="stitch-secure-card">
          <Shield size={44} />
          <strong>وصول مراقب ومشفر بالكامل</strong>
          <span>كل ملف يفتح باسمك وبعلامة مائية.</span>
        </div>
        <div className="stitch-user-list">
          <h2>أحدث الملفات</h2>
          {data.files.slice(0, 3).map((file) => (
            <Link to="/end-user/files" key={file.id}>
              <FileText size={20} />
              <span>{file.name}</span>
              <Badge tone="danger">Viewer only</Badge>
            </Link>
          ))}
        </div>
        <div className="stitch-user-list">
          <h2>النشاطات</h2>
          {notifications.slice(0, 3).map((item) => (
            <Link to={item.target} key={item.id}>
              <Bell size={20} />
              <span>{item.title}</span>
              <small>{item.time}</small>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function ProtectedFiles({ data, user }) {
  return (
    <>
      <div className="stitch-page-head">
        <div>
          <h1>عارض الملفات المحمي</h1>
          <p>تجربة قريبة من شاشة PDF/Video في Stitch: watermark، قائمة ملفات، وتحكم مشاهدة.</p>
        </div>
      </div>
      <section className="stitch-viewer-screen">
        <div className="stitch-viewer-toolbar">
          <Button variant="ghost">إغلاق العارض</Button>
          <span>1 من 24</span>
          <strong>100%</strong>
          <span>تقرير الميزانية السنوي.pdf</span>
        </div>
        <div className="stitch-document-stage">
          <div className="watermark">{user.email} / AIN / 192.168.1.42</div>
          <div className="doc-line short" />
          <div className="doc-line" />
          <div className="doc-line mid" />
          <div className="doc-boxes"><span /><span /><span /></div>
          <div className="doc-line" /><div className="doc-line" /><div className="doc-line mid" />
          <strong>PROTECTED</strong>
        </div>
        <aside className="stitch-viewer-side">
          <h2>ملفات الغرفة الآمنة</h2>
          {data.files.map((file, index) => (
            <button className={index === 0 ? "active" : ""} type="button" key={file.id}>
              <FileText size={20} />
              <span>{file.name}<small>{file.size}</small></span>
            </button>
          ))}
          <div className="stitch-security-note"><Shield size={18} /> الوصول مراقب ومشفر بالكامل</div>
        </aside>
      </section>
      <section className="stitch-video-panel">
        <Video size={36} />
        <strong>Video secure streaming</strong>
        <span>نفس سياسة الحماية تطبق على الفيديوهات مع watermark وتعطيل التحميل.</span>
        <Button variant="ghost"><Play size={16} /> Preview</Button>
      </section>
    </>
  );
}

function MeetingsPage() {
  return (
    <>
      <div className="stitch-page-head">
        <div>
          <h1>إدارة الاجتماعات</h1>
          <p>مواعيد وجلسات مرتبطة بالغرف والملفات.</p>
        </div>
      </div>
      <div className="stitch-meeting-grid">
        {["اجتماع متابعة المنتج", "جلسة تدريب الموظفين", "مراجعة سياسة الحضور"].map((title, index) => (
          <article className="stitch-meeting-card" key={title}>
            <CalendarDays size={24} />
            <h2>{title}</h2>
            <p>{index === 0 ? "اليوم 2:00 م" : "هذا الأسبوع"}</p>
            <Button variant="ghost">فتح التفاصيل</Button>
          </article>
        ))}
      </div>
    </>
  );
}

function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  return (
    <>
      <div className="stitch-page-head">
        <div>
          <h1>الإشعارات</h1>
          <p>كل إشعار يفتح المكان المرتبط به.</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllRead} variant="ghost"><CheckCheck size={16} /> تحديد الكل كمقروء</Button>
        )}
      </div>
      <div className="stitch-notification-list">
        {notifications.map((item) => (
          <Link className="stitch-notification-item" to={item.target} key={item.id} onClick={() => markRead(item.id)}>
            <MessageSquare size={22} />
            <div>
              <strong>{item.title}</strong>
              <span>{item.body}</span>
              <small>{item.time}</small>
            </div>
            <Badge tone={item.unread ? "primary" : "neutral"}>{item.unread ? "جديد" : item.type}</Badge>
          </Link>
        ))}
      </div>
    </>
  );
}
