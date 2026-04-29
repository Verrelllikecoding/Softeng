import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProjectDetail.css";
import NotificationBell from "./NotificationBell";

const categoryColors = {
  "Technology":            { bg: "#e0f2fe", color: "#0369a1" },
  "Design & Creative":     { bg: "#fdf4ff", color: "#7e22ce" },
  "Marketing":             { bg: "#f0fdf4", color: "#15803d" },
  "Business & Consulting": { bg: "#fff7ed", color: "#c2410c" },
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
          <span onClick={() => navigate("/projects")}>Projects</span>
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

export default function ProjectDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/projects/${id}`);
        if (res.status === 404) { setNotFound(true); return; }
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error("Gagal fetch project:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handlePropose = () => {
    if (!token) navigate("/login");
    else navigate(`/projects/${id}/propose`);
  };

  if (loading) return (
    <div className="detail-page"><Navbar />
      <p style={{ textAlign: "center", padding: "4rem", color: "#888" }}>Loading project...</p>
    </div>
  );

  if (notFound || !project) return (
    <div className="detail-page"><Navbar />
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <p style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Project tidak ditemukan</p>
        <button className="btn-back" onClick={() => navigate("/projects")}>← Back to Projects</button>
      </div>
    </div>
  );

  const catColor = categoryColors[project.category] || { bg: "#f1f5f9", color: "#475569" };
  const clientInitials = project.client_name
    ? project.client_name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "C";

  const skills = Array.isArray(project.skills)
    ? project.skills
    : project.skills
      ? project.skills.replace(/[{}"]/g, "").split(",").map(s => s.trim()).filter(Boolean)
      : [];

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
          <div className="detail-main">

            <div className="detail-header-card">
              <div className="detail-thumb">
                <div className="detail-thumb-overlay" />
              </div>
              <div className="detail-header-info">
                <div className="detail-badges">
                  <span className="detail-cat-badge" style={{ background: catColor.bg, color: catColor.color }}>
                    {project.sub_category}
                  </span>
                  <span className="detail-status-badge">● {project.status}</span>
                  <span className="detail-posted">
                    Posted {new Date(project.posted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <h1 className="detail-title">{project.title}</h1>
                <p className="detail-desc">{project.description}</p>
                <div className="detail-meta-row">
                  <div className="detail-meta-item">
                    <svg width="14" height="14" fill="none" stroke="#1a56db" strokeWidth="2" viewBox="0 0 24 24">
                      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                    <span className="dm-label">Budget</span>
                    <span className="dm-val blue">{project.budget}</span>
                  </div>
                  <div className="detail-meta-divider" />
                  <div className="detail-meta-item">
                    <svg width="14" height="14" fill="none" stroke="#059669" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                    </svg>
                    <span className="dm-label">Deadline</span>
                    <span className="dm-val">{project.deadline}</span>
                  </div>
                  <div className="detail-meta-divider" />
                  <div className="detail-meta-item">
                    <svg width="14" height="14" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span className="dm-label">Proposals</span>
                    <span className="dm-val">{project.proposals_count || 0} submitted</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h2 className="detail-section-title">Project Description</h2>
              <p className="detail-section-content">{project.description}</p>
            </div>

            {skills.length > 0 && (
              <div className="detail-section">
                <h2 className="detail-section-title">Required Skills</h2>
                <div className="skills-list">
                  {skills.map((sk, i) => (
                    <span className="skill-tag" key={i}>{sk}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="detail-cta-bar">
              <button className="btn-back" onClick={() => navigate("/projects")}>← Back to Projects</button>
              <button className="btn-make-proposal" onClick={handlePropose}>Submit a Proposal →</button>
            </div>

          </div>

          <aside className="detail-sidebar">

            <div className="ds-card">
              <div className="ds-card-title">About the Client</div>
              <div className="ds-client">
                <div className="ds-avatar">{clientInitials}</div>
                <div>
                  <div className="ds-client-name">{project.client_name || "Client"}</div>
                  <div className="ds-client-job">Project Owner</div>
                </div>
              </div>
              <div className="ds-client-stats">
                <div className="ds-stat">
                  <span className="ds-stat-num">⭐ {project.client_rating || "New"}</span>
                  <span className="ds-stat-label">Rating</span>
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
                  <span className="ds-row-val">{project.sub_category}</span>
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
                  <span className="ds-row-val">{project.proposals_count || 0} submitted</span>
                </div>
              </div>
            </div>

            <div className="ds-card cta-card">
              <div className="ds-card-title">Interested in this project?</div>
              <p className="cta-desc">
                {token
                  ? "Use our AI assistant to craft a compelling proposal in seconds."
                  : "Sign in or create an account to submit a proposal with the help of our AI assistant."}
              </p>
              <button className="btn-make-proposal full" onClick={handlePropose}>
                Submit a Proposal →
              </button>
              {!token && (
                <button className="btn-login-cta" onClick={() => navigate("/login")}>
                  Already have an account? Log In
                </button>
              )}
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
