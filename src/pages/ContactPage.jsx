import { useState } from "react";
import Footer from "../components/Footer";

// The form opens the visitor's own email client (mailto:) with the message
// pre-filled and addressed to KROSS — the visitor then hits Send themselves.
// No backend or API key required.
const CONTACT_EMAIL = "info@krosspadel.com";

export default function ContactPage({ navigate, notify }) {
  const [form, setForm] = useState({ name: "", last_name: "", email: "", title: "General Enquiry", message: "" });

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullName = `${form.name} ${form.last_name}`.trim();
    const subject = `[KROSS Contact] ${form.title} — ${fullName}`.trim();
    const body = [
      `Name: ${fullName}`,
      `Email: ${form.email}`,
      `Subject: ${form.title}`,
      "",
      form.message,
    ].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    notify("Opening your email app to send the message…");
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section id="hero" style={{ padding: 0 }}>
        <div className="hero-video-wrap" style={{
          backgroundImage: " linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),url('/image/backgrounds/YOT_2609.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
           }} />
        <div className="hero-content">
          <div className="hero-eyebrow">We'd Love To Hear From You</div>
          <div className="hero-title">Get In Touch</div>
          <div className="hero-sub">Reach out for court bookings, partnerships, or just to say hello</div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section style={{ padding: "100px clamp(24px, 5vw, 72px)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="grid-contact" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 100, alignItems: "start" }}>
            {/* CONTACT INFO */}
            <div>
              <div className="tag">Get In Touch</div>
              <div className="heading" style={{ marginBottom: 56 }}>Contact<br />Information</div>
              {[
                ["Email", "info@krosspadel.com"],
                ["Phone", "On Nut: 097-285-6133\nAsoke: 084-043-8893\nThonglor: 080-331-3883\nRama 4: 091-860-7150"],
                ["Instagram", "@krosspadelbangkok\n@krosspadelasoke\n@krosspadelsky\n@krosspadelindoor"],
                ["Hours", "On Nut & Rama 4: 07:00–23:00\nAsoke: 07:00–22:00\nThonglor: 08:00–22:00"],
              ].map(([k, v]) => (
                <div key={k} style={{ marginBottom: 40 }}>
                  <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.5, marginBottom: 8, fontWeight: 600 }}>{k}</div>
                  <div style={{ fontSize: 15, lineHeight: 1.9, opacity: 0.9, whiteSpace: "pre-line" }}>{v}</div>
                </div>
              ))}
            </div>

            {/* CONTACT FORM */}
            <form onSubmit={handleSubmit} style={{ padding: 40, border: "1px solid var(--border)", background: "var(--mid2)" }}>
              <div className="tag" style={{ marginBottom: 24 }}>Send Us A Message</div>
              <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, display: "block", textTransform: "uppercase", letterSpacing: 0.5 }}>First Name</label>
                  <input name="name" type="text" placeholder="John" required value={form.name} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", background: "var(--dark)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, display: "block", textTransform: "uppercase", letterSpacing: 0.5 }}>Last Name</label>
                  <input name="last_name" type="text" placeholder="Doe" value={form.last_name} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", background: "var(--dark)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", fontSize: 14 }} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, display: "block", textTransform: "uppercase", letterSpacing: 0.5 }}>Email</label>
                <input name="email" type="email" placeholder="you@email.com" required value={form.email} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", background: "var(--dark)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", fontSize: 14 }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, display: "block", textTransform: "uppercase", letterSpacing: 0.5 }}>Subject</label>
                <select name="title" value={form.title} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", background: "var(--dark)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", fontSize: 14 }}>
                  {["General Enquiry", "Court Booking", "Membership", "Coaching", "Events & Tournaments"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, display: "block", textTransform: "uppercase", letterSpacing: 0.5 }}>Message</label>
                <textarea name="message" placeholder="Tell us how we can help..." rows={6} required value={form.message} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", background: "var(--dark)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", fontSize: 14, resize: "vertical" }} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: "100%" }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* VENUE CONTACTS SECTION */}
      <section style={{ padding: "100px clamp(24px, 5vw, 72px)", background: "var(--mid2)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="tag">Venues</div>
          <div className="heading" style={{ marginBottom: 56 }}>Find Us</div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 2
          }}>
            {[
              { venue: "On Nut", phone: "097-285-6133", hours: "07:00–23:00", address: "89 Soi Chinnamat, Phra Khanong" },
              { venue: "Asoke", phone: "084-043-8893", hours: "07:00–22:00", address: "30 Sukhumvit 21 Rd, 8F" },
              { venue: "Sky", phone: "080-331-3883", hours: "08:00–22:00", address: "88 Soi Sukhumvit 49" },
              { venue: "Indoor", phone: "091-860-7150", hours: "07:00–23:00", address: "135 Ardnarong Road, Khlong Toei" },
            ].map((item, i) => (
              <div key={i} style={{
                padding: "40px 36px",
                background: "var(--black)",
                borderTop: "2px solid var(--green-highlight)",
              }}>
                <div style={{
                  fontFamily: "'Gotham Narrow', sans-serif",
                  fontSize: 28,
                  letterSpacing: 2,
                  marginBottom: 28,
                  color: "var(--white)"
                }}>KROSS {item.venue}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", opacity: 0.4, marginBottom: 6 }}>Phone</div>
                    <div style={{ fontSize: 15, opacity: 0.9 }}>{item.phone}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", opacity: 0.4, marginBottom: 6 }}>Hours</div>
                    <div style={{ fontSize: 15, opacity: 0.9 }}>Daily {item.hours}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", opacity: 0.4, marginBottom: 6 }}>Address</div>
                    <div style={{ fontSize: 13, opacity: 0.55, lineHeight: 1.6 }}>{item.address}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* EMAIL ROW */}
          <div style={{
            marginTop: 2,
            padding: "36px 36px",
            background: "var(--black)",
            borderTop: "2px solid var(--green-highlight)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 24
          }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", opacity: 0.4, marginBottom: 8 }}>General Enquiries</div>
              <div style={{ fontFamily: "'Gotham Narrow', sans-serif", fontSize: 24, letterSpacing: 1.5 }}>info@krosspadel.com</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", opacity: 0.4, marginBottom: 8 }}>Instagram</div>
              <div style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.9 }}>
                @krosspadelbangkok · @krosspadelasoke<br />
                @krosspadelsky · @krosspadelindoor
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  );
}