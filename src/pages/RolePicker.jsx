import { ArrowRight, Building2, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";

export function RolePicker() {
  return (
    <main className="flow-page">
      <FlowHeader />
      <section className="workspace-choice">
        <span className="flow-badge">No public role selection</span>
        <h1>Create or Join Workspace</h1>
        <p>
          Choose the trusted flow. Platform owner accounts are internal only and never appear in public onboarding.
        </p>

        <div className="choice-grid">
          <article className="choice-card">
            <div className="choice-icon"><Building2 size={32} /></div>
            <h2>Create Company Workspace</h2>
            <p>For business owners, academies, training centers, and teams starting a secure AIN workspace.</p>
            <div className="choice-pills">
              <span>Owner becomes Company Admin</span>
              <span>14-day trial</span>
            </div>
            <Button as={Link} to="/register-company">
              Start Company Setup
              <ArrowRight size={16} />
            </Button>
          </article>

          <article className="choice-card">
            <div className="choice-icon cyan"><KeyRound size={32} /></div>
            <h2>Join Existing Workspace</h2>
            <p>For employees, students, and members who have an invitation link or workspace code.</p>
            <div className="choice-pills">
              <span>Invitation required</span>
              <span>No manual role choice</span>
            </div>
            <Button as={Link} to="/join" variant="ghost">
              Enter Invitation Code
              <ArrowRight size={16} />
            </Button>
          </article>
        </div>

        <div className="flow-note">
          <LockKeyhole size={18} />
          <span>Internal platform admins sign in with seeded credentials. Public registration cannot create platform-level access.</span>
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
      <nav aria-label="Workspace links">
        <Link to="/">Landing</Link>
        <Link to="/login">Login</Link>
        <Link to="/workspace">Workspace</Link>
      </nav>
      <div className="flow-header-actions">
        <Button as={Link} to="/login" variant="ghost">Login</Button>
        <Button as={Link} to="/register-company"><ShieldCheck size={16} /> Get Started</Button>
      </div>
    </header>
  );
}
