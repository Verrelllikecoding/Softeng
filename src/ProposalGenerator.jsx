import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProposalGenerator.css";

const categoryColors = {
  "Technology":            { bg: "#e0f2fe", color: "#0369a1" },
  "Design & Creative":     { bg: "#fdf4ff", color: "#7e22ce" },
  "Marketing":             { bg: "#f0fdf4", color: "#15803d" },
  "Business & Consulting": { bg: "#fff7ed", color: "#c2410c" },
};

const TONE_OPTIONS = ["Professional & Formal", "Friendly & Approachable", "Bold & Confident", "Technical & Detailed"];
const EXPERIENCE_OPTIONS = ["Less than 1 year", "1–3 years", "3–5 years", "5+ years"];

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

const StepIndicator = ({ currentStep }) => {
  const steps = ["Your Profile", "Proposal Settings", "Review & Send"];
  return (
    <div className="step-indicator">
      {steps.map((label, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isDone = step < currentStep;
        return (
          <div className="step-item" key={i}>
            <div className={`step-dot ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>
              {isDone ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              ) : step}
            </div>
            <span className={`step-label ${isActive ? "active" : ""}`}>{label}</span>
            {i < steps.length - 1 && <div className={`step-line ${isDone ? "done" : ""}`} />}
          </div>
        );
      })}
    </div>
  );
};

export default function ProposalGenerator() {
  const navigate = useNavigate();
  const { id } = useParams();
  const previewRef = useRef(null);

  const [project, setProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [proposal, setProposal] = useState(null);
  const [sendStatus, setSendStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    freelancerName: user?.name || "",
    experience: "3–5 years",
    skills: "",
    portfolio: "",
    bidAmount: "",
    deliveryDays: "14",
    tone: "Professional & Formal",
    highlights: "",
    revisionNote: "",
  });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetch(`http://localhost:3001/api/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        setProject(data);
        setForm(prev => ({
          ...prev,
          bidAmount: (data.budget || "").replace(/[^0-9]/g, ""),
        }));
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingProject(false));
  }, [id]);

  // Parse skills dari project
  const projectSkills = project
    ? Array.isArray(project.skills)
      ? project.skills.join(", ")
      : project.skills
        ? project.skills.replace(/[{}"]/g, "").split(",").map(s => s.trim()).join(", ")
        : project.sub_category || ""
    : "";

  const generateProposal = async () => {
    setGenerating(true);
    setProposal(null);

    const prompt = `You are an expert freelance proposal writer. Write a compelling, professional freelance proposal for the following project and freelancer details.

PROJECT DETAILS:
- Title: ${project.title}
- Category: ${project.sub_category}
- Required Skills: ${projectSkills}
- Client Budget: ${project.budget}
- Deadline: ${project.deadline}
- Client Name: ${project.client_name}
- Description: ${project.description}

FREELANCER DETAILS:
- Name: ${form.freelancerName || "the freelancer"}
- Years of Experience: ${form.experience}
- Relevant Skills: ${form.skills || projectSkills}
- Portfolio/Past Work: ${form.portfolio || "not specified"}
- Bid Amount: $${form.bidAmount}
- Proposed Delivery: ${form.deliveryDays} days
- Tone: ${form.tone}
- Key Highlights/USPs: ${form.highlights || "professional quality, on-time delivery, clear communication"}
${form.revisionNote ? `- Additional Instructions: ${form.revisionNote}` : ""}

Write a full proposal with these sections:
1. A warm, personalized opening that addresses the client by name
2. Why I'm the right fit (2–3 sentences connecting experience to this specific project)
3. My Approach (brief methodology for this project specifically)
4. Timeline & Deliverables (reference the ${form.deliveryDays}-day timeline)
5. Investment (present the $${form.bidAmount} bid confidently)
6. A strong, action-oriented closing

Format with clear section headers using **Header Name** markdown. Keep it concise (300–400 words total), persuasive, and tailored. Tone: ${form.tone}.`;

    const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          max_tokens: 1000,
          temperature: 0.7,
          messages: [
            {
              role: "system",
              content: "You are an expert freelance proposal writer. Write compelling, professional proposals that win clients. Always use **Header** markdown for section headers.",
            },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "Groq API error");
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";
      setProposal(text);
      setStep(3);
    } catch (err) {
      console.error("Groq error:", err);
      setProposal(`❌ Failed to generate: ${err.message}\n\nPastikan VITE_GROQ_API_KEY sudah diisi di file .env`);
      setStep(3);
    } finally {
      setGenerating(false);
    }
  };

  const renderProposal = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, i) => {
      if (!line.trim()) return <div key={i} className="prop-spacer" />;
      const headerMatch = line.match(/^\*\*(.+?)\*\*/);
      if (headerMatch) {
        const rest = line.replace(/^\*\*(.+?)\*\*/, "").trim();
        return (
          <div key={i} className="prop-section-header">
            <span className="prop-header-text">{headerMatch[1]}</span>
            {rest && <span className="prop-header-rest"> {rest}</span>}
          </div>
        );
      }
      const parts = line.split(/\*\*(.+?)\*\*/g);
      return (
        <p key={i} className="prop-line">
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
        </p>
      );
    });
  };

  // ── Send proposal ke backend ──
  const handleSend = async () => {
    if (!token) { navigate("/login"); return; }
    setSending(true);
    try {
      const res = await fetch("http://localhost:3001/api/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_id: project.id,
          content: proposal,
        }),
      });

      const data = await res.json();

      if (data.proposal) {
        // Simpan ke sessionStorage untuk ProposalNegotiation
        sessionStorage.setItem("activeProposal", JSON.stringify({
          proposalText: proposal,
          bid: parseInt(form.bidAmount),
          timeline: parseInt(form.deliveryDays),
          freelancerName: form.freelancerName || user?.name || "You",
          projectId: id,
        }));
        setSendStatus("sent");
        // Seharusnya seperti ini (include proposal.id dari response API):
        setTimeout(() => navigate(`/projects/${id}/negotiate/${data.proposal.id}`), 1500);
      } else {
        alert(data.message || "Gagal mengirim proposal");
      }
    } catch (err) {
      alert("Tidak bisa terhubung ke server");
    } finally {
      setSending(false);
    }
  };

  const handleRevise = () => {
    setProposal(null);
    setStep(2);
    set("revisionNote", "");
  };

  if (loadingProject || !project) return (
    <div className="pg-page"><Navbar />
      <p style={{ textAlign: "center", padding: "4rem", color: "#888" }}>Loading project...</p>
    </div>
  );

  const catColor = categoryColors[project.category] || { bg: "#f1f5f9", color: "#475569" };

  if (sendStatus === "sent") {
    return (
      <div className="pg-page">
        <Navbar />
        <div className="pg-sent-wrap">
          <div className="pg-sent-card">
            <div className="sent-icon-ring">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 className="sent-title">Proposal Sent!</h2>
            <p className="sent-desc">Your proposal for <strong>{project.title}</strong> has been submitted to <strong>{project.client_name}</strong>. Redirecting to negotiation...</p>
            <div className="sent-actions">
              <button className="btn-sent-primary" onClick={() => navigate("/projects")}>Browse More Projects</button>
              <button className="btn-sent-ghost" onClick={() => { setSendStatus(null); setStep(1); setProposal(null); }}>Create Another</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pg-page">
      <Navbar />
      <div className="pg-body">

        <div className="pg-header">
          <button className="pg-back-btn" onClick={() => navigate(`/projects/${project.id}`)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Project
          </button>
          <div className="pg-header-center">
            <div className="pg-project-chip">
              <span className="pg-chip-badge" style={{ background: catColor.bg, color: catColor.color }}>{project.sub_category}</span>
              <span className="pg-chip-title">{project.title}</span>
              <span className="pg-chip-client">· {project.client_name}</span>
            </div>
            <h1 className="pg-title">Generate Your Proposal</h1>
            <p className="pg-subtitle">Fill in your details and let AI craft a compelling, personalized proposal in seconds.</p>
          </div>
          <StepIndicator currentStep={step} />
        </div>

        <div className="pg-split">

          {/* ── LEFT: INPUT PANEL ── */}
          <div className="pg-input-panel">

            {step === 1 && (
              <div className="pg-form-section">
                <div className="pg-section-label">
                  <span className="pg-section-num">01</span>
                  <span>Your Profile</span>
                </div>

                <div className="pg-field">
                  <label>Your Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Johnson"
                    value={form.freelancerName}
                    onChange={e => set("freelancerName", e.target.value)}
                  />
                </div>

                <div className="pg-field">
                  <label>Years of Experience</label>
                  <div className="pg-option-grid">
                    {EXPERIENCE_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        className={`pg-option-btn ${form.experience === opt ? "selected" : ""}`}
                        onClick={() => set("experience", opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pg-field">
                  <label>Relevant Skills</label>
                  <input
                    type="text"
                    placeholder={projectSkills || "e.g. React.js, Tailwind CSS, Figma"}
                    value={form.skills}
                    onChange={e => set("skills", e.target.value)}
                  />
                  <span className="pg-hint">
                    {projectSkills ? `Required: ${projectSkills}` : "Comma-separated list of your top skills"}
                  </span>
                </div>

                <div className="pg-field">
                  <label>Portfolio / Past Work <span className="optional">optional</span></label>
                  <input
                    type="text"
                    placeholder="e.g. behance.net/yourprofile or project names"
                    value={form.portfolio}
                    onChange={e => set("portfolio", e.target.value)}
                  />
                </div>

                <button className="pg-next-btn" onClick={() => setStep(2)}>
                  Continue to Proposal Settings
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="pg-form-section">
                <div className="pg-section-label">
                  <span className="pg-section-num">02</span>
                  <span>Proposal Settings</span>
                </div>

                <div className="pg-field-row">
                  <div className="pg-field">
                    <label>Your Bid Amount</label>
                    <div className="pg-input-prefix">
                      <span>$</span>
                      <input type="number" value={form.bidAmount} onChange={e => set("bidAmount", e.target.value)} min="1" />
                    </div>
                    <span className="pg-hint">Client budget: {project.budget}</span>
                  </div>
                  <div className="pg-field">
                    <label>Delivery Time</label>
                    <div className="pg-input-suffix">
                      <input type="number" value={form.deliveryDays} onChange={e => set("deliveryDays", e.target.value)} min="1" />
                      <span>days</span>
                    </div>
                    <span className="pg-hint">Deadline: {project.deadline}</span>
                  </div>
                </div>

                <div className="pg-field">
                  <label>Proposal Tone</label>
                  <div className="pg-option-grid">
                    {TONE_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        className={`pg-option-btn ${form.tone === opt ? "selected" : ""}`}
                        onClick={() => set("tone", opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pg-field">
                  <label>Key Selling Points <span className="optional">optional</span></label>
                  <textarea
                    rows={3}
                    placeholder="e.g. I've built 5 similar projects, I offer 24/7 communication, I include free revisions..."
                    value={form.highlights}
                    onChange={e => set("highlights", e.target.value)}
                  />
                  <span className="pg-hint">What makes you stand out? AI will weave these in naturally.</span>
                </div>

                {proposal && (
                  <div className="pg-field">
                    <label>Revision Instructions <span className="optional">for regeneration</span></label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Make it shorter, emphasize my experience more, sound more confident..."
                      value={form.revisionNote}
                      onChange={e => set("revisionNote", e.target.value)}
                    />
                  </div>
                )}

                <div className="pg-btn-row">
                  <button className="pg-back-step-btn" onClick={() => setStep(1)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                    Back
                  </button>
                  <button
                    className={`pg-generate-btn ${generating ? "loading" : ""}`}
                    onClick={generateProposal}
                    disabled={generating}
                  >
                    {generating ? (
                      <><span className="pg-spinner" />Generating…</>
                    ) : (
                      <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>Generate Proposal</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="pg-form-section">
                <div className="pg-section-label">
                  <span className="pg-section-num">03</span>
                  <span>Review & Send</span>
                </div>

                <div className="pg-summary-card">
                  <div className="pg-sum-row">
                    <span className="pg-sum-label">Project</span>
                    <span className="pg-sum-val">{project.title}</span>
                  </div>
                  <div className="pg-sum-row">
                    <span className="pg-sum-label">Client</span>
                    <span className="pg-sum-val">{project.client_name}</span>
                  </div>
                  <div className="pg-sum-row">
                    <span className="pg-sum-label">Your Bid</span>
                    <span className="pg-sum-val blue">${form.bidAmount}</span>
                  </div>
                  <div className="pg-sum-row">
                    <span className="pg-sum-label">Delivery</span>
                    <span className="pg-sum-val">{form.deliveryDays} days</span>
                  </div>
                  <div className="pg-sum-row">
                    <span className="pg-sum-label">Tone</span>
                    <span className="pg-sum-val">{form.tone}</span>
                  </div>
                </div>

                <div className="pg-review-tip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
                  Review your proposal on the right before sending. You can revise if needed.
                </div>

                <div className="pg-final-actions">
                  <button className="pg-revise-btn" onClick={handleRevise}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Revise Proposal
                  </button>
                  <button className="pg-send-btn" onClick={handleSend} disabled={sending}>
                    {sending ? (
                      <><span className="pg-spinner" />Sending...</>
                    ) : (
                      <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Send Proposal</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: PREVIEW PANEL ── */}
          <div className="pg-preview-panel" ref={previewRef}>
            <div className="pg-preview-header">
              <div className="pg-preview-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Proposal Preview
              </div>
              {proposal && (
                <span className="pg-preview-badge">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  AI Generated
                </span>
              )}
            </div>

            <div className="pg-preview-doc">
              <div className="pg-doc-header">
                <div className="pg-doc-logo">Proposal<span>in</span></div>
                <div className="pg-doc-meta">
                  <div className="pg-doc-meta-row">
                    <span className="pg-doc-meta-label">To</span>
                    <span className="pg-doc-meta-val">{project.client_name}</span>
                  </div>
                  <div className="pg-doc-meta-row">
                    <span className="pg-doc-meta-label">Project</span>
                    <span className="pg-doc-meta-val">{project.title}</span>
                  </div>
                  <div className="pg-doc-meta-row">
                    <span className="pg-doc-meta-label">Bid</span>
                    <span className="pg-doc-meta-val blue">${form.bidAmount}</span>
                  </div>
                  <div className="pg-doc-meta-row">
                    <span className="pg-doc-meta-label">Timeline</span>
                    <span className="pg-doc-meta-val">{form.deliveryDays} days</span>
                  </div>
                </div>
              </div>

              <div className="pg-doc-divider" />

              <div className="pg-doc-body">
                {generating && (
                  <div className="pg-generating">
                    <div className="pg-gen-dots"><span /><span /><span /></div>
                    <p>Crafting your proposal…</p>
                  </div>
                )}
                {!generating && !proposal && (
                  <div className="pg-empty-preview">
                    <div className="pg-empty-icon">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    </div>
                    <p className="pg-empty-title">Your proposal will appear here</p>
                    <p className="pg-empty-sub">Fill in your details and click <strong>Generate Proposal</strong> to create a personalized, AI-crafted proposal.</p>
                  </div>
                )}
                {!generating && proposal && (
                  <div className="pg-proposal-text">{renderProposal(proposal)}</div>
                )}
              </div>

              {proposal && !generating && (
                <div className="pg-doc-footer">
                  <span>Generated by Proposalin AI</span>
                  <span>·</span>
                  <span>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
