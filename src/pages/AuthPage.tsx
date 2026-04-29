import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Mail, Lock, User, Eye, EyeOff, Sparkles, X, ChevronRight } from "lucide-react";

interface AuthPageProps {
  initialMode?: "login" | "register";
  onBack?: () => void;
}

// Demo Google accounts shown in picker
const GOOGLE_ACCOUNTS = [
  {
    name: "Sriman Rao",
    email: "srimanrao21@gmail.com",
    avatar: "SR",
    avatarColor: "#4285F4",
  },
  {
    name: "Demo User",
    email: "demo.user@gmail.com",
    avatar: "DU",
    avatarColor: "#34A853",
  },
  {
    name: "Test Account",
    email: "testaccount@gmail.com",
    avatar: "TA",
    avatarColor: "#EA4335",
  },
];

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18L12.048 13.56c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

export default function AuthPage({ initialMode = "login", onBack }: AuthPageProps) {
  const { login } = useApp();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Google account picker state
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [googleLoading, setGoogleLoading] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill all required fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (mode === "register" && !name) {
      setError("Please enter your name.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login(email, name || email.split("@")[0]);
    setLoading(false);
  };

  const handleGoogleAccountSelect = async (account: typeof GOOGLE_ACCOUNTS[0]) => {
    setGoogleLoading(account.email);
    await new Promise((r) => setTimeout(r, 1000)); // simulate OAuth redirect
    login(account.email, account.name);
    setGoogleLoading(null);
    setShowGooglePicker(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50" />
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-green-400/20 to-blue-500/20 blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* ── Google Account Picker Modal ── */}
      {showGooglePicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-scale-in">
            {/* Modal header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <GoogleIcon />
                <button
                  onClick={() => setShowGooglePicker(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Choose an account</h2>
              <p className="text-sm text-gray-500 mt-0.5">to continue to Skill Gap Analyzer</p>
            </div>

            {/* Account list */}
            <div className="py-2">
              {GOOGLE_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  onClick={() => handleGoogleAccountSelect(account)}
                  disabled={!!googleLoading}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: account.avatarColor }}
                  >
                    {googleLoading === account.email ? (
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      account.avatar
                    )}
                  </div>

                  {/* Name & email */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{account.name}</p>
                    <p className="text-xs text-gray-500 truncate">{account.email}</p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>

            {/* Use another account */}
            <div className="border-t border-gray-100 px-4 py-3">
              <button
                className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-blue-600 font-medium"
                onClick={() => setShowGooglePicker(false)}
              >
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                  <User size={14} className="text-gray-400" />
                </div>
                Use another account
              </button>
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

      {/* ── Auth Card ── */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-scale-in">
        {/* Back to landing */}
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

        {/* Card */}
        <div className="glass-card rounded-3xl p-8">
          {/* Tabs */}
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 capitalize ${
                  mode === m
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Google Sign-In — opens picker */}
          <button
            type="button"
            className="google-btn mb-4"
            onClick={() => setShowGooglePicker(true)}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="auth-divider">or sign in with email</div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {mode === "register" && (
              <div className="animate-fade-in">
                <Label className="text-sm font-medium mb-1.5 block">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
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
          </form>

          {/* Demo hint */}
          <div className="mt-5 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
            <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
              <strong>Demo:</strong> Enter any email &amp; password to explore
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Built to help students become placement-ready 🚀
        </p>
      </div>
    </div>
  );
}
