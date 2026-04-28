import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { analyzeSkillGap } from "@/data/skillData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart2, TrendingUp, Code2, BookOpen, Trophy,
  CheckCircle2, AlertCircle, XCircle, ArrowRight, Target
} from "lucide-react";

function ScoreRing({ score, color, label, size = 120 }: { score: number; color: string; label: string; size?: number }) {
  const r = size / 2 - 12;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center flex-col gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth="9" className="text-muted/30" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="9"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-display font-bold" style={{ color }}>{score}%</span>
      </div>
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

import { MODULES } from "@/data/learningData";

export default function DashboardPage() {
  const { profile, moduleProgress, codingStats, setActiveSection } = useApp();

  const skillAnalysis = useMemo(() => {
    if (!profile.targetRole || !profile.skills.length) return null;
    return analyzeSkillGap(profile.skills, profile.targetRole);
  }, [profile]);

  const modulesPassedCount = moduleProgress.filter((m) => m.testPassed).length;
  const totalModulesCount = MODULES.length;
  const learningProgress = Math.round((modulesPassedCount / totalModulesCount) * 100);

  const totalSolved = codingStats.reduce((acc, s) => acc + s.total, 0);
  const codingScore = Math.min(100, Math.round((totalSolved / 300) * 100));
  const skillScore = skillAnalysis?.readinessScore ?? 0;

  const finalReadiness = Math.round(
    (skillScore * 0.4) + (codingScore * 0.3) + (learningProgress * 0.3)
  );

  const readinessLabel =
    finalReadiness >= 80 ? { text: "✅ Job Ready!", color: "text-green-600", bg: "bg-green-50 border-green-200" }
    : finalReadiness >= 60 ? { text: "⚡ Almost Ready", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" }
    : { text: "📚 Keep Learning", color: "text-red-500", bg: "bg-red-50 border-red-200" };

  const stats = [
    { icon: <Target className="w-5 h-5" />, label: "Skills Added", value: profile.skills.length, color: "from-blue-500 to-purple-600", action: "profile" },
    { icon: <TrendingUp className="w-5 h-5" />, label: "Skill Readiness", value: `${skillScore}%`, color: "from-purple-500 to-pink-600", action: "skillgap" },
    { icon: <BookOpen className="w-5 h-5" />, label: "Modules Passed", value: `${modulesPassedCount}/${totalModulesCount}`, color: "from-green-500 to-teal-600", action: "learning" },
    { icon: <Code2 className="w-5 h-5" />, label: "Problems Solved", value: totalSolved, color: "from-orange-500 to-red-500", action: "coding" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="glass-card rounded-2xl p-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">
              Welcome back, {profile.name || "Student"}! 👋
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {profile.targetRole ? `Goal: ${profile.targetRole}` : "Set your target role to get started"}
            </p>
          </div>
          <div className={`px-5 py-2.5 rounded-xl border-2 font-display font-bold text-lg ${readinessLabel.bg} ${readinessLabel.color}`}>
            {readinessLabel.text}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ icon, label, value, color, action }) => (
          <button key={label} onClick={() => setActiveSection(action)}
            className="stat-card text-left hover:scale-105 transition-transform">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-primary-foreground mb-3`}>{icon}</div>
            <div className="text-2xl font-display font-bold">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </button>
        ))}
      </div>

      {/* Readiness rings */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-brand-blue" /> Job Readiness Analysis
        </h2>
        <div className="flex flex-wrap justify-around items-center gap-4 md:gap-6">
          <ScoreRing score={skillScore} color="#2563eb" label="Skill Score" size={window.innerWidth < 640 ? 90 : 120} />
          <ScoreRing score={codingScore} color="#9333ea" label="Coding Score" size={window.innerWidth < 640 ? 90 : 120} />
          <ScoreRing score={learningProgress} color="#22c55e" label="Learning Score" size={window.innerWidth < 640 ? 90 : 120} />
          <div className="text-center">
            <ScoreRing score={finalReadiness} color={finalReadiness >= 80 ? "#22c55e" : finalReadiness >= 60 ? "#f59e0b" : "#ef4444"} label="Final Score" size={window.innerWidth < 640 ? 110 : 140} />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
          <div>Skills (40%)</div>
          <div>Coding (30%)</div>
          <div>Learning (30%)</div>
        </div>
      </div>

      {/* Skill gap summary */}
      {skillAnalysis ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <h3 className="font-semibold text-sm">Matching Skills</h3>
              <Badge className="bg-green-100 text-green-700 border-0 ml-auto">{skillAnalysis.matching.length}</Badge>
            </div>
            {skillAnalysis.matching.slice(0, 4).map((s) => (
              <div key={s.skill} className="text-xs text-muted-foreground py-0.5">✅ {s.skill}</div>
            ))}
          </div>
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <h3 className="font-semibold text-sm">Partial Match</h3>
              <Badge className="bg-yellow-100 text-yellow-700 border-0 ml-auto">{skillAnalysis.partial.length}</Badge>
            </div>
            {skillAnalysis.partial.slice(0, 4).map((s) => (
              <div key={s.skill} className="text-xs text-muted-foreground py-0.5">⚠️ {s.skill}</div>
            ))}
          </div>
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-4 h-4 text-red-500" />
              <h3 className="font-semibold text-sm">Missing Skills</h3>
              <Badge className="bg-red-100 text-red-700 border-0 ml-auto">{skillAnalysis.missing.length}</Badge>
            </div>
            {skillAnalysis.missing.slice(0, 4).map((s) => (
              <div key={s.skill} className="text-xs text-muted-foreground py-0.5">❌ {s.skill}</div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-6 text-center">
          <p className="text-muted-foreground text-sm mb-3">Complete your profile to see skill analysis</p>
          <Button onClick={() => setActiveSection("profile")} className="btn-gradient-primary gap-2 rounded-xl">
            Set Up Profile <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Module progress */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" /> Learning Progress
          </h2>
          <span className="text-sm text-muted-foreground">{modulesPassedCount}/{totalModulesCount} modules</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-3">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700"
            style={{ width: `${learningProgress}%` }} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {MODULES.slice(0, 8).map((mod) => {
            const p = moduleProgress.find((m) => m.moduleId === mod.id);
            return (
              <div key={mod.id} className={`text-[10px] px-2 py-1.5 rounded-lg text-center font-medium ${p?.testPassed ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                {p?.testPassed ? "✅" : "⬜"} {mod.skill}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
