import { ArrowLeft, Building2, CloudUpload, KeyRound, LockKeyhole, Search } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { FormField } from "../components/FormField";
import { PasswordField } from "../components/PasswordField";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "../contexts/ToastContext";

export function RegisterCompanyPage() {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company: "TechCorp Egypt",
    name: "Ahmed Mohamed",
    email: "owner@techcorp.com",
    password: "12345678",
    confirm: "12345678"
  });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirm) {
      showToast("كلمتا المرور غير متطابقتين", "danger");
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    navigate("/company-onboarding");
  };

  return (
    <main className="flow-page" dir={language === "ar" ? "rtl" : "ltr"}>
      <FlowHeader />
      <section className="auth-split">
        <form className="flow-card form-grid" onSubmit={submit} noValidate>
          <BrandLockup />
          <div>
            <span className="flow-badge">إنشاء مساحة عمل لشركة</span>
            <h1>أنشئ حساب شركتك</h1>
            <p>ابدأ تجربة مجانية لمدة 14 يوم. يصبح المنشئ مالك/مدير الشركة بعد تأكيد الباك اند.</p>
          </div>
          <FormField label="اسم الشركة">
            <input value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} required />
          </FormField>
          <FormField label="اسمك الكامل">
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </FormField>
          <FormField label="البريد الإلكتروني">
            <input type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </FormField>
          <FormField label="كلمة المرور">
            <PasswordField value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength={8} autoComplete="new-password" />
          </FormField>
          <FormField label="تأكيد كلمة المرور" error={form.confirm && form.confirm !== form.password ? "كلمتا المرور غير متطابقتين" : ""}>
            <PasswordField value={form.confirm} onChange={(event) => setForm({ ...form, confirm: event.target.value })} minLength={8} autoComplete="new-password" />
          </FormField>
          <label className="check-line"><input defaultChecked type="checkbox" /> أوافق على الشروط وسياسة الخصوصية</label>
          <Button className="full-width" type="submit" disabled={loading} aria-busy={loading}>
            {loading ? <span className="btn-spinner" aria-hidden="true" /> : null}
            {loading ? "جاري الإنشاء..." : "إنشاء الشركة"}
          </Button>
        </form>

        <aside className="flow-side-card">
          <div className="choice-icon"><Building2 size={36} /></div>
          <h2>آمن. بسيط. قوي.</h2>
          <p>كل ما تحتاجه الشركة لإدارة الرومات المحمية، والوصول للمحتوى، والأعضاء، والتحليلات.</p>
          <div className="choice-pills vertical">
            <span>حماية محتوى آمنة</span>
            <span>دخول من جهاز واحد</span>
            <span>تحليلات متقدمة</span>
          </div>
        </aside>
      </section>
    </main>
  );
}

export function CompanyOnboardingPage() {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const steps = ["العلامة التجارية", "المعلومات", "الخطة", "الانتهاء"];

  const finish = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    showToast("تم إعداد مساحة العمل بنجاح");
    navigate("/login?role=tenant-admin");
  };

  return (
    <main className="flow-page" dir={language === "ar" ? "rtl" : "ltr"}>
      <FlowHeader />
      <section className="onboarding-shell">
        <div className="flow-card">
          <div className="onboarding-head">
            <div>
              <span className="flow-badge">إعداد الشركة</span>
              <h1>لنجهّز علامتك التجارية</h1>
              <p>ارفع الشعار، اختر لون العلامة التجارية، وأكّد الخطة قبل فتح لوحة التحكم.</p>
            </div>
            <div className="step-pills">
              {steps.map((step, index) => <span className={index === 0 ? "active" : ""} key={step}>{index + 1} {step}</span>)}
            </div>
          </div>

          <div className="onboarding-grid">
            <div className="form-grid">
              <label className="upload-zone">
                <CloudUpload size={34} />
                <strong>رفع الشعار</strong>
                <span>يُفضّل PNG أو JPG أو SVG بمقاس 400×400</span>
                <input accept="image/png,image/jpeg,image/svg+xml" type="file" />
              </label>
              <FormField label="اسم الشركة"><input defaultValue="TechCorp Egypt" /></FormField>
              <FormField label="نبذة عن الشركة"><textarea defaultValue="نقدم حلولاً برمجية وتدريبية مبتكرة." /></FormField>
              <div className="brand-swatches">
                {["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#8B5CF6"].map((color) => (
                  <button style={{ background: color }} type="button" key={color} aria-label={color} />
                ))}
              </div>
              <Button onClick={finish} disabled={loading} aria-busy={loading}>
                {loading ? <span className="btn-spinner" aria-hidden="true" /> : null}
                {loading ? "جاري الإنهاء..." : "إنهاء الإعداد"}
              </Button>
            </div>

            <div className="brand-preview-card">
              <div className="brand-preview-logo">TE</div>
              <h2>TechCorp Egypt</h2>
              <p>سيرى موظفوك هذه الهوية داخل AIN.</p>
              <div className="mini-stats">
                <span><strong>12</strong> روم</span>
                <span><strong>245</strong> عضو</span>
                <span><strong>320</strong> ملف</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function JoinWorkspacePage() {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [code, setCode] = useState("TECHCORP-2026");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!code.trim()) {
      showToast("أدخل كود الدعوة", "danger");
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    navigate("/login?role=end-user");
  };

  return (
    <main className="flow-page" dir={language === "ar" ? "rtl" : "ltr"}>
      <FlowHeader />
      <section className="center-flow">
        <form className="flow-card join-card" onSubmit={submit} noValidate>
          <div className="choice-icon cyan"><KeyRound size={34} /></div>
          <h1>الانضمام لمساحة عمل قائمة</h1>
          <p>أدخل كود الدعوة من مدير شركتك. سنقوم بربط حسابك بعد تسجيل الدخول.</p>
          <FormField label="كود الدعوة">
            <input value={code} onChange={(event) => setCode(event.target.value)} required />
          </FormField>
          <Button className="full-width" type="submit" disabled={loading} aria-busy={loading}>
            {loading ? <span className="btn-spinner" aria-hidden="true" /> : null}
            {loading ? "جاري التحقق..." : "تحقق من الكود والمتابعة"}
          </Button>
          <Button as={Link} to="/no-workspace" variant="ghost">ليس لدي كود</Button>
        </form>
      </section>
    </main>
  );
}

export function NoWorkspacePage() {
  const { user } = useAuth();
  const { language } = useLanguage();

  return (
    <main className="flow-page" dir={language === "ar" ? "rtl" : "ltr"}>
      <FlowHeader />
      <section className="center-flow">
        <div className="flow-card join-card">
          <div className="choice-icon cyan"><Search size={34} /></div>
          <h1>{user ? "حسابك جاهز، لكن لا توجد مساحة عمل بعد" : "لست مرتبطاً بأي مساحة عمل بعد"}</h1>
          <p>
            {user
              ? `اطلب من مدير شركتك دعوة ${user.email}. عندما تصل الدعوة، ستظهر هنا أو تفتح من رابط الدعوة مباشرة.`
              : "أنشئ حساباً أولاً، ثم اطلب من مدير شركتك دعوة نفس البريد أو أدخل كود دعوة."}
          </p>
          <div className="inline-form">
            <input placeholder="أدخل كود الدعوة مثال: TECHCORP-2026" />
            <Button as={Link} to="/join">انضمام</Button>
          </div>
          {user && (
            <div className="pending-invite-box">
              <strong>لا توجد دعوات معلّقة حالياً</strong>
              <span>سيتحقق الباك اند من الدعوات عبر البريد الإلكتروني ويعرض مساحات العمل المتاحة هنا.</span>
            </div>
          )}
          <div className="flow-actions">
            <Button as={Link} to="/invite/demo-token" variant="ghost">معاينة الدعوة</Button>
            {user ? (
              <Button as={Link} to="/login" variant="ghost">تبديل الحساب</Button>
            ) : (
              <Button as={Link} to="/create-account">إنشاء حساب شخصي</Button>
            )}
            <Button as={Link} to="/register-company" variant="ghost">إنشاء مساحة عمل لشركة</Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export function InviteAcceptPage() {
  const { token } = useParams();
  const { language } = useLanguage();

  return (
    <main className="stitch-auth-page stitch-invite-page" dir={language === "ar" ? "rtl" : "ltr"}>
      <FlowHeader />
      <section className="center-flow">
        <div className="flow-card invite-card stitch-invite-card">
          <div className="choice-icon"><Building2 size={34} /></div>
          <span className="flow-badge">دعوة للانضمام</span>
          <h1>فريق تحليل البيانات</h1>
          <p>دعتك سارة أحمد للانضمام إلى مساحة العمل. Token: {token}</p>
          <div className="invite-summary">
            <div><strong>الدور</strong><span>عضو في الشركة / مستخدم نهائي</span></div>
            <div><strong>الرومات</strong><span>البيانات، التقارير، الفريق</span></div>
            <div><strong>الداعي</strong><span>سارة أحمد</span></div>
          </div>
          <div className="invite-about-box">
            <strong>حول هذه المساحة</strong>
            <span>ستتمكن من الوصول إلى لوحات التحكم، تقارير الأداء، وأدوات التعاون الخاصة بالفريق.</span>
          </div>
          <div className="flow-actions">
            <Button as={Link} to="/login?role=end-user">قبول الدعوة</Button>
            <Button as={Link} to="/" variant="ghost">تجاهل</Button>
          </div>
        </div>
      </section>
      <footer className="stitch-auth-footer">
        <nav><a>الخصوصية</a><a>الشروط</a><a>الدعم</a></nav>
        <span>AIN Precision Systems 2026 ©</span>
      </footer>
    </main>
  );
}

export function NotFoundPage() {
  const { language } = useLanguage();
  return (
    <main className="flow-page" dir={language === "ar" ? "rtl" : "ltr"}>
      <section className="not-found">
        <div className="choice-icon"><LockKeyhole size={42} /></div>
        <strong>404</strong>
        <h1>الصفحة غير موجودة</h1>
        <p>الصفحة التي تبحث عنها غير موجودة أو انتقلت إلى مسار آخر في مساحة العمل.</p>
        <Button as={Link} to="/workspace"><ArrowLeft size={16} /> الذهاب لمسار مساحة العمل</Button>
      </section>
    </main>
  );
}

function FlowHeader() {
  return (
    <header className="flow-header">
      <Link className="flow-brand" to="/">
        <span>A</span>
        <strong>AIN</strong>
      </Link>
      <nav aria-label="روابط مساحة العمل">
        <Link to="/">الصفحة الرئيسية</Link>
        <Link to="/workspace">مساحة العمل</Link>
        <Link to="/login">تسجيل الدخول</Link>
      </nav>
    </header>
  );
}

function BrandLockup() {
  return (
    <Link className="flow-brand inline" to="/">
      <span>A</span>
      <strong>AIN</strong>
    </Link>
  );
}
