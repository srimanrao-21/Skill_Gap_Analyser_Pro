import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus, TrendingUp, Code2, Award, Flame, Star,
  BarChart2, CircleDot, Zap
} from "lucide-react";
import { toast } from "sonner";


interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  url: string;
}

const PLATFORMS: Platform[] = [
  { id: "leetcode", name: "LeetCode", icon: "🔥", color: "from-orange-400 to-yellow-600", url: "https://leetcode.com" },
  { id: "hackerrank", name: "HackerRank", icon: "🚀", color: "from-green-500 to-emerald-700", url: "https://hackerrank.com" },
  { id: "codechef", name: "CodeChef", icon: "👨‍🍳", color: "from-amber-600 to-brown-800", url: "https://codechef.com" },
  { id: "codeforces", name: "Codeforces", icon: "🏆", color: "from-blue-500 to-indigo-700", url: "https://codeforces.com" },
  { id: "gfg", name: "GeeksforGeeks", icon: "🎓", color: "from-green-600 to-teal-800", url: "https://practice.geeksforgeeks.org" },
];

// Stats generation and backend API fetch
const generateStats = async (username: string, platform: string) => {
  // Real data fetching from our backend
  if (platform === "leetcode" || platform === "hackerrank") {
    try {
      const res = await fetch(`/api/${platform}/${username}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to fetch" }));
        throw new Error(err.error || `Failed to fetch ${platform} stats`);
      }
      
      const data = await res.json();
      return {
        easy: data.easy || 0,
        medium: data.medium || 0,
        hard: data.hard || 0,
        contestRating: data.contestRating || data.ranking || 0,
        streakDays: data.streakDays || 0,
        weeklyActivity: data.weeklyActivity || Array.from({ length: 7 }, () => 0),
        realName: data.realName || username,
        userAvatar: data.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
      };
    } catch (error: any) {
      console.error(`Error fetching ${platform} stats:`, error);
      throw new Error(error.message || `Could not connect to backend for ${platform} sync`);
    }
  }

  // If platform not supported for real sync
  throw new Error(`Real-time sync for ${platform} is coming soon! Please use LeetCode or HackerRank for now.`);
};

function MiniBarChart({ data, label }: { data: number[]; label: string }) {
  const max = Math.max(...data, 1);
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-2">{label}</p>
      <div className="flex items-end gap-1 h-16">
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t-sm bg-gradient-to-t from-blue-500 to-purple-500 transition-all duration-700"
              style={{ height: `${(v / max) * 52}px`, minHeight: v > 0 ? "4px" : "0" }}
            />
            <span className="text-[10px] text-muted-foreground">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DifficultyBar({ easy, medium, hard }: { easy: number; medium: number; hard: number }) {
  const total = easy + medium + hard || 1;
  return (
    <div className="space-y-1.5">
      {[
        { label: "Easy", count: easy, color: "bg-green-500", pct: (easy / total) * 100 },
        { label: "Medium", count: medium, color: "bg-yellow-500", pct: (medium / total) * 100 },
        { label: "Hard", count: hard, color: "bg-red-500", pct: (hard / total) * 100 },
      ].map(({ label, count, color, pct }) => (
        <div key={label} className="flex items-center gap-2 text-xs">
          <span className="w-12 text-muted-foreground">{label}</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
          </div>
          <span className="w-6 text-right font-semibold">{count}</span>
        </div>
      ))}
    </div>
  );
}

function CodingReadinessRing({ score }: { score: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="110" height="110" className="-rotate-90">
        <circle cx="55" cy="55" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
        <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-display font-bold" style={{ color }}>{score}%</span>
        <span className="text-[10px] text-muted-foreground">Coding</span>
      </div>
    </div>
  );
}

export default function CodingTrackerPage() {
  const { codingStats, addCodingStats, updateProfile, profile } = useApp();
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    const cleanUsername = username.trim();
    if (!cleanUsername) return;

    if (!/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
      toast.error("Invalid username format");
      return; 
    }

    setLoading(true);
    try {
      const stats: any = await generateStats(cleanUsername, selectedPlatform.id);

      addCodingStats({
        platform: selectedPlatform.id,
        username: cleanUsername,
        ...stats,
        total: stats.easy + stats.medium + stats.hard,
      });

      if (stats.realName || stats.userAvatar) {
        updateProfile({
          name: stats.realName || profile.name,
          avatar: stats.userAvatar || profile.avatar
        });
      }

      setUsername("");
      toast.success("Profile synced successfully!");
    } catch (e: any) {
      toast.error(e.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  // Filter stats to only show the selected platform
  const currentStat = codingStats.find(s => s.platform === selectedPlatform.id);

  const totalSolved = currentStat ? currentStat.total : 0;
  const totalEasy = currentStat ? currentStat.easy : 0;
  const totalMedium = currentStat ? currentStat.medium : 0;
  const totalHard = currentStat ? currentStat.hard : 0;
  const codingReadiness = Math.min(100, Math.round((totalSolved / 200) * 100));

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold gradient-text">Coding Practice Tracker</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Track your progress across coding platforms</p>
        </div>
      </div>

      {/* Add platform */}
      <div className="glass-card rounded-2xl p-5">
        <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-brand-blue" /> Sync Platform Profile
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {PLATFORMS.map((p) => (
            <button key={p.id} onClick={() => setSelectedPlatform(p)}
              className={`px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all flex items-center gap-1.5 ${selectedPlatform.id === p.id ? "border-brand-blue bg-blue-50 text-brand-blue" : "border-border/60 hover:border-brand-blue/40"
                }`}>
              <span>{p.icon}</span>{p.name}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <Input
            placeholder={`Your ${selectedPlatform.name} username...`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-xl border-border/60"
            onKeyDown={(e) => e.key === "Enter" && handleSync()}
          />
          <Button onClick={handleSync} disabled={loading || !username} className="btn-gradient-primary gap-2 rounded-xl">
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Zap className="w-4 h-4" />}
            {loading ? "Syncing..." : "Sync"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Enter your username to simulate data sync (demo mode)</p>
      </div>

      {!currentStat ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Code2 className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-muted-foreground">Platform not synced</h3>
          <p className="text-sm text-muted-foreground mt-1">Please sync your {selectedPlatform.name} profile to see statistics</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <BarChart2 className="w-5 h-5" />, label: "Total Solved", value: totalSolved, color: "from-blue-500 to-purple-600" },
              { icon: <CircleDot className="w-5 h-5" />, label: "Easy", value: totalEasy, color: "from-green-500 to-emerald-600" },
              { icon: <Star className="w-5 h-5" />, label: "Medium", value: totalMedium, color: "from-yellow-500 to-orange-500" },
              { icon: <Award className="w-5 h-5" />, label: "Hard", value: totalHard, color: "from-red-500 to-pink-600" },
            ].map(({ icon, label, value, color }) => (
              <div key={label} className="stat-card">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-primary-foreground mb-3`}>{icon}</div>
                <div className="text-2xl font-display font-bold">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          {/* Coding Readiness + Overall Bar */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <CodingReadinessRing score={codingReadiness} />
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <h3 className="font-display font-semibold mb-1">Coding Readiness Score</h3>
                  <p className="text-xs text-muted-foreground">Based on {totalSolved} problems solved across {codingStats.length} platform(s)</p>
                </div>
                <DifficultyBar easy={totalEasy} medium={totalMedium} hard={totalHard} />
              </div>
            </div>
          </div>

          {/* Per platform stats (Only showing selected) */}
          <div className="grid grid-cols-1 gap-4">
            {codingStats
              .filter((s) => s.platform === selectedPlatform.id)
              .map((stat) => {
                const platform = PLATFORMS.find((p) => p.id === stat.platform);
                return (
                  <div key={stat.platform} className="glass-card rounded-2xl p-6 space-y-4 border-2 border-brand-blue/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform?.color} flex items-center justify-center text-2xl shadow-md`}>
                          {platform?.icon}
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-lg">{platform?.name} Overview</h3>
                          <p className="text-xs text-muted-foreground font-mono">@{stat.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600">
                        <Flame className="w-4 h-4" />
                        <span className="text-sm font-bold">{stat.streakDays} Day Streak</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/40">
                      <div className="text-center">
                        <div className="text-3xl font-display font-bold text-brand-blue">{stat.total}</div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Solved</div>
                      </div>
                      <div className="text-center border-l border-border/40">
                        <div className="text-3xl font-display font-bold text-brand-purple">{stat.contestRating}</div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Platform Rating</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold">Difficulty Breakdown</h4>
                        <DifficultyBar easy={stat.easy} medium={stat.medium} hard={stat.hard} />
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold">Activity Pulse</h4>
                        <MiniBarChart data={stat.weeklyActivity} label="Solutions over last 7 days" />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Platform analysis */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-blue" /> Coding Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-green-600 mb-2">💪 Strength Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    ["Arrays", "Strings", "Basic Math", "Sorting"],
                    ["Recursion", "Hashing", "Greedy", "Math"],
                    ["Stacks", "Queues", "Bit Manipulation", "Two Pointers"]
                  ][Math.floor(Math.random() * 3)].map(t => (
                    <Badge key={t} className="bg-green-100 text-green-700 border-0">{t}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-500 mb-2">📚 Areas to Improve</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    ["Dynamic Programming", "Graphs", "Trees", "Backtracking"],
                    ["Segment Trees", "Trie", "Heaps", "Hard DP"],
                    ["Disjoint Set Union", "Network Flow", "Geometry", "Sliding Window"]
                  ][Math.floor(Math.random() * 3)].map(t => (
                    <Badge key={t} className="bg-red-100 text-red-600 border-0">{t}</Badge>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <h4 className="text-sm font-semibold text-brand-blue mb-2">📋 Recommended Problems</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {[
                    [
                      "• LeetCode #70 — Climbing Stairs (DP intro)",
                      "• LeetCode #200 — Number of Islands (Graph/BFS)",
                      "• LeetCode #94 — Binary Tree Inorder Traversal",
                      "• LeetCode #322 — Coin Change (DP classic)"
                    ],
                    [
                      "• LeetCode #1 — Two Sum (Easy but fundamental)",
                      "• LeetCode #121 — Buy/Sell Stock (Dynamic Programming)",
                      "• LeetCode #53 — Maximum Subarray (Kadane's)",
                      "• LeetCode #141 — Linked List Cycle"
                    ],
                    [
                      "• HackerRank — 1D Array Construction",
                      "• HackerRank — Time Conversion",
                      "• HackerRank — Staircase Pattern",
                      "• HackerRank — Sparse Arrays"
                    ]
                  ][Math.floor(Math.random() * 3)].map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
