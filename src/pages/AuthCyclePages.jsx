import { ArrowRight, KeyRound, Mail, ShieldCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { FormField } from "../components/FormField";
import { OtpInput } from "../components/OtpInput";
import { PasswordField } from "../components/PasswordField";
import { ResendCode } from "../components/ResendCode";
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
    if (form.password.length < 8) {
      showToast("كلمة المرور يجب ألا تقل عن 8 أحرف", "danger");
      return;
    }
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
      <form className="form-grid" onSubmit={submit} noValidate>
        <FormField label="الاسم الكامل">
          <div className="stitch-input">
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </div>
        </FormField>
        <FormField label="البريد الإلكتروني">
          <div className="stitch-input">
            <input type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            <Mail size={18} />
          </div>
        </FormField>
        <FormField label="كلمة المرور">
          <PasswordField value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength={8} autoComplete="new-password" />
        </FormField>
        <FormField label="تأكيد كلمة المرور" error={form.confirm && form.confirm !== form.password ? "كلمتا المرور غير متطابقتين" : ""}>
          <PasswordField value={form.confirm} onChange={(event) => setForm({ ...form, confirm: event.target.value })} minLength={8} autoComplete="new-password" />
        </FormField>
        <Button className="full-width" type="submit" disabled={loading} aria-busy={loading}>
          {loading ? <span className="btn-spinner" aria-hidden="true" /> : null}
          {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
        </Button>
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
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={user.tenantId ? `/${user.role}` : "/no-workspace"} replace />;

  const submit = async (event) => {
    event.preventDefault();
    if (otp.length < 6) {
      showToast("أدخل الرمز المكون من 6 أرقام كاملاً", "danger");
      return;
    }
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

  const resend = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    showToast("تم إرسال رمز جديد إلى بريدك (رمز التجربة: 123456)");
  };

  return (
    <AuthScreen>
      <AuthHeader icon={<ShieldCheck size={22} />} title="التحقق من الهوية" subtitle={`أدخل رمز التحقق المرسل إلى ${email || "بريدك الإلكتروني"}. رمز التجربة: 123456`} />
      <form className="form-grid" onSubmit={submit} noValidate>
        <OtpInput value={otp} onChange={setOtp} />
        <Button className="full-width" type="submit" disabled={loading || otp.length < 6} aria-busy={loading}>
          {loading ? <span className="btn-spinner" aria-hidden="true" /> : null}
          {loading ? "جاري التحقق..." : "تأكيد البريد"}
        </Button>
        <div className="auth-footnote-row">
          <ResendCode onResend={resend} />
        </div>
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
      <form className="form-grid" onSubmit={submit} noValidate>
        <FormField label="البريد الإلكتروني">
          <div className="stitch-input">
            <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <Mail size={18} />
          </div>
        </FormField>
        <Button className="full-width" type="submit" disabled={loading} aria-busy={loading}>
          {loading ? <span className="btn-spinner" aria-hidden="true" /> : null}
          {loading ? "جاري الإرسال..." : "إرسال رمز التعيين"}
        </Button>
        <Button as={Link} to="/login" variant="ghost" className="full-width">
          <ArrowRight size={16} /> العودة لتسجيل الدخول
        </Button>
      </form>
    </AuthScreen>
  );
}

export function ResetPasswordPage() {
  const { resetPassword, requestPasswordReset } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  if (!email) return <Navigate to="/forgot-password" replace />;

  const submit = async (event) => {
    event.preventDefault();
    if (otp.length < 6) {
      showToast("أدخل الرمز المكون من 6 أرقام كاملاً", "danger");
      return;
    }
    if (form.password.length < 8) {
      showToast("كلمة المرور يجب ألا تقل عن 8 أحرف", "danger");
      return;
    }
    if (form.password !== form.confirm) {
      showToast("كلمتا المرور غير متطابقتين", "danger");
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ email, otp, password: form.password });
      showToast("تم تحديث كلمة المرور بنجاح");
      navigate("/login", { replace: true });
    } catch (error) {
      showToast(error.message || "تعذر تحديث كلمة المرور", "danger");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    await requestPasswordReset({ email });
    showToast("تم إرسال رمز جديد إلى بريدك");
  };

  return (
    <AuthScreen>
      <AuthHeader icon={<KeyRound size={22} />} title="تعيين كلمة مرور جديدة" subtitle={`استخدم الرمز المرسل إلى ${email}. رمز التجربة: 123456`} />
      <form className="form-grid" onSubmit={submit} noValidate>
        <OtpInput value={otp} onChange={setOtp} />
        <div className="auth-footnote-row">
          <ResendCode onResend={resend} />
        </div>
        <FormField label="كلمة المرور الجديدة">
          <PasswordField value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength={8} autoComplete="new-password" />
        </FormField>
        <FormField label="تأكيد كلمة المرور" error={form.confirm && form.confirm !== form.password ? "كلمتا المرور غير متطابقتين" : ""}>
          <PasswordField value={form.confirm} onChange={(event) => setForm({ ...form, confirm: event.target.value })} minLength={8} autoComplete="new-password" />
        </FormField>
        <div className="password-requirements">
          <strong>المتطلبات الأساسية</strong>
          <span>8 أحرف على الأقل</span>
          <span>يفضل استخدام أرقام ورموز</span>
        </div>
        <Button className="full-width" type="submit" disabled={loading} aria-busy={loading}>
          {loading ? <span className="btn-spinner" aria-hidden="true" /> : null}
          {loading ? "جاري الحفظ..." : "حفظ كلمة المرور"}
        </Button>
      </form>
    </AuthScreen>
  );
}

function AuthScreen({ children }) {
  const { language } = useLanguage();
  return (
    <main className="stitch-auth-page" dir={language === "ar" ? "rtl" : "ltr"}>
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
  return (
    <header className="stitch-auth-topbar">
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
