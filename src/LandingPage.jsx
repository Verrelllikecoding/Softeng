import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

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
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <div className="nav-logo" onClick={() => scrollTo("hero")}>
          Proposal<span className="nav-accent">in</span>
        </div>
        <div className="nav-links">

          <div className="nav-item" onMouseEnter={() => setOpenMenu('features')} onMouseLeave={() => setOpenMenu(null)}>
            <span className="nav-link-arrow">Features ▾</span>
            {openMenu === 'features' && (
              <div className="nav-dropdown">
                <div className="dropdown-col">
                  <div className="dropdown-heading">CORE FEATURES</div>
                  <div className="dropdown-item">🎯 Find Projects</div>
                  <div className="dropdown-item">🤖 AI Proposals</div>
                  <div className="dropdown-item">✏️ Custom Prompts</div>
                  <div className="dropdown-item">📄 Auto Contracts</div>
                </div>
                <div className="dropdown-col">
                  <div className="dropdown-heading">COLLABORATION</div>
                  <div className="dropdown-item">💬 Chat & Negotiate</div>
                  <div className="dropdown-item">🔄 Real-time Revisions</div>
                </div>
              </div>
            )}
          </div>

          <div className="nav-item" onMouseEnter={() => setOpenMenu('projects')} onMouseLeave={() => setOpenMenu(null)}>
            <span className="nav-link-arrow">Projects ▾</span>
            {openMenu === 'projects' && (
              <div className="nav-dropdown wide">
                <div className="dropdown-col">
                  <div className="dropdown-heading">CATEGORIES</div>
                  <div className="dropdown-item">💻 Web Development</div>
                  <div className="dropdown-item">🎨 UI/UX Design</div>
                  <div className="dropdown-item">📱 Mobile App</div>
                  <div className="dropdown-item">📢 Digital Marketing</div>
                </div>
                <div className="dropdown-col">
                  <div className="dropdown-heading">LATEST PROJECTS</div>
                  <div className="dropdown-card">
                    <div className="dropdown-card-img">💻</div>
                    <div>
                      <div className="dropdown-card-title">E-Commerce Landing Page</div>
                      <div className="dropdown-card-sub">Budget: Rp 3,000,000</div>
                    </div>
                  </div>
                  <div className="dropdown-card">
                    <div className="dropdown-card-img">🎨</div>
                    <div>
                      <div className="dropdown-card-title">Dashboard App Redesign</div>
                      <div className="dropdown-card-sub">Budget: Rp 5,000,000</div>
                    </div>
                  </div>
                  <div className="dropdown-card">
                    <div className="dropdown-card-img">📱</div>
                    <div>
                      <div className="dropdown-card-title">Laundry Mobile App</div>
                      <div className="dropdown-card-sub">Budget: Rp 8,000,000</div>
                    </div>
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

        {/* RIGHT */}
        <div className={`hero-right ${visible ? "visible" : ""}`}>
          <div className="mock-card main-card">
            <div className="mock-header">
              <div className="mock-dot red" />
              <div className="mock-dot yellow" />
              <div className="mock-dot green" />
              <span className="mock-title">Proposal — Web Development Project</span>
            </div>
            <div className="mock-body">
              <div className="mock-line long" />
              <div className="mock-line medium" />
              <div className="mock-line short" />
              <div className="mock-spacer" />
              <div className="mock-line medium" />
              <div className="mock-line long" />
              <div className="mock-line short" />
              <div className="mock-spacer" />
              <div className="mock-ai-badge">✦ AI Generated</div>
              <div className="mock-line medium ai" />
              <div className="mock-line long ai" />
            </div>
            <div className="mock-footer">
              <button className="mock-btn">Send to Client →</button>
            </div>
          </div>
          <div className="mock-card side-card">
            <div className="side-card-icon">💬</div>
            <div className="side-card-text">
              <div className="mock-line short" />
              <div className="mock-line medium" />
            </div>
          </div>
          <div className="mock-card side-card2">
            <div className="side-card-icon">✅</div>
            <div className="side-card-text">
              <span className="deal-text">Deal Closed!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const features = [
  { icon: "🎯", title: "Find the Right Project", desc: "Browse hundreds of projects posted by clients. Filter by category, budget, and deadline. Apply instantly with one click." },
  { icon: "🤖", title: "Automatic AI Proposals", desc: "After selecting a project, our AI instantly prepares a tailored proposal matching the client's needs. Just review and send." },
  { icon: "✏️", title: "Customize with Prompts", desc: "Not happy with the draft? Use prompts to revise tone, technical details, or pricing. The AI understands your project context." },
  { icon: "💬", title: "Negotiate Directly in Chat", desc: "After the proposal is sent, a chat room opens automatically. Discuss, revise, and negotiate without leaving the platform." },
  { icon: "🔄", title: "Real-time Proposal Revisions", desc: "Client requested changes? Re-prompt your AI for instant revisions. Send the updated version directly from chat — effortless." },
  { icon: "📄", title: "Auto Contract on Deal Close", desc: "Once agreed, the system automatically generates a professional, legally-sound work contract. Digital signature, done." },
];

const Features = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

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
          <p className="section-sub">From browsing projects to closing deals — everything is in Proposalin.</p>
        </div>
        <div className={`features-grid ${visible ? "visible" : ""}`}>
          {features.map((f, i) => (
            <div
              className={`feature-card ${hoveredIndex === i ? "feature-card-active" : ""}`}
              key={i}
              style={{ animationDelay: `${i * 0.1}s` }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
    
              <div className="feature-card-glow" />
              <div className="feature-icon-wrap">
                <span className="feature-icon">{f.icon}</span>
            
                <div className="feature-icon-ring" />
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            
              <div className="feature-accent-bar" />
            </div>
          ))}
        </div>
   
        <div className="features-particles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

const steps = [
  { num: "01", title: "Sign Up & Create Profile", desc: "Create a freelancer or client account in 2 minutes. Complete your profile and add your skills." },
  { num: "02", title: "Browse & Choose Projects", desc: "Clients post projects, freelancers browse and select projects matching their expertise." },
  { num: "03", title: "AI Generates Proposal", desc: "Click a project → AI instantly generates a professional proposal tailored to the client's brief." },
  { num: "04", title: "Send & Negotiate", desc: "Send the proposal to the client, chat opens automatically. Discuss and negotiate until deal." },
  { num: "05", title: "Deal & Contract", desc: "Agreed? A work contract is auto-generated. Digital signature and start working!" },
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
              <button className={`btn-plan ${p.highlight ? "btn-plan-primary" : "btn-plan-outline"}`} onClick={() => navigate("/signup")}>{p.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const testimonials = [
  { name: "Rizky Pratama", role: "UI/UX Freelancer", text: "Writing a proposal used to take 3 hours. Now it's done in 10 minutes and I close the deal. Proposalin is a real game changer for freelancers.", avatar: "RP" },
  { name: "Sari Dewi", role: "Web Developer", text: "The AI really understands the project context. The proposal draft is professional — just a few edits and send. Clients are always impressed!", avatar: "SD" },
  { name: "Budi Santoso", role: "Digital Marketer", text: "Having chat + proposal revision in one place is incredible. Negotiations are faster and clients have much more trust in the process.", avatar: "BS" },
  { name: "Andini Putri", role: "Content Creator", text: "As a client, I love it. Incoming proposals are far more relevant and well-structured. It's so much easier to find the right freelancer.", avatar: "AP" },
];

const Testimonials = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="testimonials" id="testimonials" ref={ref}>
      <div className="section-inner">
        <div className={`section-header ${visible ? "visible" : ""}`}>
          <div className="section-badge">Testimonials</div>
          <h2 className="section-title">What Our Users<br />Are Saying</h2>
        </div>
        <div className={`testi-grid ${visible ? "visible" : ""}`}>
          {testimonials.map((t, i) => (
            <div
              className={`testi-card testi-card-animated ${activeIndex === i ? "testi-card-lifted" : ""}`}
              key={i}
              style={{ animationDelay: `${i * 0.1}s` }}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
        
              <div className="testi-quote-mark">"</div>
              <div className="testi-stars">★★★★★</div>
              <p className="testi-text">"{t.text}"</p>
              <div className="testi-author">
                <div className="testi-avatar testi-avatar-animated">{t.avatar}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
              <div className="testi-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">Proposal<span className="nav-accent">in</span></div>
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
        <span>© 2025 Proposalin. All rights reserved.</span>
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
