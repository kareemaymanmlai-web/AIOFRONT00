import { Globe2, LockKeyhole, LogIn, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { FormField } from "../components/FormField";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "../contexts/ToastContext";

const roleEmails = {
  "super-admin": "super@ain.test",
  "tenant-admin": "admin@techcorp.test",
  "end-user": "employee@techcorp.test"
};

export function LoginPage() {
  const { user, login } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: "admin@techcorp.test", password: "12345678" });
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const errors = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "" : t.emailError,
    password: form.password.length >= 6 ? "" : t.passwordError
  };
  const isValid = !errors.email && !errors.password;

  useEffect(() => {
    const role = searchParams.get("role");
    if (roleEmails[role]) {
      setForm({ email: roleEmails[role], password: "12345678" });
    }
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
    <main className="stitch-auth-page" dir="rtl">
      <AuthTopbar />
      <Card className="login-card stitch-auth-card">
        <div className="login-brand stitch-auth-head">
          <div className="brand-mark stitch-icon"><LockKeyhole size={24} /></div>
          <div>
            <h1>تسجيل الدخول</h1>
            <p>مرحباً بك مجدداً في AIN. أدخل بريدك وسيتم توجيهك تلقائياً إلى لوحة التحكم المناسبة.</p>
          </div>
        </div>
        <form className="form-grid" onSubmit={submit}>
          <FormField label="البريد الإلكتروني / Email" error={touched.email ? errors.email : ""}>
            <div className="stitch-input">
              <input type="email" value={form.email} onBlur={() => setTouched({ ...touched, email: true })} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
              <Mail size={18} />
            </div>
          </FormField>
          <FormField label="كلمة المرور / Password" error={touched.password ? errors.password : ""}>
            <div className="stitch-input">
              <input type="password" value={form.password} onBlur={() => setTouched({ ...touched, password: true })} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength={6} required />
              <LockKeyhole size={18} />
            </div>
          </FormField>
          <div className="stitch-auth-row">
            <label><input type="checkbox" /> تذكرني على هذا الجهاز</label>
            <Link to="/forgot-password">نسيت كلمة المرور؟</Link>
          </div>
          <Button className="full-width" type="submit" disabled={loading || !isValid} aria-busy={loading}>
            <LogIn size={16} />
            {loading ? "جاري الدخول..." : "دخول"}
          </Button>
          <div className="stitch-divider"><span>أو الدخول بواسطة</span></div>
          <div className="stitch-social-grid">
            <button type="button">Google</button>
            <button type="button">Apple</button>
          </div>
          <div className="login-demo-accounts">
            <strong>Demo accounts</strong>
            <button type="button" onClick={() => setForm({ email: "super@ain.test", password: "12345678" })}>Super Admin: super@ain.test</button>
            <button type="button" onClick={() => setForm({ email: "admin@techcorp.test", password: "12345678" })}>Company Admin: admin@techcorp.test</button>
            <button type="button" onClick={() => setForm({ email: "employee@techcorp.test", password: "12345678" })}>End User: employee@techcorp.test</button>
            <small>Password: 12345678</small>
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

function AuthTopbar() {
  const { t, toggleLanguage } = useLanguage();
  return (
    <header className="stitch-auth-topbar">
      <button type="button" className="stitch-lang" onClick={toggleLanguage}>{t.language} <Globe2 size={17} /></button>
      <strong>AIN</strong>
    </header>
  );
}

function AuthFooter() {
  return (
    <footer className="stitch-auth-footer">
      <nav><a>الخصوصية</a><a>الشروط</a><a>الأمان</a></nav>
      <span>AIN Precision Systems 2026 ©</span>
    </footer>
  );
}
