import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TargetRole, SkillLevel } from "@/data/skillData";

export interface StudentProfile {
  name: string;
  email: string;
  college: string;
  year: string;
  avatar: string;
  targetRole: TargetRole | null;
  skills: Array<{ skill: string; level: SkillLevel }>;
}

export interface ModuleProgress {
  moduleId: string;
  completed: boolean;
  testScore: number | null;
  testPassed: boolean;
  studyTimeMinutes: number;
}

export interface CodingStats {
  platform: string;
  username: string;
  easy: number;
  medium: number;
  hard: number;
  total: number;
  contestRating: number;
  streakDays: number;
  weeklyActivity: number[];
}

export interface AppState {
  isAuthenticated: boolean;
  profile: StudentProfile;
  moduleProgress: ModuleProgress[];
  codingStats: CodingStats[];
  chatMessages: Array<{ role: "user" | "assistant"; content: string }>;
  darkMode: boolean;
  activeSection: string;
  companies: any[];
}

interface AppContextType extends AppState {
  login: (email: string, name: string) => void;
  logout: () => void;
  updateProfile: (profile: Partial<StudentProfile>) => void;
  addSkill: (skill: string, level: SkillLevel) => void;
  removeSkill: (skill: string) => void;
  updateModuleProgress: (progress: ModuleProgress) => void;
  addCodingStats: (stats: CodingStats) => void;
  addChatMessage: (msg: { role: "user" | "assistant"; content: string }) => void;
  toggleDarkMode: () => void;
  setActiveSection: (section: string) => void;
}

const defaultProfile: StudentProfile = {
  name: "",
  email: "",
  college: "",
  year: "",
  avatar: "",
  targetRole: null,
  skills: [],
};

const AppContext = createContext<AppContextType | null>(null);

const BACKEND_URL = "http://localhost:5001/api";

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    profile: defaultProfile,
    moduleProgress: [],
    codingStats: [],
    chatMessages: [],
    darkMode: false,
    activeSection: "dashboard",
    companies: [],
  });

  // Load state from Backend on mount
  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/state`);
        if (response.ok) {
          const dbData = await response.json();
          setState((s) => ({ ...s, ...dbData }));
        }
      } catch (e) {
        console.warn("Backend down, using storage fallback");
        const saved = localStorage.getItem("skill-bridge-data");
        if (saved) setState((s) => ({ ...s, ...JSON.parse(saved) }));
      }
    };
    fetchState();
  }, []);

  // Sync core data to Backend on changes
  useEffect(() => {
    const syncState = async () => {
      try {
        await fetch(`${BACKEND_URL}/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile: state.profile,
            moduleProgress: state.moduleProgress,
            codingStats: state.codingStats,
            chatMessages: state.chatMessages,
          }),
        });
      } catch (e) {
        localStorage.setItem("skill-bridge-data", JSON.stringify(state));
      }
    };
    if (state.isAuthenticated) syncState();
  }, [state.profile, state.moduleProgress, state.codingStats, state.isAuthenticated]);

  const login = (email: string, name: string) => {
    setState((s) => ({
      ...s,
      isAuthenticated: true,
      profile: { ...s.profile, email, name: name || email.split("@")[0] },
    }));
  };

  const logout = () => {
    setState((s) => ({ ...s, isAuthenticated: false, profile: defaultProfile }));
  };

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...updates } }));
  };

  const addSkill = (skill: string, level: SkillLevel) => {
    setState((s) => {
      const existing = s.profile.skills.findIndex((sk) => sk.skill === skill);
      const skills =
        existing >= 0
          ? s.profile.skills.map((sk, i) => (i === existing ? { skill, level } : sk))
          : [...s.profile.skills, { skill, level }];
      return { ...s, profile: { ...s.profile, skills } };
    });
  };

  const removeSkill = (skill: string) => {
    setState((s) => ({
      ...s,
      profile: { ...s.profile, skills: s.profile.skills.filter((sk) => sk.skill !== skill) },
    }));
  };

  const updateModuleProgress = (progress: ModuleProgress) => {
    setState((s) => {
      const existing = s.moduleProgress.findIndex((m) => m.moduleId === progress.moduleId);
      const moduleProgress =
        existing >= 0
          ? s.moduleProgress.map((m, i) => (i === existing ? progress : m))
          : [...s.moduleProgress, progress];
      return { ...s, moduleProgress };
    });
  };

  const addCodingStats = (stats: CodingStats) => {
    setState((s) => {
      const existing = s.codingStats.findIndex((c) => c.platform === stats.platform);
      const codingStats =
        existing >= 0
          ? s.codingStats.map((c, i) => (i === existing ? stats : c))
          : [...s.codingStats, stats];
      return { ...s, codingStats };
    });
  };

  const addChatMessage = (msg: { role: "user" | "assistant"; content: string }) => {
    setState((s) => ({ ...s, chatMessages: [...s.chatMessages, msg] }));
  };

  const toggleDarkMode = () => {
    setState((s) => ({ ...s, darkMode: !s.darkMode }));
  };

  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [state.darkMode]);

  const setActiveSection = (section: string) => {
    setState((s) => ({ ...s, activeSection: section }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateProfile,
        addSkill,
        removeSkill,
        updateModuleProgress,
        addCodingStats,
        addChatMessage,
        toggleDarkMode,
        setActiveSection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
