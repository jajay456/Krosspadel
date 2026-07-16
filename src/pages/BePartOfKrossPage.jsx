import { useState } from "react";
import Footer from "../components/Footer";

const EMPTY = { name: "", company: "", email: "", phone: "", interest: "", message: "" };

export default function BePartOfKrossPage({ navigate }) {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 900));
    setSending(false);
    setForm(EMPTY);
    alert("Message sent! Hugo will be in touch shortly.");
  };

  const stats = [
    { value: "10+", label: "Premium Clubs", sub: "and Growing" },
    { value: "10+", label: "High-Standard", sub: "Courts" },
    { value: "5K+", label: "Active Players", sub: "and Community" },
    { value: "100+", label: "Events", sub: "Per Year" },
    { value: "4", label: "Prime Locations", sub: "in Bangkok" },
  ];

  const reasons = [
    { title: "Strong & Fast-Growing Brand", desc: "KROSS has established itself as one of the leading padel brands in Thailand, operating multiple venues and serving a rapidly growing community of players, partners, and corporate clients." },
    { title: "PROVEN & SCALABLE MODEL", desc: "Our business model has been validated across multiple locations, combining strong unit economics, operational excellence, and repeatable systems that support sustainable expansion." },
    { title: "ENGAGED COMMUNITY", desc: "At the core of KROSS is a highly active and loyal community built through leagues, tournaments, coaching programs, social events, and digital engagement." },
    { title: "DIVERSIFIED REVENUE STREAMS", desc: "Revenue is generated through multiple channels including court bookings, coaching, memberships, tournaments, events, sponsorships, retail, food & beverage, and technology solutions." },
    { title: "INTEGRATED ECOSYSTEM", desc: "Unlike traditional sports clubs, KROSS combines venues, events, coaching, technology, fitness, and lifestyle experiences into a single ecosystem, creating greater value for players, partners, and investors." },
  ];

  return (
    <div>
      {/* HERO */}
      <section id="hero" style={{ padding: 0 }}>
        <div className="hero-video-wrap" style={{
          background: `url(/image/night_court.png) center/cover no-repeat`
        }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow">Partnerships</div>
          <div className="hero-title">Be Part<br />Of Kross.</div>
          <div className="hero-sub">Thailand's leading premium sports club brand</div>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => document.querySelector("#ceo-contact").scrollIntoView({ behavior: "smooth" })}>Get In Touch</button>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="partner-section">
        <div className="partner-section-inner">
          <div className="tag">Partner With KROSS</div>
          <div className="heading" style={{ marginBottom: 32 }}>
            More Than A Sports Club.<br />A Movement.
          </div>
          <p className="body-txt" style={{ fontSize: 18, lineHeight: 1.9, maxWidth: 560 }}>
            KROSS is more than a venue. It is a rapidly growing racquet sports ecosystem where brands, communities, and experiences come together to create lasting impact.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="partner-section" style={{ background: "var(--mid)", padding: "56px clamp(20px, 5vw, 56px)" }}>
        <div className="partner-section-inner">
          <div className="stats-5col-grid">
            {stats.map((s, i) => (
              <div key={i} style={{
                padding: "36px 24px",
                background: "var(--mid2)",
                borderTop: "2px solid var(--green-highlight)",
                textAlign: "center",
              }}>
                <div style={{ fontFamily: "'Gotham Narrow', sans-serif", fontSize: 40, color: "var(--green-highlight)", lineHeight: 1, marginBottom: 10 }}>{s.value}</div>
                <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", opacity: 0.9, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 10, opacity: 0.4, letterSpacing: "1px", textTransform: "uppercase" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY PARTNER */}
      <section className="partner-section">
        <div className="partner-section-inner">
          <div className="tag">Why Partner With KROSS?</div>
          <div className="heading" style={{ marginBottom: 52 }}>What Sets Us Apart</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 2 }}>
            {reasons.map((r, i) => (
              <div key={i} style={{
                padding: "40px 32px",
                border: "1px solid var(--border)",
                background: "var(--mid)",
                transition: "border-color .3s"
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--green-highlight)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div style={{ fontSize: 10, letterSpacing: "2px", color: "var(--green-highlight)", textTransform: "uppercase", marginBottom: 14 }}>{r.title}</div>
                <p className="body-txt" style={{ fontSize: 13, margin: 0, lineHeight: 1.75 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CEO CONTACT */}
      <section id="ceo-contact" className="partner-section" style={{ background: "var(--mid)" }}>
        <div className="partner-section-inner">
          <div className="tag" style={{ marginBottom: 20 }}>Let's Build The Next KROSS Together</div>
          <div className="heading" style={{ marginBottom: 52 }}>Connect Directly<br />With Our CEO</div>
          <div className="partner-ceo-grid">
            {/* Left — CEO info */}
            <div>
              <p className="body-txt" style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 40 }}>
                Have a vision? A location? Or simply want to explore how we can work together?
                Reach out directly to our CEO.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "url('/image/team/Nacho.png')",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  border: "2px solid var(--green-highlight)",
                  flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28
                }}></div>
                <div>
                  <div style={{ fontFamily: "'Gotham Narrow', sans-serif", fontSize: 20, letterSpacing: "1px", marginBottom: 4 }}>NACHO CARBONERO</div>
                  <div style={{ fontSize: 12, color: "var(--green-highlight)", letterSpacing: "1px" }}>CEO & Co-Founder, KROSS</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: "✉", val: "info@krosspadel.com", href: "mailto:info@krosspadel.com" },
                  { icon: "📞", val: "+66 83 601 9836", href: "tel:+66836019836" },
                ].map((c, i) => (
                  <a key={i} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                    style={{ fontSize: 13, color: "var(--white)", textDecoration: "none", opacity: 0.75, display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 16 }}>{c.icon}</span>{c.val}
                  </a>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="partner-form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
                </div>
                <div className="form-group">
                  <label>Company / Organization *</label>
                  <input name="company" value={form.company} onChange={handleChange} placeholder="Company name" required />
                </div>
              </div>
              <div className="partner-form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                </div>
                <div className="form-group">
                  <label>Phone / LINE *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+66 or LINE ID" required />
                </div>
              </div>
              <div className="form-group">
                <label>Partnership Interest *</label>
                <select name="interest" value={form.interest} onChange={handleChange} required>
                  <option value="">Select partnership type...</option>
                  {["Franchise / New Club", "Brand Collaboration", "Sponsorship", "Venue Partnership", "Supplier / Equipment", "Other"].map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" value={form.message} onChange={handleChange}
                  placeholder="Tell us about your vision, location, or any questions you have..."
                  style={{ height: 120 }} />
              </div>
              <button type="submit" className="btn-primary" disabled={sending} style={{ opacity: sending ? 0.6 : 1 }}>
                {sending ? "Sending..." : "Connect With Our CEO"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  );
}
