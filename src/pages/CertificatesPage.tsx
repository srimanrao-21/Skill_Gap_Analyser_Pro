import { useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy, Download, Share2, Star, QrCode,
  CheckCircle2, Calendar, User, Target
} from "lucide-react";

interface Certificate {
  id: string;
  type: "module" | "completion";
  studentName: string;
  skillName: string;
  score: number;
  date: string;
  uniqueId: string;
}

function QRCodePlaceholder({ value }: { value: string }) {
  // Simple SVG QR code placeholder
  return (
    <div className="w-16 h-16 border-2 border-current rounded-lg flex items-center justify-center bg-white/10">
      <div className="grid grid-cols-4 gap-0.5 p-1">
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-sm ${Math.abs(Math.sin(i * value.charCodeAt(0) + i)) > 0.5 ? "bg-current" : "bg-transparent"}`} />
        ))}
      </div>
    </div>
  );
}

function CertCard({ cert }: { cert: Certificate }) {
  const isCompletion = cert.type === "completion";

  return (
    <div className={`relative rounded-3xl overflow-hidden shadow-hover ${isCompletion ? "p-0.5 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500" : "p-0.5 bg-gradient-to-br from-blue-500 to-purple-600"}`}>
      <div className={`rounded-3xl p-6 ${isCompletion ? "bg-gradient-to-br from-yellow-50 to-orange-50" : "bg-gradient-to-br from-blue-50 to-purple-50"}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isCompletion ? <Star className="w-5 h-5 text-yellow-500" /> : <Trophy className="w-5 h-5 text-blue-500" />}
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {isCompletion ? "Completion Certificate" : "Module Certificate"}
              </span>
            </div>
            <h2 className="text-xl font-display font-black">SkillBridge AI</h2>
          </div>
          <QRCodePlaceholder value={cert.uniqueId} />
        </div>

        <div className="border-t border-black/10 pt-4 mb-4">
          <p className="text-xs text-muted-foreground mb-1">This certifies that</p>
          <h3 className="text-2xl font-display font-bold mb-3">{cert.studentName}</h3>
          <p className="text-xs text-muted-foreground mb-1">has successfully completed</p>
          <h4 className={`text-lg font-display font-bold ${isCompletion ? "text-orange-600" : "text-blue-600"}`}>
            {cert.skillName}
          </h4>
          {isCompletion && (
            <p className="text-xs text-muted-foreground mt-1">with a score of {cert.score}%</p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-black/10 pt-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{cert.date}</span>
          </div>
          <div className="font-mono text-xs opacity-70">{cert.uniqueId}</div>
          {!isCompletion && <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">Score: {cert.score}%</Badge>}
        </div>
      </div>
    </div>
  );
}

export default function CertificatesPage() {
  const { profile, moduleProgress } = useApp();
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const passedModules = moduleProgress.filter((m) => m.testPassed);
  const allPassed = passedModules.length >= 3;

  const certs: Certificate[] = [
    ...passedModules.map((m) => ({
      id: m.moduleId,
      type: "module" as const,
      studentName: profile.name || "Student",
      skillName: m.moduleId.charAt(0).toUpperCase() + m.moduleId.slice(1),
      score: m.testScore ?? 0,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      uniqueId: `SKB-${m.moduleId.toUpperCase()}-${Date.now().toString(36).slice(-6).toUpperCase()}`,
    })),
    ...(allPassed ? [{
      id: "completion",
      type: "completion" as const,
      studentName: profile.name || "Student",
      skillName: profile.targetRole || "Full Stack Development",
      score: Math.round(passedModules.reduce((acc, m) => acc + (m.testScore ?? 0), 0) / passedModules.length),
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      uniqueId: `SKB-COMP-${Date.now().toString(36).slice(-8).toUpperCase()}`,
    }] : []),
  ];

  const handleDownload = (id: string) => {
    setDownloaded(id);
    setTimeout(() => setDownloaded(null), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold gradient-text">My Certificates</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Digital certificates earned through completed modules & tests</p>
      </div>

      {/* Progress */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" /> Certificate Progress
          </h2>
          <span className="text-sm text-muted-foreground">{passedModules.length}/6 modules</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-700"
            style={{ width: `${(passedModules.length / 6) * 100}%` }} />
        </div>
        <p className="text-xs text-muted-foreground">
          {allPassed
            ? "🎉 All certificates unlocked! You've earned the completion certificate."
            : `Complete ${6 - passedModules.length} more modules to unlock the Completion Certificate.`}
        </p>
      </div>

      {certs.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Trophy className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-lg mb-2">No certificates yet</h3>
          <p className="text-sm text-muted-foreground mb-5">Pass module tests in the Learning section to earn certificates.</p>
          <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
            {[{ icon: <User />, text: "Complete your profile" }, { icon: <BookOpen />, text: "Study the module" }, { icon: <CheckCircle2 />, text: "Pass the mock test (60%+)" }, { icon: <Trophy />, text: "Earn your certificate!" }].map((step, i) => (
              <div key={i} className="flex items-center gap-2"><span className="w-5 h-5 text-brand-blue">{step.icon}</span>{step.text}</div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certs.map((cert) => (
            <div key={cert.id} className="space-y-3">
              <CertCard cert={cert} />
              <div className="flex gap-2">
                <Button onClick={() => handleDownload(cert.id)}
                  className={`flex-1 rounded-xl gap-2 text-sm ${cert.type === "completion" ? "btn-gradient-warning" : "btn-gradient-primary"}`}>
                  {downloaded === cert.id ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  {downloaded === cert.id ? "Downloaded!" : "Download PDF"}
                </Button>
                <Button variant="outline" className="rounded-xl gap-2 text-sm">
                  <Share2 className="w-4 h-4" /> Share
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Fix missing import
function BookOpen({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
