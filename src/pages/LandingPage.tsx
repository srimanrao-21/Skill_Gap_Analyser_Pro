import { useState } from "react";
import { Brain, Target, TrendingUp, BookOpen, Award } from "lucide-react";

interface LandingPageProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export default function LandingPage({ onSignIn, onSignUp }: LandingPageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    { icon: Target, title: "Skill Gap Analysis", desc: "Identify exactly what skills you need to land your dream role" },
    { icon: TrendingUp, title: "Coding Tracker", desc: "Track your LeetCode & HackerRank progress in real-time" },
    { icon: BookOpen, title: "Personalized Learning", desc: "Only the courses YOU need — no clutter, no wasted time" },
    { icon: Award, title: "Resume Builder", desc: "Generate ATS-friendly resumes that get you noticed" },
  ];



  return (
    <div className="lp-root">

      {/* ── Navbar ── */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <div className="lp-logo-icon">
              <Brain size={20} color="#fff" />
            </div>
            <span className="lp-logo-text">Skill Gap Analyzer</span>
          </div>
          <div className="lp-nav-actions">
            <button id="btn-signin" className="lp-btn-ghost" onClick={onSignIn}>Sign In</button>
            <button id="btn-signup" className="lp-btn-primary" onClick={onSignUp}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero">
        {/* Left text */}
        <div className="lp-hero-left">


          <h1 className="lp-h1">
            Anything's possible<br />
            <span className="lp-h1-accent">when you have the skills</span>
          </h1>

          <p className="lp-subtitle">
            Find your skill gaps, follow a personalised learning path, and
            become placement-ready — fast.
          </p>

          <div className="lp-cta-group">
            <div className="lp-cta-label">Choose what you want to analyze:</div>
            <div className="lp-cta-row">
              <button className="lp-cta-white" onClick={onSignIn}>
                My Skill Gaps
              </button>
              <button className="lp-cta-dark" onClick={onSignUp}>
                Get Started Free
              </button>
            </div>
          </div>


        </div>

        {/* Right image */}
        <div className="lp-hero-right">
          <img src="/hero.png" alt="Professionals reviewing skill analysis" className="lp-hero-img" />

        </div>
      </section>

      {/* ── Features ── */}
      <section className="lp-features">
        <h2 className="lp-features-title">Everything you need to get placed</h2>
        <div className="lp-features-grid">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className={`lp-feature-card${hoveredFeature === i ? " lp-feature-card--hovered" : ""}`}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="lp-feature-icon">
                  <Icon size={20} color="#fff" />
                </div>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-desc">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="lp-footer-cta">
        <h2 className="lp-footer-cta-title">Ready to close your skill gaps?</h2>
        <p className="lp-footer-cta-sub">Join thousands of students on their placement journey.</p>
        <button className="lp-btn-primary lp-btn-lg" onClick={onSignUp}>Start for Free →</button>
      </section>

      <footer className="lp-footer">
        <p>© 2025 Skill Gap Analyzer · Built to help students become placement-ready 🚀</p>
      </footer>
    </div>
  );
}
