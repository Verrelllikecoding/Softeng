import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProposalNegotiation.css";

// ─── MOCK DATA ────────────────────────────────────────────────
const PROJECTS = {
  1: { id: 1, title: "E-Commerce Fashion Landing Page", sub: "Web Development", category: "Technology", budget: "$200", deadline: "Apr 15, 2025", client: "Andi Wijaya", clientAvatar: "AW" },
  2: { id: 2, title: "ML Product Recommendation System", sub: "Machine Learning", category: "Technology", budget: "$800", deadline: "Apr 30, 2025", client: "Startup Teknologi", clientAvatar: "ST" },
  3: { id: 3, title: "Admin Dashboard UI Redesign", sub: "UI/UX Design", category: "Design & Creative", budget: "$330", deadline: "Apr 20, 2025", client: "Budi Santoso", clientAvatar: "BS" },
};

const categoryColors = {
  "Technology": { bg: "#e0f2fe", color: "#0369a1" },
  "Design & Creative": { bg: "#fdf4ff", color: "#7e22ce" },
  "Marketing": { bg: "#f0fdf4", color: "#15803d" },
  "Business & Consulting": { bg: "#fff7ed", color: "#c2410c" },
};

// ─── NAVBAR ───────────────────────────────────────────────────
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

// ─── PROPOSAL BUBBLE ──────────────────────────────────────────
const ProposalBubble = ({ msg, clientInitials, freelancerName }) => {
  const isFreelancer = msg.sender === "freelancer";
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

  return (
    <div className={`neg-msg-row ${isFreelancer ? "neg-msg-row--right" : "neg-msg-row--left"}`}>
      {!isFreelancer && <Avatar initials={clientInitials} color="orange" size="sm" />}
      <div className="neg-msg-col">
        <div className="neg-msg-meta">
          <span className="neg-msg-name">{isFreelancer ? (freelancerName || "You") : "Client"}</span>
          {msg.type === "proposal" && <StatusBadge status={msg.status || "pending"} />}
          <span className="neg-msg-time">{msg.timestamp}</span>
        </div>
        <div className={`neg-bubble ${isFreelancer ? "neg-bubble--freelancer" : "neg-bubble--client"} ${msg.type === "counter" ? "neg-bubble--counter" : ""}`}>
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
      {isFreelancer && <Avatar initials="ME" color="blue" size="sm" />}
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

// ─── SIDEBAR ──────────────────────────────────────────────────
const ProposalSidebar = ({ project, currentTerms, status, onAccept, onReject, isFinalized, deal }) => {
  const catColor = categoryColors[project.category] || { bg: "#f1f5f9", color: "#475569" };
  return (
    <div className="neg-sidebar">
      <div className="neg-sidebar-card">
        <div className="neg-sidebar-section-title">Project</div>
        <div className="neg-project-info">
          <span className="neg-project-badge" style={{ background: catColor.bg, color: catColor.color }}>{project.sub}</span>
          <p className="neg-project-name">{project.title}</p>
          <div className="neg-project-meta-row">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {project.client}
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
            <span className="neg-terms-item-label">Client Budget</span>
            <span className="neg-terms-item-val gray">{project.budget}</span>
          </div>
          <div className="neg-terms-item">
            <span className="neg-terms-item-label">Deadline</span>
            <span className="neg-terms-item-val gray">{project.deadline}</span>
          </div>
        </div>
      </div>

      {!isFinalized && status === "awaiting_freelancer" && (
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
            <div><p className="neg-tl-label">Proposal Sent</p><p className="neg-tl-time">Just now</p></div>
          </div>
          <div className={`neg-timeline-item ${status !== "pending" ? "neg-timeline-item--done" : "neg-timeline-item--active"}`}>
            <div className="neg-tl-dot" />
            <div><p className="neg-tl-label">Client Responded</p><p className="neg-tl-time">{status !== "pending" ? "Just now" : "Waiting…"}</p></div>
          </div>
          <div className={`neg-timeline-item ${isFinalized ? "neg-timeline-item--done" : "neg-timeline-item--inactive"}`}>
            <div className="neg-tl-dot" />
            <div><p className="neg-tl-label">Negotiation Complete</p><p className="neg-tl-time">{isFinalized ? "Just now" : "Pending"}</p></div>
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
          <label>Your Bid</label>
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

// ─── GROQ API HELPERS ─────────────────────────────────────────

// AI Draft Reply untuk freelancer
async function generateAIReply(context) {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  const counterBid = context.latestCounter?.counterBid || context.latestCounter?.bid;
  const counterTimeline = context.latestCounter?.counterTimeline || context.latestCounter?.timeline;
  const counterMsg = context.latestCounter?.note || context.latestCounter?.text || "";

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + GROQ_API_KEY,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      max_tokens: 400,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "You are helping a freelancer negotiate professionally. Write concise, friendly replies. No markdown headers.",
        },
        {
          role: "user",
          content: "Project: " + context.projectTitle +
            "\nClient counter: $" + counterBid + " / " + counterTimeline + " days" +
            "\nClient message: " + counterMsg +
            "\nMy original bid: $" + context.myBid + " / " + context.myDays + " days" +
            "\n\nWrite a professional 3-4 paragraph reply: acknowledge feedback, propose middle-ground, end collaboratively.",
        },
      ],
    }),
  });
  if (!response.ok) throw new Error("Groq API error");
  const data = await response.json();
  return { text: data.choices?.[0]?.message?.content || "" };
}

// AI Client Auto-Reply — simulasi respon dari client
async function generateClientReply(context) {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  // Buat history percakapan sebagai string — label jelas siapa yang ngomong
  const historyText = context.messages
    .filter(m => m.type !== "system")
    .map(m => {
      const who = m.sender === "freelancer" ? context.freelancerName + " (Freelancer)" : context.clientName + " (Client)";
      const terms = (m.bid || m.counterBid) ? " [Bid: $" + (m.bid || m.counterBid) + ", " + (m.timeline || m.counterTimeline) + " days]" : "";
      return who + ": " + m.text + terms;
    })
    .join("\n\n");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + GROQ_API_KEY,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      max_tokens: 350,
      temperature: 0.85,
      messages: [
        {
          role: "system",
          content: `You are ${context.clientName}, a client negotiating with a freelancer for a project called "${context.projectTitle}".
Your budget is ${context.budget}. Be realistic and human — sometimes push back, sometimes agree if the offer is fair.

IMPORTANT — respond in ONE of these formats depending on the situation:
1. If you want to COUNTER with new numbers, start your reply with "COUNTER:[bid]:[days]:" then your message. Example: "COUNTER:250:12:Thanks for the revision..."
2. If you want to ACCEPT the current terms, start with "ACCEPT:" then your message. Example: "ACCEPT:Sounds great, let's do it!"
3. If you just want to chat/ask questions, just write normally without any prefix.

Rules:
- Accept if freelancer's bid is within 15% of your budget AND timeline is reasonable
- Counter if the numbers are close but not quite right
- Ask questions if you need more info
- Keep it short (2-3 sentences), conversational, no markdown`,
        },
        {
          role: "user",
          content: "You are " + context.clientName + " (the CLIENT). The freelancer " + context.freelancerName + " sent you a proposal.\n\nConversation so far:\n\n" + historyText + "\n\nNow write YOUR reply as " + context.clientName + " (the client, NOT the freelancer):",
        },
      ],
    }),
  });

  if (!response.ok) throw new Error("Groq API error");
  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || "";

  // Parse response dari AI
  if (raw.startsWith("ACCEPT:")) {
    return {
      type: "accept",
      text: raw.replace("ACCEPT:", "").trim(),
    };
  } else if (raw.startsWith("COUNTER:")) {
    // Format: COUNTER:bid:days:message
    const parts = raw.split(":");
    const counterBid = parseInt(parts[1]) || context.currentBid;
    const counterDays = parseInt(parts[2]) || context.currentTimeline;
    const text = parts.slice(3).join(":").trim();
    return {
      type: "counter",
      text,
      counterBid,
      counterTimeline: counterDays,
    };
  } else {
    return {
      type: "message",
      text: raw,
    };
  }
}

// ─── MAIN COMPONENT ───────────────────────────────────────────
export default function ProposalNegotiation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const project = PROJECTS[parseInt(id)] || PROJECTS[1];
  const catColor = categoryColors[project.category] || { bg: "#f1f5f9", color: "#475569" };

  // ── Baca data proposal dari ProposalGenerator via sessionStorage ──
  const savedProposal = JSON.parse(sessionStorage.getItem("activeProposal") || "{}");
  const proposalText = savedProposal.proposalText || "Hi, I'd love to work on your project. Please see my proposal above.";
  const freelancerBid = savedProposal.bid || parseInt(project.budget.replace(/[^0-9]/g, "")) || 200;
  const freelancerTimeline = savedProposal.timeline || 14;
  const freelancerName = savedProposal.freelancerName || "You";

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "freelancer",
      type: "proposal",
      text: proposalText,
      bid: freelancerBid,
      timeline: freelancerTimeline,
      timestamp: "Just now",
      status: "pending",
    },
  ]);

  const [composerMode, setComposerMode] = useState("message");
  const [composerText, setComposerText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isAISuggesting, setIsAISuggesting] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [deal, setDeal] = useState(null);
  const [showContract, setShowContract] = useState(false);

  const chatBottomRef = useRef(null);

  // Derived state
  const lastCounter = [...messages].reverse().find(m => m.counterBid || m.bid);
  const currentTerms = {
    bid: lastCounter?.counterBid || lastCounter?.bid || parseInt(project.budget.replace(/[^0-9]/g, "")),
    timeline: lastCounter?.counterTimeline || lastCounter?.timeline || 14,
  };
  const lastMsg = messages[messages.length - 1];
  const negotiationStatus = isFinalized ? "finalized" : lastMsg?.sender === "client" ? "awaiting_freelancer" : "pending";

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── Trigger client auto-reply setelah freelancer kirim pesan ──
  const triggerClientReply = async (updatedMessages) => {
    setIsTyping(true);

    // Jeda 2-3 detik supaya terasa natural
    await new Promise(res => setTimeout(res, 2000 + Math.random() * 1000));

    try {
      const lastFreelancerMsg = [...updatedMessages].reverse().find(m => m.sender === "freelancer");
      const context = {
        clientName: project.client,
        freelancerName: freelancerName,
        projectTitle: project.title,
        budget: project.budget,
        messages: updatedMessages,
        currentBid: lastFreelancerMsg?.bid || currentTerms.bid,
        currentTimeline: lastFreelancerMsg?.timeline || currentTerms.timeline,
      };

      const reply = await generateClientReply(context);

      setIsTyping(false);

      if (reply.type === "accept") {
        // Client accept — finalize deal otomatis
        const acceptMsg = {
          id: updatedMessages.length + 1,
          sender: "client",
          type: "message",
          text: reply.text,
          timestamp: "Just now",
        };
        const systemMsg = {
          id: updatedMessages.length + 2,
          sender: "system",
          type: "system",
          systemLabel: "Terms Accepted",
          text: "Both parties have agreed on $" + currentTerms.bid + " with a " + currentTerms.timeline + "-day delivery. The project is now active!",
          timestamp: "Just now",
        };
        setMessages(prev => [...prev, acceptMsg, systemMsg]);
        setDeal({ bid: currentTerms.bid, timeline: currentTerms.timeline });
        setIsFinalized(true);

      } else if (reply.type === "counter") {
        // Client counter dengan angka baru
        const counterMsg = {
          id: updatedMessages.length + 1,
          sender: "client",
          type: "counter",
          text: reply.text || "I'd like to propose different terms.",
          counterBid: reply.counterBid,
          counterTimeline: reply.counterTimeline,
          timestamp: "Just now",
        };
        setMessages(prev => [...prev, counterMsg]);

      } else {
        // Pesan biasa dari client
        const clientMsg = {
          id: updatedMessages.length + 1,
          sender: "client",
          type: "message",
          text: reply.text,
          timestamp: "Just now",
        };
        setMessages(prev => [...prev, clientMsg]);
      }

    } catch (err) {
      setIsTyping(false);
      // Fallback jika API gagal
      const fallbackMsg = {
        id: updatedMessages.length + 1,
        sender: "client",
        type: "message",
        text: "Thanks for your message! Let me review the terms and get back to you shortly.",
        timestamp: "Just now",
      };
      setMessages(prev => [...prev, fallbackMsg]);
    }
  };

  // ── Send plain message ──
  const handleSendMessage = () => {
    if (!composerText.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      sender: "freelancer",
      type: "message",
      text: composerText.trim(),
      timestamp: "Just now",
    };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setComposerText("");
    triggerClientReply(updatedMessages);
  };

  // ── Send counter offer ──
  const handleSendCounter = ({ bid, timeline, note }) => {
    setIsSending(true);
    setTimeout(() => {
      const newMsg = {
        id: messages.length + 1,
        sender: "freelancer",
        type: "counter",
        text: note || "I'd like to propose a revised offer: $" + bid + " over " + timeline + " days. I believe this reflects the full scope of work and ensures quality delivery.",
        bid,
        timeline,
        timestamp: "Just now",
      };
      const updatedMessages = [...messages, newMsg];
      setMessages(updatedMessages);
      setComposerMode("message");
      setIsSending(false);
      triggerClientReply(updatedMessages);
    }, 600);
  };

  // ── Accept counter offer (manual oleh freelancer) ──
  const handleAccept = () => {
    const acceptedDeal = { bid: currentTerms.bid, timeline: currentTerms.timeline };
    const systemMsg = {
      id: messages.length + 1,
      sender: "system",
      type: "system",
      systemLabel: "Terms Accepted",
      text: "Both parties have agreed on $" + acceptedDeal.bid + " with a " + acceptedDeal.timeline + "-day delivery. The project is now active!",
      timestamp: "Just now",
    };
    setMessages(prev => [...prev, systemMsg]);
    setDeal(acceptedDeal);
    setIsFinalized(true);
  };

  // ── Reject proposal ──
  const handleReject = () => {
    const systemMsg = {
      id: messages.length + 1,
      sender: "system",
      type: "system",
      systemLabel: "Proposal Rejected",
      text: "You have rejected this proposal. You can send a new counter offer or close the negotiation.",
      timestamp: "Just now",
    };
    setMessages(prev => [...prev, systemMsg]);
  };

  // ── AI Draft Reply untuk freelancer ──
  const handleAISuggest = async () => {
    setIsAISuggesting(true);
    try {
      const context = {
        projectTitle: project.title,
        latestCounter: lastCounter,
        myBid: messages.find(m => m.sender === "freelancer" && m.bid)?.bid || currentTerms.bid,
        myDays: messages.find(m => m.sender === "freelancer" && m.timeline)?.timeline || currentTerms.timeline,
      };
      const { text } = await generateAIReply(context);
      setComposerText(text);
    } catch {
      setComposerText("Thanks for the counter offer! I've reviewed your terms and would like to discuss a middle ground that works for both of us.");
    } finally {
      setIsAISuggesting(false);
    }
  };

  // ── Download PDF ──
  const handleDownloadPDF = () => {
    const finalizedDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    // Buat konten HTML untuk PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Contract - ${project.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; background: white; padding: 48px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 2px solid #e2e8f0; }
    .logo { font-size: 22px; font-weight: 800; color: #1e293b; }
    .logo span { color: #6366f1; }
    .tag { font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #94a3b8; text-transform: uppercase; }
    .contract-title { font-size: 28px; font-weight: 800; color: #0f172a; margin: 12px 0 28px; }
    .parties { display: flex; gap: 0; margin-bottom: 32px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    .party { flex: 1; padding: 20px 24px; background: #f8fafc; }
    .party:first-child { border-right: 1px solid #e2e8f0; }
    .party-label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px; }
    .party-name { font-size: 17px; font-weight: 700; color: #0f172a; }
    .divider { height: 1px; background: #e2e8f0; margin: 28px 0; }
    .terms-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #f1f5f9; }
    .terms-row:last-child { border-bottom: none; }
    .terms-label { font-size: 14px; color: #64748b; }
    .terms-val { font-size: 15px; font-weight: 700; color: #0f172a; }
    .terms-val.green { color: #16a34a; }
    .note { font-size: 13px; color: #94a3b8; text-align: center; line-height: 1.6; margin-top: 28px; }
    .status-active { display: inline-block; background: #dcfce7; color: #16a34a; padding: 3px 10px; border-radius: 20px; font-size: 13px; font-weight: 700; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Proposal<span>in</span></div>
    <div class="tag">Freelance Contract</div>
  </div>
  <div class="tag">FREELANCE CONTRACT</div>
  <h1 class="contract-title">${project.title}</h1>
  <div class="parties">
    <div class="party">
      <div class="party-label">Client</div>
      <div class="party-name">${project.client}</div>
    </div>
    <div class="party">
      <div class="party-label">Freelancer</div>
      <div class="party-name">${freelancerName}</div>
    </div>
  </div>
  <div class="divider"></div>
  <div class="terms-row"><span class="terms-label">Project</span><span class="terms-val">${project.title}</span></div>
  <div class="terms-row"><span class="terms-label">Category</span><span class="terms-val">${project.sub}</span></div>
  <div class="terms-row"><span class="terms-label">Agreed Bid</span><span class="terms-val green">$${deal?.bid}</span></div>
  <div class="terms-row"><span class="terms-label">Delivery</span><span class="terms-val">${deal?.timeline} days from start</span></div>
  <div class="terms-row"><span class="terms-label">Payment</span><span class="terms-val">Upon milestone approval</span></div>
  <div class="terms-row"><span class="terms-label">Revisions</span><span class="terms-val">Up to 3 rounds</span></div>
  <div class="terms-row"><span class="terms-label">Status</span><span class="terms-val"><span class="status-active">Active ✓</span></span></div>
  <div class="divider"></div>
  <p class="note">This contract was finalized on ${finalizedDate} via Proposalin.<br>Both parties agree to the terms outlined above.</p>
</body>
</html>`;

    // Buka di tab baru dan trigger print/save as PDF
    const win = window.open("", "_blank");
    win.document.write(htmlContent);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  // ── Contract Modal ──
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
                  <span className="neg-cp-val">{project.client}</span>
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
                <div className="neg-ct-row"><span>Category</span><strong>{project.sub}</strong></div>
                <div className="neg-ct-row"><span>Agreed Bid</span><strong className="green">${deal?.bid}</strong></div>
                <div className="neg-ct-row"><span>Delivery</span><strong>{deal?.timeline} days from start</strong></div>
                <div className="neg-ct-row"><span>Payment</span><strong>Upon milestone approval</strong></div>
                <div className="neg-ct-row"><span>Revisions</span><strong>Up to 3 rounds</strong></div>
                <div className="neg-ct-row"><span>Status</span><strong className="green">Active ✓</strong></div>
              </div>
              <div className="neg-contract-divider" />
              <p className="neg-contract-note">
                This contract was finalized on {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} via Proposalin.
                Both parties agree to the terms outlined above.
              </p>
              <div className="neg-contract-actions">
                <button className="neg-dl-btn" onClick={handleDownloadPDF}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download PDF
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

        {/* ── HEADER ── */}
        <div className="neg-header">
          <button className="pg-back-btn" onClick={() => navigate("/projects/" + project.id)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Project
          </button>
          <div className="neg-header-top">
            <div className="neg-header-info">
              <div className="neg-project-chip">
                <span className="pg-chip-badge" style={{ background: catColor.bg, color: catColor.color }}>{project.sub}</span>
                <span className="pg-chip-title">{project.title}</span>
                <span className="pg-chip-client">· {project.client}</span>
              </div>
              <h1 className="neg-title">Proposal Negotiation</h1>
              <p className="neg-subtitle">
                Discuss terms, send counter offers, and finalize your agreement with {project.client}.
              </p>
            </div>
            <StatusBadge status={isFinalized ? "finalized" : negotiationStatus === "awaiting_freelancer" ? "countered" : "pending"} />
          </div>
        </div>

        {/* ── LAYOUT ── */}
        <div className="neg-layout">

          {/* ── CHAT PANEL ── */}
          <div className="neg-chat-panel">

            {/* Chat Header */}
            <div className="neg-chat-header">
              <div className="neg-chat-header-left">
                <div className="neg-online-dot" />
                <span>Negotiation Chat</span>
              </div>
              <span className="neg-msg-count">{messages.length} messages</span>
            </div>

            {/* Messages */}
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
                return (
                  <ProposalBubble
                    key={msg.id}
                    msg={msg}
                    clientInitials={project.clientAvatar}
                    freelancerName={freelancerName}
                  />
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="neg-msg-row neg-msg-row--left">
                  <Avatar initials={project.clientAvatar} color="orange" size="sm" />
                  <div className="neg-typing-bubble">
                    <span /><span /><span />
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Finalized Banner */}
            {isFinalized && (
              <FinalizedBanner deal={deal} onViewContract={() => setShowContract(true)} />
            )}

            {/* Composer */}
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
                      <button
                        className={`neg-toolbar-btn ${composerMode === "message" ? "active" : ""}`}
                        onClick={() => setComposerMode("message")}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        Message
                      </button>
                      <button
                        className="neg-toolbar-btn neg-toolbar-btn--counter"
                        onClick={() => setComposerMode("counter")}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>
                        Counter Offer
                      </button>
                      <button
                        className="neg-toolbar-btn neg-toolbar-btn--ai"
                        onClick={handleAISuggest}
                        disabled={isAISuggesting || isTyping}
                        title="Let AI draft a reply based on the conversation"
                      >
                        {isAISuggesting ? (
                          <span className="neg-spinner neg-spinner--sm neg-spinner--dark" />
                        ) : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                        )}
                        AI Draft Reply
                      </button>
                    </div>
                    <div className="neg-composer-input-row">
                      <textarea
                        className="neg-composer-textarea"
                        placeholder={isTyping ? project.client + " is typing..." : "Reply to " + project.client + "…"}
                        value={composerText}
                        onChange={e => setComposerText(e.target.value)}
                        rows={3}
                        disabled={isTyping}
                        onKeyDown={e => {
                          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSendMessage();
                        }}
                      />
                      <button
                        className="neg-send-msg-btn"
                        onClick={handleSendMessage}
                        disabled={!composerText.trim() || isTyping}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      </button>
                    </div>
                    <p className="neg-composer-hint">
                      {isTyping ? "⏳ " + project.client + " is typing a response..." : "⌘ + Enter to send · Tab to switch mode"}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <ProposalSidebar
            project={project}
            currentTerms={currentTerms}
            status={negotiationStatus}
            onAccept={handleAccept}
            onReject={handleReject}
            isFinalized={isFinalized}
            deal={deal}
          />
        </div>
      </div>
    </div>
  );
}
