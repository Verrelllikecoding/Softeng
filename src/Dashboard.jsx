import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

// ─── HELPERS ──────────────────────────────────────────────────
const categoryColors = {
  "Technology":            { bg: "#e0f2fe", color: "#0369a1" },
  "Design & Creative":     { bg: "#fdf4ff", color: "#7e22ce" },
  "Marketing":             { bg: "#f0fdf4", color: "#15803d" },
  "Business & Consulting": { bg: "#fff7ed", color: "#c2410c" },
};

const statusConfig = {
  Pending:     { label: "Pending",     cls: "pending",     icon: "⏳" },
  Accepted:    { label: "Accepted",    cls: "accepted",    icon: "✓"  },
  Rejected:    { label: "Rejected",    cls: "rejected",    icon: "✕"  },
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

// ─── PROPOSAL CARD ────────────────────────────────────────────
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
        <button
          className={`dash-card-btn dash-card-btn--${st.cls}`}
          onClick={() => navigate(`/projects/${proposal.project_id}`)}
        >
          View Project →
        </button>
      </div>
    </div>
  );
};

// ─── EMPTY STATE ──────────────────────────────────────────────
const EmptyState = ({ onBrowse }) => (
  <div className="dash-empty">
    <p className="dash-empty-title">No proposals yet</p>
    <p className="dash-empty-sub">Browse open projects and send your first proposal.</p>
    <button className="dash-empty-btn" onClick={onBrowse}>Browse Projects</button>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil user dari localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Kalau tidak ada token, redirect ke login
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch proposals dari backend
    const fetchProposals = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/proposals/my', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setProposals(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Gagal fetch proposals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  const filtered = proposals.filter(p => {
    if (activeTab === "all") return true;
    if (activeTab === "closed") return ["Accepted", "Rejected"].includes(p.status);
    return p.status.toLowerCase() === activeTab;
  });

  const stats = {
    total:    proposals.length,
    pending:  proposals.filter(p => p.status === "Pending").length,
    accepted: proposals.filter(p => p.status === "Accepted").length,
    rejected: proposals.filter(p => p.status === "Rejected").length,
  };

  const TABS = [
    { key: "all",     label: "All Proposals", count: proposals.length },
    { key: "pending", label: "Pending",        count: stats.pending },
    { key: "closed",  label: "Closed",         count: stats.accepted + stats.rejected },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U";

  return (
    <div className="dash-page">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="dash-body">

        {/* WELCOME HEADER */}
        <div className="dash-header">
          <div className="dash-header-left">
            <div className="dash-avatar-lg">{initials}</div>
            <div>
              <p className="dash-welcome">Good morning 👋</p>
              <h1 className="dash-name">{user?.name || 'User'}</h1>
              <p className="dash-user-title">{user?.role || 'Freelancer'}</p>
            </div>
          </div>
          <button className="dash-browse-btn" onClick={() => navigate("/projects")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Browse Projects
          </button>
        </div>

        {/* STATS ROW */}
        <div className="dash-stats-row">
          <StatCard label="Total Proposals" value={stats.total}
            sub={`${stats.pending} pending`}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
          />
          <StatCard label="Accepted" value={stats.accepted}
            sub="Proposals accepted"
            accent="green"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
          />
          <StatCard label="Pending" value={stats.pending}
            sub="Awaiting response"
            accent="orange"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          />
          <StatCard label="Rejected" value={stats.rejected}
            sub="Not selected"
            accent="blue"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
          />
        </div>

        {/* PROPOSALS SECTION */}
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
            {TABS.map(tab => (
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
            {loading ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Loading...</p>
            ) : filtered.length === 0 ? (
              <EmptyState onBrowse={() => navigate("/projects")} />
            ) : (
              filtered.map(p => <ProposalCard key={p.id} proposal={p} />)
            )}
          </div>
        </div>

      </div>
    </div>
  );
}