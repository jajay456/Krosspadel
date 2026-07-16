import Footer from "../components/Footer";

export default function ComingSoonPage({ navigate, title = "WhatsApp", icon = "💬" }) {
  return (
    <div>
      <section id="hero" style={{ padding: 0 }}>
        <div className="hero-video-wrap" style={{
          background: "linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 100%)"
        }} />
        <div className="hero-content">
          <div className="hero-eyebrow">Coming Soon</div>
          <div className="hero-title">{title}</div>
          <div className="hero-sub">Coming Soon — Currently Under Development</div>
        </div>
      </section>

      <section style={{ padding: "120px clamp(24px, 5vw, 72px)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 72, marginBottom: 32 }}>{icon}</div>
          <div className="heading" style={{ marginBottom: 24 }}>Under Development</div>
          <p className="body-txt" style={{ fontSize: 18, opacity: 0.75, marginBottom: 48, lineHeight: 1.8 }}>
            This feature is currently under development. It will be available soon.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => navigate("home")}>Back to Home</button>
            <a
              href="https://line.me/ti/p/~@krosspadel"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
              style={{ textDecoration: "none" }}
            >Contact via LINE</a>
          </div>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  );
}
