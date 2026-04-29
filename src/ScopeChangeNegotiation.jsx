import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import "./ScopeChangeNegotiation.css";


// ─── NAVBAR ───────────────────────────────────────────────────
const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
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
          <NotificationBell />
          <div className="dash-nav-avatar">{initials}</div>
          <button className="btn-pnav-login" onClick={() => navigate("/dashboard")}>Dashboard</button>
        </div>
      </div>
    </nav>
  );
};

// ─── SIGNATURE CANVAS ─────────────────────────────────────────
const SignatureCanvas = ({ label, onSave, onClear }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(false);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e) => { e.preventDefault(); const canvas = canvasRef.current; const ctx = canvas.getContext("2d"); const pos = getPos(e, canvas); ctx.beginPath(); ctx.moveTo(pos.x, pos.y); setDrawing(true); };
  const draw = (e) => { if (!drawing) return; e.preventDefault(); const canvas = canvasRef.current; const ctx = canvas.getContext("2d"); const pos = getPos(e, canvas); ctx.lineTo(pos.x, pos.y); ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.stroke(); setHasSig(true); };
  const end = () => { setDrawing(false); if (hasSig) onSave(canvasRef.current.toDataURL()); };
  const clear = () => { const canvas = canvasRef.current; const ctx = canvas.getContext("2d"); ctx.clearRect(0, 0, canvas.width, canvas.height); setHasSig(false); onClear(); };

  return (
    <div className="sc-sig-wrap">
      <div className="sc-sig-label">{label}</div>
      <canvas ref={canvasRef} width={260} height={90} className="sc-sig-canvas"
        onMouseDown={start} onMouseMove={draw} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={draw} onTouchEnd={end}
      />
      <div className="sc-sig-row">
        <button className="sc-sig-clear" onClick={clear}>Clear</button>
        {hasSig && <span className="sc-sig-done">✓ Signed</span>}
      </div>
    </div>
  );
};

// ─── CHAT BUBBLE ──────────────────────────────────────────────
const ChatBubble = ({ msg, isMine, myInitials, otherInitials }) => (
  <div className={`sc-msg-row ${isMine ? "sc-msg-row--right" : "sc-msg-row--left"}`}>
    {!isMine && <div className="sc-avatar sc-avatar--other">{otherInitials}</div>}
    <div className="sc-msg-col">
      <div className="sc-msg-meta">
        <span className="sc-msg-name">{isMine ? "You" : msg.senderName}</span>
        <span className="sc-msg-time">{msg.timestamp}</span>
      </div>
      <div className={`sc-bubble ${isMine ? "sc-bubble--mine" : "sc-bubble--other"} ${msg.type === "counter" ? "sc-bubble--counter" : ""}`}>
        {msg.type === "counter" && (
          <div className="sc-counter-tag">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>
            Counter Offer
          </div>
        )}
        <p className="sc-bubble-text">{msg.text}</p>
        {(msg.budget != null || msg.days != null) && (
          <div className="sc-bubble-terms">
            {msg.budget != null && <span className="sc-bubble-term green">+${msg.budget} budget</span>}
            {msg.days != null && <span className="sc-bubble-term blue">+{msg.days} days</span>}
          </div>
        )}
      </div>
    </div>
    {isMine && <div className="sc-avatar sc-avatar--mine">{myInitials}</div>}
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────
export default function ScopeChangeNegotiation() {
  const navigate = useNavigate();
  const { id } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [scopeChange, setScopeChange] = useState(null);
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState([]);
  const [composerText, setComposerText] = useState("");
  const [composerMode, setComposerMode] = useState("message");
  const [counterBudget, setCounterBudget] = useState("");
  const [counterDays, setCounterDays] = useState("");
  const [counterNote, setCounterNote] = useState("");
  const [sending, setSending] = useState(false);

  const [isFinalized, setIsFinalized] = useState(false);
  const [finalTerms, setFinalTerms] = useState(null);
  const [showContract, setShowContract] = useState(false);
  const [sigClient, setSigClient] = useState(null);
  const [sigFreelancer, setSigFreelancer] = useState(null);

  const chatBottomRef = useRef(null);

  const isClient = scopeChange ? scopeChange.client_id === user?.id : false;
  const myInitials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "ME";
  const otherInitials = isClient
    ? (scopeChange?.freelancer_name?.split(" ").map(n => n[0]).join("").toUpperCase() || "F")
    : (scopeChange?.client_name?.split(" ").map(n => n[0]).join("").toUpperCase() || "C");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchScopeChange();
  }, [id]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchScopeChange = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/scope-changes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setScopeChange(data);

      // Load messages dari database
      const savedMsgs = data.messages || [];
      if (savedMsgs.length > 0) {
        setMessages(savedMsgs);
      } else {
        // Initial message dari client
        setMessages([{
          id: 1,
          sender: "client",
          senderName: data.client_name,
          type: "scope_request",
          text: data.description,
          budget: data.additional_budget,
          days: data.additional_days,
          timestamp: new Date(data.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        }]);
      }

      if (data.status === "accepted" || data.status === "rejected") {
        setIsFinalized(true);
        if (data.status === "accepted") {
          setFinalTerms({
            budget: data.counter_budget || data.additional_budget,
            days: data.counter_days || data.additional_days,
          });
        }
      }
    } catch (err) {
      console.error("Gagal fetch scope change:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveMessages = async (updatedMessages, status = "pending", finalBudget = null, finalDays = null) => {
    try {
      await fetch(`http://localhost:3001/api/scope-changes/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: updatedMessages, status, final_budget: finalBudget, final_days: finalDays }),
      });
    } catch (err) {
      console.error("Gagal save messages:", err);
    }
  };

  const handleSendMessage = () => {
    if (!composerText.trim()) return;
    const sender = isClient ? "client" : "freelancer";
    const newMsg = {
      id: messages.length + 1,
      sender,
      senderName: user?.name,
      type: "message",
      text: composerText.trim(),
      timestamp: "Just now",
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    setComposerText("");
    saveMessages(updated);
  };

  const handleSendCounter = () => {
    if (!counterNote.trim() && !counterBudget && !counterDays) return;
    setSending(true);
    const sender = isClient ? "client" : "freelancer";
    const newMsg = {
      id: messages.length + 1,
      sender,
      senderName: user?.name,
      type: "counter",
      text: counterNote || `I'd like to propose different terms for this scope change.`,
      budget: counterBudget ? parseInt(counterBudget) : null,
      days: counterDays ? parseInt(counterDays) : null,
      timestamp: "Just now",
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    setCounterBudget("");
    setCounterDays("");
    setCounterNote("");
    setComposerMode("message");
    setSending(false);
    saveMessages(updated);
  };

  const handleAccept = () => {
    const lastCounter = [...messages].reverse().find(m => m.budget != null || m.days != null);
    const finalBudget = lastCounter?.budget ?? scopeChange?.additional_budget ?? 0;
    const finalDays = lastCounter?.days ?? scopeChange?.additional_days ?? 0;

    const systemMsg = {
      id: messages.length + 1,
      sender: "system",
      type: "system",
      text: `✓ Scope change accepted! Additional budget: $${finalBudget}, Additional days: ${finalDays}. A new contract has been generated.`,
      timestamp: "Just now",
    };
    const updated = [...messages, systemMsg];
    setMessages(updated);
    setFinalTerms({ budget: finalBudget, days: finalDays });
    setIsFinalized(true);
    saveMessages(updated, "accepted", finalBudget, finalDays);
  };

  const handleReject = () => {
    const systemMsg = {
      id: messages.length + 1,
      sender: "system",
      type: "system",
      text: "✕ Scope change request has been declined.",
      timestamp: "Just now",
    };
    const updated = [...messages, systemMsg];
    setMessages(updated);
    setIsFinalized(true);
    saveMessages(updated, "rejected");
  };

  const handleDownloadContract = () => {
    const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const sigClientHTML = sigClient ? `<img src="${sigClient}" style="height:60px;display:block;margin-top:8px;" />` : '<div style="height:60px;border-bottom:1px solid #cbd5e1;margin-top:8px;width:200px;"></div>';
    const sigFreelancerHTML = sigFreelancer ? `<img src="${sigFreelancer}" style="height:60px;display:block;margin-top:8px;" />` : '<div style="height:60px;border-bottom:1px solid #cbd5e1;margin-top:8px;width:200px;"></div>';

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Scope Change Contract</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1e293b;padding:48px}.logo{font-size:22px;font-weight:800;margin-bottom:8px}.logo span{color:#7c3aed}.tag{font-size:10px;font-weight:700;letter-spacing:2px;color:#7c3aed;text-transform:uppercase;margin-bottom:32px;display:block}.new-badge{display:inline-block;background:#f3e8ff;color:#7c3aed;border:1px solid #e9d5ff;border-radius:20px;padding:4px 14px;font-size:12px;font-weight:700;margin-bottom:16px}.title{font-size:26px;font-weight:800;margin-bottom:24px}.parties{display:flex;gap:0;margin-bottom:28px;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden}.party{flex:1;padding:18px 22px;background:#f8fafc}.party:first-child{border-right:1px solid #e2e8f0}.party-label{font-size:10px;font-weight:700;letter-spacing:1.5px;color:#94a3b8;text-transform:uppercase;margin-bottom:6px}.party-name{font-size:16px;font-weight:700}.divider{height:1px;background:#e2e8f0;margin:24px 0}.row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #f1f5f9}.row-label{font-size:13px;color:#64748b}.row-val{font-size:14px;font-weight:700}.green{color:#15803d}.purple{color:#7c3aed}.sig-section{display:flex;gap:48px;margin-top:36px}.sig-box{flex:1}.sig-label{font-size:10px;font-weight:700;letter-spacing:1px;color:#94a3b8;text-transform:uppercase}.sig-name{font-size:12px;color:#64748b;margin-top:6px}.note{font-size:11px;color:#94a3b8;text-align:center;margin-top:28px;padding-top:16px;border-top:1px solid #e2e8f0}</style></head><body>
    <div class="logo">Proposal<span>in</span></div>
    <span class="tag">SCOPE CHANGE CONTRACT</span>
    <div class="new-badge">★ NEW CONTRACT — Supersedes Previous Agreement</div>
    <h1 class="title">${scopeChange?.project_title}</h1>
    <div class="parties">
      <div class="party"><div class="party-label">Client</div><div class="party-name">${scopeChange?.client_name}</div></div>
      <div class="party"><div class="party-label">Freelancer</div><div class="party-name">${scopeChange?.freelancer_name}</div></div>
    </div>
    <div class="divider"></div>
    <div class="row"><span class="row-label">Project</span><span class="row-val">${scopeChange?.project_title}</span></div>
    <div class="row"><span class="row-label">Original Budget</span><span class="row-val">${scopeChange?.current_budget}</span></div>
    <div class="row"><span class="row-label">Additional Budget</span><span class="row-val green">+$${finalTerms?.budget}</span></div>
    <div class="row"><span class="row-label">Total Budget</span><span class="row-val green" style="font-size:16px">$${(parseInt((scopeChange?.current_budget || "0").replace(/[^0-9]/g, "")) + (finalTerms?.budget || 0))}</span></div>
    <div class="row"><span class="row-label">Additional Days</span><span class="row-val purple">+${finalTerms?.days} days</span></div>
    <div class="row"><span class="row-label">Scope Description</span><span class="row-val" style="max-width:60%;text-align:right">${scopeChange?.description}</span></div>
    <div class="row"><span class="row-label">Status</span><span class="row-val green">Active ✓</span></div>
    <div class="divider"></div>
    <div class="sig-section">
      <div class="sig-box"><div class="sig-label">Client Signature</div>${sigClientHTML}<div class="sig-name">${scopeChange?.client_name}</div></div>
      <div class="sig-box"><div class="sig-label">Freelancer Signature</div>${sigFreelancerHTML}<div class="sig-name">${scopeChange?.freelancer_name}</div></div>
    </div>
    <p class="note">This scope change contract was finalized on ${date} via Proposalin. This contract supersedes the original negotiation contract for the additional scope only.</p>
    </body></html>`;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  if (loading) return (
    <div className="sc-page"><Navbar />
      <p style={{ textAlign: "center", padding: "4rem", color: "#888" }}>Loading...</p>
    </div>
  );

  if (!scopeChange) return (
    <div className="sc-page"><Navbar />
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <p>Scope change tidak ditemukan.</p>
        <button onClick={() => navigate("/dashboard")} style={{ marginTop: "1rem", padding: "8px 16px", cursor: "pointer" }}>← Back to Dashboard</button>
      </div>
    </div>
  );

  const lastMsg = messages[messages.length - 1];
  const lastCounter = [...messages].reverse().find(m => (m.budget != null || m.days != null) && m.type === "counter");
  const canAccept = !isFinalized && (
    (isClient && lastMsg?.sender === "freelancer") ||
    (!isClient && lastMsg?.sender === "client")
  );

  // Contract modal
  if (showContract && isFinalized && scopeChange.status === "accepted") {
    return (
      <div className="sc-page">
        <Navbar />
        <div className="sc-contract-overlay">
          <div className="sc-contract-modal">
            <div className="sc-contract-modal-header">
              <div>
                <div className="sc-contract-logo">Proposal<span>in</span></div>
                <div className="sc-contract-new-badge">★ NEW CONTRACT</div>
              </div>
              <button className="sc-contract-close" onClick={() => setShowContract(false)}>✕</button>
            </div>
            <div className="sc-contract-body">
              <div className="sc-contract-tag">SCOPE CHANGE CONTRACT</div>
              <h2 className="sc-contract-title">{scopeChange.project_title}</h2>
              <p className="sc-contract-supersede">This contract supersedes the original negotiation contract for the additional scope.</p>

              <div className="sc-contract-parties">
                <div className="sc-contract-party"><span className="sc-cp-label">Client</span><span className="sc-cp-val">{scopeChange.client_name}</span></div>
                <div className="sc-contract-arrow">↔</div>
                <div className="sc-contract-party"><span className="sc-cp-label">Freelancer</span><span className="sc-cp-val">{scopeChange.freelancer_name}</span></div>
              </div>

              <div className="sc-contract-divider" />

              <div className="sc-contract-terms">
                <div className="sc-ct-row"><span>Project</span><strong>{scopeChange.project_title}</strong></div>
                <div className="sc-ct-row"><span>Original Budget</span><strong>{scopeChange.current_budget}</strong></div>
                <div className="sc-ct-row"><span>Additional Budget</span><strong className="green">+${finalTerms?.budget}</strong></div>
                <div className="sc-ct-row"><span>Total Budget</span><strong className="green" style={{ fontSize: "16px" }}>${parseInt((scopeChange.current_budget || "0").replace(/[^0-9]/g, "")) + (finalTerms?.budget || 0)}</strong></div>
                <div className="sc-ct-row"><span>Additional Days</span><strong className="purple">+{finalTerms?.days} days</strong></div>
                <div className="sc-ct-row"><span>Status</span><strong className="green">Active ✓</strong></div>
              </div>

              <div className="sc-contract-divider" />

              <div className="sc-sig-section-title">Digital Signatures</div>
              <p className="sc-sig-hint">Both parties must sign to complete this contract.</p>
              <div className="sc-sig-row">
                <SignatureCanvas label={`Client — ${scopeChange.client_name}`} onSave={setSigClient} onClear={() => setSigClient(null)} />
                <SignatureCanvas label={`Freelancer — ${scopeChange.freelancer_name}`} onSave={setSigFreelancer} onClear={() => setSigFreelancer(null)} />
              </div>
              {sigClient && sigFreelancer && (
                <p className="sc-sig-both-done">✓ Both parties signed. Ready to download.</p>
              )}

              <div className="sc-contract-divider" />
              <p className="sc-contract-note">
                Finalized on {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} via Proposalin.
              </p>

              <div className="sc-contract-actions">
                <button className="sc-dl-btn" onClick={handleDownloadContract} disabled={!sigClient || !sigFreelancer} title={!sigClient || !sigFreelancer ? "Both must sign first" : ""}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download PDF {(!sigClient || !sigFreelancer) && "(Sign first)"}
                </button>
                <button className="sc-close-btn" onClick={() => setShowContract(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sc-page">
      <Navbar />
      <div className="sc-body">

        <div className="sc-header">
          <button className="sc-back-btn" onClick={() => navigate("/dashboard")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Dashboard
          </button>
          <div className="sc-header-info">
            <div className="sc-header-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>
              Scope Change Negotiation
            </div>
            <h1 className="sc-header-title">{scopeChange.project_title}</h1>
            <p className="sc-header-sub">
              {isClient ? `Negotiating with ${scopeChange.freelancer_name}` : `Negotiating with ${scopeChange.client_name}`}
              <span className="sc-role-indicator">{isClient ? "👔 Client" : "💼 Freelancer"}</span>
            </p>
          </div>
          <div className={`sc-status-badge sc-status-badge--${scopeChange.status}`}>
            {scopeChange.status === "pending" ? "⏳ Negotiating" : scopeChange.status === "accepted" ? "✓ Accepted" : "✕ Rejected"}
          </div>
        </div>

        <div className="sc-layout">

          {/* ── CHAT ── */}
          <div className="sc-chat-panel">
            <div className="sc-chat-header">
              <div className="sc-chat-header-left">
                <div className="sc-online-dot" />
                <span>Scope Change Discussion</span>
              </div>
              <span className="sc-msg-count">{messages.length} messages</span>
            </div>

            <div className="sc-messages">
              {messages.map((msg, i) => {
                if (msg.type === "system") {
                  return (
                    <div key={i} className="sc-system-msg">
                      <div className={`sc-system-inner ${msg.text.includes("✕") ? "sc-system-inner--reject" : "sc-system-inner--accept"}`}>
                        <span>{msg.text}</span>
                      </div>
                    </div>
                  );
                }
                const isMine = isClient ? msg.sender === "client" : msg.sender === "freelancer";
                return <ChatBubble key={i} msg={msg} isMine={isMine} myInitials={myInitials} otherInitials={otherInitials} />;
              })}

              {isFinalized && scopeChange.status === "accepted" && (
                <div className="sc-finalized-banner">
                  <div className="sc-finalized-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div>
                    <h3>Scope Change Accepted!</h3>
                    <p>+${finalTerms?.budget} budget · +{finalTerms?.days} days · A new contract has been generated.</p>
                  </div>
                  <button className="sc-contract-btn" onClick={() => setShowContract(true)}>
                    View New Contract →
                  </button>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* ── COMPOSER ── */}
            {!isFinalized && (
              <div className="sc-composer">
                {composerMode === "counter" ? (
                  <div className="sc-counter-form">
                    <div className="sc-counter-form-title">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>
                      Propose Counter Terms
                    </div>
                    <div className="sc-counter-fields">
                      <div className="sc-counter-field">
                        <label>Additional Budget</label>
                        <div className="sc-cf-wrap"><span>+$</span><input type="number" min="0" value={counterBudget} onChange={e => setCounterBudget(e.target.value)} placeholder="0" /></div>
                      </div>
                      <div className="sc-counter-field">
                        <label>Additional Days</label>
                        <div className="sc-cf-wrap"><input type="number" min="0" value={counterDays} onChange={e => setCounterDays(e.target.value)} placeholder="0" /><span>days</span></div>
                      </div>
                    </div>
                    <div className="sc-counter-field" style={{ marginTop: "10px" }}>
                      <label>Message <span style={{ color: "#94a3b8", fontWeight: 400 }}>optional</span></label>
                      <textarea rows={2} placeholder="Explain your counter proposal..." value={counterNote} onChange={e => setCounterNote(e.target.value)} />
                    </div>
                    <div className="sc-counter-actions">
                      <button className="sc-cancel-btn" onClick={() => setComposerMode("message")}>Cancel</button>
                      <button className="sc-send-counter-btn" onClick={handleSendCounter} disabled={sending}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        Send Counter
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="sc-composer-toolbar">
                      <button className={`sc-toolbar-btn ${composerMode === "message" ? "active" : ""}`} onClick={() => setComposerMode("message")}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        Message
                      </button>
                      <button className="sc-toolbar-btn sc-toolbar-btn--counter" onClick={() => setComposerMode("counter")}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>
                        Counter Offer
                      </button>
                    </div>
                    <div className="sc-composer-input-row">
                      <textarea
                        className="sc-composer-textarea"
                        placeholder={isClient ? `Reply to ${scopeChange.freelancer_name}…` : `Reply to ${scopeChange.client_name}…`}
                        value={composerText}
                        onChange={e => setComposerText(e.target.value)}
                        rows={3}
                        onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSendMessage(); }}
                      />
                      <button className="sc-send-btn" onClick={handleSendMessage} disabled={!composerText.trim()}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      </button>
                    </div>
                    <p className="sc-composer-hint">⌘ + Enter to send</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="sc-sidebar">
            <div className="sc-sidebar-card">
              <div className="sc-sidebar-title">Scope Change Details</div>
              <div className="sc-sidebar-rows">
                <div className="sc-sidebar-row"><span>Project</span><strong>{scopeChange.project_title}</strong></div>
                <div className="sc-sidebar-row"><span>Current Budget</span><strong>{scopeChange.current_budget}</strong></div>
                <div className="sc-sidebar-row"><span>Requested Add.</span><strong className="green">+${scopeChange.additional_budget}</strong></div>
                <div className="sc-sidebar-row"><span>Additional Days</span><strong className="blue">+{scopeChange.additional_days} days</strong></div>
              </div>
            </div>

            {lastCounter && (
              <div className="sc-sidebar-card sc-sidebar-card--counter">
                <div className="sc-sidebar-title">Latest Counter Offer</div>
                <div className="sc-sidebar-rows">
                  {lastCounter.budget != null && <div className="sc-sidebar-row"><span>Budget</span><strong className="green">+${lastCounter.budget}</strong></div>}
                  {lastCounter.days != null && <div className="sc-sidebar-row"><span>Days</span><strong className="blue">+{lastCounter.days} days</strong></div>}
                </div>
              </div>
            )}

            {!isFinalized && canAccept && (
              <div className="sc-sidebar-card sc-sidebar-card--actions">
                <div className="sc-sidebar-title">Respond</div>
                <p className="sc-action-hint">Accept the current terms or send a counter offer.</p>
                <button className="sc-accept-btn" onClick={handleAccept}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Accept Terms
                </button>
                <button className="sc-reject-btn" onClick={handleReject}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Decline
                </button>
              </div>
            )}

            {isFinalized && scopeChange.status === "accepted" && (
              <div className="sc-sidebar-card sc-sidebar-card--finalized">
                <div className="sc-sidebar-title">✓ Agreed Terms</div>
                <div className="sc-sidebar-rows">
                  <div className="sc-sidebar-row"><span>Add. Budget</span><strong className="green">+${finalTerms?.budget}</strong></div>
                  <div className="sc-sidebar-row"><span>Add. Days</span><strong className="blue">+{finalTerms?.days} days</strong></div>
                </div>
                <button className="sc-view-contract-btn" onClick={() => setShowContract(true)}>
                  📄 View New Contract
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
