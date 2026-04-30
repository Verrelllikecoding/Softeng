import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectPage.css";
import NotificationBell from "./NotificationBell";

const CATEGORIES = {
  "Technology": ["Web Development", "Mobile Development", "Machine Learning", "Data Analysis"],
  "Design & Creative": ["UI/UX Design", "Branding", "Illustration", "Photography"],
  "Marketing": ["Digital Ads", "SEO & Content", "Social Media", "Email Marketing"],
  "Business & Consulting": ["Business Plan", "Financial Analysis", "Market Research", "HR Consulting"],
};

const SORT_OPTIONS = ["Relevance", "Highest Budget", "Lowest Budget"];

const categoryColors = {
  "Technology": { bg: "#e0f2fe", color: "#0369a1" },
  "Design & Creative": { bg: "#fdf4ff", color: "#7e22ce" },
  "Marketing": { bg: "#f0fdf4", color: "#15803d" },
  "Business & Consulting": { bg: "#fff7ed", color: "#c2410c" },
};

const categoryGradients = {
  "Technology": "linear-gradient(135deg, #1e3a5f 0%, #1a56db 100%)",
  "Design & Creative": "linear-gradient(135deg, #4a1d96 0%, #7c3aed 100%)",
  "Marketing": "linear-gradient(135deg, #064e3b 0%, #10b981 100%)",
  "Business & Consulting": "linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)",
};

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
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
          <NotificationBell />
          {user ? (
            <button className="btn-pnav-login" onClick={() => navigate("/dashboard")}>Dashboard</button>
          ) : (
            <>
              <button className="btn-pnav-login" onClick={() => navigate("/login")}>Log In</button>
              <button className="btn-pnav-signup" onClick={() => navigate("/signup")}>Sign Up Free</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default function ProjectPage() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [sort, setSort] = useState("Relevance");
  const [expandedCats, setExpandedCats] = useState([
    "Technology", "Design & Creative", "Marketing", "Business & Consulting",
  ]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/projects");
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const toggleSub = (sub) => setSelectedSubs(prev =>
    prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
  );

  const toggleCat = (cat) => setExpandedCats(prev =>
    prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
  );

  const budgetToNum = (b) => parseInt((b || "0").replace(/[^0-9]/g, ""));

  const filtered = projects
    .filter(p => {
      const matchSearch =
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.sub_category?.toLowerCase().includes(search.toLowerCase());
      const matchSub = selectedSubs.length === 0 || selectedSubs.includes(p.sub_category);
      return matchSearch && matchSub;
    })
    .sort((a, b) => {
      if (sort === "Highest Budget") return budgetToNum(b.budget) - budgetToNum(a.budget);
      if (sort === "Lowest Budget") return budgetToNum(a.budget) - budgetToNum(b.budget);
      return 0;
    });

  return (
    <div className="project-page">
      <Navbar />

      <div className="project-body">

        {/* ── SIDEBAR ── */}
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
                      <input type="checkbox" checked={selectedSubs.includes(sub)} onChange={() => toggleSub(sub)} />
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

        {/* ── MAIN ── */}
        <main className="project-main">
          <div className="project-toolbar">
            <div className="search-box">
              <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
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
            <button className="btn-create-project" onClick={() => token ? navigate("/post-project") : navigate("/signup")}>
              + Post a Project
            </button>
          </div>

          {selectedSubs.length > 0 && (
            <div className="active-filters">
              {selectedSubs.map(sub => (
                <span className="filter-tag" key={sub}>
                  {sub}<span onClick={() => toggleSub(sub)}>×</span>
                </span>
              ))}
            </div>
          )}

          {loading ? (
            <p style={{ textAlign: "center", padding: "2rem", color: "#888" }}>Loading projects...</p>
          ) : filtered.length > 0 ? (
            <div className="project-grid">
              {filtered.map(p => {
                const initials = p.client_name
                  ? p.client_name.split(" ").map(n => n[0]).join("").toUpperCase()
                  : "C";
                const catColor = categoryColors[p.category] || { bg: "#f1f5f9", color: "#475569" };
                const gradient = categoryGradients[p.category] || "linear-gradient(135deg, #1e293b, #475569)";
                const imageUrl = p.image_url ? `http://localhost:3001${p.image_url}` : null;

                return (
                  <div className="project-card" key={p.id}>

                    {/* ── THUMBNAIL — bisa diklik ke detail ── */}
                    <div
                      className="card-thumb card-thumb--clickable"
                      style={{
                        background: imageUrl ? "none" : gradient,
                        position: "relative",
                        overflow: "hidden",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/projects/${p.id}`)}
                    >
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={p.title}
                          className="card-thumb-img"
                          onError={e => {
                            e.target.style.display = "none";
                            e.target.parentElement.style.background = gradient;
                          }}
                        />
                      )}
                      <div className="card-thumb-overlay" />

                      {/* Badge kategori */}
                      <span
                        className="card-cat-badge"
                        style={{ background: catColor.bg, color: catColor.color }}
                      >
                        {p.sub_category}
                      </span>

                      {/* Hover hint */}
                      <div className="card-thumb-hover-hint">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        View Detail
                      </div>
                    </div>

                    <div className="card-content">
                      <h3
                        className="card-title card-title--link"
                        onClick={() => navigate(`/projects/${p.id}`)}
                      >
                        {p.title}
                      </h3>
                      <div className="card-title-sep" />
                      <p className="card-desc">{p.description}</p>
                      <div className="card-spacer" />

                      <div className="card-meta">
                        <div className="card-meta-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="meta-svg green">
                            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                          </svg>
                          <span className="meta-val deadline-val">{p.deadline || "-"}</span>
                        </div>
                        <div className="card-meta-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="meta-svg blue">
                            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                          </svg>
                          <span className="meta-val budget-val">{p.budget || "-"}</span>
                        </div>
                      </div>

                      <div className="card-footer">
                        <div className="card-client">
                          <div className="client-avatar">{initials}</div>
                          <div>
                            <div className="client-name">{p.client_name || "Client"}</div>
                            <div className="client-label">Client</div>
                          </div>
                        </div>
                        <button className="btn-take" onClick={() => navigate(`/projects/${p.id}`)}>
                          View Detail <span className="btn-arrow">›</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
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
