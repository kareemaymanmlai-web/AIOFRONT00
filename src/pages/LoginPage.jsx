import { LogIn, Mail, ShieldCheck, Users2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { FormField } from "../components/FormField";
import { PasswordField } from "../components/PasswordField";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "../contexts/ToastContext";

const demoAccounts = [
  { role: "super-admin", email: "super@ain.test", label: "Super Admin", icon: ShieldCheck },
  { role: "tenant-admin", email: "admin@techcorp.test", label: "Company Admin", icon: Users2 },
  { role: "end-user", email: "employee@techcorp.test", label: "End User", icon: Mail }
];

export function LoginPage() {
  const { user, login } = useAuth();
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: "admin@techcorp.test", password: "12345678" });
  const [remember, setRemember] = useState(true);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const errors = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "" : t.emailError,
    password: form.password.length >= 6 ? "" : t.passwordError
  };
  const isValid = !errors.email && !errors.password;

  useEffect(() => {
    const role = searchParams.get("role");
    const match = demoAccounts.find((account) => account.role === role);
    if (match) setForm({ email: match.email, password: "12345678" });
  }, [searchParams]);

  if (user) return <Navigate to={location.state?.from || getRoleHome(user.role)} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setTouched({ email: true, password: true });
    if (!isValid) {
      showToast(`${t.loginError}: ${errors.email || errors.password}`, "danger");
      return;
    }
    setLoading(true);
    try {
      const nextUser = await login(form);
      showToast(t.loginSuccess);
      navigate(nextUser.tenantId === null && nextUser.role === "end-user" ? "/no-workspace" : location.state?.from || getRoleHome(nextUser.role), { replace: true });
    } catch (error) {
      showToast(error.message || t.loginError, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="stitch-auth-page" dir={language === "ar" ? "rtl" : "ltr"}>
      <header className="stitch-auth-topbar">
        <strong>AIN</strong>
      </header>
      <Card className="login-card stitch-auth-card">
        <div className="login-brand stitch-auth-head">
          <div className="brand-mark stitch-icon"><LogIn size={24} /></div>
          <div>
            <h1>تسجيل الدخول</h1>
            <p>مرحباً بك مجدداً في AIN. أدخل بريدك وسيتم توجيهك تلقائياً إلى لوحة التحكم المناسبة.</p>
          </div>
        </div>
        <form className="form-grid" onSubmit={submit} noValidate>
          <FormField label="البريد الإلكتروني / Email" error={touched.email ? errors.email : ""}>
            <div className="stitch-input">
              <input
                type="email"
                autoComplete="email"
                value={form.email}
                onBlur={() => setTouched({ ...touched, email: true })}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
              <Mail size={18} />
            </div>
          </FormField>
          <FormField label="كلمة المرور / Password" error={touched.password ? errors.password : ""}>
            <PasswordField
              value={form.password}
              onBlur={() => setTouched({ ...touched, password: true })}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              minLength={6}
              autoComplete="current-password"
            />
          </FormField>
          <div className="stitch-auth-row">
            <label>
              <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
              تذكرني على هذا الجهاز
            </label>
            <Link to="/forgot-password">نسيت كلمة المرور؟</Link>
          </div>
          <Button className="full-width" type="submit" disabled={loading || !isValid} aria-busy={loading}>
            {loading ? <span className="btn-spinner" aria-hidden="true" /> : <LogIn size={16} />}
            {loading ? "جاري الدخول..." : "دخول"}
          </Button>
          <div className="stitch-divider"><span>أو الدخول بواسطة</span></div>
          <div className="stitch-social-grid">
            <button type="button" onClick={() => showToast("الدخول عبر Google غير متاح في النسخة التجريبية", "warning")}>Google</button>
            <button type="button" onClick={() => showToast("الدخول عبر Apple غير متاح في النسخة التجريبية", "warning")}>Apple</button>
          </div>
          <div className="login-demo-accounts">
            <strong>حسابات تجريبية <small>Password: 12345678</small></strong>
            <div className="demo-account-grid">
              {demoAccounts.map((account) => {
                const Icon = account.icon;
                const active = form.email === account.email;
                return (
                  <button
                    type="button"
                    key={account.email}
                    className={active ? "demo-account-chip is-active" : "demo-account-chip"}
                    onClick={() => setForm({ email: account.email, password: "12345678" })}
                  >
                    <Icon size={16} />
                    <span>
                      <strong>{account.label}</strong>
                      <small>{account.email}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="login-flow-links">
            <Link to="/create-account">إنشاء حساب جديد</Link>
            <Link to="/workspace">إنشاء أو الانضمام لمساحة عمل</Link>
          </div>
        </form>
      </Card>
      <AuthFooter />
    </main>
  );
}

function getRoleHome(role) {
  if (role === "super-admin") return "/super-admin/dashboard";
  if (role === "tenant-admin") return "/tenant-admin/dashboard";
  return "/end-user/home";
}

export function AuthFooter() {
  return (
    <footer className="stitch-auth-footer">
      <nav><a>الخصوصية</a><a>الشروط</a><a>الأمان</a></nav>
      <span>AIN Precision Systems 2026 ©</span>
    </footer>
  );
}
