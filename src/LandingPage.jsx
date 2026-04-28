import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

// ─── NAVBAR ───────────────────────────────────────────────────
const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpenMenu(null);
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <div className="nav-logo" onClick={() => scrollTo("hero")}>
          Scope<span className="nav-accent">Sync</span>
        </div>
        <div className="nav-links">

          {/* FEATURES MEGA MENU */}
          <div
            className="nav-item"
            onMouseEnter={() => setOpenMenu('features')}
            onMouseLeave={() => setOpenMenu(null)}
            style={{ paddingBottom: openMenu === 'features' ? 20 : 0, marginBottom: openMenu === 'features' ? -20 : 0 }}
          >
            <span className={`nav-link-arrow ${openMenu === 'features' ? 'active' : ''}`}>
              Features
              <svg className="nav-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
            {openMenu === 'features' && (
              <div className="nav-dropdown mega-features">
                <div className="mega-left">
                  <div className="mega-section-label">CORE FEATURES</div>
                  <div className="mega-item">
                    <div className="mega-item-icon" style={{ background: 'linear-gradient(135deg,#dbeafe,#bfdbfe)' }}>🎯</div>
                    <div className="mega-item-text">
                      <div className="mega-item-title">Find Projects</div>
                      <div className="mega-item-desc">Browse hundreds of curated freelance projects daily</div>
                    </div>
                  </div>
                  <div className="mega-item">
                    <div className="mega-item-icon" style={{ background: 'linear-gradient(135deg,#ede9fe,#ddd6fe)' }}>🤖</div>
                    <div className="mega-item-text">
                      <div className="mega-item-title">AI Proposals</div>
                      <div className="mega-item-desc">Generate professional proposals in seconds with AI</div>
                    </div>
                  </div>
                  <div className="mega-item">
                    <div className="mega-item-icon" style={{ background: 'linear-gradient(135deg,#fef3c7,#fde68a)' }}>✏️</div>
                    <div className="mega-item-text">
                      <div className="mega-item-title">Custom Prompts</div>
                      <div className="mega-item-desc">Tailor AI output to match your unique voice & style</div>
                    </div>
                  </div>
                  <div className="mega-item">
                    <div className="mega-item-icon" style={{ background: 'linear-gradient(135deg,#d1fae5,#a7f3d0)' }}>📄</div>
                    <div className="mega-item-text">
                      <div className="mega-item-title">Auto Contracts</div>
                      <div className="mega-item-desc">Legally-sound contracts generated on deal close</div>
                    </div>
                  </div>
                </div>
                <div className="mega-divider" />
                <div className="mega-right">
                  <div className="mega-section-label">COLLABORATION</div>
                  <div className="mega-item">
                    <div className="mega-item-icon" style={{ background: 'linear-gradient(135deg,#fce7f3,#fbcfe8)' }}>💬</div>
                    <div className="mega-item-text">
                      <div className="mega-item-title">Chat & Negotiate</div>
                      <div className="mega-item-desc">Real-time messaging with clients inside the platform</div>
                    </div>
                  </div>
                  <div className="mega-item">
                    <div className="mega-item-icon" style={{ background: 'linear-gradient(135deg,#e0f2fe,#bae6fd)' }}>🔄</div>
                    <div className="mega-item-text">
                      <div className="mega-item-title">Real-time Revisions</div>
                      <div className="mega-item-desc">Revise & re-send proposals without leaving chat</div>
                    </div>
                  </div>
                  <div className="mega-highlight-box">
                    <div className="mega-highlight-label">✦ NEW</div>
                    <div className="mega-highlight-title">AI Negotiation Assistant</div>
                    <div className="mega-highlight-desc">Get real-time suggestions on how to respond during deal negotiation.</div>
                    <div className="mega-highlight-cta">Learn more →</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PROJECTS MEGA MENU */}
          <div
            className="nav-item"
            onMouseEnter={() => setOpenMenu('projects')}
            onMouseLeave={() => setOpenMenu(null)}
            style={{ paddingBottom: openMenu === 'projects' ? 20 : 0, marginBottom: openMenu === 'projects' ? -20 : 0 }}
          >
            <span className={`nav-link-arrow ${openMenu === 'projects' ? 'active' : ''}`}>
              Projects
              <svg className="nav-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
            {openMenu === 'projects' && (
              <div className="nav-dropdown mega-projects">
                <div className="mega-left">
                  <div className="mega-section-label">BROWSE BY CATEGORY</div>
                  <div className="mega-cat-grid">
                    <div className="mega-cat-item">
                      <div className="mega-cat-icon-wrap" style={{background:'#dbeafe'}}>💻</div>
                      <div className="mega-cat-info">
                        <div className="mega-cat-label">Web Development</div>
                        <div className="mega-cat-count">142 projects</div>
                      </div>
                    </div>
                    <div className="mega-cat-item">
                      <div className="mega-cat-icon-wrap" style={{background:'#ede9fe'}}>🎨</div>
                      <div className="mega-cat-info">
                        <div className="mega-cat-label">UI/UX Design</div>
                        <div className="mega-cat-count">98 projects</div>
                      </div>
                    </div>
                    <div className="mega-cat-item">
                      <div className="mega-cat-icon-wrap" style={{background:'#d1fae5'}}>📱</div>
                      <div className="mega-cat-info">
                        <div className="mega-cat-label">Mobile App</div>
                        <div className="mega-cat-count">76 projects</div>
                      </div>
                    </div>
                    <div className="mega-cat-item">
                      <div className="mega-cat-icon-wrap" style={{background:'#fef3c7'}}>📢</div>
                      <div className="mega-cat-info">
                        <div className="mega-cat-label">Digital Marketing</div>
                        <div className="mega-cat-count">61 projects</div>
                      </div>
                    </div>
                    <div className="mega-cat-item">
                      <div className="mega-cat-icon-wrap" style={{background:'#fce7f3'}}>🤖</div>
                      <div className="mega-cat-info">
                        <div className="mega-cat-label">AI & ML</div>
                        <div className="mega-cat-count">54 projects</div>
                      </div>
                    </div>
                    <div className="mega-cat-item">
                      <div className="mega-cat-icon-wrap" style={{background:'#e0f2fe'}}>📊</div>
                      <div className="mega-cat-info">
                        <div className="mega-cat-label">Data Analysis</div>
                        <div className="mega-cat-count">39 projects</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mega-divider" />
                <div className="mega-right">
                  <div className="mega-section-label">LATEST PROJECTS</div>
                  <div className="mega-project-card">
                    <div className="mega-project-icon" style={{ background: '#dbeafe' }}>💻</div>
                    <div className="mega-project-info">
                      <div className="mega-project-title">E-Commerce Landing Page</div>
                      <div className="mega-project-meta">
                        <span className="mega-project-budget">Rp 3,000,000</span>
                        <span className="mega-project-badge">Open</span>
                      </div>
                    </div>
                  </div>
                  <div className="mega-project-card">
                    <div className="mega-project-icon" style={{ background: '#ede9fe' }}>🎨</div>
                    <div className="mega-project-info">
                      <div className="mega-project-title">Dashboard App Redesign</div>
                      <div className="mega-project-meta">
                        <span className="mega-project-budget">Rp 5,000,000</span>
                        <span className="mega-project-badge">Open</span>
                      </div>
                    </div>
                  </div>
                  <div className="mega-project-card">
                    <div className="mega-project-icon" style={{ background: '#d1fae5' }}>📱</div>
                    <div className="mega-project-info">
                      <div className="mega-project-title">Laundry Mobile App</div>
                      <div className="mega-project-meta">
                        <span className="mega-project-budget">Rp 8,000,000</span>
                        <span className="mega-project-badge">Open</span>
                      </div>
                    </div>
                  </div>
                  <div className="mega-view-all" onClick={() => navigate("/projects")}>
                    View all projects →
                  </div>
                </div>
              </div>
            )}
          </div>

          <span onClick={() => scrollTo("pricing")}>Pricing</span>
          <span onClick={() => scrollTo("testimonials")}>Testimonials</span>
        </div>
        <div className="nav-actions">
          <button className="btn-nav-login" onClick={() => navigate("/login")}>Log In</button>
          <button className="btn-nav-signup" onClick={() => navigate("/signup")}>Sign Up Free</button>
        </div>
      </div>
    </nav>
  );
};

// ─── HERO ────────────────────────────────────────────────────
const ProposalMockup = () => (
  <div className="proposal-stack">
    {/* Background card 3 */}
    <div className="proposal-card pc-3">
      <div className="pc-header">
        <div className="pc-avatar" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>RK</div>
        <div className="pc-header-info">
          <div className="pc-title">Fintech Brand Identity</div>
          <div className="pc-subtitle">Budget: $500 · Due May 10</div>
        </div>
        <div className="pc-status pc-status-pending">Pending</div>
      </div>
    </div>

    {/* Background card 2 */}
    <div className="proposal-card pc-2">
      <div className="pc-header">
        <div className="pc-avatar" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>BS</div>
        <div className="pc-header-info">
          <div className="pc-title">Dashboard UI Redesign</div>
          <div className="pc-subtitle">Budget: $330 · Due Apr 20</div>
        </div>
        <div className="pc-status pc-status-negotiating">Negotiating</div>
      </div>
    </div>

    {/* Main front card */}
    <div className="proposal-card pc-1">
      <div className="pc-header">
        <div className="pc-avatar" style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}>AW</div>
        <div className="pc-header-info">
          <div className="pc-title">E-Commerce Fashion LP</div>
          <div className="pc-subtitle">Budget: $200 · Due Apr 15</div>
        </div>
        <div className="pc-status pc-status-accepted">✓ Accepted</div>
      </div>
      <div className="pc-body">
        <div className="pc-ai-tag">✦ AI-Generated Proposal</div>
        <div className="pc-line pc-line-full" />
        <div className="pc-line pc-line-full" />
        <div className="pc-line pc-line-3q" />
        <div className="pc-spacer" />
        <div className="pc-line pc-line-full pc-line-blue" />
        <div className="pc-line pc-line-half pc-line-blue" />
      </div>
      <div className="pc-footer">
        <div className="pc-bid">
          <span className="pc-bid-label">Your Bid</span>
          <span className="pc-bid-value">$200</span>
        </div>
        <div className="pc-timeline">
          <span className="pc-bid-label">Timeline</span>
          <span className="pc-bid-value">14 days</span>
        </div>
        <div className="pc-send-btn">Send Proposal →</div>
      </div>
    </div>
  </div>
);

const Hero = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <div className="hero-orb orb1" />
        <div className="hero-orb orb2" />
        <div className="hero-diagonal-fix" />
      </div>

      <div className="hero-wrapper">
        {/* LEFT */}
        <div className={`hero-left ${visible ? "visible" : ""}`}>
          <div className="hero-badge">✦ Freelancer Proposal Platform #1</div>
          <h1 className="hero-title">
            Win More Projects<br />
            <span className="hero-highlight">Faster.</span><br />
            More Professional.
          </h1>
          <p className="hero-sub">
            Find projects, create AI-powered proposals, negotiate directly
            with clients, and close deals — all in one platform.
          </p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => navigate("/signup")}>
              Get Started Free →
            </button>
            <button
              className="btn-ghost"
              onClick={() => document.getElementById("howitworks")?.scrollIntoView({ behavior: "smooth" })}
            >
              See How It Works
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">2.4k+</span>
              <span className="stat-label">Active Freelancers</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">8.1k+</span>
              <span className="stat-label">Proposals Sent</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">94%</span>
              <span className="stat-label">Deal Rate</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Proposal stack illustration */}
        <div className={`hero-right ${visible ? "visible" : ""}`}>
          <ProposalMockup />
        </div>
      </div>
    </section>
  );
};

// ─── FEATURES ────────────────────────────────────────────────
const features = [
  {
    icon: "🎯",
    title: "Find Projects",
    desc: "Browse hundreds of curated freelance projects. Filter by category, budget, and deadline to find your perfect match.",
    accent: "#dbeafe",
    accentDark: "#2563eb",
  },
  {
    icon: "🤖",
    title: "AI-Powered Proposals",
    desc: "Generate professional, tailored proposals in seconds. The AI understands your project context and writes in your voice.",
    accent: "#ede9fe",
    accentDark: "#7c3aed",
  },
  {
    icon: "✏️",
    title: "Custom Prompts",
    desc: "Fine-tune your AI proposals with custom instructions. Make every proposal uniquely yours — down to the tone.",
    accent: "#fef3c7",
    accentDark: "#d97706",
  },
  {
    icon: "💬",
    title: "Negotiate in Chat",
    desc: "After the proposal is sent, a chat room opens automatically. Discuss, revise, and close deals without leaving the platform.",
    accent: "#d1fae5",
    accentDark: "#059669",
  },
  {
    icon: "🔄",
    title: "Real-time Revisions",
    desc: "Client requested changes? Re-prompt your AI for instant revisions and send the updated version directly from chat.",
    accent: "#fce7f3",
    accentDark: "#db2777",
  },
  {
    icon: "📄",
    title: "Auto Contracts",
    desc: "Once agreed, the system generates a professional, legally-sound work contract automatically. Digital signature included.",
    accent: "#e0f2fe",
    accentDark: "#0284c7",
  },
];

const Features = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="features" id="features" ref={ref}>
      <div className="section-inner">
        <div className={`section-header ${visible ? "visible" : ""}`}>
          <div className="section-badge">Features</div>
          <h2 className="section-title">Everything You Need<br />to Win Projects</h2>
          <p className="section-sub">From browsing projects to closing deals — everything is in ScopeSync.</p>
        </div>
        <div className={`features-grid ${visible ? "visible" : ""}`}>
          {/* Row 1: big card left + 2 small stacked right */}
          <div className="feature-card feature-card--large" style={{ animationDelay: '0s' }}>
            <div className="fc-icon-wrap fc-blue"><span>🎯</span></div>
            <h3 className="fc-title">Find the Right Projects</h3>
            <p className="fc-desc">Browse hundreds of curated freelance projects every day. Filter by category, budget, deadline, and skill — and land the projects that truly match your expertise.</p>
            <div className="fc-illustration fc-illus-projects">
              <div className="fc-illus-row">
                <div className="fc-illus-tag" style={{background:'#dbeafe',color:'#1d4ed8'}}>💻 Web Dev</div>
                <div className="fc-illus-tag" style={{background:'#ede9fe',color:'#6d28d9'}}>🎨 UI/UX</div>
                <div className="fc-illus-tag" style={{background:'#d1fae5',color:'#065f46'}}>📱 Mobile</div>
              </div>
              <div className="fc-illus-row">
                <div className="fc-illus-tag" style={{background:'#fef3c7',color:'#92400e'}}>📢 Marketing</div>
                <div className="fc-illus-tag" style={{background:'#fce7f3',color:'#9d174d'}}>🤖 AI & ML</div>
              </div>
            </div>
          </div>

          <div className="feature-card feature-card--small" style={{ animationDelay: '0.1s' }}>
            <div className="fc-icon-wrap fc-purple"><span>🤖</span></div>
            <h3 className="fc-title">AI-Powered Proposals</h3>
            <p className="fc-desc">Generate a professional, tailored proposal in seconds. The AI reads the job brief and writes in your voice.</p>
          </div>

          <div className="feature-card feature-card--small" style={{ animationDelay: '0.2s' }}>
            <div className="fc-icon-wrap fc-amber"><span>✏️</span></div>
            <h3 className="fc-title">Custom Prompts</h3>
            <p className="fc-desc">Fine-tune every AI output with your own instructions. Make proposals uniquely yours — down to tone and style.</p>
          </div>

          {/* Row 2: 2 small left + big card right */}
          <div className="feature-card feature-card--small" style={{ animationDelay: '0.3s' }}>
            <div className="fc-icon-wrap fc-green"><span>💬</span></div>
            <h3 className="fc-title">Negotiate in Chat</h3>
            <p className="fc-desc">A real-time chat room opens the moment your proposal is sent. Discuss terms and close deals without leaving the app.</p>
          </div>

          <div className="feature-card feature-card--small" style={{ animationDelay: '0.4s' }}>
            <div className="fc-icon-wrap fc-pink"><span>🔄</span></div>
            <h3 className="fc-title">Real-time Revisions</h3>
            <p className="fc-desc">Client wants changes? Re-prompt your AI and send a revised proposal instantly — directly from the chat window.</p>
          </div>

          <div className="feature-card feature-card--large" style={{ animationDelay: '0.5s' }}>
            <div className="fc-icon-wrap fc-sky"><span>📄</span></div>
            <h3 className="fc-title">Auto Contracts on Deal Close</h3>
            <p className="fc-desc">The moment both sides agree, ScopeSync auto-generates a professional, legally-sound work contract — ready for digital signature in one click.</p>
            <div className="fc-illustration fc-illus-contract">
              <div className="fc-contract-mock">
                <div className="fc-contract-line fc-contract-title-line" />
                <div className="fc-contract-line" style={{width:'88%'}} />
                <div className="fc-contract-line" style={{width:'72%'}} />
                <div className="fc-contract-line" style={{width:'80%'}} />
                <div className="fc-contract-sigs">
                  <div className="fc-sig"><div className="fc-sig-line" /><div className="fc-sig-label">Freelancer</div></div>
                  <div className="fc-sig"><div className="fc-sig-line" /><div className="fc-sig-label">Client</div></div>
                </div>
                <div className="fc-contract-stamp">✓ Signed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── HOW IT WORKS ─────────────────────────────────────────────
const steps = [
  { num: "01", title: "Sign Up & Create Profile", desc: "Create a freelancer or client account in 2 minutes. Complete your profile and add your skills." },
  { num: "02", title: "Browse & Choose Projects", desc: "Clients post projects, freelancers browse and select projects matching their expertise." },
  { num: "03", title: "Generate AI Proposal", desc: "Input your key points and let AI craft a polished, persuasive proposal instantly." },
  { num: "04", title: "Negotiate in Real-time", desc: "Chat directly with the client, share revisions, and finalize terms without leaving the app." },
  { num: "05", title: "Close Deal & Get Contract", desc: "Agree on terms and the system auto-generates a signed contract. Start working right away." },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="howitworks" id="howitworks" ref={ref}>
      <div className="section-inner">
        <div className={`section-header ${visible ? "visible" : ""}`}>
          <div className="section-badge dark">How It Works</div>
          <h2 className="section-title light">From Project to Deal<br />in 5 Simple Steps</h2>
        </div>
        <div className={`steps ${visible ? "visible" : ""}`}>
          {steps.map((s, i) => (
            <div className="step" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="step-num">{s.num}</div>
              <div className="step-content">
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── PRICING ─────────────────────────────────────────────────
const plans = [
  { name: "Starter", price: "Free", period: "", desc: "For freelancers just getting started", features: ["5 proposals / month", "Basic templates", "Client chat", "1 active contract"], cta: "Get Started Free", highlight: false },
  { name: "Pro", price: "Rp 149k", period: "/ month", desc: "For professional freelancers", features: ["Unlimited proposals", "All premium templates", "Unlimited AI prompts", "Unlimited contracts", "Priority support"], cta: "Try 14 Days Free", highlight: true },
  { name: "Agency", price: "Rp 399k", period: "/ month", desc: "For teams & agencies", features: ["All Pro features", "Up to 10 team members", "Analytics dashboard", "Custom branding", "Dedicated support"], cta: "Contact Us", highlight: false },
];

const Pricing = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="pricing" id="pricing" ref={ref}>
      <div className="section-inner">
        <div className={`section-header ${visible ? "visible" : ""}`}>
          <div className="section-badge">Pricing</div>
          <h2 className="section-title">Choose the Right Plan</h2>
          <p className="section-sub">Start for free, upgrade anytime.</p>
        </div>
        <div className={`pricing-grid ${visible ? "visible" : ""}`}>
          {plans.map((p, i) => (
            <div className={`pricing-card ${p.highlight ? "highlight" : ""}`} key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              {p.highlight && <div className="popular-badge">Most Popular</div>}
              <div className="plan-name">{p.name}</div>
              <div className="plan-price">{p.price}<span className="plan-period">{p.period}</span></div>
              <p className="plan-desc">{p.desc}</p>
              <ul className="plan-features">
                {p.features.map((f, j) => <li key={j}><span className="check">✓</span>{f}</li>)}
              </ul>
              <button className={`btn-plan ${p.highlight ? "btn-plan-primary" : "btn-plan-outline"}`} onClick={() => navigate("/signup")}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── TESTIMONIALS (MARQUEE) ───────────────────────────────────
const testimonials = [
  { text: "ScopeSync completely changed how I land clients. My acceptance rate went from 30% to over 80% in just 2 months.", name: "Rizky Pratama", role: "Fullstack Developer", avatar: "RP", color: "#dbeafe" },
  { text: "The AI proposal generator is insane. It writes better than I do and sounds exactly like me. My clients love it.", name: "Sari Dewi", role: "UI/UX Designer", avatar: "SD", color: "#ede9fe" },
  { text: "I used to spend hours on proposals. Now it takes 5 minutes. The negotiation chat is a game changer too.", name: "Ahmad Fauzi", role: "Digital Marketer", avatar: "AF", color: "#d1fae5" },
  { text: "Best investment for my freelance business. Got 3 clients in the first week after switching from my old workflow.", name: "Maya Indah", role: "Content Strategist", avatar: "MI", color: "#fce7f3" },
  { text: "The auto-contract feature alone is worth the subscription. No more back-and-forth on terms over email.", name: "Dimas Saputra", role: "Mobile Developer", avatar: "DS", color: "#fef3c7" },
  { text: "I was skeptical about AI proposals but the quality blew me away. It nailed my tone perfectly on the first try.", name: "Nadia Putri", role: "Graphic Designer", avatar: "NP", color: "#e0f2fe" },
  { text: "As an agency, having 10 team members on one plan is perfect. The analytics dashboard helps me track everything.", name: "Hendra Wijaya", role: "Agency Owner", avatar: "HW", color: "#fce7f3" },
  { text: "ScopeSync gave me the confidence to pitch bigger clients. The professional proposals make me look like a top-tier freelancer.", name: "Fitri Handayani", role: "SEO Specialist", avatar: "FH", color: "#d1fae5" },
];

const TestiCard = ({ t }) => (
  <div className="testi-card-marquee">
    <div className="testi-quote">"</div>
    <div className="testi-stars">★★★★★</div>
    <p className="testi-text">"{t.text}"</p>
    <div className="testi-author">
      <div className="testi-avatar" style={{ background: t.color }}>
        <span style={{ color: '#1e40af', fontWeight: 700, fontSize: 13 }}>{t.avatar}</span>
      </div>
      <div>
        <div className="testi-name">{t.name}</div>
        <div className="testi-role">{t.role}</div>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const row1 = testimonials.slice(0, 4);
  const row2 = testimonials.slice(4, 8);

  return (
    <section className="testimonials" id="testimonials" ref={ref}>
      <div className={`section-header ${visible ? "visible" : ""}`} style={{ maxWidth: 1100, margin: '0 auto 48px', padding: '0 32px' }}>
        <div className="section-badge">Testimonials</div>
        <h2 className="section-title">What Our Users<br />Are Saying</h2>
      </div>

      <div
        className={`marquee-wrap ${visible ? "visible" : ""}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Row 1 — left to right */}
        <div className={`marquee-track marquee-track-1 ${paused ? "paused" : ""}`}>
          {[...row1, ...row1].map((t, i) => <TestiCard key={i} t={t} />)}
        </div>
        {/* Row 2 — right to left */}
        <div className={`marquee-track marquee-track-2 ${paused ? "paused" : ""}`}>
          {[...row2, ...row2].map((t, i) => <TestiCard key={i} t={t} />)}
        </div>
      </div>
    </section>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────
const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">Scope<span className="nav-accent">Sync</span></div>
          <p className="footer-tagline">Indonesia's best freelancer proposal platform. From project to deal, faster.</p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <div className="footer-col-title">Product</div>
            <span>Features</span><span>Pricing</span><span>Templates</span><span>How It Works</span>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Company</div>
            <span>About Us</span><span>Blog</span><span>Careers</span><span>Contact</span>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Support</div>
            <span>Help Center</span><span>Documentation</span><span>Status</span><span>Community</span>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Legal</div>
            <span>Privacy Policy</span><span>Terms of Service</span><span>Cookie Policy</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 ScopeSync. All rights reserved.</span>
        <div className="footer-bottom-links">
          <span onClick={() => navigate("/login")}>Log In</span>
          <span onClick={() => navigate("/signup")}>Sign Up Free</span>
        </div>
      </div>
    </footer>
  );
};

export default function LandingPage() {
  return (
    <div className="landing">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <Footer />
    </div>
  );
}
