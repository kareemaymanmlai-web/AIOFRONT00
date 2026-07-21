import { Camera, CheckCircle2, KeyRound, LockKeyhole, Mail, Monitor, Moon, Palette, ShieldCheck, Smartphone, Sun, UserRound } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { PageHeader } from "./PageHeader";
import { PasswordField } from "./PasswordField";

const groups = [
  ["مساحة العمل", [
    { id: "general", label: "عام", icon: UserRound },
    { id: "people", label: "الأعضاء", icon: UserRound },
    { id: "security", label: "الأمان والصلاحيات", icon: ShieldCheck },
    { id: "audit", label: "سجل التدقيق", icon: KeyRound }
  ]],
  ["الملفات الشخصية", [
    { id: "profile", label: "الملف الشخصي", icon: UserRound },
    { id: "appearance", label: "المظهر", icon: Palette }
  ]]
];

export function AccountSettings({ user, workspaceLabel = "مساحة العمل" }) {
  const { language } = useLanguage();
  const [section, setSection] = useState("profile");

  const panels = {
    general: <ProfilePanel user={user} title="عام" subtitle="المعلومات الأساسية لمساحة العمل." />,
    profile: <ProfilePanel user={user} title="الملف الشخصي" subtitle="بياناتك الشخصية وصورة حسابك." />,
    people: <ComingSoonPanel title="الأعضاء" subtitle="إدارة أعضاء مساحة العمل وصلاحياتهم." />,
    security: <SecurityPanel />,
    audit: <ComingSoonPanel title="سجل التدقيق" subtitle="سجل كامل لكل نشاط يحدث داخل مساحة العمل." />,
    appearance: <AppearancePanel />
  };

  return (
    <div className="settings-workspace" dir={language === "ar" ? "rtl" : "ltr"}>
      <aside className="settings-sidebar">
        <strong>كل الإعدادات</strong>
        {groups.map(([title, items]) => (
          <div className="settings-group" key={title}>
            <span>{title}</span>
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  className={section === item.id ? "active" : ""}
                  type="button"
                  key={item.id}
                  onClick={() => setSection(item.id)}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </aside>
      <main className="settings-main">
        <PageHeader title="الإعدادات" subtitle={`الملف الشخصي، الأمان، والتفضيلات لـ ${workspaceLabel}`} />
        {panels[section]}
      </main>
    </div>
  );
}

function ProfilePanel({ user, title, subtitle }) {
  const { showToast } = useToast();
  const [avatarPreview, setAvatarPreview] = useState("");
  const [form, setForm] = useState({ name: user.name, email: user.email, password: "" });
  const [saving, setSaving] = useState(false);

  const onAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaving(false);
    showToast("تم حفظ التعديلات بنجاح");
  };

  const reset = () => {
    setForm({ name: user.name, email: user.email, password: "" });
    setAvatarPreview("");
  };

  return (
    <section className="settings-card">
      <div className="settings-card-head">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <form className="settings-form-card" onSubmit={save}>
        <div className="settings-avatar-block">
          <label className="settings-avatar-upload">
            {avatarPreview ? (
              <img src={avatarPreview} alt={`${user.name} profile`} />
            ) : (
              <span>{user.name.slice(0, 2).toUpperCase()}</span>
            )}
            <input accept="image/png,image/jpeg,image/webp" type="file" onChange={onAvatarChange} />
            <i><Camera size={15} /></i>
          </label>
          <div>
            <strong>{form.name}</strong>
            <span>متصل الآن</span>
          </div>
        </div>
        <label>
          <span>الاسم الكامل</span>
          <div className="settings-input"><UserRound size={15} /> <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
        </label>
        <label>
          <span>البريد الإلكتروني</span>
          <div className="settings-input"><Mail size={15} /> <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div>
        </label>
        <label>
          <span>كلمة المرور الجديدة</span>
          <PasswordField
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="اتركها فارغة إن لم ترغب بالتغيير"
            minLength={0}
            required={false}
            autoComplete="new-password"
          />
        </label>
        <div className="settings-form-actions">
          <Button type="submit" disabled={saving} aria-busy={saving}>
            {saving ? <span className="btn-spinner" aria-hidden="true" /> : null}
            {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
          </Button>
          <Button onClick={reset} type="button" variant="ghost">إلغاء</Button>
        </div>
      </form>
    </section>
  );
}

function SecurityPanel() {
  const { showToast } = useToast();
  const [sms, setSms] = useState(false);
  const [totp, setTotp] = useState(true);

  const toggle = (current, setter, label) => {
    setter(!current);
    showToast(!current ? `تم تفعيل ${label}` : `تم إيقاف ${label}`);
  };

  return (
    <section className="settings-card">
      <div className="settings-card-head">
        <h3>التحقق بخطوتين (2FA)</h3>
        <p>حافظ على أمان حسابك برمز إضافي عبر SMS أو تطبيق مصادقة.</p>
      </div>
      <div className="settings-options">
        <SettingOption
          icon={<Smartphone size={17} />}
          title="رسالة نصية (SMS)"
          subtitle="استقبل رمزاً لمرة واحدة عبر الرسائل النصية عند كل تسجيل دخول."
          badge="خطة الأعمال"
          checked={sms}
          onToggle={() => toggle(sms, setSms, "التحقق عبر SMS")}
        />
        <SettingOption
          icon={<ShieldCheck size={17} />}
          title="تطبيق المصادقة (TOTP)"
          subtitle="استخدم تطبيقاً مثل Google Authenticator لاستقبال رمز مؤقت."
          checked={totp}
          onToggle={() => toggle(totp, setTotp, "تطبيق المصادقة")}
        />
      </div>
    </section>
  );
}

function AppearancePanel() {
  const { theme, setTheme } = useTheme();
  const colors = ["#4F46E5", "#7C3AED", "#0EA5E9", "#EC4899", "#A855F7", "#6366F1", "#F97316", "#14B8A6"];
  const [accent, setAccent] = useState(colors[0]);

  return (
    <section className="settings-card">
      <div className="settings-card-head">
        <h3>المظهر</h3>
        <p>اختر شكل الواجهة ولون العلامة المميز لحسابك.</p>
      </div>
      <div className="theme-settings">
        <div className="appearance-cards">
          <button className={theme === "light" ? "appearance-card light-card selected" : "appearance-card light-card"} onClick={() => setTheme("light")} type="button">
            <Sun size={18} /> فاتح
          </button>
          <button className={theme === "dark" ? "appearance-card dark-card selected" : "appearance-card dark-card"} onClick={() => setTheme("dark")} type="button">
            <Moon size={18} /> داكن
          </button>
          <button className="appearance-card system-card" disabled title="قريباً" type="button">
            <Monitor size={18} /> حسب النظام
          </button>
        </div>
        <div>
          <span className="settings-subtle-label">لون العلامة المميز</span>
          <div className="color-swatches">
            {colors.map((color) => (
              <button
                className={accent === color ? "selected" : ""}
                style={{ background: color }}
                type="button"
                key={color}
                aria-label={`لون ${color}`}
                onClick={() => setAccent(color)}
              >
                {accent === color && <CheckCircle2 color="#fff" size={16} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ComingSoonPanel({ title, subtitle }) {
  return (
    <section className="settings-card">
      <div className="settings-card-head">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <div className="stitch-empty-panel">
        <LockKeyhole size={38} />
        <strong>{title}</strong>
        <span>هذا القسم قيد الإعداد وسيتم ربطه بالباك اند قريباً.</span>
      </div>
    </section>
  );
}

function SettingOption({ icon, title, subtitle, badge, checked, onToggle }) {
  return (
    <div className="setting-option">
      <button className={checked ? "toggle-switch on" : "toggle-switch"} onClick={onToggle} type="button" aria-label={title} aria-pressed={checked}><span /></button>
      <div className="setting-option-icon">{icon}</div>
      <div>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
      {badge && <Badge tone="primary">{badge}</Badge>}
    </div>
  );
}
