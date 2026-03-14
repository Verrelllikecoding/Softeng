import { useNavigate, useParams } from "react-router-dom";
import "./ProjectDetail.css";

const PROJECTS = {
  1: {
    id: 1,
    title: "Landing Page E-Commerce Fashion",
    category: "Technology",
    sub: "Web Development",
    budget: "Rp 3.000.000",
    deadline: "15 Apr 2025",
    client: "Andi Wijaya",
    clientAvatar: "AW",
    clientJob: "Owner - Toko Fashion Lokal",
    clientRating: 4.8,
    clientProjects: 12,
    posted: "2 hari lalu",
    status: "Open",
    desc: "Kami membutuhkan seorang freelancer berpengalaman untuk membangun landing page modern dan responsif untuk brand fashion lokal kami. Halaman ini harus mencerminkan identitas brand yang elegan dan profesional.",
    sections: [
      {
        title: "Deskripsi Project",
        content: "Landing page ini ditujukan untuk meningkatkan konversi penjualan online. Desain harus clean, mobile-first, dan mampu menampilkan koleksi produk dengan baik. Integrasi dengan payment gateway (Midtrans atau Xendit) diperlukan untuk proses checkout yang mulus.",
      },
      {
        title: "Requirement Teknis",
        content: "Teknologi yang digunakan bebas (React, Next.js, atau HTML/CSS biasa). Harus responsif di semua ukuran layar. Page speed score minimal 85 di Google PageSpeed Insights. SEO-friendly dengan meta tags yang tepat.",
      },
      {
        title: "Deliverable",
        content: "Source code lengkap, dokumentasi singkat cara deploy, desain mobile & desktop (jika freelancer juga handle desain), dan revisi maksimal 3 kali setelah pengiriman pertama.",
      },
    ],
    skills: ["React.js", "Tailwind CSS", "UI/UX", "Payment Gateway", "SEO"],
    attachments: ["brief_brand.pdf", "referensi_desain.zip"],
    proposals: 7,
  },
  2: {
    id: 2,
    title: "Machine Learning Recommendation System",
    category: "Technology",
    sub: "Machine Learning",
    budget: "Rp 12.000.000",
    deadline: "30 Apr 2025",
    client: "Startup Teknologi",
    clientAvatar: "ST",
    clientJob: "CTO - Marketplace Startup",
    clientRating: 4.5,
    clientProjects: 5,
    posted: "1 hari lalu",
    status: "Open",
    desc: "Startup kami membutuhkan sistem rekomendasi produk yang cerdas untuk meningkatkan engagement dan penjualan di platform marketplace kami yang memiliki lebih dari 50.000 produk aktif.",
    sections: [
      {
        title: "Deskripsi Project",
        content: "Sistem rekomendasi berbasis collaborative filtering dan content-based filtering. Data pengguna dan produk sudah tersedia dalam format CSV/JSON. Sistem harus mampu memberikan rekomendasi real-time dengan latensi maksimal 200ms.",
      },
      {
        title: "Requirement Teknis",
        content: "Python (scikit-learn, TensorFlow, atau PyTorch). REST API endpoint untuk serving rekomendasi. Model harus bisa di-retrain secara berkala dengan data baru. Dokumentasi teknis lengkap wajib disertakan.",
      },
      {
        title: "Deliverable",
        content: "Model ML terlatih, REST API siap deploy, notebook Jupyter berisi proses training dan evaluasi, laporan performa model (precision, recall, NDCG), dan dokumentasi teknis.",
      },
    ],
    skills: ["Python", "Machine Learning", "TensorFlow", "REST API", "Data Science"],
    attachments: ["dataset_sample.csv", "api_spec.pdf"],
    proposals: 3,
  },
  3: {
    id: 3,
    title: "Redesign Dashboard Admin App",
    category: "Design & Creative",
    sub: "UI/UX Design",
    budget: "Rp 5.000.000",
    deadline: "20 Apr 2025",
    client: "Budi Santoso",
    clientAvatar: "BS",
    clientJob: "Product Manager - Logistik",
    clientRating: 4.9,
    clientProjects: 20,
    posted: "3 hari lalu",
    status: "Open",
    desc: "Aplikasi logistik kami memiliki dashboard admin yang sudah outdated dan sulit digunakan. Kami ingin redesign total dengan pendekatan user-centered design agar tim operasional lebih produktif.",
    sections: [
      {
        title: "Deskripsi Project",
        content: "Dashboard mencakup: monitoring pengiriman real-time, manajemen driver, laporan keuangan, dan manajemen pelanggan. Saat ini menggunakan UI yang dibuat tahun 2019 dan banyak fitur baru yang ditambahkan tanpa perencanaan desain yang baik.",
      },
      {
        title: "Requirement Desain",
        content: "Desain menggunakan Figma. Warna brand sudah ada (biru tua dan oranye). Harus memperhatikan information hierarchy yang jelas. Komponen design system yang konsisten dan reusable. Prototype interaktif untuk user testing.",
      },
      {
        title: "Deliverable",
        content: "File Figma lengkap (wireframe + high fidelity), design system/component library, prototype interaktif, panduan handoff untuk developer, dan laporan singkat UX rationale.",
      },
    ],
    skills: ["Figma", "UI Design", "UX Research", "Design System", "Prototyping"],
    attachments: ["current_dashboard_screenshot.pdf", "brand_guideline.pdf"],
    proposals: 11,
  },
};

const categoryColors = {
  "Technology": { bg: "#dbeafe", color: "#1d4ed8" },
  "Design & Creative": { bg: "#fce7f3", color: "#be185d" },
  "Marketing": { bg: "#d1fae5", color: "#065f46" },
  "Business & Consulting": { bg: "#fef3c7", color: "#92400e" },
};

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


export default function ProjectDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const project = PROJECTS[parseInt(id)] || PROJECTS[1];
  const catColor = categoryColors[project.category];

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
                <div className="detail-thumb-icon">
                  {project.sub === "Web Development" ? "💻" :
                   project.sub === "UI/UX Design" ? "🎨" :
                   project.sub === "Machine Learning" ? "🤖" :
                   project.sub === "Mobile Development" ? "📱" : "📁"}
                </div>
              </div>
              <div className="detail-header-info">
                <div className="detail-badges">
                  <span className="detail-cat-badge" style={{ background: catColor.bg, color: catColor.color }}>
                    {project.sub}
                  </span>
                  <span className="detail-status-badge">🟢 {project.status}</span>
                  <span className="detail-posted">Diposting {project.posted}</span>
                </div>
                <h1 className="detail-title">{project.title}</h1>
                <p className="detail-desc">{project.desc}</p>
                <div className="detail-meta-row">
                  <div className="detail-meta-item">
                    <span className="dm-label">💰 Budget</span>
                    <span className="dm-val">{project.budget}</span>
                  </div>
                  <div className="detail-meta-item">
                    <span className="dm-label">📅 Deadline</span>
                    <span className="dm-val">{project.deadline}</span>
                  </div>
                  <div className="detail-meta-item">
                    <span className="dm-label">📨 Proposal Masuk</span>
                    <span className="dm-val">{project.proposals} freelancer</span>
                  </div>
                </div>
              </div>
            </div>

      
            {project.sections.map((s, i) => (
              <div className="detail-section" key={i}>
                <h2 className="detail-section-title">{s.title}</h2>
                <p className="detail-section-content">{s.content}</p>
              </div>
            ))}

        
            <div className="detail-section">
              <h2 className="detail-section-title">Skill yang Dibutuhkan</h2>
              <div className="skills-list">
                {project.skills.map((sk, i) => (
                  <span className="skill-tag" key={i}>{sk}</span>
                ))}
              </div>
            </div>

      
            <div className="detail-section">
              <h2 className="detail-section-title">Lampiran</h2>
              <div className="attachments">
                {project.attachments.map((a, i) => (
                  <div className="attachment-item" key={i}>
                    <span className="att-icon">📎</span>
                    <span className="att-name">{a}</span>
                    <span className="att-dl">↓ Unduh</span>
                  </div>
                ))}
              </div>
            </div>

     
            <div className="detail-cta-bar">
              <button className="btn-back" onClick={() => navigate("/projects")}>
                ← Kembali ke Projects
              </button>
              <button className="btn-make-proposal" onClick={() => navigate("/signup")}>
                Buat Proposal Sekarang →
              </button>
            </div>
          </div>

      
          <aside className="detail-sidebar">

          
            <div className="ds-card">
              <div className="ds-card-title">Tentang Client</div>
              <div className="ds-client">
                <div className="ds-avatar">{project.clientAvatar}</div>
                <div>
                  <div className="ds-client-name">{project.client}</div>
                  <div className="ds-client-job">{project.clientJob}</div>
                </div>
              </div>
              <div className="ds-client-stats">
                <div className="ds-stat">
                  <span className="ds-stat-num">⭐ {project.clientRating}</span>
                  <span className="ds-stat-label">Rating</span>
                </div>
                <div className="ds-stat-div" />
                <div className="ds-stat">
                  <span className="ds-stat-num">{project.clientProjects}</span>
                  <span className="ds-stat-label">Total Project</span>
                </div>
              </div>
            </div>

    
            <div className="ds-card">
              <div className="ds-card-title">Ringkasan Project</div>
              <div className="ds-summary">
                <div className="ds-row">
                  <span className="ds-row-label">Kategori</span>
                  <span className="ds-row-val">{project.category}</span>
                </div>
                <div className="ds-row">
                  <span className="ds-row-label">Bidang</span>
                  <span className="ds-row-val">{project.sub}</span>
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
                  <span className="ds-row-label">Proposal</span>
                  <span className="ds-row-val">{project.proposals} masuk</span>
                </div>
              </div>
            </div>

    
            <div className="ds-card cta-card">
              <div className="ds-card-title">Tertarik dengan project ini?</div>
              <p className="cta-desc">Login atau daftar untuk langsung membuat proposal dengan bantuan AI kami.</p>
              <button className="btn-make-proposal full" onClick={() => navigate("/signup")}>
                Buat Proposal →
              </button>
              <button className="btn-login-cta" onClick={() => navigate("/login")}>
                Sudah punya akun? Login
              </button>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
