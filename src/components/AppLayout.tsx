import { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard, User, TrendingUp, BookOpen, Code2,
  Trophy, FileText, Building2, MessageSquare, Brain,
  LogOut, Moon, Sun, Menu, X, ChevronRight
} from "lucide-react";


const NAV_ITEMS = [
  { id: "dashboard", icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard" },
  { id: "profile", icon: <User className="w-4 h-4" />, label: "My Profile" },
  { id: "skillgap", icon: <TrendingUp className="w-4 h-4" />, label: "Skill Gap Analysis" },
  { id: "learning", icon: <BookOpen className="w-4 h-4" />, label: "Learning Modules" },
  { id: "coding", icon: <Code2 className="w-4 h-4" />, label: "Coding Tracker" },
  { id: "certificates", icon: <Trophy className="w-4 h-4" />, label: "Certificates" },
  { id: "resume", icon: <FileText className="w-4 h-4" />, label: "Resume Generator" },
  { id: "companies", icon: <Building2 className="w-4 h-4" />, label: "Companies" },
  { id: "ai", icon: <MessageSquare className="w-4 h-4" />, label: "AI Assistant" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile, logout, toggleDarkMode, darkMode, activeSection, setActiveSection } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static z-50 h-full w-64 flex-shrink-0 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "hsl(var(--sidebar-background))" }}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow-blue">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-sidebar-foreground text-base leading-tight">Skill Gap Analyzer</h1>
                <p className="text-[10px] text-sidebar-foreground/60">Placement Readiness Platform</p>
              </div>
              <button className="ml-auto lg:hidden text-sidebar-foreground/60" onClick={() => setSidebarOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User info */}
          <div className="px-4 py-3 mx-3 mt-3 rounded-xl" style={{ background: "rgba(120, 120, 120, 0.1)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-primary-foreground font-bold text-sm">
                {(profile.name || "S").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sidebar-foreground text-sm font-semibold truncate">{profile.name || "Student"}</p>
                <p className="text-[11px] text-sidebar-foreground/60 truncate">{profile.targetRole || "Set your target role"}</p>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
            {NAV_ITEMS.map(({ id, icon, label }) => (
              <button key={id} onClick={() => { setActiveSection(id); setSidebarOpen(false); }}
                className={`nav-item w-full ${activeSection === id ? "active" : "text-sidebar-foreground/70"}`}>
                {icon}
                <span className="flex-1 text-left">{label}</span>
                {activeSection === id && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ))}
          </nav>

          {/* Bottom actions */}
          <div className="p-3 border-t border-sidebar-border flex gap-2">
            <button onClick={toggleDarkMode}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-all text-xs">
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {darkMode ? "Light" : "Dark"}
            </button>
            <button onClick={logout}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-all text-xs">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile topbar */}
        <div className="sticky top-0 z-30 lg:hidden flex items-center gap-3 px-4 py-3 glass-card border-b border-border/40">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-sm text-foreground">Skill Gap Analyzer</span>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
