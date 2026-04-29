import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlayCircle, FileText, Code2, ChevronDown, ChevronUp,
  ExternalLink, CheckCircle2, Lock, Trophy
} from "lucide-react";
import { ROLE_REQUIREMENTS, RoleRequirement } from "@/data/skillData";
import { MODULES, Module } from "@/data/learningData";

interface TestState {
  moduleId: string;
  current: number;
  answers: number[];
  submitted: boolean;
}

export default function LearningPage() {
  const { moduleProgress, updateModuleProgress, profile } = useApp();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"tutorial" | "video" | "test">("tutorial");
  const [testState, setTestState] = useState<TestState | null>(null);

  const getProgress = (id: string) => moduleProgress.find((m) => m.moduleId === id);

  const handleAnswer = (ansIdx: number) => {
    if (!testState || testState.submitted) return;
    const newAnswers = [...testState.answers];
    newAnswers[testState.current] = ansIdx;
    setTestState({ ...testState, answers: newAnswers });
  };

  const handleSubmitTest = (mod: Module) => {
    if (!testState) return;
    let correct = 0;
    testState.answers.forEach((ans, i) => {
      if (ans === mod.mcqs[i].answer) correct++;
    });
    const score = Math.round((correct / mod.mcqs.length) * 100);
    const passed = score >= 60;
    updateModuleProgress({ moduleId: mod.id, completed: passed, testScore: score, testPassed: passed, studyTimeMinutes: 30 });
    setTestState({ ...testState, submitted: true });
  };

  // Filter to ONLY modules required for the user's target role.
  // If no role is selected, show all modules.
  const requiredSkillNames = profile.targetRole
    ? ROLE_REQUIREMENTS[profile.targetRole].map((r: RoleRequirement) => r.skill)
    : null;

  const relevantModules = requiredSkillNames
    ? MODULES.filter(m => requiredSkillNames.includes(m.skill))
    : MODULES;

  // Sort: missing gaps first, then already-owned required, then others
  const sortedModules = [...relevantModules].sort((a, b) => {
    const aReq = profile.targetRole && ROLE_REQUIREMENTS[profile.targetRole]?.some((r: RoleRequirement) => r.skill === a.skill);
    const bReq = profile.targetRole && ROLE_REQUIREMENTS[profile.targetRole]?.some((r: RoleRequirement) => r.skill === b.skill);
    const aHas = profile.skills.some(s => s.skill === a.skill);
    const bHas = profile.skills.some(s => s.skill === b.skill);

    // 1. Missing required skills first (the gaps)
    if (aReq && !aHas && (!bReq || bHas)) return -1;
    if (bReq && !bHas && (!aReq || aHas)) return 1;

    // 2. Already owned required skills next
    if (aReq && aHas && (!bReq || !bHas)) return -1;
    if (bReq && bHas && (!aReq || !aHas)) return 1;

    return 0;
  });

  const requiredSkills = profile.targetRole ? ROLE_REQUIREMENTS[profile.targetRole] : [];
  const missingRequired = requiredSkills.filter(req => !profile.skills.some(ps => ps.skill === req.skill));

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold gradient-text">Learning Modules</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {profile.targetRole 
              ? `Personalized path to become a ${profile.targetRole} (${missingRequired.length} gaps identified)`
              : "Structured learning path with tutorials, videos, and tests"}
          </p>
        </div>
        {profile.targetRole && (
          <Badge className="bg-brand-blue/10 text-brand-blue border-brand-blue/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
            Smart Selection On
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        {sortedModules.map((mod, idx) => {
          const progress = getProgress(mod.id);
          const isExpanded = expandedModule === mod.id;
          const userSkill = profile.skills.find(s => s.skill === mod.skill);
          const isRequired = profile.targetRole && ROLE_REQUIREMENTS[profile.targetRole]?.some((r: RoleRequirement) => r.skill === mod.skill);
          
          // Logic for lock/unlock
          // We unlock it if: it's the first one, OR the one before it is passed, OR the user already has the skill
          const prevPassed = idx === 0 || getProgress(sortedModules[idx - 1].id)?.testPassed || profile.skills.some(s => s.skill === sortedModules[idx - 1].skill);
          const isLocked = !prevPassed && !userSkill;

          return (
            <div key={mod.id} className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${isLocked ? "opacity-60 grayscale-[0.4]" : "shadow-md hover:shadow-lg border-border/60"}`}>
              {/* Module header */}
              <button
                onClick={() => !isLocked && setExpandedModule(isExpanded ? null : mod.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/30 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-2xl shadow-md flex-shrink-0 animate-scale-in`}>
                  {mod.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-bold text-lg">{mod.skill}</h3>
                    
                    {isRequired && !userSkill && (
                      <Badge className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-[10px] font-bold uppercase px-1.5 h-5">
                        ⭐ Recommended
                      </Badge>
                    )}
                    
                    {userSkill && (
                      <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase px-1.5 h-5">
                        ✅ Already Have ({userSkill.level})
                      </Badge>
                    )}

                    {!userSkill && prevPassed && !progress?.testPassed && (
                      <Badge className="bg-purple-100 text-purple-700 border-0 text-[10px] font-black uppercase px-1.5 h-5 animate-pulse">
                        Next Up
                      </Badge>
                    )}

                    {progress?.testPassed && (
                      <Badge className="bg-green-100 text-green-700 border-0 text-[10px] font-black uppercase px-2 h-5 gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> Mastered
                      </Badge>
                    )}
                    
                    {isLocked && <Badge className="bg-gray-100 text-gray-500 border-0 text-[10px] font-bold uppercase px-2 h-5 gap-1"><Lock className="w-3 h-3" /> Locked</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 truncate">{mod.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-border/40 animate-fade-in">
                  {/* Tabs */}
                  <div className="flex border-b border-border/40 bg-white/20">
                    {(["tutorial", "video", "test"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-sm font-bold transition-all capitalize border-r border-border/20 last:border-0 ${
                          activeTab === tab
                            ? "bg-brand-blue/5 text-brand-blue shadow-[inset_0_-2px_0_0_currentColor]"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        }`}
                      >
                        {tab === "tutorial" ? "📖 Tutorial" : tab === "video" ? "🎥 Video" : "📝 Mock Test"}
                      </button>
                    ))}
                  </div>

                  <div className="p-5 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5">
                    {/* Tutorial tab */}
                    {activeTab === "tutorial" && (
                      <div className="space-y-6">
                        <div className="rounded-2xl bg-white/60 dark:bg-black/20 border border-border/60 p-5 shadow-sm">
                          <h4 className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-widest">Introduction</h4>
                          <pre className="text-sm whitespace-pre-wrap font-sans text-foreground/90 leading-relaxed font-medium">{mod.tutorial}</pre>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h4 className="font-bold text-sm flex items-center gap-2 px-1"><Code2 className="w-4 h-4 text-brand-blue" /> Code Example</h4>
                            <div className="relative group">
                              <pre className="rounded-2xl bg-slate-950 text-blue-300 p-5 text-xs overflow-x-auto font-mono leading-relaxed border border-slate-800 shadow-xl">
                                {mod.codeExample}
                              </pre>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-bold text-sm mb-3 flex items-center gap-2 px-1"><FileText className="w-4 h-4 text-brand-green" /> Practical Exercises</h4>
                              <ul className="space-y-2.5">
                                {mod.assignments.map((a, i) => (
                                  <li key={i} className="flex items-start gap-3 text-sm font-medium p-3 rounded-xl bg-green-50/30 dark:bg-green-500/5 border border-green-100 dark:border-green-500/10">
                                    <span className="mt-0.5 w-5 h-5 rounded-lg bg-green-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 shadow-sm">{i + 1}</span>
                                    {a}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-bold text-sm mb-3 flex items-center gap-2 px-1"><ExternalLink className="w-4 h-4 text-brand-purple" /> Top Resources</h4>
                              <div className="flex flex-wrap gap-2">
                                {mod.resources.map((r) => (
                                  <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-bold hover:bg-purple-100 transition-all hover:scale-[1.03]">
                                    {r.name} <ExternalLink className="w-3 h-3" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Video tab */}
                    {activeTab === "video" && (
                      <div className="space-y-5">
                        <div className="rounded-2xl overflow-hidden aspect-video shadow-2xl border-4 border-white dark:border-white/5">
                          <iframe
                            src={`https://www.youtube.com/embed/${mod.youtubeId}`}
                            className="w-full h-full"
                            allowFullScreen
                            title={`${mod.skill} Tutorial`}
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10">
                          <div className="flex items-center gap-3">
                            <PlayCircle className="w-5 h-5 text-brand-blue" />
                            <span className="text-sm font-bold">Watch & Learn: {mod.skill} Fundamentals</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Test tab */}
                    {activeTab === "test" && (
                      <div className="max-w-2xl mx-auto py-4">
                        {(!testState || testState.moduleId !== mod.id) ? (
                          <div className="text-center py-10 space-y-6">
                            <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mx-auto text-4xl shadow-glow-blue">
                              📝
                            </div>
                            <div className="space-y-2">
                              <h3 className="font-display font-bold text-2xl tracking-tight">Final Assessment</h3>
                              <p className="text-sm text-muted-foreground">Prove your mastery in **{mod.skill}** to earn your completion badge.</p>
                            </div>
                            <div className="flex items-center justify-center gap-8 py-4 border-y border-border/40">
                              <div className="text-center">
                                <span className="block text-xl font-bold">5</span>
                                <span className="text-[10px] text-muted-foreground uppercase font-black">Questions</span>
                              </div>
                              <div className="text-center">
                                <span className="block text-xl font-bold">5m</span>
                                <span className="text-[10px] text-muted-foreground uppercase font-black">Duration</span>
                              </div>
                              <div className="text-center">
                                <span className="block text-xl font-bold">60%</span>
                                <span className="text-[10px] text-muted-foreground uppercase font-black">To Pass</span>
                              </div>
                            </div>
                            <Button
                              onClick={() => setTestState({ moduleId: mod.id, current: 0, answers: new Array(mod.mcqs.length).fill(-1), submitted: false })}
                              className="w-full max-w-xs h-12 btn-gradient-primary gap-2 rounded-xl text-base font-bold shadow-lg"
                            >
                              <PlayCircle className="w-5 h-5" /> Begin Assessment
                            </Button>
                          </div>
                        ) : testState.submitted ? (
                          <div className="text-center py-10 space-y-6">
                            {getProgress(mod.id)?.testPassed ? (
                              <div className="animate-scale-in">
                                <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                                  <Trophy className="w-12 h-12 text-green-600 shadow-glow-green" />
                                </div>
                                <h3 className="font-display font-black text-3xl text-green-600 mb-2">MASTERED!</h3>
                                <p className="text-muted-foreground text-lg">You scored <strong>{getProgress(mod.id)?.testScore}%</strong> in {mod.skill}.</p>
                                <div className="mt-8">
                                  <Badge className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-full text-xs font-bold shadow-lg">New Module Unlocked</Badge>
                                </div>
                              </div>
                            ) : (
                              <div className="animate-scale-in">
                                <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
                                  <span className="text-4xl">❌</span>
                                </div>
                                <h3 className="font-display font-bold text-2xl text-red-500 mb-2">Keep Practicing</h3>
                                <p className="text-muted-foreground mb-6">You scored <strong>{getProgress(mod.id)?.testScore}%</strong>. A minimum of 60% is needed to pass.</p>
                                <Button onClick={() => setTestState({ moduleId: mod.id, current: 0, answers: new Array(mod.mcqs.length).fill(-1), submitted: false })}
                                  className="btn-gradient-warning gap-2 rounded-xl h-11 px-8 font-bold">Retry Assessment</Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center justify-between px-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Progress: {testState.current + 1} / {mod.mcqs.length}</span>
                              <div className="flex gap-1.5">
                                {mod.mcqs.map((_, i) => (
                                  <div key={i} className={`h-2 rounded-full transition-all ${i < testState.current ? "w-8 bg-green-500" : i === testState.current ? "w-12 bg-brand-blue" : "w-4 bg-muted"}`} />
                                ))}
                              </div>
                            </div>
                            <div className="rounded-2xl bg-white dark:bg-white/5 border border-border/60 p-6 shadow-sm">
                              <p className="text-lg font-bold leading-tight tracking-tight">{mod.mcqs[testState.current].q}</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {mod.mcqs[testState.current].options.map((opt, i) => (
                                <button key={i} onClick={() => handleAnswer(i)}
                                  className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all group ${
                                    testState.answers[testState.current] === i
                                      ? "border-brand-blue bg-blue-50/50 dark:bg-brand-blue/10 text-brand-blue"
                                      : "border-border/40 hover:border-brand-blue/30 hover:bg-muted/50"
                                  }`}>
                                  <div className="flex items-center gap-4">
                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-colors ${
                                      testState.answers[testState.current] === i ? "bg-brand-blue text-white" : "bg-muted group-hover:bg-brand-blue/10"
                                    }`}>
                                      {String.fromCharCode(65 + i)}
                                    </span>
                                    <span className="font-semibold">{opt}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                            <div className="flex gap-3 pt-4">
                              {testState.current > 0 && (
                                <Button variant="outline" onClick={() => setTestState({ ...testState, current: testState.current - 1 })} className="rounded-xl h-12 flex-1 font-bold">Back</Button>
                              )}
                              {testState.current < mod.mcqs.length - 1 ? (
                                <Button onClick={() => setTestState({ ...testState, current: testState.current + 1 })}
                                  disabled={testState.answers[testState.current] === -1}
                                  className="btn-gradient-primary flex-[2] h-12 rounded-xl font-bold shadow-md">Next Question</Button>
                              ) : (
                                <Button onClick={() => handleSubmitTest(mod)}
                                  disabled={testState.answers.some((a) => a === -1)}
                                  className="btn-gradient-success flex-[2] h-12 rounded-xl font-black text-white shadow-glow-green">COMPLETE TEST</Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
