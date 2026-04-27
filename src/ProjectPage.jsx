import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectPage.css";

const PROJECTS = [
  {
    id: 1,
    title: "E-Commerce Fashion Landing Page",
    category: "Technology",
    sub: "Web Development",
    budget: "$200",
    deadline: "Apr 15, 2025",
    client: "Andi Wijaya",
    clientAvatar: "AW",
    desc: "Development of a modern, conversion-optimized landing page for a local fashion brand, including payment gateway integration and mobile-responsive design.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop"
  },
  {
    id: 2,
    title: "ML Product Recommendation System",
    category: "Technology",
    sub: "Machine Learning",
    budget: "$800",
    deadline: "Apr 30, 2025",
    client: "Startup Teknologi",
    clientAvatar: "ST",
    desc: "Building a collaborative filtering-based recommendation engine for a marketplace platform to enhance product discovery and user engagement.",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop"
  },
  {
    id: 3,
    title: "Admin Dashboard UI Redesign",
    category: "Design & Creative",
    sub: "UI/UX Design",
    budget: "$330",
    deadline: "Apr 20, 2025",
    client: "Budi Santoso",
    clientAvatar: "BS",
    desc: "Comprehensive redesign of a logistics application's admin dashboard to improve usability, data visibility, and overall user experience.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop"
  },
  {
    id: 4,
    title: "Fintech Startup Brand Identity",
    category: "Design & Creative",
    sub: "Branding",
    budget: "$500",
    deadline: "May 10, 2025",
    client: "Rini Kusuma",
    clientAvatar: "RK",
    desc: "Creation of a complete visual identity system including logo design, brand guidelines, and marketing assets for an emerging fintech startup.",
    image: "https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?w=400&h=200&fit=crop"
  },
  {
    id: 5,
    title: "Mobile RPG Character Illustration",
    category: "Design & Creative",
    sub: "Illustration",
    budget: "$265",
    deadline: "Apr 25, 2025",
    client: "GameStudio ID",
    clientAvatar: "GS",
    desc: "Design and illustration of 10 hero and villain characters in anime style for a mobile RPG game, including concept art and final production assets.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop"
  },
  {
    id: 6,
    title: "Google & Meta Ads Campaign Management",
    category: "Marketing",
    sub: "Digital Ads",
    budget: "$400",
    deadline: "May 1, 2025",
    client: "Toko Online Maju",
    clientAvatar: "TM",
    desc: "End-to-end management of paid advertising campaigns across Google and Meta platforms to maximize ROAS for a local skincare product line.",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&h=200&fit=crop"
  },
  {
    id: 7,
    title: "Tech Blog SEO Content Strategy",
    category: "Marketing",
    sub: "SEO & Content",
    budget: "$165",
    deadline: "May 5, 2025",
    client: "Media Digital",
    clientAvatar: "MD",
    desc: "Production of 20 SEO-optimized articles for a technology blog, targeting high-value keywords to drive organic traffic and domain authority.",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=200&fit=crop"
  },
  {
    id: 8,
    title: "FMCG Brand Social Media Strategy",
    category: "Marketing",
    sub: "Social Media",
    budget: "$530",
    deadline: "May 15, 2025",
    client: "PT Maju Bersama",
    clientAvatar: "MB",
    desc: "Development and execution of a multi-platform social media strategy for Instagram, TikTok, and Twitter to elevate brand presence and audience engagement.",
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=400&h=200&fit=crop"
  },
  {
    id: 9,
    title: "F&B Startup Business Plan",
    category: "Business & Consulting",
    sub: "Business Plan",
    budget: "$300",
    deadline: "May 12, 2025",
    client: "Dian Pratiwi",
    clientAvatar: "DP",
    desc: "Preparation of a comprehensive business plan for an F&B startup seeking seed investment, including market analysis, financial projections, and pitch deck.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop"
  },
  {
    id: 10,
    title: "Portfolio Financial Analysis & Investor Report",
    category: "Business & Consulting",
    sub: "Financial Analysis",
    budget: "$600",
    deadline: "May 20, 2025",
    client: "Venture Capital ID",
    clientAvatar: "VC",
    desc: "In-depth financial analysis of three portfolio companies with consolidated investor reporting and strategic performance benchmarking.",
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=200&fit=crop"
  },
  {
    id: 11,
    title: "Laundry Management Mobile Application",
    category: "Technology",
    sub: "Mobile Development",
    budget: "$1,000",
    deadline: "Jun 1, 2025",
    client: "Laundry Express",
    clientAvatar: "LE",
    desc: "Full-stack Android and iOS mobile application for managing laundry orders, real-time pickup scheduling, and last-mile delivery tracking.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop"
  },
  {
    id: 12,
    title: "Premium Batik Product Photography",
    category: "Design & Creative",
    sub: "Photography",
    budget: "$230",
    deadline: "May 8, 2025",
    client: "Batik Nusantara",
    clientAvatar: "BN",
    desc: "Professional photoshoot of 50 premium batik items for e-commerce catalogues and editorial lookbooks, including styling, lighting, and post-production.",
    image: "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=400&h=200&fit=crop"
  },
];

const CATEGORIES = {
  "Technology": ["Web Development", "Mobile Development", "Machine Learning", "Data Analysis"],
  "Design & Creative": ["UI/UX Design", "Branding", "Illustration", "Photography"],
  "Marketing": ["Digital Ads", "SEO & Content", "Social Media", "Email Marketing"],
  "Business & Consulting": ["Business Plan", "Financial Analysis", "Market Research", "HR Consulting"],
};

const SORT_OPTIONS = ["Relevance", "Highest Budget", "Lowest Budget", "Nearest Deadline"];

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
          <span className="active">Projects</span>
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

export default function ProjectPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [sort, setSort] = useState("Relevance");
  const [expandedCats, setExpandedCats] = useState(["Technology", "Design & Creative", "Marketing", "Business & Consulting"]);

  const toggleSub = (sub) => {
    setSelectedSubs(prev =>
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const toggleCat = (cat) => {
    setExpandedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const budgetToNum = (b) => parseInt(b.replace(/[^0-9]/g, ""));

  const filtered = PROJECTS.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sub.toLowerCase().includes(search.toLowerCase());
    const matchSub = selectedSubs.length === 0 || selectedSubs.includes(p.sub);
    return matchSearch && matchSub;
  }).sort((a, b) => {
    if (sort === "Highest Budget") return budgetToNum(b.budget) - budgetToNum(a.budget);
    if (sort === "Lowest Budget") return budgetToNum(a.budget) - budgetToNum(b.budget);
    return 0;
  });

  return (
    <div className="project-page">
      <Navbar />

      <div className="project-body">

        <aside className="sidebar">
          <div className="sidebar-title">Filter by Category</div>

          {Object.entries(CATEGORIES).map(([cat, subs]) => (
            <div className="sidebar-cat" key={cat}>
              <div className="sidebar-cat-header" onClick={() => toggleCat(cat)}>
                <span>{cat}</span>
                <span className={`sidebar-chevron ${expandedCats.includes(cat) ? "open" : ""}`}>›</span>
              </div>
              {expandedCats.includes(cat) && (
                <div className="sidebar-subs">
                  {subs.map(sub => (
                    <label className="sidebar-check" key={sub}>
                      <input
                        type="checkbox"
                        checked={selectedSubs.includes(sub)}
                        onChange={() => toggleSub(sub)}
                      />
                      <span>{sub}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          {selectedSubs.length > 0 && (
            <button className="btn-clear-filter" onClick={() => setSelectedSubs([])}>
              Clear Filters ({selectedSubs.length})
            </button>
          )}
        </aside>

        <main className="project-main">

          <div className="project-toolbar">
            <div className="search-box">
              <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                placeholder="Search projects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="project-count">
              <span className="count-num">{filtered.length}</span> projects found
            </div>

            <div className="sort-box">
              <span>Sort by:</span>
              <select value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <button className="btn-create-project" onClick={() => navigate("/signup")}>
              + Post a Project
            </button>
          </div>

          {selectedSubs.length > 0 && (
            <div className="active-filters">
              {selectedSubs.map(sub => (
                <span className="filter-tag" key={sub}>
                  {sub}
                  <span onClick={() => toggleSub(sub)}>×</span>
                </span>
              ))}
            </div>
          )}

          {filtered.length > 0 ? (
            <div className="project-grid">
              {filtered.map(p => (
                <div className="project-card" key={p.id}>

                  <div className="card-thumb">
                    <img src={p.image} alt={p.title} className="card-thumb-img" />
                    <div className="card-thumb-overlay" />
                    <span
                      className="card-cat-badge"
                      style={{ background: categoryColors[p.category]?.bg, color: categoryColors[p.category]?.color }}
                    >
                      {p.sub}
                    </span>
                  </div>

                  <div className="card-content">
                    <h3 className="card-title">{p.title}</h3>
                    <div className="card-title-sep" />
                    <p className="card-desc">{p.desc}</p>
                    <div className="card-spacer" />

                    <div className="card-meta">
                      <div className="card-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="meta-svg green">
                          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                        </svg>
                        <span className="meta-val deadline-val">{p.deadline}</span>
                      </div>
                      <div className="card-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="meta-svg blue">
                          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                        <span className="meta-val budget-val">{p.budget}</span>
                      </div>
                    </div>

                    <div className="card-footer">
                      <div className="card-client">
                        <div className="client-avatar">{p.clientAvatar}</div>
                        <div>
                          <div className="client-name">{p.client}</div>
                          <div className="client-label">Client</div>
                        </div>
                      </div>
                      <button className="btn-take" onClick={() => navigate(`/projects/${p.id}`)}>
                        View Detail <span className="btn-arrow">›</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">No Projects Found</div>
              <div className="empty-sub">Try adjusting your filters or search query</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
