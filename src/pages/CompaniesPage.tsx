import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { analyzeSkillGap } from "@/data/skillData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Building2, CheckCircle2, AlertCircle, XCircle, ArrowRight } from "lucide-react";

interface Company {
  name: string;
  logo: string;
  type: string;
  minScore: number;
  description: string;
  url: string;
  roles: string[];
  color: string;
}

const COMPANIES: Company[] = [
  { name: "TCS", logo: "💠", type: "Top MNC", minScore: 75, description: "India's largest IT company. Great for freshers with strong fundamentals.", url: "https://www.tcs.com/careers", roles: ["Software Engineer", "Systems Engineer"], color: "from-blue-600 to-indigo-800" },
  { name: "Infosys", logo: "🔷", type: "Top MNC", minScore: 70, description: "Global IT company with excellent training programs for fresh graduates.", url: "https://www.infosys.com/careers", roles: ["Systems Engineer", "Associate"], color: "from-blue-500 to-cyan-700" },
  { name: "Wipro", logo: "☸️", type: "Top MNC", minScore: 70, description: "IT services company with diverse project opportunities.", url: "https://careers.wipro.com", roles: ["Project Engineer", "Associate"], color: "from-purple-600 to-indigo-700" },
  { name: "Accenture", logo: "🔼", type: "Top MNC", minScore: 75, description: "Global consulting firm with technology and digital services.", url: "https://www.accenture.com/in-en/careers", roles: ["Software Engineer", "Associate Developer"], color: "from-purple-800 to-blue-900" },
  { name: "Cognizant", logo: "🌐", type: "Top MNC", minScore: 65, description: "IT services company with strong focus on digital transformation.", url: "https://careers.cognizant.com", roles: ["Programmer Analyst", "Associate"], color: "from-blue-400 to-blue-600" },
  { name: "HCL Technologies", logo: "⚛️", type: "Top MNC", minScore: 65, description: "Enterprise IT solutions company with global presence.", url: "https://www.hcltech.com/careers", roles: ["Software Engineer", "Graduate Engineer"], color: "from-blue-900 to-blue-700" },
  { name: "Zoho", logo: "🇿️", type: "Product", minScore: 60, description: "Leading SaaS product company — excellent work culture.", url: "https://jobs.zoho.com", roles: ["Software Developer", "Project Lead"], color: "from-red-500 to-yellow-500" },
  { name: "Freshworks", logo: "🍃", type: "Startup/Product", minScore: 55, description: "Fast-growing product company with great learning opportunities.", url: "https://careers.freshworks.com", roles: ["Software Engineer", "Product Engineer"], color: "from-green-500 to-emerald-700" },
  { name: "Startup Internship", logo: "🚀", type: "Internship", minScore: 40, description: "Build real projects, get mentorship, and grow fast.", url: "https://internshala.com", roles: ["Web Developer Intern", "Full Stack Intern"], color: "from-orange-400 to-rose-500" },
  { name: "AngelList Startups", logo: "🆙", type: "Startup", minScore: 45, description: "Explore thousands of startup opportunities across India.", url: "https://angel.co/jobs", roles: ["Junior Developer", "Intern"], color: "from-slate-700 to-black" },
];

function EligibilityBadge({ eligible }: { eligible: boolean; borderline?: boolean }) {
  if (eligible) return <Badge className="bg-green-100 text-green-700 border-0 gap-1"><CheckCircle2 className="w-3 h-3" /> Eligible</Badge>;
  return <Badge className="bg-red-100 text-red-600 border-0 gap-1"><XCircle className="w-3 h-3" /> Not Ready</Badge>;
}

export default function CompaniesPage() {
  const { profile, moduleProgress, codingStats, setActiveSection, companies: backendCompanies } = useApp();

  // Use backend companies if available, otherwise fallback to local ones
  const activeCompanies = backendCompanies.length > 0 ? backendCompanies : COMPANIES;

  const skillScore = useMemo(() => {
    if (!profile.targetRole || !profile.skills.length) return 0;
    return analyzeSkillGap(profile.skills, profile.targetRole).readinessScore;
  }, [profile]);

  const modulesPassed = moduleProgress.filter((m) => m.testPassed).length;
  const learningScore = Math.round((modulesPassed / 6) * 100);
  const totalSolved = codingStats.reduce((acc, s) => acc + s.total, 0);
  const codingScore = Math.min(100, Math.round((totalSolved / 300) * 100));
  const finalScore = Math.round(skillScore * 0.4 + codingScore * 0.3 + learningScore * 0.3);

  const eligible = activeCompanies.filter((c) => finalScore >= c.minScore);
  const borderline = activeCompanies.filter((c) => finalScore >= c.minScore - 15 && finalScore < c.minScore);
  const notReady = activeCompanies.filter((c) => finalScore < c.minScore - 15);

  const scoreLabel =
    finalScore >= 80 ? { text: "Excellent!", color: "text-green-600" }
    : finalScore >= 60 ? { text: "Good Progress", color: "text-yellow-600" }
    : { text: "Keep Improving", color: "text-red-500" };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold gradient-text">Company Recommendations</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Companies matched to your current readiness score</p>
      </div>

      {/* Score summary */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <svg width="120" height="120" className="-rotate-90">
              <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/30" />
              <circle cx="60" cy="60" r="50" fill="none"
                stroke={finalScore >= 80 ? "#22c55e" : finalScore >= 60 ? "#f59e0b" : "#ef4444"}
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 * (1 - finalScore / 100)}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-display font-bold">{finalScore}%</span>
              <span className="text-xs text-muted-foreground">Readiness</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className={`text-xl font-display font-bold ${scoreLabel.color} mb-3`}>{scoreLabel.text}</h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Eligible", count: eligible.length, color: "bg-green-50 border-green-200 text-green-600" },
                { label: "Close", count: borderline.length, color: "bg-yellow-50 border-yellow-200 text-yellow-600" },
                { label: "Not Ready", count: notReady.length, color: "bg-red-50 border-red-200 text-red-500" },
              ].map(({ label, count, color }) => (
                <div key={label} className={`rounded-xl border p-3 ${color}`}>
                  <div className="text-2xl font-bold font-display">{count}</div>
                  <div className="text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Eligible Companies */}
      {eligible.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-lg flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-500" /> You're Eligible For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eligible.map((c) => (
              <div key={c.name} className="glass-card rounded-2xl p-5 hover:shadow-hover transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
                    {c.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-display font-bold">{c.name}</h3>
                      <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">{c.type}</Badge>
                      <EligibilityBadge eligible />
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{c.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {c.roles.map((r: string) => <span key={r} className="text-xs bg-muted px-2 py-0.5 rounded-md">{r}</span>)}
                    </div>
                    <a href={c.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs bg-brand-blue text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition font-medium">
                      View Jobs &amp; Internships <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Borderline */}
      {borderline.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-lg flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-500" /> Almost There — Improve Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {borderline.map((c) => (
              <div key={c.name} className="glass-card rounded-2xl p-5 opacity-90">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-xl shadow-md flex-shrink-0`}>{c.logo}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">Needs {c.minScore}% readiness</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700 border-0">+{c.minScore - finalScore}% needed</Badge>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {c.roles.map((r: string) => <span key={r} className="text-xs bg-muted px-2 py-0.5 rounded-md">{r}</span>)}
                </div>
                <a href={c.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs bg-yellow-500 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition font-medium">
                  Preview Jobs &amp; Internships <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Not Ready Companies */}
      {notReady.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-lg flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5 text-red-400" /> Keep Improving — Target These Later
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notReady.map((c) => (
              <div key={c.name} className="glass-card rounded-2xl p-5 opacity-60 hover:opacity-80 transition-opacity">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-xl shadow-md flex-shrink-0`}>{c.logo}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">Needs {c.minScore}% readiness</p>
                  </div>
                  <Badge className="bg-red-100 text-red-600 border-0">+{c.minScore - finalScore}% needed</Badge>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {c.roles.map((r: string) => <span key={r} className="text-xs bg-muted px-2 py-0.5 rounded-md">{r}</span>)}
                </div>
                <a href={c.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs bg-slate-600 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition font-medium">
                  Explore Jobs &amp; Internships <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {finalScore === 0 && (
        <div className="glass-card rounded-2xl p-8 text-center">
          <Building2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-lg mb-2">Build Your Profile First</h3>
          <p className="text-sm text-muted-foreground mb-5">Add skills, complete learning modules, and practice coding to unlock company recommendations.</p>
          <Button onClick={() => setActiveSection("profile")} className="btn-gradient-primary gap-2 rounded-xl">
            Set Up Profile <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
