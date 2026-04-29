import { useState } from "react";
import { Brain, Sparkles, Target, TrendingUp, BookOpen, Award } from "lucide-react";

interface LandingPageProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export default function LandingPage({ onSignIn, onSignUp }: LandingPageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    { icon: Target, title: "Skill Gap Analysis", desc: "Identify exactly what skills you need to land your dream job" },
    { icon: TrendingUp, title: "Coding Tracker", desc: "Track your LeetCode & HackerRank progress in real-time" },
    { icon: BookOpen, title: "Learning Paths", desc: "Curated resources tailored to close your skill gaps fast" },
    { icon: Award, title: "Resume Builder", desc: "Generate ATS-friendly resumes that get you noticed" },
  ];

  return (
    <div className="landing-root">
      {/* ── Navbar ── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          {/* Logo */}
          <div className="landing-logo">
            <div className="landing-logo-icon">
              <Brain size={22} color="#fff" />
            </div>
            <span className="landing-logo-text">Skill Gap Analyzer</span>
          </div>

          {/* Auth Buttons */}
          <div className="landing-nav-actions">
            <button id="btn-signin" className="landing-btn-outline" onClick={onSignIn}>
              Sign In
            </button>
            <button id="btn-signup" className="landing-btn-filled" onClick={onSignUp}>
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero">
        {/* Decorative blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="landing-hero-content">
          <div className="landing-badge">
            <Sparkles size={14} />
            <span>AI-Powered Placement Platform</span>
          </div>

          <h1 className="landing-h1">
            Skills Gap<br />
            <span className="landing-h1-accent">Analysis Tool</span>
          </h1>

          <p className="landing-subtitle">
            A fast, simple, and actionable way for students to start
            identifying their individual skill gaps and become placement-ready.
          </p>

          <p className="landing-choose-label">Choose what you want to analyze:</p>

          <div className="landing-cta-row">
            <button className="landing-cta-outline" onClick={onSignIn}>
              My Skill Gaps
            </button>
            <button className="landing-cta-filled" onClick={onSignUp}>
              Get Started Free
            </button>
          </div>
        </div>

        {/* Right side – dashboard preview card */}
        <div className="landing-hero-visual">
          <div className="preview-card">
            <div className="preview-card-header">
              <span className="preview-dot red" />
              <span className="preview-dot yellow" />
              <span className="preview-dot green" />
              <span className="preview-title">Start your skills gap analysis</span>
            </div>

            <p className="preview-subtitle">
              Change and transformation is happening frequently.<br />
              What would help your team better adapt?
            </p>

            <div className="preview-options">
              {[
                "The skills to navigate the fast pace of change, even without certainty",
                "Stronger project management skills",
                "The ability to positively manage and communicate with stakeholders",
                "Strong innovative and creative thinking for future trends",
              ].map((opt, i) => (
                <div key={i} className="preview-option">
                  <span className="preview-radio" />
                  <span>{opt}</span>
                </div>
              ))}
            </div>

            <div className="preview-footer">
              <button className="preview-back-btn">Back</button>
              <button className="preview-next-btn" onClick={onSignUp}>Next →</button>
            </div>
          </div>

          {/* Floating stat chips */}
          <div className="stat-chip chip-1">
            <span className="chip-num">95%</span>
            <span className="chip-label">Placement Rate</span>
          </div>
          <div className="stat-chip chip-2">
            <span className="chip-num">2K+</span>
            <span className="chip-label">Students Helped</span>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-features">
        <h2 className="features-title">Everything you need to get placed</h2>
        <div className="features-grid">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className={`feature-card${hoveredFeature === i ? " feature-card-hovered" : ""}`}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="feature-icon-wrap">
                  <Icon size={22} color="#fff" />
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="landing-footer-cta">
        <h2 className="footer-cta-title">Ready to close your skill gaps?</h2>
        <p className="footer-cta-sub">Join thousands of students on their placement journey.</p>
        <button className="landing-btn-filled landing-btn-lg" onClick={onSignUp}>
          Start for Free →
        </button>
      </section>

      <footer className="landing-footer">
        <p>© 2025 Skill Gap Analyzer · Built to help students become placement-ready 🚀</p>
      </footer>
    </div>
  );
}
