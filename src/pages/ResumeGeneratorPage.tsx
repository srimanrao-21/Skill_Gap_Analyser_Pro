import { useState, useMemo, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { analyzeSkillGap, ALL_SKILLS } from "@/data/skillData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Download, User, Mail, Code2, Trophy, Star,
  Briefcase, GraduationCap, CheckCircle2, Zap
} from "lucide-react";

const TEMPLATES = [
  { id: "modern", name: "Modern Blue", color: "from-blue-600 to-purple-600" },
  { id: "clean", name: "Clean Green", color: "from-green-600 to-teal-600" },
  { id: "bold", name: "Bold Dark", color: "from-gray-800 to-gray-900" },
];

export default function ResumeGeneratorPage() {
  const { profile, moduleProgress, codingStats } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [downloading, setDownloading] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const skillAnalysis = useMemo(() => {
    if (!profile.targetRole || !profile.skills.length) return null;
    return analyzeSkillGap(profile.skills, profile.targetRole);
  }, [profile]);

  const passedModules = moduleProgress.filter((m) => m.testPassed);
  const totalSolved = codingStats.reduce((acc, s) => acc + s.total, 0);
  const template = TEMPLATES.find((t) => t.id === selectedTemplate)!;

  const handleDownload = async () => {
    if (!resumeRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(resumeRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width / 2, canvas.height / 2] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Resume_${(profile.name || "Student").replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
    setDownloading(false);
  };

  const skillsByCategory = profile.skills.reduce((acc, { skill }) => {
    const s = ALL_SKILLS.find((a) => a.name === skill);
    if (s) {
      acc[s.category] = acc[s.category] || [];
      acc[s.category].push(skill);
    }
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold gradient-text">Resume Generator</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Auto-generate your professional resume from your profile</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleDownload} disabled={downloading}
            className="btn-gradient-primary gap-2 rounded-xl">
            {downloading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
            {downloading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>

      {/* Template selector */}
      <div className="glass-card rounded-2xl p-5">
        <h2 className="font-display font-semibold mb-3">Choose Template</h2>
        <div className="flex gap-3">
          {TEMPLATES.map((t) => (
            <button key={t.id} onClick={() => setSelectedTemplate(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                selectedTemplate === t.id ? "border-brand-blue bg-blue-50 text-brand-blue" : "border-border/60 hover:border-brand-blue/40"
              }`}>
              <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${t.color}`} />
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Resume preview */}
      <div ref={resumeRef} className="glass-card rounded-2xl overflow-hidden shadow-hover">
        {/* Header band */}
        <div className={`bg-gradient-to-r ${template.color} p-8 text-white`}>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-4xl font-display font-bold flex-shrink-0">
              {(profile.name || "S").charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-display font-black mb-1">{profile.name || "Your Name"}</h1>
              <p className="text-lg opacity-90 font-medium">{profile.targetRole || "Software Developer"}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-sm opacity-80">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{profile.email || "your.email@example.com"}</span>
                {profile.college && <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" />{profile.college}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="space-y-5">
            {/* Skills */}
            <div>
              <h2 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-blue" /> Skills
              </h2>
              {Object.entries(skillsByCategory).length === 0 ? (
                <p className="text-xs text-muted-foreground">Add skills in your profile</p>
              ) : (
                Object.entries(skillsByCategory).map(([cat, skills]) => (
                  <div key={cat} className="mb-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">{cat}</p>
                    <div className="flex flex-wrap gap-1">
                      {skills.map((s) => <Badge key={s} className="bg-blue-100 text-blue-700 border-0 text-xs">{s}</Badge>)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Coding stats */}
            {totalSolved > 0 && (
              <div>
                <h2 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-brand-purple" /> Coding
                </h2>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Problems Solved</span>
                    <span className="font-bold">{totalSolved}</span>
                  </div>
                  {codingStats.map((s) => (
                    <div key={s.platform} className="flex justify-between text-xs">
                      <span className="text-muted-foreground capitalize">{s.platform}</span>
                      <span>@{s.username}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            <div>
              <h2 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-brand-green" /> Education
              </h2>
              <div>
                <p className="font-semibold text-sm">{profile.college || "Your University"}</p>
                <p className="text-xs text-muted-foreground">B.Tech in Computer Science</p>
                <p className="text-xs text-muted-foreground">{profile.year || "Final Year"}</p>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="md:col-span-2 space-y-5">
            {/* Summary */}
            <div>
              <h2 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-blue" /> Professional Summary
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Passionate {profile.targetRole || "Software Developer"} with hands-on experience in{" "}
                {profile.skills.slice(0, 4).map((s) => s.skill).join(", ") || "modern web technologies"}.
                Solved {totalSolved > 0 ? `${totalSolved}+` : "numerous"} coding problems on competitive platforms.
                Eager to contribute to innovative projects and grow within a dynamic tech team.
              </p>
            </div>

            {/* Projects */}
            <div>
              <h2 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand-purple" /> Projects
              </h2>
              <div className="space-y-4">
                {["Full Stack E-Commerce App", "REST API with Authentication", "Data Dashboard"].slice(0, passedModules.length > 0 ? 3 : 1).map((proj, i) => {
                  const techs = [
                    ["React", "Node.js", "MongoDB", "JWT"],
                    ["Express.js", "PostgreSQL", "Docker"],
                    ["Python", "Pandas", "Chart.js"],
                  ][i];
                  return (
                    <div key={proj} className="border-l-2 border-brand-blue pl-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">{proj}</h3>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                          className="text-xs text-brand-blue hover:underline">GitHub →</a>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {techs.map((t) => <Badge key={t} className="bg-purple-100 text-purple-700 border-0 text-xs">{t}</Badge>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Certifications */}
            {passedModules.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" /> Certifications
                </h2>
                <div className="space-y-2">
                  {passedModules.map((m) => (
                    <div key={m.moduleId} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="font-medium capitalize">{m.moduleId}</span>
                      <span className="text-muted-foreground text-xs">— SkillBridge AI · Score: {m.testScore}%</span>
                    </div>
                  ))}
                  {skillAnalysis && (
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      <span>Job Readiness Score: <strong>{skillAnalysis.readinessScore}%</strong></span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
