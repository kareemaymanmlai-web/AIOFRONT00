import { httpClient, shouldUseMockApi } from "./httpClient";

const storageKey = "aiofront_user";
const tokenKey = "aiofront_token";
const accountsKey = "aiofront_mock_accounts";
const pendingRegistrationKey = "aiofront_pending_registration";
const pendingResetKey = "aiofront_pending_reset";

const mockAccounts = {
  "super@ain.test": {
    id: "super-admin",
    name: "Platform Admin",
    role: "super-admin",
    roleLabel: "Super Admin",
    company: "All In One (AIN)",
    tenantId: null,
    permissions: ["manage_platform", "manage_tenants", "manage_billing"]
  },
  "admin@techcorp.test": {
    id: "tenant-admin",
    name: "Ahmed Mostafa",
    role: "tenant-admin",
    roleLabel: "Tenant Admin",
    company: "TechCorp Egypt",
    tenantId: "tenant_techcorp",
    permissions: ["manage_rooms", "manage_members", "upload_files", "view_reports"]
  },
  "employee@techcorp.test": {
    id: "end-user",
    name: "Mohamed Ahmed",
    role: "end-user",
    roleLabel: "End User",
    company: "TechCorp Egypt",
    tenantId: "tenant_techcorp",
    permissions: ["view_assigned_rooms", "view_files"]
  }
};

export const authService = {
  currentUser() {
    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch {
      window.localStorage.removeItem(storageKey);
      window.localStorage.removeItem(tokenKey);
      return null;
    }
  },

  async login({ email, password }) {
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!shouldUseMockApi()) {
      const result = await httpClient("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: normalizedEmail, password })
      });
      window.localStorage.setItem(storageKey, JSON.stringify(result.user));
      window.localStorage.setItem(tokenKey, result.token);
      return result.user;
    }

    const account = { ...mockAccounts, ...readStoredAccounts() }[normalizedEmail];
    if (!account || !isValidPassword(account, password)) {
      throw new Error("Email or password is incorrect");
    }

    const { password: _password, ...safeAccount } = account;
    const user = { ...safeAccount, email: normalizedEmail };
    window.localStorage.setItem(storageKey, JSON.stringify(user));
    window.localStorage.setItem(tokenKey, `mock-token-${user.role}-${Date.now()}`);
    return user;
  },

  async createPersonalAccount(payload) {
    const normalizedEmail = String(payload.email || "").trim().toLowerCase();
    const accounts = { ...mockAccounts, ...readStoredAccounts() };

    if (accounts[normalizedEmail]) {
      throw new Error("This email already has an account. Please sign in.");
    }

    const pending = {
      name: payload.name,
      email: normalizedEmail,
      password: payload.password,
      otp: "123456",
      createdAt: new Date().toISOString()
    };
    window.localStorage.setItem(pendingRegistrationKey, JSON.stringify(pending));
    return { email: normalizedEmail, delivery: "email", otp: pending.otp };
  },

  async verifyRegistrationOtp({ email, otp }) {
    const pending = readJson(pendingRegistrationKey);
    const normalizedEmail = String(email || pending?.email || "").trim().toLowerCase();

    if (!pending || pending.email !== normalizedEmail || String(otp) !== pending.otp) {
      throw new Error("Invalid verification code");
    }

    const account = {
      id: `user-${Date.now()}`,
      name: pending.name,
      email: pending.email,
      password: pending.password,
      role: "end-user",
      roleLabel: "Workspace Member",
      company: "No workspace yet",
      tenantId: null,
      workspaceStatus: "none",
      permissions: ["pending_workspace"]
    };
    const accounts = readStoredAccounts();
    accounts[pending.email] = account;
    writeStoredAccounts(accounts);
    window.localStorage.removeItem(pendingRegistrationKey);

    const { password: _password, ...safeAccount } = account;
    window.localStorage.setItem(storageKey, JSON.stringify(safeAccount));
    window.localStorage.setItem(tokenKey, `mock-token-${safeAccount.role}-${Date.now()}`);
    return safeAccount;
  },

  async requestPasswordReset({ email }) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const account = { ...mockAccounts, ...readStoredAccounts() }[normalizedEmail];

    if (!account) {
      throw new Error("No account found for this email");
    }

    const pending = { email: normalizedEmail, otp: "123456", createdAt: new Date().toISOString() };
    window.localStorage.setItem(pendingResetKey, JSON.stringify(pending));
    return { email: normalizedEmail, delivery: "email", otp: pending.otp };
  },

  async resetPassword({ email, otp, password }) {
    const pending = readJson(pendingResetKey);
    const normalizedEmail = String(email || pending?.email || "").trim().toLowerCase();

    if (!pending || pending.email !== normalizedEmail || String(otp) !== pending.otp) {
      throw new Error("Invalid reset code");
    }

    const storedAccounts = readStoredAccounts();
    if (storedAccounts[normalizedEmail]) {
      storedAccounts[normalizedEmail] = { ...storedAccounts[normalizedEmail], password };
      writeStoredAccounts(storedAccounts);
    }

    window.localStorage.removeItem(pendingResetKey);
    return { email: normalizedEmail };
  },

  logout() {
    window.localStorage.removeItem(storageKey);
    window.localStorage.removeItem(tokenKey);
  }
};

function isValidPassword(account, password) {
  if (account.password) return account.password === password;
  return String(password || "").length >= 6;
}

function readStoredAccounts() {
  return readJson(accountsKey) || {};
}

function writeStoredAccounts(accounts) {
  window.localStorage.setItem(accountsKey, JSON.stringify(accounts));
}

function readJson(key) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
}
