import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProposalNegotiation.css";
import NotificationBell from "./NotificationBell";

const categoryColors = {
  "Technology":            { bg: "#e0f2fe", color: "#0369a1" },
  "Design & Creative":     { bg: "#fdf4ff", color: "#7e22ce" },
  "Marketing":             { bg: "#f0fdf4", color: "#15803d" },
  "Business & Consulting": { bg: "#fff7ed", color: "#c2410c" },
};

// ─── NAVBAR ───────────────────────────────────────────────────
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
          <span className="active" onClick={() => navigate("/projects")}>Projects</span>
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

// ─── AVATAR ───────────────────────────────────────────────────
const Avatar = ({ initials, color = "blue", size = "md" }) => (
  <div className={`neg-avatar neg-avatar--${color} neg-avatar--${size}`}>{initials}</div>
);

// ─── STATUS BADGE ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    pending:   { label: "Awaiting Response", cls: "pending" },
    countered: { label: "Countered",         cls: "countered" },
    accepted:  { label: "Accepted",          cls: "accepted" },
    rejected:  { label: "Rejected",          cls: "rejected" },
    finalized: { label: "Finalized ✓",       cls: "finalized" },
  };
  const s = map[status] || map.pending;
  return <span className={`neg-status-badge neg-status-badge--${s.cls}`}>{s.label}</span>;
};

// ─── RENDER TEXT (markdown bold + headers) ────────────────────
const renderText = (text) => {
  if (!text) return null;
  return text.split("\n").map((line, i) => {
    if (!line.trim()) return <div key={i} className="neg-spacer" />;
    const headerMatch = line.match(/^\*\*(.+?)\*\*/);
    if (headerMatch) {
      const rest = line.replace(/^\*\*(.+?)\*\*/, "").trim();
      return (
        <p key={i} className="neg-bubble-header">
          <strong>{headerMatch[1]}</strong>{rest ? ` ${rest}` : ""}
        </p>
      );
    }
    const parts = line.split(/\*\*(.+?)\*\*/g);
    return (
      <p key={i} className="neg-bubble-line">
        {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
      </p>
    );
  });
};

// ─── PROPOSAL BUBBLE ──────────────────────────────────────────
// isMine = true kalau pesan ini dari user yang sedang login
const ProposalBubble = ({ msg, isMine, myInitials, otherInitials, myName, otherName }) => {
  return (
    <div className={`neg-msg-row ${isMine ? "neg-msg-row--right" : "neg-msg-row--left"}`}>
      {!isMine && <Avatar initials={otherInitials} color="orange" size="sm" />}
      <div className="neg-msg-col">
        <div className="neg-msg-meta">
          <span className="neg-msg-name">{isMine ? (myName || "You") : (otherName || "Other")}</span>
          {msg.type === "proposal" && <StatusBadge status={msg.status || "pending"} />}
          <span className="neg-msg-time">{msg.timestamp}</span>
        </div>
        <div className={`neg-bubble ${isMine ? "neg-bubble--freelancer" : "neg-bubble--client"} ${msg.type === "counter" ? "neg-bubble--counter" : ""}`}>
          {msg.type === "counter" && (
            <div className="neg-counter-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>
              Counter Offer
            </div>
          )}
          <div className="neg-bubble-body">{renderText(msg.text)}</div>
          {(msg.bid || msg.counterBid) && (
            <div className="neg-terms-row">
              <div className="neg-term">
                <span className="neg-term-label">Bid</span>
                <span className="neg-term-val neg-term-val--green">${msg.bid || msg.counterBid}</span>
              </div>
              <div className="neg-term-divider" />
              <div className="neg-term">
                <span className="neg-term-label">Timeline</span>
                <span className="neg-term-val">{msg.timeline || msg.counterTimeline} days</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {isMine && <Avatar initials={myInitials} color="blue" size="sm" />}
    </div>
  );
};

// ─── FINALIZED BANNER ─────────────────────────────────────────
const FinalizedBanner = ({ deal, onViewContract }) => (
  <div className="neg-finalized-banner">
    <div className="neg-finalized-icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
    <div className="neg-finalized-info">
      <h3>Deal Finalized!</h3>
      <p>Both parties agreed on <strong>${deal.bid}</strong> over <strong>{deal.timeline} days</strong>. The project is now active.</p>
    </div>
    <button className="neg-contract-btn" onClick={onViewContract}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      View Contract
    </button>
  </div>
);

// ─── DIGITAL SIGNATURE CANVAS ─────────────────────────────────
const SignatureCanvas = ({ onSave, onClear, label }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(false);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
    setHasSig(true);
  };

  const end = () => {
    setDrawing(false);
    if (hasSig) {
      onSave(canvasRef.current.toDataURL());
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSig(false);
    onClear();
  };

  return (
    <div className="neg-sig-wrap">
      <div className="neg-sig-label">{label}</div>
      <canvas
        ref={canvasRef}
        width={280}
        height={100}
        className="neg-sig-canvas"
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={draw}
        onTouchEnd={end}
      />
      <div className="neg-sig-actions">
        <button className="neg-sig-clear" onClick={clear}>Clear</button>
        {hasSig && <span className="neg-sig-done">✓ Signed</span>}
      </div>
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────
const ProposalSidebar = ({ project, currentTerms, negotiationStatus, onAccept, onReject, isFinalized, deal, isClient }) => {
  const catColor = categoryColors[project.category] || { bg: "#f1f5f9", color: "#475569" };

  return (
    <div className="neg-sidebar">
      <div className="neg-sidebar-card">
        <div className="neg-sidebar-section-title">Project</div>
        <div className="neg-project-info">
          <span className="neg-project-badge" style={{ background: catColor.bg, color: catColor.color }}>{project.sub_category}</span>
          <p className="neg-project-name">{project.title}</p>
          <div className="neg-project-meta-row">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {project.client_name}
          </div>
        </div>
      </div>

      <div className="neg-sidebar-card">
        <div className="neg-sidebar-section-title">
          {isFinalized ? "Agreed Terms" : "Latest Terms"}
          {isFinalized && <span className="neg-finalized-chip">✓ Final</span>}
        </div>
        <div className="neg-terms-grid">
          <div className="neg-terms-item">
            <span className="neg-terms-item-label">Bid Amount</span>
            <span className={`neg-terms-item-val ${isFinalized ? "green" : ""}`}>${isFinalized ? deal.bid : currentTerms.bid}</span>
          </div>
          <div className="neg-terms-item">
            <span className="neg-terms-item-label">Timeline</span>
            <span className="neg-terms-item-val">{isFinalized ? deal.timeline : currentTerms.timeline} days</span>
          </div>
          <div className="neg-terms-item">
            <span className="neg-terms-item-label">Budget</span>
            <span className="neg-terms-item-val gray">{project.budget}</span>
          </div>
          <div className="neg-terms-item">
            <span className="neg-terms-item-label">Deadline</span>
            <span className="neg-terms-item-val gray">{project.deadline}</span>
          </div>
        </div>
      </div>

      {/* Client: bisa accept/reject kalau freelancer yang terakhir kirim */}
      {!isFinalized && isClient && negotiationStatus === "awaiting_client" && (
        <div className="neg-sidebar-card neg-sidebar-actions">
          <div className="neg-sidebar-section-title">Respond to Proposal</div>
          <p className="neg-action-hint">The freelancer has submitted a proposal. You can accept, counter, or reject.</p>
          <button className="neg-accept-btn" onClick={onAccept}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Accept Terms
          </button>
          <button className="neg-reject-btn" onClick={onReject}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Reject Proposal
          </button>
        </div>
      )}

      {/* Freelancer: bisa accept kalau client yang terakhir kirim counter */}
      {!isFinalized && !isClient && negotiationStatus === "awaiting_freelancer" && (
        <div className="neg-sidebar-card neg-sidebar-actions">
          <div className="neg-sidebar-section-title">Respond to Counter Offer</div>
          <p className="neg-action-hint">The client has proposed new terms. You can accept, counter, or reject.</p>
          <button className="neg-accept-btn" onClick={onAccept}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Accept These Terms
          </button>
          <button className="neg-reject-btn" onClick={onReject}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Reject Proposal
          </button>
        </div>
      )}

      <div className="neg-sidebar-card">
        <div className="neg-sidebar-section-title">Timeline</div>
        <div className="neg-timeline">
          <div className="neg-timeline-item neg-timeline-item--done">
            <div className="neg-tl-dot" />
            <div><p className="neg-tl-label">Proposal Sent</p><p className="neg-tl-time">Done</p></div>
          </div>
          <div className={`neg-timeline-item ${negotiationStatus !== "pending" ? "neg-timeline-item--done" : "neg-timeline-item--active"}`}>
            <div className="neg-tl-dot" />
            <div><p className="neg-tl-label">Negotiating</p><p className="neg-tl-time">{negotiationStatus !== "pending" ? "Ongoing" : "Waiting…"}</p></div>
          </div>
          <div className={`neg-timeline-item ${isFinalized ? "neg-timeline-item--done" : "neg-timeline-item--inactive"}`}>
            <div className="neg-tl-dot" />
            <div><p className="neg-tl-label">Deal Finalized</p><p className="neg-tl-time">{isFinalized ? "Done" : "Pending"}</p></div>
          </div>
          <div className={`neg-timeline-item ${isFinalized ? "neg-timeline-item--active" : "neg-timeline-item--inactive"}`}>
            <div className="neg-tl-dot" />
            <div><p className="neg-tl-label">Project Active</p><p className="neg-tl-time">{isFinalized ? "Active" : "Pending"}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── COUNTER FORM ─────────────────────────────────────────────
const CounterForm = ({ initialBid, initialDays, onSubmit, onCancel, isLoading }) => {
  const [bid, setBid] = useState(initialBid);
  const [days, setDays] = useState(initialDays);
  const [note, setNote] = useState("");
  return (
    <div className="neg-counter-form">
      <div className="neg-counter-form-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>
        Send Counter Offer
      </div>
      <div className="neg-counter-fields">
        <div className="neg-counter-field">
          <label>Bid Amount</label>
          <div className="neg-cf-input-wrap">
            <span>$</span>
            <input type="number" value={bid} onChange={e => setBid(e.target.value)} min="1" />
          </div>
        </div>
        <div className="neg-counter-field">
          <label>Delivery Days</label>
          <div className="neg-cf-input-wrap">
            <input type="number" value={days} onChange={e => setDays(e.target.value)} min="1" />
            <span>days</span>
          </div>
        </div>
      </div>
      <div className="neg-counter-field" style={{ marginTop: 12 }}>
        <label>Message <span className="optional">optional</span></label>
        <textarea rows={3} placeholder="Explain your counter offer..." value={note} onChange={e => setNote(e.target.value)} />
      </div>
      <div className="neg-counter-actions">
        <button className="neg-cancel-btn" onClick={onCancel}>Cancel</button>
        <button className="neg-submit-counter-btn" onClick={() => onSubmit({ bid: parseInt(bid), timeline: parseInt(days), note })} disabled={isLoading}>
          {isLoading ? <span className="neg-spinner" /> : (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Send Counter</>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── GROQ AI HELPERS ──────────────────────────────────────────
async function generateAIDraft(context) {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  const historyText = context.messages
    .filter(m => m.type !== "system")
    .map(m => {
      const who = m.sender === "freelancer" ? context.freelancerName + " (Freelancer)" : context.clientName + " (Client)";
      const terms = (m.bid || m.counterBid) ? ` [Bid: $${m.bid || m.counterBid}, ${m.timeline || m.counterTimeline} days]` : "";
      return `${who}: ${m.text}${terms}`;
    }).join("\n\n");

  const systemPrompt = context.isClient
    ? `You are ${context.clientName}, a client reviewing a freelancer's proposal for "${context.projectTitle}". Your budget is ${context.budget}. Write a short, professional, realistic reply as the CLIENT. You can ask for clarification, negotiate, or express interest. Keep it 2-3 sentences.`
    : `You are a freelancer negotiating professionally with client ${context.clientName} for project "${context.projectTitle}". Write a concise, friendly reply that acknowledges their message and moves the negotiation forward. Keep it 2-3 paragraphs.`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + GROQ_API_KEY },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      max_tokens: 350,
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Conversation so far:\n\n${historyText}\n\nNow write your reply:` },
      ],
    }),
  });
  if (!response.ok) throw new Error("Groq API error");
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// ─── MAIN COMPONENT ───────────────────────────────────────────
export default function ProposalNegotiation() {
  const navigate = useNavigate();
  const { id, proposal_id } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [project, setProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [showContract, setShowContract] = useState(false);

  // Baca data dari sessionStorage (dari ProposalGenerator)
  const savedProposal = JSON.parse(sessionStorage.getItem("activeProposal") || "{}");
  const proposalText = savedProposal.proposalText || "Hi, I'd love to work on your project. Please see my proposal above.";
  const freelancerBid = savedProposal.bid || 200;
  const freelancerTimeline = savedProposal.timeline || 14;
  const freelancerName = savedProposal.freelancerName || user?.name || "Freelancer";

  const [messages, setMessages] = useState([
    { id: 1, sender: "freelancer", type: "proposal", text: proposalText, bid: freelancerBid, timeline: freelancerTimeline, timestamp: "Just now", status: "pending" },
  ]);
  const [composerMode, setComposerMode] = useState("message");
  const [composerText, setComposerText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isAISuggesting, setIsAISuggesting] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [deal, setDeal] = useState(null);
  const [sigFreelancer, setSigFreelancer] = useState(null);
  const [sigClient, setSigClient] = useState(null);
  const chatBottomRef = useRef(null);

  // ── Load project ──
  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetch(`http://localhost:3001/api/projects/${id}`)
      .then(res => res.json())
      .then(data => setProject(data))
      .catch(err => console.error(err))
      .finally(() => setLoadingProject(false));
  }, [id]);

  // ── Load negotiation dari database ──
  useEffect(() => {
    if (!proposal_id || !token) return;
    fetch(`http://localhost:3001/api/negotiations/proposal/${proposal_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.messages && data.messages.length > 0) {
          setMessages(data.messages);
          if (data.status === "finalized") {
            setIsFinalized(true);
            setDeal({ bid: data.final_bid, timeline: data.final_timeline });
          }
        }
      })
      .catch(err => console.error("Gagal load negotiation:", err));
  }, [proposal_id]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── Save negotiation ──
  const saveNegotiation = async (updatedMessages, status = "ongoing", finalBid = null, finalTimeline = null) => {
    if (!proposal_id || !token) return;
    try {
      await fetch(`http://localhost:3001/api/negotiations/proposal/${proposal_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: updatedMessages, status, final_bid: finalBid, final_timeline: finalTimeline }),
      });
    } catch (err) {
      console.error("Gagal save negotiation:", err);
    }
  };

  // ── Detect role ──
  // isClient = user yang login adalah pemilik project
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    if (project && user) {
      setIsClient(project.client_id === user.id);
    }
  }, [project, user]);

  const myInitials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "ME";
  const otherInitials = isClient
    ? (freelancerName ? freelancerName.split(" ").map(n => n[0]).join("").toUpperCase() : "F")
    : (project?.client_name ? project.client_name.split(" ").map(n => n[0]).join("").toUpperCase() : "C");

  const lastCounter = [...messages].reverse().find(m => m.counterBid || m.bid);
  const currentTerms = {
    bid: lastCounter?.counterBid || lastCounter?.bid || freelancerBid,
    timeline: lastCounter?.counterTimeline || lastCounter?.timeline || freelancerTimeline,
  };

  const lastMsg = messages[messages.length - 1];
  // negotiationStatus dari perspektif kedua pihak
  const negotiationStatus = isFinalized
    ? "finalized"
    : lastMsg?.sender === "client"
      ? "awaiting_freelancer"
      : "awaiting_client";

  // ── Send message (dari siapapun yang login) ──
  const handleSendMessage = () => {
    if (!composerText.trim()) return;
    const sender = isClient ? "client" : "freelancer";
    const newMsg = { id: messages.length + 1, sender, type: "message", text: composerText.trim(), timestamp: "Just now" };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setComposerText("");
    saveNegotiation(updatedMessages);
  };

  // ── Send counter (dari siapapun yang login) ──
  const handleSendCounter = ({ bid, timeline, note }) => {
    setIsSending(true);
    setTimeout(() => {
      const sender = isClient ? "client" : "freelancer";
      const newMsg = {
        id: messages.length + 1, sender, type: "counter",
        text: note || `I'd like to propose $${bid} over ${timeline} days.`,
        ...(isClient ? { counterBid: bid, counterTimeline: timeline } : { bid, timeline }),
        timestamp: "Just now"
      };
      const updatedMessages = [...messages, newMsg];
      setMessages(updatedMessages);
      setComposerMode("message");
      setIsSending(false);
      saveNegotiation(updatedMessages);
    }, 600);
  };

  // ── Accept terms ──
  const handleAccept = () => {
    const acceptedDeal = { bid: currentTerms.bid, timeline: currentTerms.timeline };
    const systemMsg = {
      id: messages.length + 1, sender: "system", type: "system",
      systemLabel: "Terms Accepted",
      text: `Both parties have agreed on $${acceptedDeal.bid} with a ${acceptedDeal.timeline}-day delivery. The project is now active!`,
      timestamp: "Just now"
    };
    const updatedMessages = [...messages, systemMsg];
    setMessages(updatedMessages);
    setDeal(acceptedDeal);
    setIsFinalized(true);
    saveNegotiation(updatedMessages, "finalized", acceptedDeal.bid, acceptedDeal.timeline);
  };

  // ── Reject ──
  const handleReject = () => {
    const systemMsg = {
      id: messages.length + 1, sender: "system", type: "system",
      systemLabel: "Proposal Rejected",
      text: "The proposal has been rejected. You can send a new counter offer or close the negotiation.",
      timestamp: "Just now"
    };
    setMessages(prev => [...prev, systemMsg]);
  };

  // ── AI Draft ──
  const handleAISuggest = async () => {
    if (!project) return;
    setIsAISuggesting(true);
    try {
      const text = await generateAIDraft({
        isClient,
        clientName: project.client_name,
        freelancerName,
        projectTitle: project.title,
        budget: project.budget,
        messages,
      });
      setComposerText(text);
    } catch {
      setComposerText("Thank you for your message. I'd like to discuss the terms further and find a solution that works for both of us.");
    } finally {
      setIsAISuggesting(false);
    }
  };

  // ── Download PDF ──
  const handleDownloadPDF = () => {
    const finalizedDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const sigFreelancerHTML = sigFreelancer ? `<img src="${sigFreelancer}" style="height:60px;display:block;margin-top:8px;" />` : '<div style="height:60px;border-bottom:1px solid #cbd5e1;margin-top:8px;"></div>';
    const sigClientHTML = sigClient ? `<img src="${sigClient}" style="height:60px;display:block;margin-top:8px;" />` : '<div style="height:60px;border-bottom:1px solid #cbd5e1;margin-top:8px;"></div>';

    const htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Contract - ${project?.title}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1e293b;padding:48px}.logo{font-size:22px;font-weight:800;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #e2e8f0}.logo span{color:#6366f1}.tag{font-size:11px;font-weight:700;letter-spacing:2px;color:#94a3b8;text-transform:uppercase;margin-bottom:12px}.contract-title{font-size:28px;font-weight:800;margin:8px 0 28px}.parties{display:flex;margin-bottom:32px;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden}.party{flex:1;padding:20px 24px;background:#f8fafc}.party:first-child{border-right:1px solid #e2e8f0}.party-label{font-size:10px;font-weight:700;letter-spacing:1.5px;color:#94a3b8;text-transform:uppercase;margin-bottom:6px}.party-name{font-size:17px;font-weight:700}.divider{height:1px;background:#e2e8f0;margin:28px 0}.terms-row{display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid #f1f5f9}.terms-label{font-size:14px;color:#64748b}.terms-val{font-size:15px;font-weight:700}.green{color:#16a34a}.sig-section{display:flex;gap:48px;margin-top:40px}.sig-box{flex:1}.sig-label{font-size:11px;font-weight:700;letter-spacing:1px;color:#94a3b8;text-transform:uppercase;margin-bottom:8px}.sig-name{font-size:13px;color:#64748b;margin-top:8px}.note{font-size:12px;color:#94a3b8;text-align:center;margin-top:32px}</style></head><body>
    <div class="logo">Proposal<span>in</span></div>
    <div class="tag">FREELANCE CONTRACT</div>
    <h1 class="contract-title">${project?.title}</h1>
    <div class="parties"><div class="party"><div class="party-label">Client</div><div class="party-name">${project?.client_name}</div></div><div class="party"><div class="party-label">Freelancer</div><div class="party-name">${freelancerName}</div></div></div>
    <div class="divider"></div>
    <div class="terms-row"><span class="terms-label">Project</span><span class="terms-val">${project?.title}</span></div>
    <div class="terms-row"><span class="terms-label">Category</span><span class="terms-val">${project?.sub_category}</span></div>
    <div class="terms-row"><span class="terms-label">Agreed Bid</span><span class="terms-val green">$${deal?.bid}</span></div>
    <div class="terms-row"><span class="terms-label">Delivery</span><span class="terms-val">${deal?.timeline} days from start</span></div>
    <div class="terms-row"><span class="terms-label">Revisions</span><span class="terms-val">Up to 3 rounds</span></div>
    <div class="divider"></div>
    <div class="sig-section">
      <div class="sig-box"><div class="sig-label">Freelancer Signature</div>${sigFreelancerHTML}<div class="sig-name">${freelancerName}</div></div>
      <div class="sig-box"><div class="sig-label">Client Signature</div>${sigClientHTML}<div class="sig-name">${project?.client_name}</div></div>
    </div>
    <p class="note">This contract was finalized on ${finalizedDate} via Proposalin.</p>
    </body></html>`;

    const win = window.open("", "_blank");
    win.document.write(htmlContent);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  if (loadingProject || !project) return (
    <div className="pg-page"><Navbar />
      <p style={{ textAlign: "center", padding: "4rem", color: "#888" }}>Loading...</p>
    </div>
  );

  const catColor = categoryColors[project.category] || { bg: "#f1f5f9", color: "#475569" };

  // ── CONTRACT MODAL ──
  if (showContract && isFinalized) {
    return (
      <div className="pg-page">
        <Navbar />
        <div className="neg-contract-overlay">
          <div className="neg-contract-modal">
            <div className="neg-contract-modal-header">
              <div className="neg-contract-logo">Proposal<span>in</span></div>
              <button className="neg-contract-close" onClick={() => setShowContract(false)}>✕</button>
            </div>
            <div className="neg-contract-body">
              <div className="neg-contract-tag">FREELANCE CONTRACT</div>
              <h2 className="neg-contract-title">{project.title}</h2>
              <div className="neg-contract-parties">
                <div className="neg-contract-party">
                  <span className="neg-cp-label">Client</span>
                  <span className="neg-cp-val">{project.client_name}</span>
                </div>
                <div className="neg-contract-arrow">↔</div>
                <div className="neg-contract-party">
                  <span className="neg-cp-label">Freelancer</span>
                  <span className="neg-cp-val">{freelancerName}</span>
                </div>
              </div>
              <div className="neg-contract-divider" />
              <div className="neg-contract-terms">
                <div className="neg-ct-row"><span>Project</span><strong>{project.title}</strong></div>
                <div className="neg-ct-row"><span>Category</span><strong>{project.sub_category}</strong></div>
                <div className="neg-ct-row"><span>Agreed Bid</span><strong className="green">${deal?.bid}</strong></div>
                <div className="neg-ct-row"><span>Delivery</span><strong>{deal?.timeline} days from start</strong></div>
                <div className="neg-ct-row"><span>Revisions</span><strong>Up to 3 rounds</strong></div>
                <div className="neg-ct-row"><span>Status</span><strong className="green">Active ✓</strong></div>
              </div>
              <div className="neg-contract-divider" />

              {/* ── DIGITAL SIGNATURES ── */}
              <div className="neg-sig-section">
                <div className="neg-sig-section-title">Digital Signatures</div>
                <p className="neg-sig-hint">Both parties must sign to finalize the contract. Draw your signature below.</p>
                <div className="neg-sig-row">
                  <SignatureCanvas
                    label={`Freelancer — ${freelancerName}`}
                    onSave={setSigFreelancer}
                    onClear={() => setSigFreelancer(null)}
                  />
                  <SignatureCanvas
                    label={`Client — ${project.client_name}`}
                    onSave={setSigClient}
                    onClear={() => setSigClient(null)}
                  />
                </div>
                {sigFreelancer && sigClient && (
                  <p className="neg-sig-both-done">✓ Both parties have signed. You can now download the contract.</p>
                )}
              </div>

              <div className="neg-contract-divider" />
              <p className="neg-contract-note">
                This contract was finalized on {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} via Proposalin.
              </p>
              <div className="neg-contract-actions">
                <button
                  className="neg-dl-btn"
                  onClick={handleDownloadPDF}
                  disabled={!sigFreelancer || !sigClient}
                  title={!sigFreelancer || !sigClient ? "Both parties must sign first" : "Download PDF"}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download PDF {(!sigFreelancer || !sigClient) && "(Sign first)"}
                </button>
                <button className="neg-close-btn" onClick={() => setShowContract(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pg-page">
      <Navbar />
      <div className="neg-body">

        <div className="neg-header">
          <button className="pg-back-btn" onClick={() => navigate("/dashboard")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Dashboard
          </button>
          <div className="neg-header-top">
            <div className="neg-header-info">
              <div className="neg-project-chip">
                <span className="pg-chip-badge" style={{ background: catColor.bg, color: catColor.color }}>{project.sub_category}</span>
                <span className="pg-chip-title">{project.title}</span>
                <span className="pg-chip-client">· {project.client_name}</span>
              </div>
              <h1 className="neg-title">Proposal Negotiation</h1>
              <p className="neg-subtitle">
                {isClient
                  ? `You are reviewing this proposal as the client. Discuss terms with ${freelancerName}.`
                  : `Discuss terms with ${project.client_name} and finalize your agreement.`}
              </p>
            </div>
            <StatusBadge status={isFinalized ? "finalized" : negotiationStatus === "awaiting_freelancer" ? "countered" : "pending"} />
          </div>
        </div>

        <div className="neg-layout">
          <div className="neg-chat-panel">
            <div className="neg-chat-header">
              <div className="neg-chat-header-left">
                <div className="neg-online-dot" />
                <span>Negotiation Chat</span>
                <span className="neg-role-indicator">{isClient ? "👔 Viewing as Client" : "💼 Viewing as Freelancer"}</span>
              </div>
              <span className="neg-msg-count">{messages.length} messages</span>
            </div>

            <div className="neg-messages">
              {messages.map(msg => {
                if (msg.type === "system") {
                  return (
                    <div key={msg.id} className="neg-system-msg">
                      <div className={`neg-system-msg-inner ${msg.systemLabel?.includes("Rejected") ? "neg-system-msg-inner--reject" : "neg-system-msg-inner--accept"}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          {msg.systemLabel?.includes("Rejected")
                            ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                            : <polyline points="20 6 9 17 4 12"/>}
                        </svg>
                        <span className="neg-system-label">{msg.systemLabel}</span>
                        <span className="neg-system-text">{msg.text}</span>
                      </div>
                    </div>
                  );
                }

                // Tentukan apakah pesan ini dari "saya" (user yang login)
                const isMine = isClient
                  ? msg.sender === "client"
                  : msg.sender === "freelancer";

                return (
                  <ProposalBubble
                    key={msg.id}
                    msg={msg}
                    isMine={isMine}
                    myInitials={myInitials}
                    otherInitials={otherInitials}
                    myName={isClient ? project.client_name : freelancerName}
                    otherName={isClient ? freelancerName : project.client_name}
                  />
                );
              })}

              {isTyping && (
                <div className="neg-msg-row neg-msg-row--left">
                  <Avatar initials={otherInitials} color="orange" size="sm" />
                  <div className="neg-typing-bubble"><span /><span /><span /></div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {isFinalized && <FinalizedBanner deal={deal} onViewContract={() => setShowContract(true)} />}

            {!isFinalized && (
              <div className="neg-composer">
                {composerMode === "counter" ? (
                  <CounterForm
                    initialBid={currentTerms.bid}
                    initialDays={currentTerms.timeline}
                    onSubmit={handleSendCounter}
                    onCancel={() => setComposerMode("message")}
                    isLoading={isSending}
                  />
                ) : (
                  <>
                    <div className="neg-composer-toolbar">
                      <button className={`neg-toolbar-btn ${composerMode === "message" ? "active" : ""}`} onClick={() => setComposerMode("message")}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        Message
                      </button>
                      <button className="neg-toolbar-btn neg-toolbar-btn--counter" onClick={() => setComposerMode("counter")}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>
                        Counter Offer
                      </button>
                      <button className="neg-toolbar-btn neg-toolbar-btn--ai" onClick={handleAISuggest} disabled={isAISuggesting}>
                        {isAISuggesting ? <span className="neg-spinner neg-spinner--sm neg-spinner--dark" /> : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                        )}
                        AI Draft Reply
                      </button>
                    </div>
                    <div className="neg-composer-input-row">
                      <textarea
                        className="neg-composer-textarea"
                        placeholder={isClient ? `Reply to ${freelancerName}…` : `Reply to ${project.client_name}…`}
                        value={composerText}
                        onChange={e => setComposerText(e.target.value)}
                        rows={3}
                        onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSendMessage(); }}
                      />
                      <button className="neg-send-msg-btn" onClick={handleSendMessage} disabled={!composerText.trim()}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      </button>
                    </div>
                    <p className="neg-composer-hint">⌘ + Enter to send</p>
                  </>
                )}
              </div>
            )}
          </div>

          <ProposalSidebar
            project={project}
            currentTerms={currentTerms}
            negotiationStatus={negotiationStatus}
            onAccept={handleAccept}
            onReject={handleReject}
            isFinalized={isFinalized}
            deal={deal}
            isClient={isClient}
          />
        </div>
      </div>
    </div>
  );
}
