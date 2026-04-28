import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ALL_SKILLS, TargetRole, ROLE_REQUIREMENTS, RoleRequirement } from "@/data/skillData";
import { SkillLevel } from "@/data/skillData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Plus, X, Target, GraduationCap, CheckCircle2, Sparkles, Search } from "lucide-react";

const TARGET_ROLES: TargetRole[] = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Data Analyst",
  "DevOps Engineer",
  "Mobile Developer",
  "AI/ML Engineer",
  "Cybersecurity Analyst",
  "UI/UX Designer",
  "Cloud Architect",
  "QA Engineer",
];

const SKILL_LEVELS: SkillLevel[] = ["Beginner", "Intermediate", "Advanced"];

const LEVEL_COLORS: Record<SkillLevel, string> = {
  Beginner: "bg-green-100 text-green-700 border-green-200",
  Intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Advanced: "bg-red-100 text-red-700 border-red-200",
};

export default function ProfilePage() {
  const { profile, updateProfile, addSkill, removeSkill, setActiveSection } = useApp();
  const [skillSearch, setSkillSearch] = useState("");
  const [selectedNewSkill, setSelectedNewSkill] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>("Beginner");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: profile.name,
    college: profile.college || "",
    year: profile.year || "",
  });

  const filteredSkills = ALL_SKILLS.filter(
    (s) =>
      s.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
      !profile.skills.find((ps) => ps.skill === s.name)
  );

  const handleAddSkill = () => {
    if (selectedNewSkill) {
      addSkill(selectedNewSkill, selectedLevel);
      setSelectedNewSkill("");
      setSkillSearch("");
    }
  };

  const handleSave = () => {
    updateProfile({ name: form.name, college: form.college, year: form.year });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };



  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold gradient-text">Student Profile</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Set up your skills and target role for analysis</p>
        </div>
        <Button onClick={handleSave} className="btn-gradient-primary gap-2 rounded-xl">
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <h2 className="font-display font-semibold text-lg">Personal Info</h2>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Full Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Your full name"
                className="mt-1 rounded-xl border-border/60"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</Label>
              <Input value={profile.email} disabled className="mt-1 rounded-xl bg-muted/50" />
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">College / University</Label>
              <Input
                value={form.college}
                onChange={(e) => setForm((f) => ({ ...f, college: e.target.value }))}
                placeholder="e.g., IIT Bombay"
                className="mt-1 rounded-xl border-border/60"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Year of Study</Label>
              <select
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm"
              >
                <option value="">Select year</option>
                {["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year", "Fresher"].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Target Role */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Target className="w-4 h-4 text-primary-foreground" />
            </div>
            <h2 className="font-display font-semibold text-lg">Target Role</h2>
          </div>

          <p className="text-xs text-muted-foreground mb-3">Select the job role you're preparing for:</p>
          <div className="grid grid-cols-1 gap-2">
            {TARGET_ROLES.map((role) => (
              <button
                key={role}
                onClick={() => updateProfile({ targetRole: role })}
                className={`text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                  profile.targetRole === role
                    ? "border-brand-blue bg-blue-50 dark:bg-blue-950/30 text-brand-blue"
                    : "border-border/60 hover:border-brand-blue/50 hover:bg-blue-50/50"
                }`}
              >
                <span className="flex items-center justify-between">
                  {role}
                  {profile.targetRole === role && <CheckCircle2 className="w-4 h-4 text-brand-blue" />}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <h2 className="font-display font-semibold text-lg">My Skills</h2>
            <Badge className="bg-blue-100 text-blue-700 text-xs">{profile.skills.length} skills</Badge>
          </div>
          {profile.targetRole && (
            <div className="hidden md:flex items-center gap-1.5 text-[11px] font-bold text-brand-blue uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
              <Target className="w-3 h-3" />
              Tailored for {profile.targetRole}
            </div>
          )}
        </div>

        {/* Recommended Skills for Freshers/Beginners */}
        {profile.targetRole && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-800/50">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-300">
              <Sparkles className="w-4 h-4" /> Recommended for {profile.targetRole}
            </h3>
            <div className="flex flex-wrap gap-2">
              {ROLE_REQUIREMENTS[profile.targetRole]
                .filter(req => !profile.skills.find(ps => ps.skill === req.skill))
                .map((req: RoleRequirement) => {
                  const skillData = ALL_SKILLS.find(s => s.name === req.skill);
                  return (
                    <button
                      key={req.skill}
                      onClick={() => addSkill(req.skill, selectedLevel)}
                      className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-card border border-blue-200 dark:border-blue-800 hover:border-brand-blue hover:shadow-md transition-all text-left"
                    >
                      <span className="text-lg">{skillData?.icon || "🔹"}</span>
                      <div>
                        <div className="text-xs font-bold leading-none">{req.skill}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">Add as {selectedLevel}</div>
                      </div>
                      <Plus className="w-3 h-3 ml-1 text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              {ROLE_REQUIREMENTS[profile.targetRole].filter(req => !profile.skills.find(ps => ps.skill === req.skill)).length === 0 && (
                <div className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1.5 py-1">
                  <CheckCircle2 className="w-4 h-4" /> You've added all core recommended skills!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Skill Manual */}
        <div className="flex gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-[280px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search className="w-4 h-4" />
            </div>
            <Input
              placeholder="Search or add any other skill..."
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              className="rounded-xl border-border/60 pl-10 h-11"
            />
            {skillSearch && filteredSkills.length > 0 && (
              <div className="absolute z-20 top-full mt-1 w-full bg-white dark:bg-card border border-border rounded-xl shadow-xl max-h-60 overflow-y-auto">
                {filteredSkills.slice(0, 10).map((s) => (
                  <button
                    key={s.name}
                    onClick={() => {
                      setSelectedNewSkill(s.name);
                      setSkillSearch(s.name);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-muted text-sm flex items-center gap-3 border-b border-border/40 last:border-0"
                  >
                    <span className="text-xl">{s.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold">{s.name}</div>
                      <div className="text-[10px] text-muted-foreground">{s.category}</div>
                    </div>
                    <Plus className="w-4 h-4 text-brand-blue opacity-40" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as SkillLevel)}
              className="flex-1 sm:flex-none rounded-xl border border-border/60 bg-background px-4 h-11 text-sm font-medium"
            >
              {SKILL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <Button 
              onClick={handleAddSkill} 
              disabled={!selectedNewSkill} 
              className="flex-1 sm:flex-none h-11 px-6 btn-gradient-primary gap-1.5 rounded-xl font-bold"
            >
              <Plus className="w-4 h-4" /> Add Skill
            </Button>
          </div>
        </div>

        {/* Skill list */}
        <div className="space-y-4">
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Currently Added</Label>
          {profile.skills.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border-2 border-dashed border-border/40 text-muted-foreground">
              <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium">No skills added yet</p>
              <p className="text-xs mt-1">Add recommended skills or search above to begin</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {profile.skills.map(({ skill, level }) => {
                const skillData = ALL_SKILLS.find((s) => s.name === skill);
                return (
                  <div key={skill} className={`flex items-center gap-2 pl-3 pr-1 py-1.5 rounded-xl border ${LEVEL_COLORS[level]} transition-all hover:scale-[1.02] shadow-sm`}>
                    <span className="text-base">{skillData?.icon || "🔹"}</span>
                    <span className="text-sm font-bold">{skill}</span>
                    <Badge variant="outline" className="h-5 text-[9px] font-black uppercase px-1.5 border-current/30">
                      {level}
                    </Badge>
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:bg-black/10 rounded-lg p-1 transition-colors"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {profile.skills.length > 0 && profile.targetRole && (
          <div className="mt-8 pt-6 border-t border-border/40">
            <Button
              onClick={() => setActiveSection("skillgap")}
              className="btn-gradient-primary w-full h-12 rounded-xl font-bold text-base shadow-glow-blue"
            >
              🔍 Analyze Job Readiness for {profile.targetRole} →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
