import React from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import AppLayout from "@/components/AppLayout";
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

function AppContent() {
  const { isAuthenticated, activeSection } = useApp();

  if (!isAuthenticated) return <AuthPage />;

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

  return (
    <AppLayout>
      {pages[activeSection] ?? <DashboardPage />}
    </AppLayout>
  );
}

const Index = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default Index;
