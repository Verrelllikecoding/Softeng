import { useNavigate, useParams } from "react-router-dom";
import "./ProjectDetail.css";

const PROJECTS = {
  1: {
    id: 1,
    title: "E-Commerce Fashion Landing Page",
    category: "Technology",
    sub: "Web Development",
    budget: "$200",
    deadline: "Apr 15, 2025",
    client: "Andi Wijaya",
    clientAvatar: "AW",
    clientJob: "Owner — Local Fashion Brand",
    clientRating: 4.8,
    clientProjects: 12,
    posted: "2 days ago",
    status: "Open",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=320&fit=crop",
    desc: "We are seeking an experienced freelancer to build a modern, responsive landing page for our local fashion brand. The page must reflect an elegant, professional brand identity and be fully optimized for conversion.",
    sections: [
      {
        title: "Project Description",
        content: "This landing page aims to increase online sales conversion. The design must be clean, mobile-first, and capable of showcasing the product collection effectively. Integration with a payment gateway (Stripe or PayPal) is required for a seamless checkout experience.",
      },
      {
        title: "Technical Requirements",
        content: "Technology stack is open (React, Next.js, or plain HTML/CSS). Must be fully responsive across all screen sizes. Page speed score of at least 85 on Google PageSpeed Insights. SEO-friendly with proper meta tags and structured data.",
      },
      {
        title: "Deliverables",
        content: "Complete source code, brief deployment documentation, mobile & desktop design files (if freelancer handles design), and a maximum of 3 revision rounds after the initial submission.",
      },
    ],
    skills: ["React.js", "Tailwind CSS", "UI/UX", "Payment Gateway", "SEO"],
    attachments: ["brand_brief.pdf", "design_references.zip"],
    proposals: 7,
  },
  2: {
    id: 2,
    title: "ML Product Recommendation System",
    category: "Technology",
    sub: "Machine Learning",
    budget: "$800",
    deadline: "Apr 30, 2025",
    client: "Startup Teknologi",
    clientAvatar: "ST",
    clientJob: "CTO — Marketplace Startup",
    clientRating: 4.5,
    clientProjects: 5,
    posted: "1 day ago",
    status: "Open",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&h=320&fit=crop",
    desc: "Our startup requires an intelligent product recommendation system to increase user engagement and sales on our marketplace platform, which hosts over 50,000 active products.",
    sections: [
      {
        title: "Project Description",
        content: "Recommendation system based on collaborative filtering and content-based filtering. User and product data is available in CSV/JSON format. The system must deliver real-time recommendations with a maximum latency of 200ms.",
      },
      {
        title: "Technical Requirements",
        content: "Python (scikit-learn, TensorFlow, or PyTorch). REST API endpoint for serving recommendations. Model must support periodic retraining with new data. Full technical documentation is mandatory.",
      },
      {
        title: "Deliverables",
        content: "Trained ML model, production-ready REST API, Jupyter notebook documenting training and evaluation, model performance report (precision, recall, NDCG), and comprehensive technical documentation.",
      },
    ],
    skills: ["Python", "Machine Learning", "TensorFlow", "REST API", "Data Science"],
    attachments: ["dataset_sample.csv", "api_spec.pdf"],
    proposals: 3,
  },
  3: {
    id: 3,
    title: "Admin Dashboard UI Redesign",
    category: "Design & Creative",
    sub: "UI/UX Design",
    budget: "$330",
    deadline: "Apr 20, 2025",
    client: "Budi Santoso",
    clientAvatar: "BS",
    clientJob: "Product Manager — Logistics",
    clientRating: 4.9,
    clientProjects: 20,
    posted: "3 days ago",
    status: "Open",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=320&fit=crop",
    desc: "Our logistics application's admin dashboard has become outdated and difficult to use. We want a complete redesign using a user-centered design approach to improve operational team productivity.",
    sections: [
      {
        title: "Project Description",
        content: "The dashboard covers: real-time shipment monitoring, driver management, financial reporting, and customer management. The current UI was built in 2019 and many features have since been added without proper design planning.",
      },
      {
        title: "Design Requirements",
        content: "Design to be completed in Figma. Brand colors are established (dark blue and orange). Clear information hierarchy is essential. Consistent, reusable design system components required. Interactive prototype for user testing.",
      },
      {
        title: "Deliverables",
        content: "Complete Figma file (wireframe + high fidelity), design system/component library, interactive prototype, developer handoff guide, and a brief UX rationale report.",
      },
    ],
    skills: ["Figma", "UI Design", "UX Research", "Design System", "Prototyping"],
    attachments: ["current_dashboard.pdf", "brand_guideline.pdf"],
    proposals: 11,
  },
  4: {
    id: 4,
    title: "Fintech Startup Brand Identity",
    category: "Design & Creative",
    sub: "Branding",
    budget: "$500",
    deadline: "May 10, 2025",
    client: "Rini Kusuma",
    clientAvatar: "RK",
    clientJob: "Founder — Fintech Startup",
    clientRating: 4.7,
    clientProjects: 3,
    posted: "4 days ago",
    status: "Open",
    image: "https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?w=900&h=320&fit=crop",
    desc: "We are launching a new fintech startup and need a complete visual identity system that conveys trust, innovation, and professionalism to both investors and end users.",
    sections: [
      {
        title: "Project Description",
        content: "The brand identity must position the company as a modern, trustworthy fintech platform. The design should appeal to millennials and Gen Z while maintaining a professional tone suitable for investor presentations.",
      },
      {
        title: "Design Requirements",
        content: "Logo in multiple formats (SVG, PNG, dark/light variants). Full brand guideline document including typography, color palette, spacing, and usage rules. Marketing asset templates for pitch decks and social media.",
      },
      {
        title: "Deliverables",
        content: "Master logo files, brand guideline PDF, social media kit, pitch deck template, and business card design. All files delivered in editable source format.",
      },
    ],
    skills: ["Logo Design", "Brand Strategy", "Adobe Illustrator", "Figma", "Typography"],
    attachments: ["competitor_analysis.pdf", "mood_board.pdf"],
    proposals: 6,
  },
  5: {
    id: 5,
    title: "Mobile RPG Character Illustration",
    category: "Design & Creative",
    sub: "Illustration",
    budget: "$265",
    deadline: "Apr 25, 2025",
    client: "GameStudio ID",
    clientAvatar: "GS",
    clientJob: "Art Director — Game Studio",
    clientRating: 4.6,
    clientProjects: 8,
    posted: "1 day ago",
    status: "Open",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=900&h=320&fit=crop",
    desc: "We need 10 original character illustrations — 5 heroes and 5 villains — for an anime-style mobile RPG. Characters must be expressive, distinctive, and production-ready for in-game use.",
    sections: [
      {
        title: "Project Description",
        content: "Each character requires a full-body illustration in our established anime art style. Characters must convey clear personality archetypes. Art will be used in-game for character selection screens, battle scenes, and promotional materials.",
      },
      {
        title: "Technical Requirements",
        content: "Delivered as layered PSD or AI files at 300 DPI. Transparent background. Each character on a separate artboard. Must match the existing art style reference sheet provided in attachments.",
      },
      {
        title: "Deliverables",
        content: "10 final character illustrations (layered PSD + flattened PNG), concept sketches for approval before final render, and a brief style guide for consistency in future expansions.",
      },
    ],
    skills: ["Digital Illustration", "Character Design", "Adobe Photoshop", "Anime Style", "Game Art"],
    attachments: ["art_style_guide.pdf", "character_brief.pdf"],
    proposals: 9,
  },
  6: {
    id: 6,
    title: "Google & Meta Ads Campaign Management",
    category: "Marketing",
    sub: "Digital Ads",
    budget: "$400",
    deadline: "May 1, 2025",
    client: "Toko Online Maju",
    clientAvatar: "TM",
    clientJob: "Marketing Manager — E-Commerce",
    clientRating: 4.4,
    clientProjects: 15,
    posted: "5 days ago",
    status: "Open",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=900&h=320&fit=crop",
    desc: "We are looking for a performance marketing specialist to manage our paid advertising campaigns across Google and Meta to maximize return on ad spend for our skincare product line.",
    sections: [
      {
        title: "Project Description",
        content: "Current monthly ad spend is $2,000. Target ROAS is 4x. Campaigns include Google Search, Google Shopping, Meta Feed, and Stories ads. Freelancer will have full access to ad accounts and analytics dashboards.",
      },
      {
        title: "Requirements",
        content: "Proven experience with Google Ads and Meta Ads Manager. Ability to create ad copy and coordinate with our in-house designer for creatives. Weekly performance reports with actionable insights.",
      },
      {
        title: "Deliverables",
        content: "Campaign setup and optimization, weekly performance reports, monthly strategy review, A/B test results documentation, and a final campaign performance summary at project close.",
      },
    ],
    skills: ["Google Ads", "Meta Ads", "Performance Marketing", "Analytics", "Copywriting"],
    attachments: ["current_campaign_data.pdf", "product_catalog.pdf"],
    proposals: 5,
  },
  7: {
    id: 7,
    title: "Tech Blog SEO Content Strategy",
    category: "Marketing",
    sub: "SEO & Content",
    budget: "$165",
    deadline: "May 5, 2025",
    client: "Media Digital",
    clientAvatar: "MD",
    clientJob: "Editor-in-Chief — Tech Publication",
    clientRating: 4.3,
    clientProjects: 22,
    posted: "2 days ago",
    status: "Open",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&h=320&fit=crop",
    desc: "We need a skilled SEO content writer to produce 20 high-quality, SEO-optimized articles for our technology blog, targeting specific high-value keywords to drive organic traffic growth.",
    sections: [
      {
        title: "Project Description",
        content: "Articles cover topics in AI, cybersecurity, software development, and consumer electronics. Each article must be thoroughly researched, factually accurate, and written for a tech-savvy audience. Target length: 1,500–2,500 words per article.",
      },
      {
        title: "Requirements",
        content: "Strong command of English. Keyword research and on-page SEO optimization for each article. Internal linking strategy. Meta title and description for each post. Delivery via Google Docs with comments for edits.",
      },
      {
        title: "Deliverables",
        content: "20 fully written and SEO-optimized articles, keyword mapping spreadsheet, meta descriptions for all articles, and a content calendar recommendation for future posts.",
      },
    ],
    skills: ["SEO Writing", "Content Strategy", "Keyword Research", "Tech Writing", "WordPress"],
    attachments: ["keyword_list.xlsx", "editorial_guidelines.pdf"],
    proposals: 14,
  },
  8: {
    id: 8,
    title: "FMCG Brand Social Media Strategy",
    category: "Marketing",
    sub: "Social Media",
    budget: "$530",
    deadline: "May 15, 2025",
    client: "PT Maju Bersama",
    clientAvatar: "MB",
    clientJob: "Brand Manager — FMCG",
    clientRating: 4.8,
    clientProjects: 7,
    posted: "3 days ago",
    status: "Open",
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=900&h=320&fit=crop",
    desc: "We require a social media strategist to develop and execute a multi-platform content strategy across Instagram, TikTok, and X (Twitter), with the goal of increasing brand awareness and community engagement.",
    sections: [
      {
        title: "Project Description",
        content: "The brand sells household and personal care products targeting urban families. We currently have 50K followers on Instagram with moderate engagement. Goal is to grow to 100K followers and increase average engagement rate from 2% to 5% within 3 months.",
      },
      {
        title: "Requirements",
        content: "Platform-specific content strategy for Instagram, TikTok, and X. Content calendar covering 3 months. Coordination with our in-house graphic designer. Community management and response guidelines. Monthly analytics reporting.",
      },
      {
        title: "Deliverables",
        content: "3-month content strategy document, monthly content calendars, engagement playbook, analytics report template, and competitor benchmarking analysis.",
      },
    ],
    skills: ["Social Media Strategy", "Content Planning", "Community Management", "Analytics", "Copywriting"],
    attachments: ["brand_guidelines.pdf", "current_analytics.pdf"],
    proposals: 4,
  },
  9: {
    id: 9,
    title: "F&B Startup Business Plan",
    category: "Business & Consulting",
    sub: "Business Plan",
    budget: "$300",
    deadline: "May 12, 2025",
    client: "Dian Pratiwi",
    clientAvatar: "DP",
    clientJob: "Founder — F&B Startup",
    clientRating: 4.5,
    clientProjects: 2,
    posted: "6 days ago",
    status: "Open",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&h=320&fit=crop",
    desc: "We are preparing to pitch to seed investors and require a comprehensive, professionally structured business plan for our F&B startup focused on healthy, locally-sourced meal kits.",
    sections: [
      {
        title: "Project Description",
        content: "The startup targets health-conscious urban consumers aged 25–40. We have a validated concept with 200+ beta users and initial revenue data. The business plan must present a compelling growth narrative and realistic financial projections.",
      },
      {
        title: "Requirements",
        content: "Executive summary, market analysis, competitive landscape, go-to-market strategy, operational plan, financial model (3-year projection), and funding requirements. Must follow standard investor-grade business plan format.",
      },
      {
        title: "Deliverables",
        content: "Complete business plan document (30–50 pages), financial model in Excel, executive summary (2-page standalone), and a 10-slide pitch deck aligned with the business plan narrative.",
      },
    ],
    skills: ["Business Planning", "Financial Modeling", "Market Research", "Pitch Deck", "Excel"],
    attachments: ["beta_user_data.pdf", "initial_financials.xlsx"],
    proposals: 8,
  },
  10: {
    id: 10,
    title: "Portfolio Financial Analysis & Investor Report",
    category: "Business & Consulting",
    sub: "Financial Analysis",
    budget: "$600",
    deadline: "May 20, 2025",
    client: "Venture Capital ID",
    clientAvatar: "VC",
    clientJob: "Investment Analyst — VC Firm",
    clientRating: 4.9,
    clientProjects: 18,
    posted: "1 day ago",
    status: "Open",
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=900&h=320&fit=crop",
    desc: "We require a financial analyst to conduct an in-depth analysis of three portfolio companies and produce a consolidated investor report for our quarterly LP update.",
    sections: [
      {
        title: "Project Description",
        content: "The three portfolio companies operate in SaaS, logistics, and consumer goods sectors. Financial data will be provided under NDA. Analysis must include performance benchmarking against industry peers and forward-looking commentary.",
      },
      {
        title: "Requirements",
        content: "CFA or equivalent qualification preferred. Proficiency in Excel financial modeling. Experience with VC/PE reporting standards. Ability to synthesize complex data into clear, executive-level narratives.",
      },
      {
        title: "Deliverables",
        content: "Individual company analysis reports (3), consolidated portfolio summary, variance analysis against previous quarter, industry benchmark comparison, and LP-ready investor deck (15–20 slides).",
      },
    ],
    skills: ["Financial Analysis", "Excel", "Valuation", "Investor Relations", "PowerPoint"],
    attachments: ["portfolio_data_nda.pdf", "report_template.xlsx"],
    proposals: 2,
  },
  11: {
    id: 11,
    title: "Laundry Management Mobile Application",
    category: "Technology",
    sub: "Mobile Development",
    budget: "$1,000",
    deadline: "Jun 1, 2025",
    client: "Laundry Express",
    clientAvatar: "LE",
    clientJob: "CEO — Laundry Express",
    clientRating: 4.6,
    clientProjects: 4,
    posted: "7 days ago",
    status: "Open",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&h=320&fit=crop",
    desc: "We are building a mobile application for Android and iOS to digitize our laundry operations, enabling customers to schedule pickups, track orders in real time, and make payments digitally.",
    sections: [
      {
        title: "Project Description",
        content: "The app serves two user types: customers (order placement, tracking, payment) and drivers (pickup/delivery management). Backend must handle real-time order status updates and push notifications. Currently managing 200+ orders per day manually.",
      },
      {
        title: "Technical Requirements",
        content: "Cross-platform development preferred (React Native or Flutter). Backend with RESTful API (Node.js or Django). Payment integration (Stripe). Firebase or equivalent for push notifications and real-time updates. Admin web panel for order management.",
      },
      {
        title: "Deliverables",
        content: "Published apps on Google Play and App Store, full backend API, admin web panel, API documentation, deployment guide, and 30 days of post-launch support.",
      },
    ],
    skills: ["React Native", "Flutter", "Node.js", "Firebase", "REST API"],
    attachments: ["app_wireframes.pdf", "technical_spec.pdf"],
    proposals: 5,
  },
  12: {
    id: 12,
    title: "Premium Batik Product Photography",
    category: "Design & Creative",
    sub: "Photography",
    budget: "$230",
    deadline: "May 8, 2025",
    client: "Batik Nusantara",
    clientAvatar: "BN",
    clientJob: "Creative Director — Batik Nusantara",
    clientRating: 4.7,
    clientProjects: 9,
    posted: "3 days ago",
    status: "Open",
    image: "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=900&h=320&fit=crop",
    desc: "We require a professional photographer to conduct a product photoshoot for 50 premium batik items intended for our e-commerce catalogue and editorial lookbook.",
    sections: [
      {
        title: "Project Description",
        content: "Products include batik shirts, dresses, and accessories across 5 collections. Shoot must capture fabric texture, color accuracy, and the premium positioning of the brand. Both flat-lay and on-mannequin shots are required for each product.",
      },
      {
        title: "Requirements",
        content: "Studio available at our location in Jakarta. Photographer must provide own equipment. Lighting setup for accurate color reproduction on fabric. Post-production retouching included. Delivery within 7 business days of shoot date.",
      },
      {
        title: "Deliverables",
        content: "100 final retouched images (2 per product) in JPEG and TIFF at 300 DPI, web-optimized JPEGs for e-commerce upload, and 10 editorial-quality shots for lookbook use.",
      },
    ],
    skills: ["Product Photography", "Studio Lighting", "Adobe Lightroom", "Retouching", "E-Commerce"],
    attachments: ["product_list.pdf", "brand_mood_board.pdf"],
    proposals: 6,
  },
};

const categoryColors = {
  "Technology": { bg: "#e0f2fe", color: "#0369a1" },
  "Design & Creative": { bg: "#fdf4ff", color: "#7e22ce" },
  "Marketing": { bg: "#f0fdf4", color: "#15803d" },
  "Business & Consulting": { bg: "#fff7ed", color: "#c2410c" },
};

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="pnav">
      <div className="pnav-inner">
        <div className="pnav-logo" onClick={() => navigate("/")}>
          Proposal<span className="pnav-accent">in</span>
        </div>
        <div className="pnav-links">
          <span onClick={() => navigate("/")}>Features</span>
          <span onClick={() => navigate("/")}>How It Works</span>
          <span className="active" onClick={() => navigate("/projects")}>Projects</span>
          <span onClick={() => navigate("/")}>Pricing</span>
        </div>
        <div className="pnav-actions">
          <button className="btn-pnav-login" onClick={() => navigate("/login")}>Log In</button>
          <button className="btn-pnav-signup" onClick={() => navigate("/signup")}>Sign Up Free</button>
        </div>
      </div>
    </nav>
  );
};

export default function ProjectDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const project = PROJECTS[parseInt(id)] || PROJECTS[1];
  const catColor = categoryColors[project.category];

  return (
    <div className="detail-page">
      <Navbar />

      <div className="detail-body">

        <div className="breadcrumb">
          <span onClick={() => navigate("/")}>Home</span>
          <span className="bc-sep">›</span>
          <span onClick={() => navigate("/projects")}>Projects</span>
          <span className="bc-sep">›</span>
          <span className="bc-active">{project.title}</span>
        </div>

        <div className="detail-layout">

          {/* ── MAIN COLUMN ── */}
          <div className="detail-main">

            <div className="detail-header-card">
              <div className="detail-thumb">
                <img src={project.image} alt={project.title} className="detail-thumb-img" />
                <div className="detail-thumb-overlay" />
              </div>
              <div className="detail-header-info">
                <div className="detail-badges">
                  <span className="detail-cat-badge" style={{ background: catColor.bg, color: catColor.color }}>
                    {project.sub}
                  </span>
                  <span className="detail-status-badge">● {project.status}</span>
                  <span className="detail-posted">Posted {project.posted}</span>
                </div>
                <h1 className="detail-title">{project.title}</h1>
                <p className="detail-desc">{project.desc}</p>
                <div className="detail-meta-row">
                  <div className="detail-meta-item">
                    <svg width="14" height="14" fill="none" stroke="#1a56db" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    <span className="dm-label">Budget</span>
                    <span className="dm-val blue">{project.budget}</span>
                  </div>
                  <div className="detail-meta-divider" />
                  <div className="detail-meta-item">
                    <svg width="14" height="14" fill="none" stroke="#059669" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    <span className="dm-label">Deadline</span>
                    <span className="dm-val">{project.deadline}</span>
                  </div>
                  <div className="detail-meta-divider" />
                  <div className="detail-meta-item">
                    <svg width="14" height="14" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span className="dm-label">Proposals</span>
                    <span className="dm-val">{project.proposals} submitted</span>
                  </div>
                </div>
              </div>
            </div>

            {project.sections.map((s, i) => (
              <div className="detail-section" key={i}>
                <h2 className="detail-section-title">{s.title}</h2>
                <p className="detail-section-content">{s.content}</p>
              </div>
            ))}

            <div className="detail-section">
              <h2 className="detail-section-title">Required Skills</h2>
              <div className="skills-list">
                {project.skills.map((sk, i) => (
                  <span className="skill-tag" key={i}>{sk}</span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h2 className="detail-section-title">Attachments</h2>
              <div className="attachments">
                {project.attachments.map((a, i) => (
                  <div className="attachment-item" key={i}>
                    <svg width="16" height="16" fill="none" stroke="#1a56db" strokeWidth="2" viewBox="0 0 24 24"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                    <span className="att-name">{a}</span>
                    <span className="att-dl">↓ Download</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-cta-bar">
              <button className="btn-back" onClick={() => navigate("/projects")}>
                ← Back to Projects
              </button>
              <button className="btn-make-proposal" onClick={() => navigate(`/projects/${project.id}/propose`)}>
                Submit a Proposal →
              </button>
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <aside className="detail-sidebar">

            <div className="ds-card">
              <div className="ds-card-title">About the Client</div>
              <div className="ds-client">
                <div className="ds-avatar">{project.clientAvatar}</div>
                <div>
                  <div className="ds-client-name">{project.client}</div>
                  <div className="ds-client-job">{project.clientJob}</div>
                </div>
              </div>
              <div className="ds-client-stats">
                <div className="ds-stat">
                  <span className="ds-stat-num">⭐ {project.clientRating}</span>
                  <span className="ds-stat-label">Rating</span>
                </div>
                <div className="ds-stat-div" />
                <div className="ds-stat">
                  <span className="ds-stat-num">{project.clientProjects}</span>
                  <span className="ds-stat-label">Total Projects</span>
                </div>
              </div>
            </div>

            <div className="ds-card">
              <div className="ds-card-title">Project Summary</div>
              <div className="ds-summary">
                <div className="ds-row">
                  <span className="ds-row-label">Category</span>
                  <span className="ds-row-val">{project.category}</span>
                </div>
                <div className="ds-row">
                  <span className="ds-row-label">Specialization</span>
                  <span className="ds-row-val">{project.sub}</span>
                </div>
                <div className="ds-row">
                  <span className="ds-row-label">Budget</span>
                  <span className="ds-row-val blue">{project.budget}</span>
                </div>
                <div className="ds-row">
                  <span className="ds-row-label">Deadline</span>
                  <span className="ds-row-val">{project.deadline}</span>
                </div>
                <div className="ds-row">
                  <span className="ds-row-label">Status</span>
                  <span className="ds-row-val green">● {project.status}</span>
                </div>
                <div className="ds-row">
                  <span className="ds-row-label">Proposals</span>
                  <span className="ds-row-val">{project.proposals} submitted</span>
                </div>
              </div>
            </div>

            <div className="ds-card cta-card">
              <div className="ds-card-title">Interested in this project?</div>
              <p className="cta-desc">Sign in or create an account to submit a proposal with the help of our AI assistant.</p>
              <button className="btn-make-proposal full" onClick={() => navigate(`/projects/${project.id}/propose`)}>
                Submit a Proposal →
              </button>
              <button className="btn-login-cta" onClick={() => navigate("/login")}>
                Already have an account? Log In
              </button>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
