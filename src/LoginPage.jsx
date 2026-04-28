import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const AnimatedPanel = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animFrame;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const stripes = [
      { color: "#2563eb", width: 0.16,  y: 0,   speed: 0.8 },
      { color: "#10b981", width: 0.14,  y: 300, speed: 0.8 },
      { color: "#ffffff", width: 0.025, y: 150, speed: 0.8 },
    ];

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#0b1426");
      bg.addColorStop(1, "#0e223f");

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Particles minimal
      ctx.save();
      for (let i = 0; i < 8; i++) {
        const px = ((Math.sin(t * 0.00025 + i) + 1) / 2) * w;
        const py = ((Math.cos(t * 0.0002 + i) + 1) / 2) * h;

        const alpha = ((Math.sin(t * 0.0003 + i) + 1) / 2) * 0.10;

        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147,197,253,${alpha})`;
        ctx.fill();
      }
      ctx.restore();

stripes.forEach((s) => {

  const stripeH = s.width * h;
  const skewX = h * 0.25;

  // gerakan ke atas
  s.y -= s.speed;

  // jika sudah benar-benar keluar layar
if (s.y + stripeH + skewX < 0) {
  s.y = h + skewX;
}


  const y = s.y;

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(0, y + skewX);
  ctx.lineTo(w, y);
  ctx.lineTo(w, y + stripeH);
  ctx.lineTo(0, y + stripeH + skewX);
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, 0, w, 0);

  grad.addColorStop(0, s.color + "55");
  grad.addColorStop(0.5, s.color);
  grad.addColorStop(1, s.color + "55");

  ctx.globalAlpha = s.color === "#ffffff" ? 0.25 : 0.32;

  ctx.fillStyle = grad;
  ctx.fill();

  ctx.restore();

});

      // Soft light orb
      const orbX = w * 0.3 + Math.sin(t * 0.0003) * 10;
      const orbY = h * 0.4 + Math.cos(t * 0.0003) * 10;

      const orb = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, 240);

      orb.addColorStop(0, "rgba(37,99,235,0.18)");
      orb.addColorStop(1, "transparent");

      ctx.fillStyle = orb;
      ctx.fillRect(0, 0, w, h);

      t++;

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

 const handleLogin = async () => {
  setLoading(true);

  try {
    const res = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } else {
      alert(data.message || 'Login gagal');
    }
  } catch (err) {
    alert('Tidak bisa terhubung ke server');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="page-wrapper">

      <div className={`login-card ${mounted ? "show" : ""}`}>

        <div className="left-panel">

          <AnimatedPanel />

          <div className="left-text">

            <div className="badge">
              <div className="dot-pulse" />
              Secure Connection
            </div>

            <div className="app-title">
                 Scope<span className="accent">Sync</span>
            </div>

          </div>

        </div>


        <div className={`form-panel ${mounted ? "show" : ""}`}>
        
          <div className="form-header">

            <h1 className="form-title">Welcome👋</h1>

            <p className="form-subtitle">
              Manage your freelance projects better.<br/>
            </p>

          </div>

          <div className="form-fields">

            <div className="field-group">
              <label className="label">Email</label>

              <input
                className="input-field"
                type="email"
                placeholder="Enter your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field-group">

              <label className="label">Password</label>

              <div className="input-wrapper">

                <input
                  className="input-field"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: "44px" }}
                />

                 <img
                  src={showPass ? "/eyeoff.svg" : "/eye.svg"}
                  alt="toggle password"
                 className="eye-icon"
        onClick={() => setShowPass(!showPass)}
      />

              </div>
            </div>

            <button className="btn-login" onClick={handleLogin}>

              {loading ? (
                <span className="loading-content">
                  <span className="spinner" />
                  Signing in...
                </span>
              ) : (
                "Login Now"
              )}

            </button>

            <div className="forgot-wrapper">
              <a className="forgot-link">Forget Password?</a>
            </div>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or</span>
              <div className="divider-line" />
            </div>

            <button className="btn-google">

              <svg width="18" height="18" viewBox="0 0 24 24">

                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>

              </svg>

              Continue with Google

            </button>

          </div>

          <p className="register-text">
            Don't have an account?{" "}
            <a className="register-link" onClick={() => navigate("/signup")}>
            Register now
            </a>
          </p>

        </div>

      </div>

    </div>
  );
}