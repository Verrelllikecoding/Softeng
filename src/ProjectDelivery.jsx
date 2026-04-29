import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProjectDelivery.css";
import NotificationBell from "./NotificationBell";

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
            <button className="btn-pnav-login" onClick={() => navigate("/login")}>Log In</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default function ProjectDelivery() {
  const navigate = useNavigate();
  const { proposal_id } = useParams();

  const [project, setProject] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchData();
  }, [proposal_id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let foundProject = null;
      let detectedIsClient = false;

      // ── Coba fetch sebagai freelancer dulu ──
      const propRes = await fetch(`http://localhost:3001/api/proposals/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const myProposals = await propRes.json();
      const myProposal = Array.isArray(myProposals)
        ? myProposals.find(p => p.id === parseInt(proposal_id))
        : null;

      if (myProposal) {
        // User adalah freelancer dari proposal ini
        const projRes = await fetch(`http://localhost:3001/api/projects/${myProposal.project_id}`);
        foundProject = await projRes.json();
        detectedIsClient = false;
      } else {
        // ── Coba fetch sebagai client ──
        const clientRes = await fetch(`http://localhost:3001/api/proposals/client/my-projects`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const clientProjects = await clientRes.json();

        for (const proj of (Array.isArray(clientProjects) ? clientProjects : [])) {
          const matchProposal = (proj.proposals || []).find(
            p => p.id === parseInt(proposal_id)
          );
          if (matchProposal) {
            // Fetch full project detail
            const projRes = await fetch(`http://localhost:3001/api/projects/${proj.id}`);
            foundProject = await projRes.json();
            detectedIsClient = true;
            break;
          }
        }
      }

      if (foundProject) {
        setProject(foundProject);
        setIsClient(detectedIsClient);
      }

      // ── Fetch deliveries ──
      const delRes = await fetch(`http://localhost:3001/api/deliveries/proposal/${proposal_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const delData = await delRes.json();
      setDeliveries(Array.isArray(delData) ? delData : []);

    } catch (err) {
      console.error("Gagal fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setFileName(f.name);
  };

  const handleSubmitDelivery = async () => {
    if (!file && !message.trim()) {
      alert("Upload file atau isi pesan dulu!"); return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("proposal_id", proposal_id);
      formData.append("project_id", project?.id);
      formData.append("message", message);
      if (file) formData.append("file", file);

      const res = await fetch("http://localhost:3001/api/deliveries", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.delivery) {
        setSuccessMsg("✓ Delivery berhasil dikirim! Client akan segera mereview.");
        setMessage("");
        setFile(null);
        setFileName("");
        fetchData();
      } else {
        alert(data.message || "Gagal submit delivery");
      }
    } catch (err) {
      alert("Tidak bisa terhubung ke server");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmPayment = async (deliveryId) => {
    setConfirming(deliveryId);
    try {
      const res = await fetch(`http://localhost:3001/api/deliveries/${deliveryId}/confirm-payment`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.delivery) {
        setSuccessMsg("✓ Payment confirmed! Project selesai 🎉");
        fetchData();
      } else {
        alert(data.message || "Gagal confirm payment");
      }
    } catch (err) {
      alert("Tidak bisa terhubung ke server");
    } finally {
      setConfirming(null);
    }
  };

  const handleRejectDelivery = async (deliveryId) => {
    const reason = window.prompt("Tulis alasan atau catatan revisi untuk freelancer:");
    if (reason === null) return;
    setRejecting(deliveryId);
    try {
      const res = await fetch(`http://localhost:3001/api/deliveries/${deliveryId}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (data.delivery) {
        setSuccessMsg("Revision requested. Freelancer akan segera merevisi.");
        fetchData();
      } else {
        alert(data.message || "Gagal reject delivery");
      }
    } catch (err) {
      alert("Tidak bisa terhubung ke server");
    } finally {
      setRejecting(null);
    }
  };

  const latestDelivery = deliveries[0];
  const isCompleted = latestDelivery?.payment_status === "paid" || latestDelivery?.status === "completed";

  if (loading) return (
    <div className="del-page"><Navbar />
      <p style={{ textAlign: "center", padding: "4rem", color: "#888" }}>Loading...</p>
    </div>
  );

  if (!project) return (
    <div className="del-page"><Navbar />
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <p style={{ fontSize: "1.2rem", color: "#64748b", marginBottom: "1rem" }}>
          Delivery page tidak ditemukan atau kamu tidak punya akses.
        </p>
        <button className="del-back-btn" onClick={() => navigate("/dashboard")} style={{ fontSize: "14px" }}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="del-page">
      <Navbar />

      <div className="del-body">

        {/* ── HEADER ── */}
        <div className="del-header">
          <button className="del-back-btn" onClick={() => navigate("/dashboard")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Dashboard
          </button>
          <div className="del-header-info">
            <div className="del-header-top">
              <div>
                <h1 className="del-title">Project Delivery</h1>
                <p className="del-subtitle">{project?.title}</p>
                <span className="del-role-indicator">
                  {isClient ? "👔 Viewing as Client" : "💼 Viewing as Freelancer"}
                </span>
              </div>
              <span className={`del-status-badge ${isCompleted ? "completed" : "active"}`}>
                {isCompleted ? "✓ Completed" : "● Active"}
              </span>
            </div>
          </div>
        </div>

        <div className="del-layout">

          {/* ── MAIN ── */}
          <div className="del-main">

            {successMsg && (
              <div className="del-success-msg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {successMsg}
              </div>
            )}

            {isCompleted && (
              <div className="del-completed-banner">
                <div className="del-completed-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <h3>Project Completed! 🎉</h3>
                  <p>Payment has been confirmed and the project is now closed.</p>
                </div>
              </div>
            )}

            {/* ── DELIVERY HISTORY ── */}
            <div className="del-section">
              <h2 className="del-section-title">Delivery History</h2>

              {deliveries.length === 0 ? (
                <div className="del-empty">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <p>No deliveries yet.</p>
                  <span>{isClient ? "Waiting for the freelancer to submit their work." : "Submit your first delivery below."}</span>
                </div>
              ) : (
                <div className="del-list">
                  {deliveries.map((d, i) => {
                    const isPaid = d.payment_status === "paid";
                    const isRejected = d.status === "rejected";
                    return (
                      <div className="del-item" key={d.id}>
                        <div className="del-item-header">
                          <div className="del-item-num">Delivery #{deliveries.length - i}</div>
                          <span className={`del-item-status ${isPaid ? "paid" : isRejected ? "rejected" : d.status}`}>
                            {isPaid ? "✓ Paid" : isRejected ? "✕ Revision Requested" : "⏳ Under Review"}
                          </span>
                          <span className="del-item-date">
                            {new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>

                        {d.message && <p className="del-item-message">"{d.message}"</p>}

                        {d.file_url && (
                          <a href={`http://localhost:3001${d.file_url}`} target="_blank" rel="noreferrer" className="del-item-file">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                            </svg>
                            View / Download Submitted File
                          </a>
                        )}

                        {/* ── CLIENT: Confirm atau Reject ── */}
                        {isClient && d.status === "submitted" && !isPaid && !isRejected && (
                          <div className="del-confirm-row">
                            <p className="del-confirm-hint">
                              Review the delivered work carefully. Confirm payment if satisfied, or request a revision.
                            </p>
                            <div className="del-confirm-actions">
                              <button className="del-confirm-btn" onClick={() => handleConfirmPayment(d.id)} disabled={confirming === d.id}>
                                {confirming === d.id ? <><span className="del-spinner" />Processing...</> : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Confirm Payment</>}
                              </button>
                              <button className="del-reject-btn" onClick={() => handleRejectDelivery(d.id)} disabled={rejecting === d.id}>
                                {rejecting === d.id ? <><span className="del-spinner" />Processing...</> : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Request Revision</>}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* ── FREELANCER: Status review ── */}
                        {!isClient && d.status === "submitted" && !isPaid && (
                          <div className="del-review-status">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                            Client is currently reviewing your work.
                          </div>
                        )}

                        {isRejected && d.reject_reason && (
                          <div className="del-rejected-msg">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#be123c" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                            <span>Revision note: "{d.reject_reason}"</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── SUBMIT DELIVERY (Freelancer only) ── */}
            {!isClient && !isCompleted && (
              <div className="del-section">
                <h2 className="del-section-title">
                  {deliveries.some(d => d.status === "rejected") ? "Submit Revision" : "Submit Delivery"}
                </h2>
                <p className="del-section-sub">
                  {deliveries.some(d => d.status === "rejected")
                    ? "The client requested a revision. Upload your updated work below."
                    : "Upload your completed work and add a message for the client."}
                </p>

                <div className="del-field">
                  <label>Message to Client</label>
                  <textarea rows={4} placeholder="Describe what you've completed..." value={message} onChange={e => setMessage(e.target.value)} />
                </div>

                <div className="del-field">
                  <label>Upload File <span className="del-optional">optional</span></label>
                  <div className="del-file-upload" onClick={() => document.getElementById("del-file-input").click()}>
                    {fileName ? (
                      <div className="del-file-selected">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <span>{fileName}</span>
                        <button onClick={e => { e.stopPropagation(); setFile(null); setFileName(""); }} style={{ marginLeft: "auto", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "18px" }}>×</button>
                      </div>
                    ) : (
                      <div className="del-file-placeholder">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <p>Click to upload your work</p>
                        <span>Any file type — max 20MB</span>
                      </div>
                    )}
                  </div>
                  <input id="del-file-input" type="file" onChange={handleFileChange} style={{ display: "none" }} />
                </div>

                <button className="del-submit-btn" onClick={handleSubmitDelivery} disabled={submitting}>
                  {submitting
                    ? <><span className="del-spinner" />Submitting...</>
                    : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>Submit Delivery</>}
                </button>
              </div>
            )}

          </div>

          {/* ── SIDEBAR ── */}
          <aside className="del-sidebar">
            <div className="del-sidebar-card">
              <div className="del-sidebar-title">Project Details</div>
              <div className="del-sidebar-rows">
                <div className="del-sidebar-row"><span>Project</span><strong>{project?.title || "-"}</strong></div>
                <div className="del-sidebar-row"><span>Budget</span><strong className="blue">{project?.budget || "-"}</strong></div>
                <div className="del-sidebar-row"><span>Deadline</span><strong>{project?.deadline || "-"}</strong></div>
                <div className="del-sidebar-row"><span>Your Role</span><strong>{isClient ? "Client 👔" : "Freelancer 💼"}</strong></div>
                <div className="del-sidebar-row">
                  <span>Status</span>
                  <strong className={isCompleted ? "green" : "orange"}>{isCompleted ? "Completed" : "In Progress"}</strong>
                </div>
              </div>
            </div>

            <div className="del-sidebar-card">
              <div className="del-sidebar-title">Delivery Progress</div>
              <div className="del-progress-steps">
                <div className={`del-prog-step ${deliveries.length > 0 ? "done" : "active"}`}>
                  <div className="del-prog-dot" />
                  <div><p>Work Submitted</p><span>{deliveries.length > 0 ? "✓ Done" : isClient ? "Waiting for freelancer" : "Submit below"}</span></div>
                </div>
                <div className={`del-prog-step ${isCompleted ? "done" : deliveries.length > 0 ? "active" : "inactive"}`}>
                  <div className="del-prog-dot" />
                  <div><p>Client Review</p><span>{isCompleted ? "✓ Done" : deliveries.length > 0 ? (isClient ? "⚡ Action required" : "In Review") : "Pending"}</span></div>
                </div>
                <div className={`del-prog-step ${isCompleted ? "done" : "inactive"}`}>
                  <div className="del-prog-dot" />
                  <div><p>Payment Confirmed</p><span>{isCompleted ? "✓ Paid" : "Pending"}</span></div>
                </div>
                <div className={`del-prog-step ${isCompleted ? "active" : "inactive"}`}>
                  <div className="del-prog-dot" />
                  <div><p>Project Closed</p><span>{isCompleted ? "✓ Closed" : "Pending"}</span></div>
                </div>
              </div>
            </div>

            {isClient && deliveries.length > 0 && !isCompleted && (
              <div className="del-sidebar-card" style={{ background: "#fffbeb", borderColor: "#fde68a" }}>
                <div className="del-sidebar-title">⚡ Action Required</div>
                <p style={{ fontSize: "13px", color: "#92400e", margin: 0, lineHeight: 1.5 }}>
                  The freelancer has submitted their work. Please review and confirm payment or request a revision.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
