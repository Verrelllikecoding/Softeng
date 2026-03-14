import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectPage.css";

const PROJECTS = [
  { id: 1, title: "Landing Page E-Commerce Fashion", category: "Technology", sub: "Web Development", budget: "Rp 3.000.000", deadline: "15 Apr 2025", client: "Andi Wijaya", clientAvatar: "AW", desc: "Butuh landing page modern untuk brand fashion lokal dengan integrasi payment gateway." },
  { id: 2, title: "Machine Learning Recommendation System", category: "Technology", sub: "Machine Learning", budget: "Rp 12.000.000", deadline: "30 Apr 2025", client: "Startup Teknologi", clientAvatar: "ST", desc: "Sistem rekomendasi produk berbasis collaborative filtering untuk platform marketplace." },
  { id: 3, title: "Redesign Dashboard Admin App", category: "Design & Creative", sub: "UI/UX Design", budget: "Rp 5.000.000", deadline: "20 Apr 2025", client: "Budi Santoso", clientAvatar: "BS", desc: "Redesign dashboard admin aplikasi logistik agar lebih intuitif dan modern." },
  { id: 4, title: "Branding & Visual Identity Startup", category: "Design & Creative", sub: "Branding", budget: "Rp 7.500.000", deadline: "10 Mei 2025", client: "Rini Kusuma", clientAvatar: "RK", desc: "Pembuatan logo, brand guideline, dan aset visual untuk startup fintech baru." },
  { id: 5, title: "Ilustrasi Karakter untuk Game Mobile", category: "Design & Creative", sub: "Ilustrasi", budget: "Rp 4.000.000", deadline: "25 Apr 2025", client: "GameStudio ID", clientAvatar: "GS", desc: "Butuh 10 karakter hero dan villain untuk game RPG mobile dengan gaya anime." },
  { id: 6, title: "Kampanye Google Ads & Meta Ads", category: "Marketing", sub: "Digital Ads", budget: "Rp 6.000.000", deadline: "1 Mei 2025", client: "Toko Online Maju", clientAvatar: "TM", desc: "Pengelolaan iklan berbayar untuk meningkatkan ROAS produk skincare lokal." },
  { id: 7, title: "Konten SEO Blog Teknologi", category: "Marketing", sub: "SEO & Content", budget: "Rp 2.500.000", deadline: "5 Mei 2025", client: "Media Digital", clientAvatar: "MD", desc: "Penulisan 20 artikel SEO-friendly untuk blog teknologi dengan target keyword spesifik." },
  { id: 8, title: "Strategi Social Media Brand FMCG", category: "Marketing", sub: "Social Media", budget: "Rp 8.000.000", deadline: "15 Mei 2025", client: "PT Maju Bersama", clientAvatar: "MB", desc: "Pengelolaan konten dan strategi posting untuk Instagram, TikTok, dan Twitter." },
  { id: 9, title: "Business Plan Startup Kuliner", category: "Business & Consulting", sub: "Business Plan", budget: "Rp 4.500.000", deadline: "12 Mei 2025", client: "Dian Pratiwi", clientAvatar: "DP", desc: "Penyusunan business plan lengkap untuk startup kuliner yang akan pitching ke investor." },
  { id: 10, title: "Analisis Keuangan & Laporan Investor", category: "Business & Consulting", sub: "Financial Analysis", budget: "Rp 9.000.000", deadline: "20 Mei 2025", client: "Venture Capital ID", clientAvatar: "VC", desc: "Analisis laporan keuangan 3 perusahaan portofolio dan penyusunan investor deck." },
  { id: 11, title: "Mobile App Manajemen Laundry", category: "Technology", sub: "Mobile Development", budget: "Rp 15.000.000", deadline: "1 Jun 2025", client: "Laundry Express", clientAvatar: "LE", desc: "Aplikasi mobile Android & iOS untuk manajemen order, pickup, dan delivery laundry." },
  { id: 12, title: "Fotografi Produk Katalog Online", category: "Design & Creative", sub: "Photography", budget: "Rp 3.500.000", deadline: "8 Mei 2025", client: "Batik Nusantara", clientAvatar: "BN", desc: "Sesi foto produk untuk 50 item batik premium untuk katalog e-commerce dan lookbook." },
];

const CATEGORIES = {
  "Technology": ["Web Development", "Mobile Development", "Machine Learning", "Data Analysis"],
  "Design & Creative": ["UI/UX Design", "Branding", "Ilustrasi", "Photography"],
  "Marketing": ["Digital Ads", "SEO & Content", "Social Media", "Email Marketing"],
  "Business & Consulting": ["Business Plan", "Financial Analysis", "Market Research", "HR Consulting"],
};

const SORT_OPTIONS = ["Relevansi", "Budget Tertinggi", "Budget Terendah", "Deadline Terdekat"];

const categoryColors = {
  "Technology": { bg: "#dbeafe", color: "#1d4ed8" },
  "Design & Creative": { bg: "#fce7f3", color: "#be185d" },
  "Marketing": { bg: "#d1fae5", color: "#065f46" },
  "Business & Consulting": { bg: "#fef3c7", color: "#92400e" },
};

const Navbar = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <nav className="pnav">
      <div className="pnav-inner">
        <div className="pnav-logo" onClick={() => navigate("/")}>
          Proposal<span className="pnav-accent">in</span>
        </div>
        <div className="pnav-links">
          <span onClick={() => navigate("/")}>Features</span>
          <span onClick={() => navigate("/")}>How It Works</span>
          <span className="active">Projects</span>
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

export default function ProjectPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [sort, setSort] = useState("Relevansi");
  const [expandedCats, setExpandedCats] = useState(["Technology", "Design & Creative", "Marketing", "Business & Consulting"]);

  const toggleSub = (sub) => {
    setSelectedSubs(prev =>
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const toggleCat = (cat) => {
    setExpandedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const filtered = PROJECTS.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sub.toLowerCase().includes(search.toLowerCase());
    const matchSub = selectedSubs.length === 0 || selectedSubs.includes(p.sub);
    return matchSearch && matchSub;
  }).sort((a, b) => {
    if (sort === "Budget Tertinggi") return parseInt(b.budget.replace(/\D/g, "")) - parseInt(a.budget.replace(/\D/g, ""));
    if (sort === "Budget Terendah") return parseInt(a.budget.replace(/\D/g, "")) - parseInt(b.budget.replace(/\D/g, ""));
    return 0;
  });

  return (
    <div className="project-page">
      <Navbar />

      <div className="project-body">
  
        <aside className="sidebar">
          <div className="sidebar-title">Filter Kategori</div>

          {Object.entries(CATEGORIES).map(([cat, subs]) => (
            <div className="sidebar-cat" key={cat}>
              <div className="sidebar-cat-header" onClick={() => toggleCat(cat)}>
                <span>{cat}</span>
                <span className={`sidebar-chevron ${expandedCats.includes(cat) ? "open" : ""}`}>›</span>
              </div>
              {expandedCats.includes(cat) && (
                <div className="sidebar-subs">
                  {subs.map(sub => (
                    <label className="sidebar-check" key={sub}>
                      <input
                        type="checkbox"
                        checked={selectedSubs.includes(sub)}
                        onChange={() => toggleSub(sub)}
                      />
                      <span>{sub}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          {selectedSubs.length > 0 && (
            <button className="btn-clear-filter" onClick={() => setSelectedSubs([])}>
              Hapus Filter ({selectedSubs.length})
            </button>
          )}
        </aside>

     
        <main className="project-main">
        
          <div className="project-toolbar">
            <div className="search-box">
              <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                placeholder="Cari project..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="project-count">
              <span className="count-num">{filtered.length}</span> project ditemukan
            </div>

            <div className="sort-box">
              <span>Urutkan:</span>
              <select value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <button className="btn-create-project" onClick={() => navigate("/signup")}>
              + Post Project
            </button>
          </div>

         
          {selectedSubs.length > 0 && (
            <div className="active-filters">
              {selectedSubs.map(sub => (
                <span className="filter-tag" key={sub}>
                  {sub}
                  <span onClick={() => toggleSub(sub)}>×</span>
                </span>
              ))}
            </div>
          )}

         
          {filtered.length > 0 ? (
            <div className="project-grid">
              {filtered.map(p => (
                <div className="project-card" key={p.id}>
             
                  <div className="card-thumb">
                    <div className="card-thumb-icon">
                      {p.sub === "Web Development" ? "💻" :
                       p.sub === "UI/UX Design" ? "🎨" :
                       p.sub === "Mobile Development" ? "📱" :
                       p.sub === "Machine Learning" ? "🤖" :
                       p.sub === "Digital Ads" ? "📢" :
                       p.sub === "SEO & Content" ? "✍️" :
                       p.sub === "Social Media" ? "📱" :
                       p.sub === "Branding" ? "✨" :
                       p.sub === "Photography" ? "📷" :
                       p.sub === "Ilustrasi" ? "🖌️" :
                       p.sub === "Business Plan" ? "📊" :
                       p.sub === "Financial Analysis" ? "💹" : "📁"}
                    </div>
                    <span
                      className="card-cat-badge"
                      style={{ background: categoryColors[p.category]?.bg, color: categoryColors[p.category]?.color }}
                    >
                      {p.sub}
                    </span>
                  </div>

              
                  <div className="card-content">
                    <h3 className="card-title">{p.title}</h3>
                    <p className="card-desc">{p.desc}</p>

                    <div className="card-meta">
                      <div className="card-meta-item">
                        <span className="meta-icon">💰</span>
                        <span className="meta-val">{p.budget}</span>
                      </div>
                      <div className="card-meta-item">
                        <span className="meta-icon">📅</span>
                        <span className="meta-val">{p.deadline}</span>
                      </div>
                    </div>

                    <div className="card-footer">
                      <div className="card-client">
                        <div className="client-avatar">{p.clientAvatar}</div>
                        <div>
                          <div className="client-name">{p.client}</div>
                          <div className="client-label">Client</div>
                        </div>
                      </div>
                      <button className="btn-take" onClick={() => navigate(`/projects/${p.id}`)}>
                         Lihat Detail →
                    </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">Tidak ada project ditemukan</div>
              <div className="empty-sub">Coba ubah filter atau kata kunci pencarian</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
