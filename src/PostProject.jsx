import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PostProject.css";
import NotificationBell from "./NotificationBell";

const CATEGORIES = {
  "Technology": ["Web Development", "Mobile Development", "Machine Learning", "Data Analysis"],
  "Design & Creative": ["UI/UX Design", "Branding", "Illustration", "Photography"],
  "Marketing": ["Digital Ads", "SEO & Content", "Social Media", "Email Marketing"],
  "Business & Consulting": ["Business Plan", "Financial Analysis", "Market Research", "HR Consulting"],
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

export default function PostProject() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    category: "",
    sub_category: "",
    budget: "",
    deadline: "",
    description: "",
  });
  // Simpan nilai date input terpisah supaya bisa ditampilkan di input
  const [dateValue, setDateValue] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDateChange = (e) => {
    const raw = e.target.value; // format: "2025-05-25"
    setDateValue(raw);
    if (!raw) { set("deadline", ""); return; }
    // Format jadi "May 25, 2025"
    const [year, month, day] = raw.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    set("deadline", formatted);
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setSkills(prev => prev.filter(s => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async () => {
    if (!token) { navigate("/login"); return; }
    if (!form.title || !form.category || !form.sub_category || !form.budget || !form.deadline || !form.description) {
      alert("Semua field wajib diisi!"); return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append("skills", skills.join(","));
      if (image) formData.append("image", image);

      const res = await fetch("http://localhost:3001/api/projects", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.project) {
        navigate(`/projects/${data.project.id}`);
      } else {
        alert(data.message || "Gagal membuat project");
      }
    } catch (err) {
      alert("Tidak bisa terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const subCategories = form.category ? CATEGORIES[form.category] || [] : [];

  return (
    <div className="pp-page">
      <Navbar />

      <div className="pp-body">

        <div className="pp-header">
          <button className="pp-back-btn" onClick={() => navigate("/projects")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Projects
          </button>
          <div className="pp-header-center">
            <h1 className="pp-title">Post a New Project</h1>
            <p className="pp-subtitle">Describe your project and find the perfect freelancer.</p>
          </div>

          <div className="pp-steps">
            {["Project Info", "Skills & Budget", "Preview"].map((label, i) => {
              const s = i + 1;
              return (
                <div className="pp-step-item" key={i}>
                  <div className={`pp-step-dot ${step === s ? "active" : ""} ${step > s ? "done" : ""}`}>
                    {step > s
                      ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      : s}
                  </div>
                  <span className={`pp-step-label ${step === s ? "active" : ""}`}>{label}</span>
                  {i < 2 && <div className={`pp-step-line ${step > s ? "done" : ""}`} />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="pp-card">

          {/* ── STEP 1: Project Info ── */}
          {step === 1 && (
            <div className="pp-section">
              <div className="pp-section-label">
                <span className="pp-section-num">01</span>
                <span>Project Information</span>
              </div>

              <div className="pp-field">
                <label>Project Title <span className="pp-required">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. E-Commerce Landing Page Redesign"
                  value={form.title}
                  onChange={e => set("title", e.target.value)}
                />
              </div>

              <div className="pp-field-row">
                <div className="pp-field">
                  <label>Category <span className="pp-required">*</span></label>
                  <select value={form.category} onChange={e => { set("category", e.target.value); set("sub_category", ""); }}>
                    <option value="">Select Category</option>
                    {Object.keys(CATEGORIES).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="pp-field">
                  <label>Specialization <span className="pp-required">*</span></label>
                  <select value={form.sub_category} onChange={e => set("sub_category", e.target.value)} disabled={!form.category}>
                    <option value="">Select Specialization</option>
                    {subCategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pp-field">
                <label>Project Description <span className="pp-required">*</span></label>
                <textarea
                  rows={5}
                  placeholder="Describe your project in detail — what do you need, what's the expected outcome, any specific requirements..."
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                />
                <span className="pp-hint">{form.description.length} characters — aim for at least 100</span>
              </div>

              <div className="pp-field">
                <label>Project Image <span className="pp-optional">optional</span></label>
                <div className="pp-image-upload" onClick={() => document.getElementById('pp-img-input').click()}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="pp-image-preview" />
                  ) : (
                    <div className="pp-image-placeholder">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <p>Click to upload image</p>
                      <span>JPG, PNG, WebP — max 5MB</span>
                    </div>
                  )}
                </div>
                <input id="pp-img-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              </div>

              <button className="pp-next-btn" onClick={() => {
                if (!form.title || !form.category || !form.sub_category || !form.description) {
                  alert("Isi semua field yang wajib dulu!"); return;
                }
                setStep(2);
              }}>
                Continue
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          )}

          {/* ── STEP 2: Skills & Budget ── */}
          {step === 2 && (
            <div className="pp-section">
              <div className="pp-section-label">
                <span className="pp-section-num">02</span>
                <span>Skills & Budget</span>
              </div>

              <div className="pp-field">
                <label>Required Skills <span className="pp-required">*</span></label>
                <div className="pp-skill-input-row">
                  <input
                    type="text"
                    placeholder="e.g. React.js, Figma, Python..."
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button className="pp-add-skill-btn" onClick={addSkill}>Add</button>
                </div>
                <span className="pp-hint">Press Enter or comma to add a skill</span>

                {skills.length > 0 && (
                  <div className="pp-skills-tags">
                    {skills.map((sk, i) => (
                      <span className="pp-skill-tag" key={i}>
                        {sk}
                        <button onClick={() => removeSkill(sk)}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pp-field-row">
                <div className="pp-field">
                  <label>Budget <span className="pp-required">*</span></label>
                  <div className="pp-input-prefix">
                    <span>$</span>
                    <input
                      type="text"
                      placeholder="e.g. 500"
                      value={form.budget.replace(/[^0-9]/g, "")}
                      onChange={e => set("budget", "$" + e.target.value)}
                    />
                  </div>
                </div>
                <div className="pp-field">
                  <label>Deadline <span className="pp-required">*</span></label>
                  <input
                    type="date"
                    value={dateValue}
                    onChange={handleDateChange}
                  />
                  {form.deadline && (
                    <span className="pp-hint" style={{ color: "#10b981", marginTop: "4px" }}>
                      ✓ Selected: {form.deadline}
                    </span>
                  )}
                </div>
              </div>

              <div className="pp-btn-row">
                <button className="pp-back-step-btn" onClick={() => setStep(1)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  Back
                </button>
                <button className="pp-next-btn" onClick={() => {
                  if (!form.budget || !form.deadline) {
                    alert("Isi budget dan deadline dulu!"); return;
                  }
                  if (skills.length === 0) {
                    alert("Tambahkan minimal 1 skill!"); return;
                  }
                  setStep(3);
                }}>
                  Preview Project
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Preview ── */}
          {step === 3 && (
            <div className="pp-section">
              <div className="pp-section-label">
                <span className="pp-section-num">03</span>
                <span>Preview & Post</span>
              </div>

              <div className="pp-preview-card">
                {imagePreview && (
                  <img src={imagePreview} alt="Project" className="pp-preview-img" />
                )}
                <div className="pp-preview-body">
                  <div className="pp-preview-badges">
                    <span className="pp-preview-cat">{form.sub_category}</span>
                    <span className="pp-preview-status">● Open</span>
                  </div>
                  <h2 className="pp-preview-title">{form.title}</h2>
                  <p className="pp-preview-desc">{form.description}</p>

                  <div className="pp-preview-skills">
                    {skills.map((sk, i) => (
                      <span className="pp-preview-skill-tag" key={i}>{sk}</span>
                    ))}
                  </div>

                  <div className="pp-preview-meta">
                    <div className="pp-preview-meta-item">
                      <svg width="14" height="14" fill="none" stroke="#1a56db" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                      <span>{form.budget}</span>
                    </div>
                    <div className="pp-preview-meta-item">
                      <svg width="14" height="14" fill="none" stroke="#059669" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                      </svg>
                      <span>{form.deadline}</span>
                    </div>
                    <div className="pp-preview-meta-item">
                      <svg width="14" height="14" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      <span>{form.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pp-review-tip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
                Review your project before posting. Once posted, freelancers will be able to view and submit proposals.
              </div>

              <div className="pp-btn-row">
                <button className="pp-back-step-btn" onClick={() => setStep(2)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  Back
                </button>
                <button className="pp-submit-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <><span className="pp-spinner" />Posting...</>
                  ) : (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Post Project</>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
