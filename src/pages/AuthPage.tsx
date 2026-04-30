import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Brain, Mail, Lock, User, Eye, EyeOff, Sparkles,
  X, ChevronRight, Check, Plus, AlertCircle,
} from "lucide-react";

// ── User Registry (localStorage) ───────────────────────────────
interface StoredUser {
  email: string;
  password: string;
  name: string;
}

const USERS_KEY = "sga_users";
const GOOGLE_ACCS_KEY = "sga_google_accounts";

function getUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
function saveUser(u: StoredUser) {
  const users = getUsers();
  users.push(u);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function findUser(email: string, password: string): StoredUser | null {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password) ?? null;
}
function emailExists(email: string): boolean {
  return getUsers().some(u => u.email.toLowerCase() === email.toLowerCase());
}

// ── Google accounts (user-entered, stored locally) ─────────────
interface GoogleAccount { email: string; name: string; color: string; }
const AVATAR_COLORS = ["#4285F4", "#34A853", "#EA4335", "#FBBC05", "#9333ea", "#f97316"];

function getGoogleAccounts(): GoogleAccount[] {
  try { return JSON.parse(localStorage.getItem(GOOGLE_ACCS_KEY) || "[]"); } catch { return []; }
}
function saveGoogleAccount(acc: GoogleAccount) {
  const list = getGoogleAccounts().filter(a => a.email !== acc.email);
  list.unshift(acc);
  localStorage.setItem(GOOGLE_ACCS_KEY, JSON.stringify(list.slice(0, 5)));
}
function removeGoogleAccount(email: string) {
  const list = getGoogleAccounts().filter(a => a.email !== email);
  localStorage.setItem(GOOGLE_ACCS_KEY, JSON.stringify(list));
}

// ── Password strength ───────────────────────────────────────────
const PWD_CONDITIONS = [
  { id: "len",     label: "At least 8 characters",        test: (p: string) => p.length >= 8 },
  { id: "upper",  label: "One uppercase letter (A-Z)",    test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower",  label: "One lowercase letter (a-z)",    test: (p: string) => /[a-z]/.test(p) },
  { id: "num",    label: "One number (0-9)",              test: (p: string) => /[0-9]/.test(p) },
  { id: "special",label: "One special character (!@#…)",  test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(password: string) {
  const passed = PWD_CONDITIONS.filter((c) => c.test(password)).length;
  if (!password)        return { score: 0, label: "",       color: "" };
  if (passed <= 1)      return { score: 1, label: "Weak",   color: "#ef4444" };
  if (passed === 2)     return { score: 2, label: "Fair",   color: "#f97316" };
  if (passed <= 4)      return { score: 3, label: "Good",   color: "#eab308" };
  return                       { score: 4, label: "Strong", color: "#22c55e" };
}

// ── Google icon ─────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18L12.048 13.56c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

// ── Props ───────────────────────────────────────────────────────
interface AuthPageProps {
  initialMode?: "login" | "register";
  onBack?: () => void;
}

// ════════════════════════════════════════════════════════════════
export default function AuthPage({ initialMode = "login", onBack }: AuthPageProps) {
  const { login } = useApp();

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Google picker
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [googleAccounts, setGoogleAccounts] = useState<GoogleAccount[]>(getGoogleAccounts);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleEmailError, setGoogleEmailError] = useState("");
  const [addingGoogle, setAddingGoogle] = useState(false);
  const [googleLoading, setGoogleLoading] = useState<string | null>(null);

  // ── Email/Password submit ──────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) { setError("Please fill all required fields."); return; }
    if (!emailRegex.test(email)) { setError("Please enter a valid email address."); return; }

    if (mode === "register") {
      if (!name.trim()) { setError("Please enter your name."); return; }
      if (emailExists(email)) { setError("An account with this email already exists. Please sign in."); return; }
      const failed = PWD_CONDITIONS.filter(c => !c.test(password));
      if (failed.length > 0) {
        setError(`Password must include: ${failed.map(c => c.label).join(", ")}.`);
        return;
      }
      setLoading(true);
      await new Promise(r => setTimeout(r, 700));
      saveUser({ email, password, name: name.trim() });
      login(email, name.trim());
    } else {
      // Sign In — validate against registry
      setLoading(true);
      await new Promise(r => setTimeout(r, 700));
      const user = findUser(email, password);
      if (!user) {
        setError("Invalid email or password. Please check your credentials or sign up.");
        setLoading(false);
        return;
      }
      login(user.email, user.name);
    }
    setLoading(false);
  };

  // ── Google account entry ───────────────────────────────────────
  const handleAddGoogleEmail = () => {
    setGoogleEmailError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!googleEmail.trim()) { setGoogleEmailError("Please enter your Gmail address."); return; }
    if (!emailRegex.test(googleEmail)) { setGoogleEmailError("Please enter a valid email address."); return; }

    const acc: GoogleAccount = {
      email: googleEmail.trim(),
      name: googleEmail.split("@")[0],
      color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    };
    saveGoogleAccount(acc);
    const updated = getGoogleAccounts();
    setGoogleAccounts(updated);
    setGoogleEmail("");
    setAddingGoogle(false);
  };

  const handleGoogleAccountSelect = async (acc: GoogleAccount) => {
    setGoogleLoading(acc.email);
    await new Promise(r => setTimeout(r, 800));
    login(acc.email, acc.name);
    setGoogleLoading(null);
    setShowGooglePicker(false);
  };

  const handleRemoveGoogleAccount = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeGoogleAccount(email);
    setGoogleAccounts(getGoogleAccounts());
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50" />
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-green-400/20 to-blue-500/20 blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* ══ Google Picker Modal ══════════════════════════════════ */}
      {showGooglePicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <GoogleIcon />
                <button
                  onClick={() => { setShowGooglePicker(false); setAddingGoogle(false); setGoogleEmail(""); setGoogleEmailError(""); }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Choose an account</h2>
              <p className="text-sm text-gray-500 mt-0.5">to continue to Skill Gap Analyzer</p>
            </div>

            {/* Account list */}
            <div className="py-2 max-h-60 overflow-y-auto">
              {googleAccounts.length === 0 && !addingGoogle && (
                <div className="px-6 py-4 text-center text-sm text-gray-400">
                  No accounts added yet.<br />Click below to add your Gmail.
                </div>
              )}
              {googleAccounts.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => handleGoogleAccountSelect(acc)}
                  disabled={!!googleLoading}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: acc.color }}
                  >
                    {googleLoading === acc.email
                      ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      : acc.email[0].toUpperCase()
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{acc.name}</p>
                    <p className="text-xs text-gray-500 truncate">{acc.email}</p>
                  </div>
                  <button
                    onClick={(e) => handleRemoveGoogleAccount(acc.email, e)}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all"
                    title="Remove account"
                  >
                    <X size={12} />
                  </button>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0" />
                </button>
              ))}
            </div>

            {/* Add Gmail section */}
            <div className="border-t border-gray-100 px-4 py-3">
              {addingGoogle ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      type="email"
                      placeholder="Enter your Gmail address"
                      value={googleEmail}
                      onChange={e => { setGoogleEmail(e.target.value); setGoogleEmailError(""); }}
                      onKeyDown={e => e.key === "Enter" && handleAddGoogleEmail()}
                      className="flex-1 h-9 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                    />
                    <button
                      onClick={handleAddGoogleEmail}
                      className="px-3 h-9 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 font-medium"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => { setAddingGoogle(false); setGoogleEmail(""); setGoogleEmailError(""); }}
                      className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  {googleEmailError && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={11} /> {googleEmailError}
                    </p>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAddingGoogle(true)}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-blue-600 font-medium"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                    <Plus size={14} className="text-gray-400" />
                  </div>
                  Add Google account
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-3 text-center">
              <p className="text-[11px] text-gray-400">
                <span className="text-blue-500 cursor-pointer hover:underline">Privacy Policy</span>
                {" · "}
                <span className="text-blue-500 cursor-pointer hover:underline">Terms of Service</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══ Auth Card ════════════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-scale-in">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </button>
        )}

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-glow-blue">
              <Brain className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold gradient-text">Skill Gap Analyzer</h1>
          <p className="text-muted-foreground mt-1 text-sm">Your Placement Readiness Platform</p>
        </div>

        <div className="glass-card rounded-3xl p-8">
          {/* Tabs */}
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            {(["login", "register"] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  mode === m
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Google button */}
          <button
            type="button"
            className="google-btn mb-4"
            onClick={() => { setShowGooglePicker(true); setGoogleAccounts(getGoogleAccounts()); }}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="auth-divider">or {mode === "login" ? "sign in" : "sign up"} with email</div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {mode === "register" && (
              <div className="animate-fade-in">
                <Label className="text-sm font-medium mb-1.5 block">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="John Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-border/60 bg-white/60"
                  />
                </div>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium mb-1.5 block">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-border/60 bg-white/60"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-1.5 block">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 rounded-xl border-border/60 bg-white/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength indicator — Sign Up only */}
              {mode === "register" && password.length > 0 && (() => {
                const s = getStrength(password);
                return (
                  <div className="mt-2.5 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1 flex-1">
                        {[1, 2, 3, 4].map(seg => (
                          <div
                            key={seg}
                            className="h-1.5 flex-1 rounded-full transition-all duration-300"
                            style={{ background: seg <= s.score ? s.color : "#e2e8f0" }}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold w-12 text-right" style={{ color: s.color }}>
                        {s.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {PWD_CONDITIONS.map(cond => {
                        const ok = cond.test(password);
                        return (
                          <div key={cond.id} className="flex items-center gap-2 text-xs transition-colors" style={{ color: ok ? "#22c55e" : "#94a3b8" }}>
                            <span
                              className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 border transition-all"
                              style={{ background: ok ? "#22c55e" : "transparent", borderColor: ok ? "#22c55e" : "#cbd5e1" }}
                            >
                              {ok && <Check size={9} color="#fff" strokeWidth={3} />}
                            </span>
                            {cond.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl btn-gradient-primary font-semibold text-base mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {mode === "login" ? "Sign In" : "Create Account"}
                </span>
              )}
            </Button>

            {mode === "login" && (
              <p className="text-center text-xs text-muted-foreground">
                Don't have an account?{" "}
                <button type="button" onClick={() => { setMode("register"); setError(""); }}
                  className="text-brand-blue font-semibold hover:underline">
                  Sign Up
                </button>
              </p>
            )}
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Built to help students become placement-ready 🚀
        </p>
      </div>
    </div>
  );
}
