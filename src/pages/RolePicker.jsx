import { ArrowLeft, Building2, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { useLanguage } from "../contexts/LanguageContext";

export function RolePicker() {
  const { language } = useLanguage();

  return (
    <main className="flow-page" dir={language === "ar" ? "rtl" : "ltr"}>
      <FlowHeader />
      <section className="workspace-choice">
        <span className="flow-badge">بدون اختيار دور علني</span>
        <h1>إنشاء أو الانضمام لمساحة عمل</h1>
        <p>اختر المسار المناسب لك. حسابات مالكي المنصة داخلية فقط ولا تظهر أبداً في التسجيل العام.</p>

        <div className="choice-grid">
          <article className="choice-card">
            <div className="choice-icon"><Building2 size={32} /></div>
            <h2>إنشاء مساحة عمل لشركة</h2>
            <p>لأصحاب الأعمال والأكاديميات ومراكز التدريب والفرق التي تريد بدء مساحة عمل آمنة على AIN.</p>
            <div className="choice-pills">
              <span>المالك يصبح مدير الشركة</span>
              <span>تجربة مجانية 14 يوم</span>
            </div>
            <Button as={Link} to="/register-company">
              ابدأ إعداد الشركة
              <ArrowLeft size={16} />
            </Button>
          </article>

          <article className="choice-card">
            <div className="choice-icon cyan"><KeyRound size={32} /></div>
            <h2>الانضمام لمساحة عمل قائمة</h2>
            <p>للموظفين والطلاب والأعضاء الذين لديهم رابط دعوة أو كود مساحة عمل.</p>
            <div className="choice-pills">
              <span>يتطلب دعوة</span>
              <span>لا يوجد اختيار دور يدوي</span>
            </div>
            <Button as={Link} to="/join" variant="ghost">
              أدخل كود الدعوة
              <ArrowLeft size={16} />
            </Button>
          </article>
        </div>

        <div className="flow-note">
          <LockKeyhole size={18} />
          <span>مديرو المنصة الداخليون يسجلون الدخول ببيانات معتمدة مسبقاً. التسجيل العام لا يمكنه إنشاء صلاحيات على مستوى المنصة.</span>
        </div>
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
        <Link to="/login">تسجيل الدخول</Link>
        <Link to="/workspace">مساحة العمل</Link>
      </nav>
      <div className="flow-header-actions">
        <Button as={Link} to="/login" variant="ghost">تسجيل الدخول</Button>
        <Button as={Link} to="/register-company"><ShieldCheck size={16} /> ابدأ الآن</Button>
      </div>
    </header>
  );
}
