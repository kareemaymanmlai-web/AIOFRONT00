import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CheckCheck,
  Cloud,
  CloudUpload,
  Download,
  Eye,
  FileText,
  Filter,
  Grid2X2,
  Lock,
  MoreVertical,
  Plus,
  Rocket,
  Search,
  Shield,
  Smartphone,
  Trash2,
  UserPlus,
  Users
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AccountSettings } from "../components/AccountSettings";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { FormField } from "../components/FormField";
import { Modal } from "../components/Modal";
import { useNotifications } from "../contexts/NotificationsContext";
import { AppLayout } from "../layouts/AppLayout";
import { api } from "../services/api";

const nav = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", path: "/tenant-admin/dashboard" },
  { id: "rooms", label: "Rooms", icon: "rooms", path: "/tenant-admin/rooms" },
  { id: "files", label: "Content Library", icon: "files", path: "/tenant-admin/files" },
  { id: "members", label: "Members", icon: "members", path: "/tenant-admin/members" },
  { id: "notifications", label: "Notifications", icon: "notifications", path: "/tenant-admin/notifications" },
  { id: "analytics", label: "Analytics", icon: "analytics", path: "/tenant-admin/analytics" },
  { id: "security", label: "Security", icon: "security", path: "/tenant-admin/security" },
  { id: "subscription", label: "Subscriptions", icon: "subscription", path: "/tenant-admin/subscription" },
  { id: "settings", label: "Settings", icon: "settings", path: "/tenant-admin/settings" }
];

export function TenantAdminApp({ data, user }) {
  const { page = "dashboard" } = useParams();
  const appUser = { name: user.name, role: "مدير النظام", company: user.company };

  if (!nav.some((item) => item.id === page)) {
    return <Navigate to="/tenant-admin/dashboard" replace />;
  }

  return (
    <AppLayout appTitle="Tenant Admin" user={appUser} nav={nav}>
      {page === "dashboard" && <Dashboard data={data} />}
      {page === "rooms" && <RoomsPage rooms={data.rooms} />}
      {page === "files" && <ContentLibrary files={data.files} />}
      {page === "members" && <MembersPage members={data.members} />}
      {page === "notifications" && <NotificationsPage />}
      {page === "analytics" && <AnalyticsPage />}
      {page === "security" && <SecurityPage />}
      {page === "subscription" && <SubscriptionPage />}
      {page === "settings" && <AccountSettings user={user} workspaceLabel="Tenant Admin workspace" />}
    </AppLayout>
  );
}

function Dashboard({ data }) {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <div className="stitch-page-head">
        <div>
          <h1>مرحباً، TechCorp Egypt</h1>
          <p>إليك ملخص أداء منظومتك لهذا اليوم.</p>
        </div>
        <Button onClick={() => setInviteOpen(true)}><Plus size={18} /> إجراء سريع</Button>
      </div>

      <section className="stitch-stat-grid five">
        <StatCard title="الغرف النشطة" value="24" hint="+12%" icon={<Building2 />} tone="primary" />
        <StatCard title="إجمالي الأعضاء" value="1,280" hint="+5" icon={<Users />} tone="success" />
        <StatCard title="الملفات المحمية" value="8,432" hint="مستقر" icon={<Shield />} tone="warning" />
        <StatCard title="سعة التخزين" value="85%" hint="42.5 GB من 50 GB" icon={<Cloud />} progress={85} />
        <StatCard title="تنبيهات أمنية" value="03" hint="تنبيه!" icon={<AlertTriangle />} tone="danger" />
      </section>

      <section className="stitch-dashboard-grid">
        <div className="stitch-activity-card">
          <h2>آخر النشاطات</h2>
          <ActivityItem tone="primary" title="تم رفع ملف جديد" body="بواسطة سارة أحمد في غرفة التسويق" time="منذ 5 دقائق" />
          <ActivityItem tone="success" title="انضم عضو جديد" body="محمد خليل انضم للفريق التقني" time="منذ 45 دقيقة" />
          <ActivityItem tone="danger" title="محاولة دخول فاشلة" body="تم رصد محاولة من IP غير معروف" time="منذ ساعتين" />
        </div>

        <div className="stitch-performance-card">
          <div className="stitch-card-head">
            <h2>أداء الغرف النشطة</h2>
            <a href="/tenant-admin/rooms">عرض الكل</a>
          </div>
          <div className="stitch-feature-room">
            <div>
              <span>الغرفة الأعلى تفاعلاً</span>
              <strong>غرفة التطوير العقاري - القاهرة</strong>
              <small>1.2k مشاهدة / 450 مشاركة</small>
            </div>
          </div>
          <RoomMini title="غرفة الشؤون القانونية" status="نشط الآن" />
          <RoomMini title="أرشيف المشاريع 2023" status="منذ ساعتين" dot="warning" />
        </div>

        <div className="stitch-quick-card">
          <h2>إجراءات سريعة</h2>
          <a href="/tenant-admin/rooms"><Plus size={20} /> إنشاء غرفة جديدة</a>
          <a href="/tenant-admin/files"><CloudUpload size={20} /> رفع محتوى جديد</a>
          <button onClick={() => setInviteOpen(true)} type="button"><UserPlus size={20} /> دعوة عضو</button>
        </div>

        <div className="stitch-subscription-card">
          <h2>حالة الاشتراك</h2>
          <Badge tone="success">الباقة الذهبية</Badge>
          <p>ينتهي الاشتراك خلال 24 يوماً</p>
          <Button as="a" href="/tenant-admin/subscription">تجديد الاشتراك</Button>
        </div>
      </section>

      <InviteMemberModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </>
  );
}

function RoomsPage({ rooms }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="stitch-page-head">
        <div>
          <h1>إدارة الغرف</h1>
          <p>قم بإدارة مساحات العمل التعاونية، تتبع نشاط الأعضاء، والتحكم في الوصول إلى الملفات المشتركة.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={18} /> إنشاء روم</Button>
      </div>

      <FilterBar />

      <section className="stitch-room-grid">
        {rooms.map((room, index) => (
          <article className="stitch-room-card" key={room.id}>
            <div className="stitch-room-top">
              <div className={`stitch-square tone-${index % 3}`}><RoomIcon index={index} /></div>
              <div className="stitch-card-actions">
                <Badge tone={room.status === "Private" ? "neutral" : "success"}>{room.status === "Private" ? "مغلق" : "نشط"}</Badge>
                <button type="button"><MoreVertical size={20} /></button>
              </div>
            </div>
            <h2>{room.name}</h2>
            <p>{room.type === "Read only" ? "مساحة خاصة لقراءة الملفات ومراجعة المحتوى المحمي." : "مساحة عمل تعاونية لرفع الملفات ومشاركة التحديثات."}</p>
            <div className="stitch-room-meta">
              <span>{room.members}+</span>
              <span>{room.files} ملف</span>
            </div>
            <div className="stitch-room-footer">
              <span>آخر نشاط<br /><strong>{index === 0 ? "منذ دقيقتين" : "أمس، 11:45 م"}</strong></span>
              <div>
                <button type="button"><Lock size={20} /></button>
                <button type="button">↪</button>
              </div>
            </div>
          </article>
        ))}
      </section>
      <CreateRoomModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function ContentLibrary({ files }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="stitch-page-head">
        <div>
          <h1>مكتبة المحتوى</h1>
          <p>إدارة وتصفح جميع الملفات والوثائق الخاصة بك.</p>
        </div>
        <Button onClick={() => setOpen(true)}><CloudUpload size={18} /> رفع محتوى</Button>
      </div>
      <ContentFilters />
      <div className="stitch-table-card">
        <table>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>الغرفة</th>
              <th>بواسطة</th>
              <th>تاريخ الرفع</th>
              <th>المشاهدات</th>
              <th>حالة الحماية</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {files.slice(0, 4).map((file, index) => (
              <tr key={file.id}>
                <td><FileCell file={file} index={index} /></td>
                <td>{file.room}</td>
                <td><AvatarName initials={index === 0 ? "SA" : index === 1 ? "MK" : "JD"} name={index === 0 ? "سارة أحمد" : index === 1 ? "محمد خالد" : "جود الدوسري"} /></td>
                <td>{file.date}</td>
                <td>{file.views.toLocaleString()}</td>
                <td><Badge tone={index === 2 ? "danger" : index === 1 ? "neutral" : "success"}>{index === 2 ? "سري جداً" : index === 1 ? "عام" : "محمي"}</Badge></td>
                <td>
                  <div className="stitch-row-actions">
                    <Eye size={19} />
                    <Download size={19} />
                    <Trash2 size={19} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UploadFileModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function MembersPage({ members }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="stitch-page-head">
        <div>
          <h1>إدارة الأعضاء</h1>
          <p>إدارة أذونات الفريق والوصول إلى الغرف والنشاط.</p>
        </div>
        <Button onClick={() => setOpen(true)}><UserPlus size={18} /> دعوة عضو</Button>
      </div>
      <section className="stitch-stat-grid four">
        <StatCard title="إجمالي الأعضاء" value="1,284" hint="+12% من الشهر الماضي" icon={<Users />} tone="primary" />
        <StatCard title="نشط الآن" value="342" hint="جلسات نشطة حالياً" icon={<span />} tone="success" />
        <StatCard title="طلبات معلقة" value="18" hint="في انتظار الموافقة" icon={<UserPlus />} tone="warning" />
        <StatCard title="المساحة المستخدمة" value="84%" icon={<Cloud />} progress={84} />
      </section>
      <div className="stitch-table-card">
        <div className="stitch-table-tools">
          <button><Filter size={18} /> تصفية</button>
          <button>الدور: الكل</button>
          <button>الحالة: نشط</button>
        </div>
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>الاسم</th>
              <th>الدور</th>
              <th>الغرف المعينة</th>
              <th>حالة الجهاز</th>
              <th>آخر ظهور</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {members.slice(0, 3).map((member, index) => (
              <tr key={member.id}>
                <td><input defaultChecked={index === 1} type="checkbox" /></td>
                <td><AvatarName initials={member.name.split(" ").map((part) => part[0]).join("").slice(0, 2)} name={member.name} sub={member.email} /></td>
                <td>{index === 0 ? "Admin" : "Member"}</td>
                <td><div className="stitch-room-bubbles"><span>HQ</span>{index === 0 && <><span>DEV</span><span>+4</span></>}</div></td>
                <td><Badge tone={index === 2 ? "danger" : index === 1 ? "neutral" : "success"}>{index === 2 ? "خطر" : index === 1 ? "غير متصل" : "نشط"}</Badge></td>
                <td>{index === 0 ? "منذ ساعتين" : index === 1 ? "منذ 3 أيام" : "أسبوع مضى"}</td>
                <td><Badge tone={index === 2 ? "danger" : index === 1 ? "neutral" : "success"}>{index === 2 ? "محظور" : index === 1 ? "معلق" : "نشط"}</Badge></td>
                <td><MoreVertical size={20} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <InviteMemberModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  return (
    <>
      <div className="stitch-page-head">
        <div>
          <h1>مركز الإشعارات</h1>
          <p>كل إشعار مرتبط بالمكان الصحيح لمتابعة السبب أو تنفيذ الإجراء.</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllRead} variant="ghost"><CheckCheck size={16} /> تحديد الكل كمقروء</Button>
        )}
      </div>
      <div className="stitch-notification-list">
        {notifications.map((item) => (
          <Link className="stitch-notification-item" to={item.target} key={item.id} onClick={() => markRead(item.id)}>
            <Bell size={22} />
            <div>
              <strong>{item.title}</strong>
              <span>{item.body}</span>
              <small>{item.time}</small>
            </div>
            <Badge tone={item.type === "Security" ? "danger" : "primary"}>{item.type}</Badge>
          </Link>
        ))}
      </div>
    </>
  );
}

function AnalyticsPage() {
  return <SimplePanel title="Analytics" subtitle="تحليلات الغرف، المشاهدات، والتفاعل." />;
}

function SecurityPage() {
  return <SimplePanel title="Security" subtitle="سياسات الحماية، الأجهزة، ومحاولات الدخول." />;
}

function SubscriptionPage() {
  return <SimplePanel title="Subscriptions" subtitle="إدارة الاشتراك الشهري والسنوي وحالة التجديد." />;
}

function SimplePanel({ title, subtitle }) {
  return (
    <>
      <div className="stitch-page-head">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="stitch-empty-panel">
        <BarChart3 size={42} />
        <strong>{title}</strong>
        <span>الصفحة مهيأة للربط بالباك اند بنفس نظام Stitch.</span>
      </div>
    </>
  );
}

function StatCard({ title, value, hint, icon, tone = "primary", progress }) {
  return (
    <article className={`stitch-stat-card ${tone}`}>
      <div>
        <span>{title}</span>
        <div className="stitch-stat-icon">{icon}</div>
      </div>
      <strong>{value}</strong>
      {progress ? <div className="stitch-progress"><i style={{ width: `${progress}%` }} /></div> : <small>{hint}</small>}
      {progress && hint && <small>{hint}</small>}
    </article>
  );
}

function FilterBar() {
  return (
    <div className="stitch-filter-card">
      <div className="stitch-view-toggle"><button><Grid2X2 size={20} /></button><button><Filter size={20} /></button></div>
      <div className="stitch-selects">
        <button>جميع الحالات <Filter size={18} /></button>
        <button>جميع الأنواع <Building2 size={18} /></button>
      </div>
    </div>
  );
}

function ContentFilters() {
  return (
    <div className="stitch-filter-card content">
      <div className="stitch-selects">
        <label>نوع الملف: <button>الكل</button></label>
        <label>الغرفة: <button>كل الغرف</button></label>
        <label>التاريخ: <input type="date" /></label>
      </div>
      <div className="stitch-view-toggle"><button><BookOpen size={20} /></button><button><Grid2X2 size={20} /></button></div>
    </div>
  );
}

function ActivityItem({ title, body, time, tone }) {
  return (
    <div className={`stitch-activity-item ${tone}`}>
      <i />
      <div>
        <strong>{title}</strong>
        <span>{body}</span>
        <small>{time}</small>
      </div>
    </div>
  );
}

function RoomMini({ title, status, dot = "success" }) {
  return (
    <div className="stitch-room-mini">
      <span className={dot} />
      <strong>{title}</strong>
      <small>{status}</small>
    </div>
  );
}

function RoomIcon({ index }) {
  if (index === 0) return <Rocket size={22} />;
  if (index === 1) return <Bell size={22} />;
  return <BarChart3 size={22} />;
}

function FileCell({ file, index }) {
  const colors = ["red", "blue", "amber", "indigo"];
  return (
    <div className="stitch-file-cell">
      <div className={`stitch-file-icon ${colors[index % colors.length]}`}><FileText size={20} /></div>
      <div>
        <strong>{file.name}</strong>
        <small>{file.size}</small>
      </div>
    </div>
  );
}

function AvatarName({ initials, name, sub }) {
  return (
    <div className="stitch-avatar-name">
      <i>{initials}</i>
      <div>
        <strong>{name}</strong>
        {sub && <small>{sub}</small>}
      </div>
    </div>
  );
}

function CreateRoomModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", type: "Read only" });
  const submit = async (event) => {
    event.preventDefault();
    await api.createRoom(form);
    onClose();
  };

  return (
    <Modal title="إنشاء روم" open={open} onClose={onClose} footer={<Button form="create-room-form">إنشاء</Button>}>
      <form id="create-room-form" className="form-grid" onSubmit={submit}>
        <FormField label="اسم الروم"><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></FormField>
        <FormField label="نوع الوصول"><select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}><option>Read only</option><option>Upload + read</option></select></FormField>
      </form>
    </Modal>
  );
}

function InviteMemberModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", room: "HR & Policies" });
  const submit = async (event) => {
    event.preventDefault();
    await api.inviteMember(form);
    onClose();
  };

  return (
    <Modal title="دعوة عضو" open={open} onClose={onClose} footer={<Button form="invite-member-form">إرسال الدعوة</Button>}>
      <form id="invite-member-form" className="form-grid" onSubmit={submit}>
        <FormField label="الاسم"><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></FormField>
        <FormField label="البريد الإلكتروني"><input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></FormField>
        <FormField label="الروم"><input required value={form.room} onChange={(event) => setForm({ ...form, room: event.target.value })} /></FormField>
      </form>
    </Modal>
  );
}

function UploadFileModal({ open, onClose }) {
  const submit = (event) => {
    event.preventDefault();
    onClose();
  };

  return (
    <Modal title="رفع محتوى جديد" open={open} onClose={onClose} footer={<Button form="upload-file-form">بدء الرفع</Button>}>
      <form id="upload-file-form" className="form-grid" onSubmit={submit}>
        <FormField label="الملف"><input type="file" required /></FormField>
        <FormField label="الغرفة"><input defaultValue="HR & Policies" required /></FormField>
      </form>
    </Modal>
  );
}
