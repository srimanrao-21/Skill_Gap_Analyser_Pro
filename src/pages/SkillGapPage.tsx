import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { analyzeSkillGap, ALL_SKILLS } from "@/data/skillData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle, TrendingUp, BookOpen, ArrowRight } from "lucide-react";

const LEVEL_ORDER = { Beginner: 1, Intermediate: 2, Advanced: 3 };

function ReadinessRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/40" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s ease-in-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-display font-bold" style={{ color }}>{score}%</span>
        <span className="text-xs text-muted-foreground font-medium">Readiness</span>
      </div>
    </div>
  );
}

export default function SkillGapPage() {
  const { profile, setActiveSection } = useApp();

  const result = useMemo(() => {
    if (!profile.targetRole || profile.skills.length === 0) return null;
    return analyzeSkillGap(profile.skills, profile.targetRole);
  }, [profile.skills, profile.targetRole]);

  if (!profile.targetRole || profile.skills.length === 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-96 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-display font-bold mb-2">Setup Required</h2>
        <p className="text-muted-foreground text-sm mb-5">
          Please complete your profile with skills and a target role first.
        </p>
        <Button onClick={() => setActiveSection("profile")} className="btn-gradient-primary gap-2 rounded-xl">
          <ArrowRight className="w-4 h-4" /> Go to Profile Setup
        </Button>
      </div>
    );
  }

  if (!result) return null;

  const { matching, partial, missing, readinessScore } = result;
  const label = readinessScore >= 80 ? "Job Ready! 🎉" : readinessScore >= 60 ? "Almost Ready ⚡" : "Keep Learning 📚";
  const labelColor = readinessScore >= 80 ? "text-green-600" : readinessScore >= 60 ? "text-yellow-600" : "text-red-500";

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold gradient-text">Skill Gap Analysis</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Analyzing for: <strong>{profile.targetRole}</strong>
        </p>
      </div>

      {/* Top summary */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ReadinessRing score={readinessScore} />
          <div className="flex-1 space-y-4">
            <div>
              <h2 className={`text-2xl font-display font-bold ${labelColor}`}>{label}</h2>
              <p className="text-muted-foreground text-sm mt-1">
                You have {matching.length} matching skills, {partial.length} partially matching, and {missing.length} skills to learn.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Matching", count: matching.length, color: "bg-green-50 border-green-200", textColor: "text-green-600", icon: "✅" },
                { label: "Partial", count: partial.length, color: "bg-yellow-50 border-yellow-200", textColor: "text-yellow-600", icon: "⚠️" },
                { label: "Missing", count: missing.length, color: "bg-red-50 border-red-200", textColor: "text-red-500", icon: "❌" },
              ].map(({ label, count, color, textColor, icon }) => (
                <div key={label} className={`rounded-xl border p-3 text-center ${color}`}>
                  <div className="text-lg">{icon}</div>
                  <div className={`text-2xl font-bold font-display ${textColor}`}>{count}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Skill breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Matching */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <h3 className="font-display font-semibold text-green-700">✅ Matching Skills</h3>
          </div>
          {matching.length === 0 ? (
            <p className="text-xs text-muted-foreground">None yet — keep building!</p>
          ) : (
            <div className="space-y-2">
              {matching.map(({ skill, studentLevel }) => {
                const s = ALL_SKILLS.find((sk) => sk.name === skill);
                return (
                  <div key={skill} className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1.5">
                      <span>{s?.icon}</span>{skill}
                    </span>
                    <Badge className="bg-green-100 text-green-700 text-xs border-0">{studentLevel}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Partial */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <h3 className="font-display font-semibold text-yellow-700">⚠️ Partial Match</h3>
          </div>
          {partial.length === 0 ? (
            <p className="text-xs text-muted-foreground">All skill levels match!</p>
          ) : (
            <div className="space-y-2">
              {partial.map(({ skill, studentLevel, requiredLevel }) => {
                const s = ALL_SKILLS.find((sk) => sk.name === skill);
                return (
                  <div key={skill} className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm flex items-center gap-1.5">
                        <span>{s?.icon}</span>{skill}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-md">{studentLevel}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md">{requiredLevel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Missing */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5 text-red-500" />
            <h3 className="font-display font-semibold text-red-600">❌ Missing Skills</h3>
          </div>
          {missing.length === 0 ? (
            <p className="text-xs text-muted-foreground">No missing skills 🎉</p>
          ) : (
            <div className="space-y-2">
              {missing.map(({ skill, requiredLevel }) => {
                const s = ALL_SKILLS.find((sk) => sk.name === skill);
                return (
                  <div key={skill} className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1.5">
                      <span>{s?.icon}</span>{skill}
                    </span>
                    <Badge className="bg-red-100 text-red-700 text-xs border-0">{requiredLevel}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      {missing.length > 0 && (
        <div className="glass-card rounded-2xl p-5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-brand-blue" />
              <div>
                <p className="font-semibold">Ready to fill these gaps?</p>
                <p className="text-xs text-muted-foreground">Start learning {missing[0]?.skill} and more</p>
              </div>
            </div>
            <Button onClick={() => setActiveSection("learning")} className="btn-gradient-primary gap-2 rounded-xl">
              Start Learning <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
