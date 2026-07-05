import { Globe2, KeyRound, Mail, ShieldCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { FormField } from "../components/FormField";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "../contexts/ToastContext";

export function CreateAccountPage() {
  const { user, createPersonalAccount } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "New Member", email: "new.member@techcorp.test", password: "12345678", confirm: "12345678" });
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={user.tenantId ? `/${user.role}` : "/no-workspace"} replace />;

  const submit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirm) {
      showToast("كلمتا المرور غير متطابقتين", "danger");
      return;
    }
    setLoading(true);
    try {
      await createPersonalAccount(form);
      showToast("تم إرسال رمز التحقق إلى بريدك");
      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`, { replace: true });
    } catch (error) {
      showToast(error.message || "تعذر إنشاء الحساب", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen>
      <AuthHeader icon={<UserPlus size={22} />} title="إنشاء حساب جديد" subtitle="أنشئ حساباً شخصياً أولاً، وبعدها يمكن للشركة دعوتك على نفس البريد." />
      <form className="form-grid" onSubmit={submit}>
        <FormField label="الاسم الكامل"><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></FormField>
        <FormField label="البريد الإلكتروني"><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></FormField>
        <FormField label="كلمة المرور"><input type="password" minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></FormField>
        <FormField label="تأكيد كلمة المرور"><input type="password" minLength={8} value={form.confirm} onChange={(event) => setForm({ ...form, confirm: event.target.value })} required /></FormField>
        <Button className="full-width" type="submit" disabled={loading}>{loading ? "جاري الإنشاء..." : "إنشاء حساب"}</Button>
        <div className="auth-footnote"><span>لديك حساب بالفعل؟</span><Link to="/login">تسجيل الدخول</Link></div>
      </form>
    </AuthScreen>
  );
}

export function VerifyEmailPage() {
  const { user, verifyRegistrationOtp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("123456");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={user.tenantId ? `/${user.role}` : "/no-workspace"} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const nextUser = await verifyRegistrationOtp({ email, otp });
      showToast("تم تأكيد البريد الإلكتروني");
      navigate(nextUser.tenantId ? `/${nextUser.role}` : "/no-workspace", { replace: true });
    } catch (error) {
      showToast(error.message || "رمز غير صحيح", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen>
      <AuthHeader icon={<ShieldCheck size={22} />} title="التحقق من الهوية" subtitle={`أدخل رمز التحقق المرسل إلى ${email || "بريدك الإلكتروني"}. رمز التجربة: 123456`} />
      <form className="form-grid" onSubmit={submit}>
        <div className="otp-boxes" aria-hidden="true">{Array.from({ length: 6 }).map((_, index) => <span key={index}>{otp[index] || ""}</span>)}</div>
        <FormField label="رمز التحقق"><input inputMode="numeric" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value)} required /></FormField>
        <Button className="full-width" type="submit" disabled={loading}>{loading ? "جاري التحقق..." : "تأكيد البريد"}</Button>
      </form>
    </AuthScreen>
  );
}

export function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@techcorp.test");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset({ email });
      showToast("تم إرسال رمز إعادة التعيين");
      navigate(`/reset-password?email=${encodeURIComponent(email)}`, { replace: true });
    } catch (error) {
      showToast(error.message || "تعذر إرسال الرمز", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen>
      <AuthHeader icon={<Mail size={22} />} title="نسيت كلمة المرور؟" subtitle="أدخل بريدك الإلكتروني وسنرسل لك رمزاً لإعادة تعيين كلمة المرور." />
      <form className="form-grid" onSubmit={submit}>
        <FormField label="البريد الإلكتروني"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></FormField>
        <Button className="full-width" type="submit" disabled={loading}>{loading ? "جاري الإرسال..." : "إرسال رابط التعيين"}</Button>
        <Button as={Link} to="/login" variant="ghost">العودة لتسجيل الدخول</Button>
      </form>
    </AuthScreen>
  );
}

export function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [form, setForm] = useState({ otp: "123456", password: "12345678", confirm: "12345678" });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirm) {
      showToast("كلمتا المرور غير متطابقتين", "danger");
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ email, otp: form.otp, password: form.password });
      showToast("تم تحديث كلمة المرور");
      navigate("/login", { replace: true });
    } catch (error) {
      showToast(error.message || "تعذر تحديث كلمة المرور", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen>
      <AuthHeader icon={<KeyRound size={22} />} title="تعيين كلمة مرور جديدة" subtitle={`استخدم الرمز المرسل إلى ${email || "بريدك الإلكتروني"}. رمز التجربة: 123456`} />
      <form className="form-grid" onSubmit={submit}>
        <FormField label="رمز إعادة التعيين"><input inputMode="numeric" value={form.otp} onChange={(event) => setForm({ ...form, otp: event.target.value })} required /></FormField>
        <FormField label="كلمة المرور الجديدة"><input type="password" minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></FormField>
        <FormField label="تأكيد كلمة المرور"><input type="password" minLength={8} value={form.confirm} onChange={(event) => setForm({ ...form, confirm: event.target.value })} required /></FormField>
        <div className="password-requirements"><strong>المتطلبات الأساسية</strong><span>8 أحرف على الأقل</span><span>يفضل استخدام أرقام ورموز</span></div>
        <Button className="full-width" type="submit" disabled={loading}>{loading ? "جاري الحفظ..." : "حفظ كلمة المرور"}</Button>
      </form>
    </AuthScreen>
  );
}

function AuthScreen({ children }) {
  return (
    <main className="stitch-auth-page" dir="rtl">
      <AuthTopbar />
      <Card className="login-card stitch-auth-card">{children}</Card>
      <AuthFooter />
    </main>
  );
}

function AuthHeader({ icon, title, subtitle }) {
  return (
    <div className="login-brand stitch-auth-head">
      <div className="brand-mark stitch-icon">{icon}</div>
      <div><h1>{title}</h1><p>{subtitle}</p></div>
    </div>
  );
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
