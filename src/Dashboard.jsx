import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

// ─── MOCK USER ────────────────────────────────────────────────
const USER = {
  name: "Alex Johnson",
  title: "Full-Stack & UI Freelancer",
  avatar: "AJ",
  joinedDate: "March 2025",
  successRate: 87,
};

// ─── MOCK DATA ────────────────────────────────────────────────
const PROPOSALS = [
  {
    id: 1,
    projectId: 1,
    projectTitle: "E-Commerce Fashion Landing Page",
    client: "Andi Wijaya",
    category: "Web Development",
    categoryGroup: "Technology",
    bid: 200,
    timeline: 14,
    sentAt: "2 hours ago",
    status: "negotiating",   // pending | negotiating | accepted | rejected | active
    hasNewMessage: true,
    lastMessage: "Client countered with $220 / 10 days",
  },
  {
    id: 2,
    projectId: 3,
    projectTitle: "Admin Dashboard UI Redesign",
    client: "Budi Santoso",
    category: "UI/UX Design",
    categoryGroup: "Design & Creative",
    bid: 280,
    timeline: 10,
    sentAt: "1 day ago",
    status: "accepted",
    hasNewMessage: false,
    lastMessage: "Terms finalized — project is now active!",
  },
  {
    id: 3,
    projectId: 6,
    projectTitle: "Google & Meta Ads Campaign Management",
    client: "Toko Online Maju",
    category: "Digital Ads",
    categoryGroup: "Marketing",
    bid: 380,
    timeline: 30,
    sentAt: "3 days ago",
    status: "pending",
    hasNewMessage: false,
    lastMessage: "Awaiting client response",
  },
  {
    id: 4,
    projectId: 2,
    projectTitle: "ML Product Recommendation System",
    client: "Startup Teknologi",
    category: "Machine Learning",
    categoryGroup: "Technology",
    bid: 750,
    timeline: 25,
    sentAt: "5 days ago",
    status: "rejected",
    hasNewMessage: false,
    lastMessage: "Client chose another freelancer",
  },
  {
    id: 5,
    projectId: 9,
    projectTitle: "F&B Startup Business Plan",
    client: "Dian Pratiwi",
    category: "Business Plan",
    categoryGroup: "Business & Consulting",
    bid: 290,
    timeline: 12,
    sentAt: "1 week ago",
    status: "active",
    hasNewMessage: false,
    lastMessage: "In progress — Day 4 of 12",
    progress: 33,
  },
  {
    id: 6,
    projectId: 5,
    projectTitle: "Mobile RPG Character Illustration",
    client: "GameStudio ID",
    category: "Illustration",
    categoryGroup: "Design & Creative",
    bid: 240,
    timeline: 7,
    sentAt: "2 weeks ago",
    status: "active",
    hasNewMessage: true,
    lastMessage: "Client left a revision note",
    progress: 71,
  },
];

// ─── HELPERS ──────────────────────────────────────────────────
const categoryColors = {
  "Technology":            { bg: "#e0f2fe", color: "#0369a1" },
  "Design & Creative":     { bg: "#fdf4ff", color: "#7e22ce" },
  "Marketing":             { bg: "#f0fdf4", color: "#15803d" },
  "Business & Consulting": { bg: "#fff7ed", color: "#c2410c" },
};

const statusConfig = {
  pending:     { label: "Pending",     cls: "pending",     icon: "⏳" },
  negotiating: { label: "Negotiating", cls: "negotiating", icon: "💬" },
  accepted:    { label: "Accepted",    cls: "accepted",    icon: "✓"  },
  active:      { label: "Active",      cls: "active",      icon: "▶"  },
  rejected:    { label: "Rejected",    cls: "rejected",    icon: "✕"  },
};

const TABS = [
  { key: "all",         label: "All Proposals",    count: PROPOSALS.length },
  { key: "active",      label: "Active Projects",  count: PROPOSALS.filter(p => p.status === "active").length },
  { key: "negotiating", label: "Negotiations",     count: PROPOSALS.filter(p => p.status === "negotiating").length },
  { key: "pending",     label: "Pending",          count: PROPOSALS.filter(p => p.status === "pending").length },
  { key: "closed",      label: "Closed",           count: PROPOSALS.filter(p => ["accepted","rejected"].includes(p.status)).length },
];

// ─── STATS ────────────────────────────────────────────────────
const stats = {
  total:       PROPOSALS.length,
  active:      PROPOSALS.filter(p => p.status === "active").length,
  negotiating: PROPOSALS.filter(p => p.status === "negotiating").length,
  accepted:    PROPOSALS.filter(p => p.status === "accepted").length,
  pending:     PROPOSALS.filter(p => p.status === "pending").length,
  earnings:    PROPOSALS.filter(p => ["accepted","active"].includes(p.status)).reduce((s, p) => s + p.bid, 0),
};

// ─── NAVBAR ───────────────────────────────────────────────────
const Navbar = ({ onLogout }) => {
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
          <span onClick={() => navigate("/project")}>Projects</span>
          <span onClick={() => navigate("/")}>Pricing</span>
        </div>
        <div className="pnav-actions dash-nav-actions">
          <div className="dash-nav-avatar" title={USER.name}>
            {USER.avatar}
          </div>
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
const ProposalCard = ({ proposal, onNavigate }) => {
  const navigate = useNavigate();
  const catColor = categoryColors[proposal.categoryGroup] || { bg: "#f1f5f9", color: "#475569" };
  const st = statusConfig[proposal.status];

  const handleAction = () => {
    if (proposal.status === "negotiating") {
      navigate(`/projects/${proposal.projectId}/negotiate`);
    } else if (proposal.status === "active" || proposal.status === "accepted") {
      navigate(`/projects/${proposal.projectId}`);
    } else {
      navigate(`/projects/${proposal.projectId}`);
    }
  };

  return (
    <div className={`dash-proposal-card ${proposal.hasNewMessage ? "dash-proposal-card--notify" : ""}`}>
      {/* Left accent bar */}
      <div className={`dash-card-accent dash-card-accent--${proposal.status}`} />

      <div className="dash-card-main">
        {/* Top row */}
        <div className="dash-card-top">
          <div className="dash-card-tags">
            <span className="dash-cat-badge" style={{ background: catColor.bg, color: catColor.color }}>
              {proposal.category}
            </span>
            {proposal.hasNewMessage && (
              <span className="dash-new-badge">
                <span className="dash-new-dot" />
                New activity
              </span>
            )}
          </div>
          <span className={`dash-status-badge dash-status-badge--${st.cls}`}>
            {st.icon} {st.label}
          </span>
        </div>

        {/* Title + client */}
        <h3 className="dash-card-title">{proposal.projectTitle}</h3>
        <p className="dash-card-client">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          {proposal.client}
          <span className="dash-card-dot">·</span>
          {proposal.sentAt}
        </p>

        {/* Last message */}
        <p className="dash-card-last-msg">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          {proposal.lastMessage}
        </p>

        {/* Progress bar (active only) */}
        {proposal.status === "active" && proposal.progress != null && (
          <div className="dash-progress-wrap">
            <div className="dash-progress-bar">
              <div className="dash-progress-fill" style={{ width: `${proposal.progress}%` }} />
            </div>
            <span className="dash-progress-label">{proposal.progress}% complete</span>
          </div>
        )}
      </div>

      {/* Right: terms + action */}
      <div className="dash-card-right">
        <div className="dash-card-terms">
          <div className="dash-term">
            <span className="dash-term-label">Bid</span>
            <span className="dash-term-val">${proposal.bid}</span>
          </div>
          <div className="dash-term-sep" />
          <div className="dash-term">
            <span className="dash-term-label">Days</span>
            <span className="dash-term-val">{proposal.timeline}</span>
          </div>
        </div>
        <button className={`dash-card-btn dash-card-btn--${proposal.status}`} onClick={handleAction}>
          {proposal.status === "negotiating" && "Go to Chat →"}
          {proposal.status === "active"      && "View Project →"}
          {proposal.status === "pending"     && "View Details →"}
          {proposal.status === "accepted"    && "View Contract →"}
          {proposal.status === "rejected"    && "Browse More →"}
        </button>
      </div>
    </div>
  );
};

// ─── EMPTY STATE ──────────────────────────────────────────────
const EmptyState = ({ tab, onBrowse }) => (
  <div className="dash-empty">
    <div className="dash-empty-icon">
      {tab === "active"      && <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
      {tab === "negotiating" && <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
      {tab === "pending"     && <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
      {tab === "closed"      && <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>}
      {tab === "all"         && <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
    </div>
    <p className="dash-empty-title">No proposals here yet</p>
    <p className="dash-empty-sub">Browse open projects and send your first proposal.</p>
    <button className="dash-empty-btn" onClick={onBrowse}>Browse Projects</button>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const filtered = PROPOSALS.filter(p => {
    if (activeTab === "all")         return true;
    if (activeTab === "closed")      return ["accepted", "rejected"].includes(p.status);
    return p.status === activeTab;
  });

  const handleLogout = () => navigate("/login");

  return (
    <div className="dash-page">
      <Navbar onLogout={handleLogout} />

      <div className="dash-body">

        {/* ── WELCOME HEADER ── */}
        <div className="dash-header">
          <div className="dash-header-left">
            <div className="dash-avatar-lg">{USER.avatar}</div>
            <div>
              <p className="dash-welcome">Good morning 👋</p>
              <h1 className="dash-name">{USER.name}</h1>
              <p className="dash-user-title">{USER.title}</p>
            </div>
          </div>
          <button className="dash-browse-btn" onClick={() => navigate("/project")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Browse Projects
          </button>
        </div>

        {/* ── STATS ROW ── */}
        <div className="dash-stats-row">
          <StatCard
            label="Total Proposals"
            value={stats.total}
            sub={`${stats.pending} pending response`}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            }
          />
          <StatCard
            label="Active Projects"
            value={stats.active}
            sub="Currently in progress"
            accent="blue"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            }
          />
          <StatCard
            label="In Negotiation"
            value={stats.negotiating}
            sub="Awaiting your response"
            accent="orange"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            }
          />
          <StatCard
            label="Total Earnings"
            value={`$${stats.earnings.toLocaleString()}`}
            sub="Accepted + active projects"
            accent="green"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            }
          />
          <StatCard
            label="Success Rate"
            value={`${USER.successRate}%`}
            sub="Proposals accepted"
            accent="purple"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            }
          />
        </div>

        {/* ── PROPOSALS SECTION ── */}
        <div className="dash-proposals-section">

          {/* Section header */}
          <div className="dash-section-header">
            <div>
              <h2 className="dash-section-title">My Proposals</h2>
              <p className="dash-section-sub">Track all your submitted proposals and their current status.</p>
            </div>
            <button className="dash-new-proposal-btn" onClick={() => navigate("/projects")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Proposal
            </button>
          </div>

          {/* Tabs */}
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

          {/* Cards */}
          <div className="dash-cards-list">
            {filtered.length === 0 ? (
              <EmptyState tab={activeTab} onBrowse={() => navigate("/projects")} />
            ) : (
              filtered.map(p => (
                <ProposalCard key={p.id} proposal={p} />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
