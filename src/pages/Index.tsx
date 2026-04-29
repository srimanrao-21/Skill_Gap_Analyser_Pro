import React, { useState } from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import AppLayout from "@/components/AppLayout";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import ProfilePage from "@/pages/ProfilePage";
import SkillGapPage from "@/pages/SkillGapPage";
import LearningPage from "@/pages/LearningPage";
import CodingTrackerPage from "@/pages/CodingTrackerPage";
import CertificatesPage from "@/pages/CertificatesPage";
import ResumeGeneratorPage from "@/pages/ResumeGeneratorPage";
import CompaniesPage from "@/pages/CompaniesPage";
import AIChatPage from "@/pages/AIChatPage";

type Screen = "landing" | "signin" | "signup";

function AppContent() {
  const { isAuthenticated, activeSection } = useApp();
  const [screen, setScreen] = useState<Screen>("landing");

  // ── STEP 1: Always show landing page first on load ──────────────────────
  // (even if auth state was restored from localStorage/backend)
  if (screen === "landing") {
    return (
      <LandingPage
        onSignIn={() => setScreen("signin")}
        onSignUp={() => setScreen("signup")}
      />
    );
  }

  // ── STEP 2: User clicked a button — now check auth ──────────────────────
  // If already authenticated (restored from session), go straight to app
  if (isAuthenticated) {
    const pages: Record<string, React.ReactNode> = {
      dashboard: <DashboardPage />,
      profile: <ProfilePage />,
      skillgap: <SkillGapPage />,
      learning: <LearningPage />,
      coding: <CodingTrackerPage />,
      certificates: <CertificatesPage />,
      resume: <ResumeGeneratorPage />,
      companies: <CompaniesPage />,
      ai: <AIChatPage />,
    };
    return <AppLayout>{pages[activeSection] ?? <DashboardPage />}</AppLayout>;
  }

  // ── STEP 3: Not authenticated — show sign in / sign up form ─────────────
  return (
    <AuthPage
      initialMode={screen === "signup" ? "register" : "login"}
      onBack={() => setScreen("landing")}
    />
  );
}

const Index = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default Index;
