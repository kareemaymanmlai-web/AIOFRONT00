import { ArrowLeft, ArrowRight, Building2, CheckCircle2, CloudUpload, KeyRound, LockKeyhole, Search, ShieldCheck, UserPlus } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { FormField } from "../components/FormField";
import { useAuth } from "../contexts/AuthContext";

export function RegisterCompanyPage() {
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    navigate("/company-onboarding");
  };

  return (
    <main className="flow-page">
      <FlowHeader />
      <section className="auth-split">
        <form className="flow-card form-grid" onSubmit={submit}>
          <BrandLockup />
          <div>
            <span className="flow-badge">Create Company Workspace</span>
            <h1>Create your company</h1>
            <p>Start a 14-day trial. The creator becomes Company Owner/Admin after backend confirmation.</p>
          </div>
          <FormField label="Company name"><input defaultValue="TechCorp Egypt" required /></FormField>
          <FormField label="Your name"><input defaultValue="Ahmed Mohamed" required /></FormField>
          <FormField label="Email address"><input defaultValue="owner@techcorp.com" type="email" required /></FormField>
          <FormField label="Password"><input defaultValue="12345678" minLength={8} type="password" required /></FormField>
          <FormField label="Confirm password"><input defaultValue="12345678" minLength={8} type="password" required /></FormField>
          <label className="check-line"><input defaultChecked type="checkbox" /> I agree to Terms and Privacy Policy</label>
          <Button className="full-width" type="submit">Create Company</Button>
        </form>

        <aside className="flow-side-card">
          <div className="choice-icon"><Building2 size={36} /></div>
          <h2>Secure. Simple. Powerful.</h2>
          <p>Everything a company needs to manage protected rooms, content access, members, and analytics.</p>
          <div className="choice-pills vertical">
            <span>Secure content protection</span>
            <span>One device access</span>
            <span>Advanced analytics</span>
          </div>
        </aside>
      </section>
    </main>
  );
}

export function CompanyOnboardingPage() {
  const navigate = useNavigate();
  const steps = ["Branding", "Info", "Plan", "Success"];

  return (
    <main className="flow-page">
      <FlowHeader />
      <section className="onboarding-shell">
        <div className="flow-card">
          <div className="onboarding-head">
            <div>
              <span className="flow-badge">Company Onboarding</span>
              <h1>Let's set up your brand</h1>
              <p>Upload the logo, choose a brand color, and confirm the plan before opening the dashboard.</p>
            </div>
            <div className="step-pills">
              {steps.map((step, index) => <span className={index === 0 ? "active" : ""} key={step}>{index + 1} {step}</span>)}
            </div>
          </div>

          <div className="onboarding-grid">
            <div className="form-grid">
              <label className="upload-zone">
                <CloudUpload size={34} />
                <strong>Upload logo</strong>
                <span>PNG, JPG, or SVG recommended 400x400</span>
                <input accept="image/png,image/jpeg,image/svg+xml" type="file" />
              </label>
              <FormField label="Company name"><input defaultValue="TechCorp Egypt" /></FormField>
              <FormField label="Company bio"><textarea defaultValue="We provide innovative software and training solutions." /></FormField>
              <div className="brand-swatches">
                {["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#8B5CF6"].map((color) => <button style={{ background: color }} type="button" key={color} aria-label={color} />)}
              </div>
              <Button onClick={() => navigate("/login?role=tenant-admin")}>Finish setup</Button>
            </div>

            <div className="brand-preview-card">
              <div className="brand-preview-logo">TE</div>
              <h2>TechCorp Egypt</h2>
              <p>Your employees will see this identity inside AIN.</p>
              <div className="mini-stats">
                <span><strong>12</strong> Rooms</span>
                <span><strong>245</strong> Members</span>
                <span><strong>320</strong> Files</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function JoinWorkspacePage() {
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    navigate("/login?role=end-user");
  };

  return (
    <main className="flow-page">
      <FlowHeader />
      <section className="center-flow">
        <form className="flow-card join-card" onSubmit={submit}>
          <div className="choice-icon cyan"><KeyRound size={34} /></div>
          <h1>Join Existing Workspace</h1>
          <p>Enter the invitation code from your company admin. We will attach your account after login.</p>
          <FormField label="Invitation code">
            <input defaultValue="TECHCORP-2026" required />
          </FormField>
          <Button className="full-width" type="submit">Validate code and continue</Button>
          <Button as={Link} to="/no-workspace" variant="ghost">I do not have a code</Button>
        </form>
      </section>
    </main>
  );
}

export function NoWorkspacePage() {
  const { user } = useAuth();

  return (
    <main className="flow-page">
      <FlowHeader />
      <section className="center-flow">
        <div className="flow-card join-card">
          <div className="choice-icon cyan"><Search size={34} /></div>
          <h1>{user ? "Your account is ready, but no workspace yet" : "You are not connected to any workspace yet"}</h1>
          <p>
            {user
              ? `Ask your company admin to invite ${user.email}. When the invitation arrives, it will appear here or open from the invitation link.`
              : "Create an account first, then ask your company admin to invite the same email or enter an invitation code."}
          </p>
          <div className="inline-form">
            <input placeholder="Enter invitation code e.g. TECHCORP-2026" />
            <Button as={Link} to="/join">Join</Button>
          </div>
          {user && (
            <div className="pending-invite-box">
              <strong>No pending invitations found</strong>
              <span>Backend will check invitations by email and show pending workspace access here.</span>
            </div>
          )}
          <div className="flow-actions">
            <Button as={Link} to="/invite/demo-token" variant="ghost">Preview invitation</Button>
            {user ? (
              <Button as={Link} to="/login" variant="ghost">Switch account</Button>
            ) : (
              <Button as={Link} to="/create-account">Create personal account</Button>
            )}
            <Button as={Link} to="/register-company" variant="ghost">Create Company Workspace</Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export function InviteAcceptPage() {
  const { token } = useParams();

  return (
    <main className="stitch-auth-page stitch-invite-page" dir="rtl">
      <FlowHeader />
      <section className="center-flow">
        <div className="flow-card invite-card stitch-invite-card">
          <div className="choice-icon"><Building2 size={34} /></div>
          <span className="flow-badge">دعوة للانضمام</span>
          <h1>فريق تحليل البيانات</h1>
          <p>دعتك سارة أحمد للانضمام إلى مساحة العمل. Token: {token}</p>
          <div className="invite-summary">
            <div><strong>الدور</strong><span>Company Member / End User</span></div>
            <div><strong>الرومات</strong><span>Data, Reports, Team</span></div>
            <div><strong>الداعي</strong><span>Sarah Ahmed</span></div>
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
        <span>AIN Precision Systems 2024 ©</span>
      </footer>
    </main>
  );
}

export function NotFoundPage() {
  return (
    <main className="flow-page">
      <section className="not-found">
        <div className="choice-icon"><LockKeyhole size={42} /></div>
        <strong>404</strong>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist or moved to another workspace route.</p>
        <Button as={Link} to="/workspace"><ArrowLeft size={16} /> Go to workspace flow</Button>
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
      <nav aria-label="Workspace links">
        <Link to="/">Landing</Link>
        <Link to="/workspace">Workspace</Link>
        <Link to="/login">Login</Link>
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
