// Core skill data for the Skill Gap Analyzer

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

export type TargetRole =
  | "Full Stack Developer"
  | "Backend Developer"
  | "Frontend Developer"
  | "Data Analyst"
  | "DevOps Engineer"
  | "Mobile Developer"
  | "AI/ML Engineer"
  | "Cybersecurity Analyst"
  | "UI/UX Designer"
  | "Cloud Architect"
  | "QA Engineer";

export interface Skill {
  name: string;
  icon: string;
  category: string;
  color: string;
}

export interface RoleRequirement {
  skill: string;
  requiredLevel: SkillLevel;
}

export const ALL_SKILLS: Skill[] = [
  { name: "HTML", icon: "🏢", category: "Frontend", color: "bg-orange-100 text-orange-700" },
  { name: "CSS", icon: "🌈", category: "Frontend", color: "bg-blue-100 text-blue-700" },
  { name: "JavaScript", icon: "📜", category: "Frontend", color: "bg-yellow-100 text-yellow-700" },
  { name: "TypeScript", icon: "📘", category: "Frontend", color: "bg-blue-100 text-blue-800" },
  { name: "React", icon: "⚛️", category: "Frontend", color: "bg-cyan-100 text-cyan-700" },
  { name: "Vue.js", icon: "🌿", category: "Frontend", color: "bg-green-100 text-green-700" },
  { name: "Angular", icon: "🅰️", category: "Frontend", color: "bg-red-100 text-red-700" },
  { name: "Node.js", icon: "🍏", category: "Backend", color: "bg-green-100 text-green-800" },
  { name: "Express.js", icon: "🚂", category: "Backend", color: "bg-gray-100 text-gray-700" },
  { name: "Python", icon: "🐍", category: "Backend", color: "bg-yellow-100 text-yellow-800" },
  { name: "Java", icon: "🍵", category: "Backend", color: "bg-orange-100 text-orange-800" },
  { name: "C++", icon: "🐲", category: "Backend", color: "bg-purple-100 text-purple-700" },
  { name: "Go", icon: "💨", category: "Backend", color: "bg-cyan-100 text-cyan-800" },
  { name: "MongoDB", icon: "🍃", category: "Database", color: "bg-green-100 text-green-700" },
  { name: "MySQL", icon: "🐬", category: "Database", color: "bg-blue-100 text-blue-700" },
  { name: "PostgreSQL", icon: "🐘", category: "Database", color: "bg-blue-100 text-blue-800" },
  { name: "SQL", icon: "🔍", category: "Database", color: "bg-indigo-100 text-indigo-700" },
  { name: "Redis", icon: "🔴", category: "Database", color: "bg-red-100 text-red-700" },
  { name: "Docker", icon: "🐋", category: "DevOps", color: "bg-blue-100 text-blue-700" },
  { name: "Kubernetes", icon: "☸️", category: "DevOps", color: "bg-blue-100 text-blue-800" },
  { name: "AWS", icon: "☁️", category: "DevOps", color: "bg-orange-100 text-orange-700" },
  { name: "CI/CD", icon: "🚀", category: "DevOps", color: "bg-purple-100 text-purple-700" },
  { name: "Git", icon: "🎋", category: "Tools", color: "bg-orange-100 text-orange-700" },
  { name: "Linux", icon: "🐧", category: "Tools", color: "bg-gray-100 text-gray-700" },
  { name: "REST APIs", icon: "🔗", category: "Backend", color: "bg-indigo-100 text-indigo-700" },
  { name: "GraphQL", icon: "🎆", category: "Backend", color: "bg-pink-100 text-pink-700" },
  { name: "Pandas", icon: "🐼", category: "Data", color: "bg-blue-100 text-blue-700" },
  { name: "NumPy", icon: "🔢", category: "Data", color: "bg-blue-100 text-blue-800" },
  { name: "Machine Learning", icon: "🎓", category: "Data", color: "bg-purple-100 text-purple-700" },
  { name: "Power BI", icon: "📈", category: "Data", color: "bg-yellow-100 text-yellow-700" },
  { name: "Flutter", icon: "💙", category: "Mobile", color: "bg-blue-100 text-blue-600" },
  { name: "Swift", icon: "🍎", category: "Mobile", color: "bg-orange-100 text-orange-600" },
  { name: "Kotlin", icon: "📱", category: "Mobile", color: "bg-purple-100 text-purple-600" },
  { name: "TensorFlow", icon: "🧠", category: "AI/ML", color: "bg-orange-100 text-orange-800" },
  { name: "PyTorch", icon: "🔥", category: "AI/ML", color: "bg-red-100 text-red-700" },
  { name: "Ethical Hacking", icon: "🛡️", category: "Security", color: "bg-gray-100 text-gray-800" },
  { name: "Network Security", icon: "🔐", category: "Security", color: "bg-blue-100 text-blue-900" },
  { name: "Figma", icon: "🎨", category: "Design", color: "bg-pink-100 text-pink-600" },
  { name: "Adobe XD", icon: "🖌️", category: "Design", color: "bg-purple-100 text-purple-800" },
  { name: "Terraform", icon: "🏗️", category: "Infrastructure", color: "bg-indigo-100 text-indigo-800" },
  { name: "Selenium", icon: "🧪", category: "QA", color: "bg-green-100 text-green-700" },
  { name: "Jest", icon: "🃏", category: "QA", color: "bg-red-100 text-red-800" },
];

export const ROLE_REQUIREMENTS: Record<TargetRole, RoleRequirement[]> = {
  "Full Stack Developer": [
    { skill: "HTML", requiredLevel: "Intermediate" },
    { skill: "CSS", requiredLevel: "Intermediate" },
    { skill: "JavaScript", requiredLevel: "Advanced" },
    { skill: "React", requiredLevel: "Intermediate" },
    { skill: "Node.js", requiredLevel: "Intermediate" },
    { skill: "MongoDB", requiredLevel: "Intermediate" },
    { skill: "REST APIs", requiredLevel: "Intermediate" },
    { skill: "Git", requiredLevel: "Intermediate" },
    { skill: "SQL", requiredLevel: "Beginner" },
  ],
  "Frontend Developer": [
    { skill: "HTML", requiredLevel: "Advanced" },
    { skill: "CSS", requiredLevel: "Advanced" },
    { skill: "JavaScript", requiredLevel: "Advanced" },
    { skill: "TypeScript", requiredLevel: "Intermediate" },
    { skill: "React", requiredLevel: "Advanced" },
    { skill: "Git", requiredLevel: "Intermediate" },
    { skill: "REST APIs", requiredLevel: "Beginner" },
  ],
  "Backend Developer": [
    { skill: "Node.js", requiredLevel: "Advanced" },
    { skill: "Express.js", requiredLevel: "Intermediate" },
    { skill: "Python", requiredLevel: "Intermediate" },
    { skill: "MongoDB", requiredLevel: "Intermediate" },
    { skill: "SQL", requiredLevel: "Intermediate" },
    { skill: "REST APIs", requiredLevel: "Advanced" },
    { skill: "Docker", requiredLevel: "Beginner" },
    { skill: "Git", requiredLevel: "Intermediate" },
  ],
  "Data Analyst": [
    { skill: "Python", requiredLevel: "Intermediate" },
    { skill: "SQL", requiredLevel: "Advanced" },
    { skill: "Pandas", requiredLevel: "Intermediate" },
    { skill: "NumPy", requiredLevel: "Intermediate" },
    { skill: "Power BI", requiredLevel: "Intermediate" },
    { skill: "Machine Learning", requiredLevel: "Beginner" },
  ],
  "DevOps Engineer": [
    { skill: "Linux", requiredLevel: "Advanced" },
    { skill: "Docker", requiredLevel: "Advanced" },
    { skill: "Kubernetes", requiredLevel: "Intermediate" },
    { skill: "AWS", requiredLevel: "Intermediate" },
    { skill: "CI/CD", requiredLevel: "Advanced" },
    { skill: "Git", requiredLevel: "Advanced" },
    { skill: "Python", requiredLevel: "Beginner" },
  ],
  "Mobile Developer": [
    { skill: "Flutter", requiredLevel: "Advanced" },
    { skill: "Kotlin", requiredLevel: "Intermediate" },
    { skill: "Swift", requiredLevel: "Intermediate" },
    { skill: "JavaScript", requiredLevel: "Intermediate" },
    { skill: "REST APIs", requiredLevel: "Advanced" },
    { skill: "Git", requiredLevel: "Advanced" },
  ],
  "AI/ML Engineer": [
    { skill: "Python", requiredLevel: "Advanced" },
    { skill: "TensorFlow", requiredLevel: "Advanced" },
    { skill: "PyTorch", requiredLevel: "Intermediate" },
    { skill: "NumPy", requiredLevel: "Advanced" },
    { skill: "Pandas", requiredLevel: "Advanced" },
    { skill: "Machine Learning", requiredLevel: "Advanced" },
  ],
  "Cybersecurity Analyst": [
    { skill: "Linux", requiredLevel: "Advanced" },
    { skill: "Ethical Hacking", requiredLevel: "Advanced" },
    { skill: "Network Security", requiredLevel: "Advanced" },
    { skill: "Python", requiredLevel: "Intermediate" },
    { skill: "SQL", requiredLevel: "Intermediate" },
  ],
  "UI/UX Designer": [
    { skill: "Figma", requiredLevel: "Advanced" },
    { skill: "Adobe XD", requiredLevel: "Advanced" },
    { skill: "HTML", requiredLevel: "Beginner" },
    { skill: "CSS", requiredLevel: "Intermediate" },
    { skill: "React", requiredLevel: "Beginner" },
  ],
  "Cloud Architect": [
    { skill: "AWS", requiredLevel: "Advanced" },
    { skill: "Docker", requiredLevel: "Advanced" },
    { skill: "Kubernetes", requiredLevel: "Advanced" },
    { skill: "Terraform", requiredLevel: "Advanced" },
    { skill: "Linux", requiredLevel: "Intermediate" },
  ],
  "QA Engineer": [
    { skill: "Selenium", requiredLevel: "Advanced" },
    { skill: "Jest", requiredLevel: "Advanced" },
    { skill: "JavaScript", requiredLevel: "Advanced" },
    { skill: "Git", requiredLevel: "Intermediate" },
    { skill: "SQL", requiredLevel: "Beginner" },
  ],
};

const levelScore: Record<SkillLevel, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

export interface SkillGapResult {
  matching: Array<{ skill: string; studentLevel: SkillLevel; requiredLevel: SkillLevel }>;
  partial: Array<{ skill: string; studentLevel: SkillLevel; requiredLevel: SkillLevel }>;
  missing: Array<{ skill: string; requiredLevel: SkillLevel }>;
  readinessScore: number;
}

export function analyzeSkillGap(
  studentSkills: Array<{ skill: string; level: SkillLevel }>,
  targetRole: TargetRole
): SkillGapResult {
  const requirements = ROLE_REQUIREMENTS[targetRole];
  const studentSkillMap = new Map(studentSkills.map((s) => [s.skill, s.level]));

  const matching: SkillGapResult["matching"] = [];
  const partial: SkillGapResult["partial"] = [];
  const missing: SkillGapResult["missing"] = [];

  let totalPoints = 0;
  let earnedPoints = 0;

  for (const req of requirements) {
    const maxPoints = levelScore[req.requiredLevel];
    totalPoints += maxPoints;

    const studentLevel = studentSkillMap.get(req.skill);
    if (!studentLevel) {
      missing.push({ skill: req.skill, requiredLevel: req.requiredLevel });
    } else {
      const studentScore = levelScore[studentLevel];
      earnedPoints += Math.min(studentScore, maxPoints);

      if (studentScore >= levelScore[req.requiredLevel]) {
        matching.push({ skill: req.skill, studentLevel, requiredLevel: req.requiredLevel });
      } else {
        partial.push({ skill: req.skill, studentLevel, requiredLevel: req.requiredLevel });
      }
    }
  }

  const readinessScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  return { matching, partial, missing, readinessScore };
}
