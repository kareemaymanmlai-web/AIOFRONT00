import { AlertTriangle, Building2, CreditCard, Download, MoreVertical, Plus, Shield, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { AccountSettings } from "../components/AccountSettings";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { FormField } from "../components/FormField";
import { Modal } from "../components/Modal";
import { AppLayout } from "../layouts/AppLayout";
import { api } from "../services/api";

const nav = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", path: "/super-admin/dashboard" },
  { id: "tenants", label: "Tenants", icon: "rooms", path: "/super-admin/tenants" },
  { id: "revenue", label: "Revenue", icon: "analytics", path: "/super-admin/revenue" },
  { id: "subscriptions", label: "Subscriptions", icon: "subscription", path: "/super-admin/subscriptions" },
  { id: "pricing", label: "Pricing", icon: "settings", path: "/super-admin/pricing" },
  { id: "activity", label: "Activity", icon: "locked", path: "/super-admin/activity" },
  { id: "settings", label: "Settings", icon: "settings", path: "/super-admin/settings" }
];

export function SuperAdminApp({ data, user }) {
  const { page = "dashboard" } = useParams();
  const appUser = { name: user.name, role: "Super Admin", company: "AIN SaaS Workspace" };

  if (!nav.some((item) => item.id === page)) {
    return <Navigate to="/super-admin/dashboard" replace />;
  }

  return (
    <AppLayout appTitle="Super Admin" user={appUser} nav={nav}>
      {page === "dashboard" && <Dashboard data={data} />}
      {page === "tenants" && <TenantsPage tenants={data.tenants} />}
      {page === "revenue" && <RevenuePage />}
      {page === "subscriptions" && <SubscriptionsPage tenants={data.tenants} />}
      {page === "pricing" && <Pricing />}
      {page === "activity" && <ActivityPage />}
      {page === "settings" && <AccountSettings user={user} workspaceLabel="Super Admin workspace" />}
    </AppLayout>
  );
}

function Dashboard({ data }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="stitch-page-head">
        <div>
          <h1>لوحة تحكم مدير المنصة</h1>
          <p>إدارة الشركات، الإيرادات، الاشتراكات، والتنبيهات التشغيلية من مكان واحد.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={18} /> Tenant جديد</Button>
      </div>

      <section className="stitch-stat-grid five">
        <StatCard title="الشركات النشطة" value="14" hint="+3 هذا الشهر" icon={<Building2 />} tone="primary" />
        <StatCard title="الإيرادات الشهرية" value="42K" hint="+18% عن الشهر" icon={<TrendingUp />} tone="success" />
        <StatCard title="اشتراكات تنتهي قريباً" value="5" hint="خلال 7 أيام" icon={<CreditCard />} tone="warning" />
        <StatCard title="إجمالي المستخدمين" value="847" hint="+62 هذا الأسبوع" icon={<Users />} tone="primary" />
        <StatCard title="تنبيهات أمنية" value="3" hint="تحتاج مراجعة" icon={<AlertTriangle />} tone="danger" />
      </section>

      <section className="stitch-dashboard-grid super">
        <div className="stitch-performance-card">
          <div className="stitch-card-head">
            <h2>أحدث الـ Tenants</h2>
            <a href="/super-admin/tenants">عرض الكل</a>
          </div>
          {data.tenants.slice(0, 4).map((tenant) => (
            <div className="stitch-room-mini tenant" key={tenant.id}>
              <span className={tenant.status.includes("Expiring") ? "warning" : "success"} />
              <strong>{tenant.name}</strong>
              <small>{tenant.plan} / {tenant.users} مستخدم</small>
              <Badge tone={tenant.status.includes("Expiring") ? "warning" : "success"}>{tenant.status}</Badge>
            </div>
          ))}
        </div>

        <div className="stitch-quick-card">
          <h2>إجراءات سريعة</h2>
          <button onClick={() => setOpen(true)} type="button"><Plus size={20} /> إنشاء Tenant</button>
          <a href="/super-admin/subscriptions"><CreditCard size={20} /> مراجعة التجديدات</a>
          <a href="/super-admin/revenue"><Download size={20} /> تصدير CSV</a>
        </div>

        <div className="stitch-activity-card">
          <h2>Action inbox</h2>
          <ActivityItem tone="warning" title="Renewal risk" body="5 tenants expire within 7 days" time="الآن" />
          <ActivityItem tone="danger" title="Payment issue" body="3 failed payment attempts" time="منذ ساعة" />
          <ActivityItem tone="primary" title="New tenant review" body="Verify onboarding details" time="اليوم" />
        </div>
      </section>
      <CreateTenantModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function TenantsPage({ tenants }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="stitch-page-head">
        <div>
          <h1>إدارة الشركات</h1>
          <p>الشركات، الخطط، الكوتا، تاريخ الانتهاء، وحالة التشغيل.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={18} /> Tenant جديد</Button>
      </div>
      <TenantTable tenants={tenants} />
      <CreateTenantModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function SubscriptionsPage({ tenants }) {
  return (
    <>
      <div className="stitch-page-head">
        <div>
          <h1>الاشتراكات</h1>
          <p>تتبع التجديدات، الاشتراكات الشهرية والسنوية، وتصدير التقارير.</p>
        </div>
        <Button variant="ghost"><Download size={18} /> تصدير CSV</Button>
      </div>
      <TenantTable tenants={tenants} />
    </>
  );
}

function TenantTable({ tenants }) {
  return (
    <div className="stitch-table-card">
      <table>
        <thead>
          <tr>
            <th>الشركة</th>
            <th>الخطة</th>
            <th>المستخدمين</th>
            <th>الملفات</th>
            <th>الإيراد</th>
            <th>ينتهي في</th>
            <th>الحالة</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id}>
              <td><AvatarName initials={tenant.name.slice(0, 2).toUpperCase()} name={tenant.name} sub={`${tenant.rooms} rooms`} /></td>
              <td>{tenant.plan}</td>
              <td>{tenant.users}</td>
              <td>{tenant.files}</td>
              <td>{tenant.revenue} EGP</td>
              <td>{tenant.expiresAt}</td>
              <td><Badge tone={tenant.status.includes("Expiring") ? "warning" : "success"}>{tenant.status}</Badge></td>
              <td><MoreVertical size={20} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Pricing() {
  const [period, setPeriod] = useState("monthly");
  const prices = {
    Starter: { monthly: "500", yearly: "4,800" },
    Growth: { monthly: "1,200", yearly: "11,520" },
    Pro: { monthly: "2,500", yearly: "24,000" }
  };

  return (
    <>
      <div className="stitch-page-head">
        <div>
          <h1>الباقات</h1>
          <p>الباقات تعمل شهرياً وسنوياً، والاختيار يغير الأسعار فوراً.</p>
        </div>
        <div className="stitch-period-toggle">
          <button className={period === "monthly" ? "active" : ""} onClick={() => setPeriod("monthly")} type="button">شهري</button>
          <button className={period === "yearly" ? "active" : ""} onClick={() => setPeriod("yearly")} type="button">سنوي -20%</button>
        </div>
      </div>
      <div className="stitch-pricing-grid">
        {Object.entries(prices).map(([name, price]) => (
          <article className={name === "Growth" ? "stitch-plan-card featured" : "stitch-plan-card"} key={name}>
            {name === "Growth" && <Badge tone="primary">الأكثر مبيعاً</Badge>}
            <h2>{name}</h2>
            <strong>{price[period]} جنيه / {period === "monthly" ? "شهر" : "سنة"}</strong>
            <p>{name === "Starter" ? "Room واحد / 100 مستخدم" : name === "Growth" ? "10 رومات / 500 مستخدم / Analytics" : "غير محدود / White Label / Payments"}</p>
            <Button variant={name === "Growth" ? "primary" : "ghost"}>تعديل</Button>
          </article>
        ))}
      </div>
    </>
  );
}

function RevenuePage() {
  return (
    <>
      <div className="stitch-page-head">
        <div>
          <h1>الإيرادات</h1>
          <p>عرض واضح للإيرادات حسب الخطة والحالة.</p>
        </div>
      </div>
      <section className="stitch-stat-grid four">
        <StatCard title="الإيراد الشهري" value="42K" hint="+18%" icon={<TrendingUp />} tone="success" />
        <StatCard title="Growth" value="9.6K" hint="8 tenants" icon={<CreditCard />} tone="primary" />
        <StatCard title="Pro" value="5K" hint="2 tenants" icon={<Shield />} tone="primary" />
        <StatCard title="Starter" value="3.8K" hint="4 tenants" icon={<Building2 />} tone="warning" />
      </section>
    </>
  );
}

function ActivityPage() {
  return (
    <>
      <div className="stitch-page-head">
        <div>
          <h1>Activity</h1>
          <p>سجل تشغيلي لأحداث المنصة.</p>
        </div>
      </div>
      <div className="stitch-activity-card">
        <ActivityItem tone="success" title="TechCorp renewed subscription" body="Growth plan renewal completed" time="منذ 12 دقيقة" />
        <ActivityItem tone="primary" title="Elite Academy changed plan" body="Pro plan edited by platform admin" time="منذ ساعة" />
        <ActivityItem tone="warning" title="Language Institute needs renewal" body="Subscription expires soon" time="اليوم" />
      </div>
    </>
  );
}

function StatCard({ title, value, hint, icon, tone = "primary" }) {
  return (
    <article className={`stitch-stat-card ${tone}`}>
      <div>
        <span>{title}</span>
        <div className="stitch-stat-icon">{icon}</div>
      </div>
      <strong>{value}</strong>
      <small>{hint}</small>
    </article>
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

function CreateTenantModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", adminEmail: "", plan: "Growth" });

  const submit = async (event) => {
    event.preventDefault();
    await api.createTenant(form);
    onClose();
  };

  return (
    <Modal title="إنشاء Tenant" open={open} onClose={onClose} footer={<Button form="create-tenant-form">إنشاء</Button>}>
      <form id="create-tenant-form" className="form-grid" onSubmit={submit}>
        <FormField label="اسم الشركة"><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></FormField>
        <FormField label="إيميل المسؤول"><input type="email" required value={form.adminEmail} onChange={(event) => setForm({ ...form, adminEmail: event.target.value })} /></FormField>
        <FormField label="الخطة">
          <select value={form.plan} onChange={(event) => setForm({ ...form, plan: event.target.value })}>
            <option>Starter</option>
            <option>Growth</option>
            <option>Pro</option>
          </select>
        </FormField>
      </form>
    </Modal>
  );
}
