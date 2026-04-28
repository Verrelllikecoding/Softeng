import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const statusConfig = {
  Pending:   { label: "Pending",   cls: "pending",   icon: "⏳" },
  Accepted:  { label: "Accepted",  cls: "accepted",  icon: "✓"  },
  Rejected:  { label: "Rejected",  cls: "rejected",  icon: "✕"  },
  Delivered: { label: "Delivered", cls: "delivered", icon: "📦" },
  Completed: { label: "Completed", cls: "completed", icon: "🎉" },
};

const categoryColors = {
  "Technology":            { bg: "#e0f2fe", color: "#0369a1" },
  "Design & Creative":     { bg: "#fdf4ff", color: "#7e22ce" },
  "Marketing":             { bg: "#f0fdf4", color: "#15803d" },
  "Business & Consulting": { bg: "#fff7ed", color: "#c2410c" },
};

// ─── NAVBAR ───────────────────────────────────────────────────
const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U";
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
        <div className="pnav-actions dash-nav-actions">
          <div className="dash-nav-avatar" title={user?.name}>{initials}</div>
          <button className="btn-pnav-login" onClick={onLogout}>Log Out</button>
        </div>
      </div>
    </nav>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────
const StatCard = ({ label, value, sub, accent, icon }) => (
  <div className={`dash-stat-card ${accent ? `dash-stat-card--${accent}` : ""}`}>
    <div className="dash-stat-icon">{icon}</div>
    <div className="dash-stat-body">
      <span className="dash-stat-val">{value}</span>
      <span className="dash-stat-label">{label}</span>
      {sub && <span className="dash-stat-sub">{sub}</span>}
    </div>
  </div>
);

// ─── FREELANCER PROPOSAL CARD ─────────────────────────────────
const ProposalCard = ({ proposal }) => {
  const navigate = useNavigate();
  const st = statusConfig[proposal.status] || { label: proposal.status, cls: "pending", icon: "⏳" };

  return (
    <div className="dash-proposal-card">
      <div className={`dash-card-accent dash-card-accent--${st.cls}`} />
      <div className="dash-card-main">
        <div className="dash-card-top">
          <span className={`dash-status-badge dash-status-badge--${st.cls}`}>
            {st.icon} {st.label}
          </span>
        </div>
        <h3 className="dash-card-title">{proposal.project_title}</h3>
        <p className="dash-card-client">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          {new Date(proposal.created_at).toLocaleDateString()}
        </p>
        <p className="dash-card-last-msg">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          {proposal.content?.slice(0, 80)}...
        </p>
      </div>
      <div className="dash-card-right">
        {(proposal.status === "Accepted" || proposal.status === "Delivered") && (
          <button
            className="dash-card-btn dash-card-btn--delivery"
            onClick={() => navigate(`/delivery/${proposal.id}`)}
          >
            {proposal.status === "Delivered" ? "View Delivery →" : "Submit Delivery →"}
          </button>
        )}
        <button
          className={`dash-card-btn dash-card-btn--${st.cls}`}
          onClick={() => navigate(`/projects/${proposal.project_id}/negotiate/${proposal.id}`)}
        >
          View Negotiation →
        </button>
      </div>
    </div>
  );
};

// ─── CLIENT PROJECT CARD ──────────────────────────────────────
const ClientProjectCard = ({ project, onViewProposals }) => {
  const navigate = useNavigate();
  const catColor = categoryColors[project.category] || { bg: "#f1f5f9", color: "#475569" };
  const proposalCount = parseInt(project.proposal_count) || 0;
  const proposals = project.proposals || [];
  const pendingCount = proposals.filter(p => p.status === "Pending").length;
  const acceptedCount = proposals.filter(p => p.status === "Accepted").length;

  return (
    <div className="dash-client-card">
      <div className="dash-client-card-header">
        <span className="dash-client-cat-badge" style={{ background: catColor.bg, color: catColor.color }}>
          {project.sub_category}
        </span>
        <span className={`dash-client-status ${project.status?.toLowerCase()}`}>
          ● {project.status}
        </span>
      </div>

      <h3 className="dash-client-card-title">{project.title}</h3>
      <p className="dash-client-card-desc">{project.description?.slice(0, 100)}...</p>

      <div className="dash-client-card-meta">
        <div className="dash-client-meta-item">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          {project.budget}
        </div>
        <div className="dash-client-meta-item">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
          {project.deadline}
        </div>
        <div className="dash-client-meta-item">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          {proposalCount} proposals
        </div>
      </div>

      {proposalCount > 0 && (
        <div className="dash-client-proposal-summary">
          {pendingCount > 0 && <span className="dash-cps dash-cps--pending">⏳ {pendingCount} Pending</span>}
          {acceptedCount > 0 && <span className="dash-cps dash-cps--accepted">✓ {acceptedCount} Accepted</span>}
        </div>
      )}

      <div className="dash-client-card-actions">
        <button className="dash-client-view-btn" onClick={() => navigate(`/projects/${project.id}`)}>
          View Project
        </button>
        {proposalCount > 0 && (
          <button className="dash-client-proposals-btn" onClick={() => onViewProposals(project)}>
            Review Proposals ({proposalCount})
          </button>
        )}
        <button className="dash-client-post-btn" onClick={() => navigate("/post-project")}>
          + Post New
        </button>
      </div>
    </div>
  );
};

// ─── PROPOSALS MODAL ──────────────────────────────────────────
const ProposalsModal = ({ project, onClose, token }) => {
  const navigate = useNavigate();
  const proposals = project.proposals || [];

  const handleAccept = async (proposalId) => {
    try {
      await fetch(`http://localhost:3001/api/proposals/${proposalId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Accepted" }),
      });
      alert("Proposal accepted!");
      onClose();
    } catch (err) {
      alert("Gagal update status");
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await fetch(`http://localhost:3001/api/proposals/${proposalId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Rejected" }),
      });
      alert("Proposal rejected!");
      onClose();
    } catch (err) {
      alert("Gagal update status");
    }
  };

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal" onClick={e => e.stopPropagation()}>
        <div className="dash-modal-header">
          <div>
            <h2 className="dash-modal-title">Proposals for</h2>
            <p className="dash-modal-subtitle">{project.title}</p>
          </div>
          <button className="dash-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="dash-modal-body">
          {proposals.length === 0 ? (
            <p style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>No proposals yet.</p>
          ) : (
            proposals.map(p => {
              const st = statusConfig[p.status] || { label: p.status, cls: "pending", icon: "⏳" };
              const initials = p.freelancer_name
                ? p.freelancer_name.split(" ").map(n => n[0]).join("").toUpperCase()
                : "F";
              return (
                <div className="dash-modal-proposal" key={p.id}>
                  <div className="dash-modal-proposal-header">
                    <div className="dash-modal-avatar">{initials}</div>
                    <div className="dash-modal-freelancer-info">
                      <span className="dash-modal-freelancer-name">{p.freelancer_name}</span>
                      <span className="dash-modal-date">{new Date(p.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className={`dash-status-badge dash-status-badge--${st.cls}`}>
                      {st.icon} {st.label}
                    </span>
                  </div>

                  <p className="dash-modal-content">{p.content?.slice(0, 200)}...</p>

                  <div className="dash-modal-actions">
                    <button
                      className="dash-modal-negotiate-btn"
                      onClick={() => navigate(`/projects/${project.id}/negotiate/${p.id}`)}
                    >
                      💬 Negotiate
                    </button>
                    {p.status === "Pending" && (
                      <>
                        <button className="dash-modal-accept-btn" onClick={() => handleAccept(p.id)}>
                          ✓ Accept
                        </button>
                        <button className="dash-modal-reject-btn" onClick={() => handleReject(p.id)}>
                          ✕ Reject
                        </button>
                      </>
                    )}
                    {(p.status === "Accepted" || p.status === "Delivered" || p.status === "Completed") && (
                      <button
                        className="dash-modal-delivery-btn"
                        onClick={() => {
                            console.log("proposal data:", p);
                            navigate(`/delivery/${p.id}`);
                        }}

                      >
                        📦 View Delivery
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// ─── EMPTY STATE ──────────────────────────────────────────────
const EmptyState = ({ title, sub, btnLabel, onBtn }) => (
  <div className="dash-empty">
    <p className="dash-empty-title">{title}</p>
    <p className="dash-empty-sub">{sub}</p>
    <button className="dash-empty-btn" onClick={onBtn}>{btnLabel}</button>
  </div>
);

// ─── MAIN DASHBOARD ───────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // ── Role tabs (Freelancer / Client) ──
  const [roleTab, setRoleTab] = useState("freelancer");

  // ── Freelancer state ──
  const [activeTab, setActiveTab] = useState("all");
  const [proposals, setProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(true);

  // ── Client state ──
  const [clientProjects, setClientProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchProposals();
    fetchClientProjects();
  }, []);

  const fetchProposals = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/proposals/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProposals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal fetch proposals:", err);
    } finally {
      setLoadingProposals(false);
    }
  };

  const fetchClientProjects = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/proposals/client/my-projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setClientProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal fetch client projects:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ── Freelancer stats ──
  const stats = {
    total:    proposals.length,
    pending:  proposals.filter(p => p.status === "Pending").length,
    accepted: proposals.filter(p => p.status === "Accepted").length,
    rejected: proposals.filter(p => p.status === "Rejected").length,
  };

  // ── Client stats ──
  const clientStats = {
    total:     clientProjects.length,
    open:      clientProjects.filter(p => p.status === "Open").length,
    proposals: clientProjects.reduce((acc, p) => acc + (parseInt(p.proposal_count) || 0), 0),
    active:    clientProjects.filter(p => {
      const proposals = p.proposals || [];
      return proposals.some(pr => pr.status === "Accepted");
    }).length,
  };

  const FREELANCER_TABS = [
    { key: "all",     label: "All",      count: stats.total },
    { key: "pending", label: "Pending",  count: stats.pending },
    { key: "closed",  label: "Closed",   count: stats.accepted + stats.rejected },
  ];

  const filteredProposals = proposals.filter(p => {
    if (activeTab === "all") return true;
    if (activeTab === "closed") return ["Accepted", "Rejected", "Delivered", "Completed"].includes(p.status);
    return p.status.toLowerCase() === activeTab;
  });

  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U";

  return (
    <div className="dash-page">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="dash-body">

        {/* ── WELCOME HEADER ── */}
        <div className="dash-header">
          <div className="dash-header-left">
            <div className="dash-avatar-lg">{initials}</div>
            <div>
              <p className="dash-welcome">Good morning 👋</p>
              <h1 className="dash-name">{user?.name || "User"}</h1>
              <p className="dash-user-title">
                  {roleTab === "client" ? "Client 👔" : "Freelancer 💼"}
              </p>
            </div>
          </div>
          <div className="dash-header-actions">
            <button className="dash-browse-btn" onClick={() => navigate("/projects")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Browse Projects
            </button>
            <button className="dash-post-btn" onClick={() => navigate("/post-project")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Post a Project
            </button>
          </div>
        </div>

        {/* ── ROLE TABS ── */}
        <div className="dash-role-tabs">
          <button
            className={`dash-role-tab ${roleTab === "freelancer" ? "active" : ""}`}
            onClick={() => setRoleTab("freelancer")}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Freelancer
            <span className="dash-role-tab-count">{stats.total}</span>
          </button>
          <button
            className={`dash-role-tab ${roleTab === "client" ? "active" : ""}`}
            onClick={() => setRoleTab("client")}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            Client
            <span className="dash-role-tab-count">{clientStats.total}</span>
          </button>
        </div>

        {/* ══════════════════════════════════════════
            FREELANCER VIEW
        ══════════════════════════════════════════ */}
        {roleTab === "freelancer" && (
          <>
            <div className="dash-stats-row">
              <StatCard label="Total Proposals" value={stats.total} sub={`${stats.pending} pending`}
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
              />
              <StatCard label="Accepted" value={stats.accepted} sub="Proposals accepted" accent="green"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
              />
              <StatCard label="Pending" value={stats.pending} sub="Awaiting response" accent="orange"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
              />
              <StatCard label="Rejected" value={stats.rejected} sub="Not selected" accent="blue"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
              />
            </div>

            <div className="dash-proposals-section">
              <div className="dash-section-header">
                <div>
                  <h2 className="dash-section-title">My Proposals</h2>
                  <p className="dash-section-sub">Track all your submitted proposals.</p>
                </div>
                <button className="dash-new-proposal-btn" onClick={() => navigate("/projects")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  New Proposal
                </button>
              </div>

              <div className="dash-tabs">
                {FREELANCER_TABS.map(tab => (
                  <button
                    key={tab.key}
                    className={`dash-tab ${activeTab === tab.key ? "dash-tab--active" : ""}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                    <span className={`dash-tab-count ${activeTab === tab.key ? "dash-tab-count--active" : ""}`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="dash-cards-list">
                {loadingProposals ? (
                  <p style={{ textAlign: "center", padding: "2rem", color: "#888" }}>Loading...</p>
                ) : filteredProposals.length === 0 ? (
                  <EmptyState
                    title="No proposals yet"
                    sub="Browse open projects and send your first proposal."
                    btnLabel="Browse Projects"
                    onBtn={() => navigate("/projects")}
                  />
                ) : (
                  filteredProposals.map(p => <ProposalCard key={p.id} proposal={p} />)
                )}
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════
            CLIENT VIEW
        ══════════════════════════════════════════ */}
        {roleTab === "client" && (
          <>
            <div className="dash-stats-row">
              <StatCard label="Total Projects" value={clientStats.total} sub="Projects posted"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}
              />
              <StatCard label="Open Projects" value={clientStats.open} sub="Accepting proposals" accent="green"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
              />
              <StatCard label="Total Proposals" value={clientStats.proposals} sub="Received proposals" accent="orange"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
              />
              <StatCard label="Active Projects" value={clientStats.active} sub="In progress" accent="blue"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
              />
            </div>

            <div className="dash-proposals-section">
              <div className="dash-section-header">
                <div>
                  <h2 className="dash-section-title">My Projects</h2>
                  <p className="dash-section-sub">Manage your posted projects and review proposals.</p>
                </div>
                <button className="dash-new-proposal-btn" onClick={() => navigate("/post-project")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Post New Project
                </button>
              </div>

              <div className="dash-cards-list">
                {loadingProjects ? (
                  <p style={{ textAlign: "center", padding: "2rem", color: "#888" }}>Loading...</p>
                ) : clientProjects.length === 0 ? (
                  <EmptyState
                    title="No projects posted yet"
                    sub="Post your first project and start receiving proposals from freelancers."
                    btnLabel="Post a Project"
                    onBtn={() => navigate("/post-project")}
                  />
                ) : (
                  <div className="dash-client-grid">
                    {clientProjects.map(p => (
                      <ClientProjectCard
                        key={p.id}
                        project={p}
                        onViewProposals={setSelectedProject}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

      </div>

      {/* ── PROPOSALS MODAL ── */}
      {selectedProject && (
        <ProposalsModal
          project={selectedProject}
          token={token}
          onClose={() => {
            setSelectedProject(null);
            fetchClientProjects();
          }}
        />
      )}

    </div>
  );
}
