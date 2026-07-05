import { Camera, LockKeyhole, Mail, Palette, ShieldCheck, Smartphone, UserRound } from "lucide-react";
import { useState } from "react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { PageHeader } from "./PageHeader";

export function AccountSettings({ user, workspaceLabel = "Workspace" }) {
  const [avatarPreview, setAvatarPreview] = useState("");
  const settingGroups = [
    ["Workspace", ["General", "People", "Security & Permissions", "Audit Logs"]],
    ["Features", ["Template Center", "Automations", "Spaces", "Work Schedule"]],
    ["My Settings", ["Profile", "Notifications", "Themes", "Keyboard shortcuts"]]
  ];
  const colors = ["#4F46E5", "#7C3AED", "#0EA5E9", "#EC4899", "#A855F7", "#6366F1", "#F97316", "#14B8A6", "#A78BFA", "#10B981"];

  const onAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  };

  return (
    <div className="settings-workspace">
      <aside className="settings-sidebar">
        <strong>All settings</strong>
        {settingGroups.map(([title, items]) => (
          <div className="settings-group" key={title}>
            <span>{title}</span>
            {items.map((item) => (
              <button className={item === "Profile" || item === "General" ? "active" : ""} type="button" key={item}>
                <UserRound size={15} />
                {item}
              </button>
            ))}
          </div>
        ))}
      </aside>
      <main className="settings-main">
        <PageHeader title="My Settings" subtitle={`Profile, security, and preferences for ${workspaceLabel}`} />
        <section className="settings-section">
          <div className="settings-section-copy">
            <h3>Profile</h3>
            <p>Your personal information and profile picture.</p>
          </div>
          <div className="settings-form-card">
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
              <strong>{user.name}</strong>
              <span>Online</span>
            </div>
            <label>
              <span>Full Name</span>
              <div className="settings-input"><UserRound size={15} /> <input defaultValue={user.name} /></div>
            </label>
            <label>
              <span>Email</span>
              <div className="settings-input"><Mail size={15} /> <input defaultValue={user.email} /></div>
            </label>
            <label>
              <span>Password</span>
              <div className="settings-input"><LockKeyhole size={15} /> <input placeholder="Enter new password" type="password" /></div>
            </label>
            <div className="settings-form-actions">
              <Button>Save profile</Button>
              <Button variant="ghost">Cancel</Button>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-copy">
            <h3>Two-factor authentication (2FA)</h3>
            <p>Keep your account secure using SMS or authenticator app passcodes.</p>
          </div>
          <div className="settings-options">
            <SettingOption icon={<Smartphone size={17} />} title="Text Message (SMS)" subtitle="Receive a one-time passcode via SMS each time you log in." badge="Business" />
            <SettingOption icon={<ShieldCheck size={17} />} title="Authenticator App (TOTP)" subtitle="Use an app to receive a temporary one-time passcode." />
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-copy">
            <h3>Theme color</h3>
            <p>Choose a preferred color for the app.</p>
          </div>
          <div className="theme-settings">
            <div className="color-swatches">
              {colors.map((color, index) => <button className={index === 0 ? "selected" : ""} style={{ background: color }} type="button" key={color} aria-label={`Theme color ${color}`} />)}
            </div>
            <div className="appearance-cards">
              <button className="appearance-card light-card" type="button"><Palette size={18} /> Light</button>
              <button className="appearance-card dark-card selected" type="button"><Palette size={18} /> Dark</button>
              <button className="appearance-card system-card" type="button"><Palette size={18} /> System</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SettingOption({ icon, title, subtitle, badge }) {
  return (
    <div className="setting-option">
      <button className="toggle-switch" type="button" aria-label={title}><span /></button>
      <div className="setting-option-icon">{icon}</div>
      <div>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
      {badge && <Badge tone="primary">{badge}</Badge>}
    </div>
  );
}
