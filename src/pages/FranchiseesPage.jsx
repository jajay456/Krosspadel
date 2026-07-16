import { useState } from "react";
import Footer from "../components/Footer";

const EMPTY_FORM = { name: "", company: "", email: "", phone: "", message: "" };

export default function FranchiseesPage({ navigate, notify }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);

  const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 800));
    setSending(false);
    setForm(EMPTY_FORM);
    notify("Partnership inquiry sent! We'll be in touch within 2 business days.");
  };

  const packageItems = [
    { title: "Brand License & Identity Pack", desc: "Logos, color codes, templates, signage guidelines." },
    { title: "Club Design & Build Support", desc: "Floor plans, lighting schemes, spectator areas, F&B corners." },
    { title: "Booking App & Tech Setup", desc: "White-label app, user onboarding, data migration." },
    { title: "Staff Training Program", desc: "Coaching syllabus, customer service scripts, cross protocols." },
    { title: "Event & Tournament Toolkit", desc: "Branding kits, prize-giving templates, social media calendar." },
    { title: "Supplier & Sponsor Introductions", desc: "Equipment deals, beverage partnerships, apparel discounts." },
    { title: "Marketing Launch Campaign", desc: "Press release template, influencer kit, local activations guide." },
  ];

  const whyItems = [
    { title: "Brand Power and Recognition", desc: "Instant credibility in competitive markets." },
    { title: "Turnkey Digital Platform", desc: "Our booking app, CRM and member portal come pre-integrated." },
    { title: "Preferred Supplier Network", desc: "Guaranteed lead times & volume discounts on courts, balls, racks, apparel." },
    { title: "Proven Training & Ops", desc: "Comprehensive on-site and remote training modules for staff at every level." },
    { title: "Event Ecosystem", desc: "Access to our tournament calendar, DJs, sponsors (Corona, PEACHES Active) and community activations." },
  ];

  return (
    <div>
      {/* HERO */}
      <section id="hero" style={{ padding: 0 }}>
        <div className="hero-video-wrap" style={{
          background: `url(/image/night_court.png) center/cover no-repeat`
        }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow">Franchise Opportunity</div>
          <div className="hero-title">KROSS Franchisees</div>
          <div className="hero-sub">Bring the KROSS experience to your city</div>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => document.querySelector("#contact-form").scrollIntoView({ behavior: "smooth" })}>Get In Touch</button>
          </div>
        </div>
      </section>

      {/* FRANCHISE INTRO */}
      <section className="partner-section">
        <div className="partner-section-inner">
          <div className="tag">Franchise With KROSS</div>
          <div className="heading" style={{ fontSize: "clamp(40px, 6vw, 80px)", marginBottom: 32 }}>
            Be Part Of Something Bigger.
          </div>
          <p className="body-txt" style={{ fontSize: 18, lineHeight: 1.9, maxWidth: 560 }}>
            Kross is more than a sports club. It's a community, a lifestyle and a global movement. Now you can bring the Kross experience to your city.
          </p>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="partner-section" style={{ background: "var(--mid)" }}>
        <div className="partner-section-inner">
          <div className="tag">The KROSS Philosophy</div>
          <div className="heading" style={{ marginBottom: 32 }}>Our Team As The Heart<br />Of Our Community</div>
          <p className="body-txt" style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 64, maxWidth: 680 }}>
            At Kross, we believe that our team is the foundation of our success. Our philosophy is built on three key principles: connection, growth, and long-term commitment.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 2 }}>
            {[
              { title: "Connection", sub: "Training, playing and engaging with the community" },
              { title: "Growth", sub: "Building our team from the ground up" },
              { title: "Expanding KROSS", sub: "Beyond Bangkok" },
            ].map((item, i) => (
              <div key={i} style={{ padding: "40px 36px", border: "1px solid var(--border)", background: "var(--dark)" }}>
                <div style={{ fontSize: 10, letterSpacing: "2px", color: "var(--green-highlight)", textTransform: "uppercase", marginBottom: 12 }}>{item.title}</div>
                <div style={{ fontSize: 13, letterSpacing: "1.5px", textTransform: "uppercase", opacity: 0.65, lineHeight: 1.6 }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FRANCHISE PACKAGE */}
      <section className="partner-section">
        <div className="partner-section-inner">
          <div className="tag">What You Get</div>
          <div className="heading" style={{ marginBottom: 24 }}>A Complete<br />Franchise Package</div>
          <p className="body-txt" style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 64, maxWidth: 640 }}>
            From day one, we equip you with everything you need to launch confidently. Our package includes brand assets, operational manuals, step-by-step best practices, and live support 24/7 during your first year.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 2 }}>
            {packageItems.map((item, i) => (
              <div key={i} style={{ padding: "32px 28px", border: "1px solid var(--border)", background: "var(--mid)", transition: "border-color .3s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--green-highlight)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>{item.title}</div>
                <p className="body-txt" style={{ fontSize: 13, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY KROSS */}
      <section className="partner-section" style={{ background: "var(--mid)" }}>
        <div className="partner-section-inner">
          <div className="tag">Why KROSS?</div>
          <div className="heading" style={{ marginBottom: 64 }}>What Sets Us Apart</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 2 }}>
            {whyItems.map((item, i) => (
              <div key={i} style={{ padding: "36px 28px", border: "1px solid var(--border)", background: "var(--dark)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12, color: "var(--green-highlight)" }}>{item.title}</div>
                <p className="body-txt" style={{ fontSize: 13, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + FORM */}
      <section id="contact-form" className="partner-section">
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="form-contact-grid">
            <div>
              <div className="tag">Let's Build The Next KROSS Together</div>
              <div className="heading" style={{ marginBottom: 24 }}>Ready To Get Started?</div>
              <p className="body-txt" style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 40 }}>
                Join our global network and bring the Kross experience to your community.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", opacity: 0.45, marginBottom: 4 }}>Get In Touch</div>
                <a href="mailto:franchise@krosspadel.com" style={{ color: "var(--white)", textDecoration: "none", fontSize: 14 }}>franchise@krosspadel.com</a>
                <a href="tel:+6620260261" style={{ color: "var(--white)", textDecoration: "none", fontSize: 14 }}>+66 2 026 0261</a>
              </div>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="partner-form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input value={form.name} onChange={e => handleChange("name", e.target.value)} placeholder="Your full name" required />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input value={form.company} onChange={e => handleChange("company", e.target.value)} placeholder="Company name" />
                </div>
              </div>
              <div className="partner-form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} placeholder="your@email.com" required />
                </div>
                <div className="form-group">
                  <label>Phone / LINE</label>
                  <input value={form.phone} onChange={e => handleChange("phone", e.target.value)} placeholder="+66 or LINE ID" />
                </div>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea value={form.message} onChange={e => handleChange("message", e.target.value)} placeholder="Tell us about your interest, location, or any questions..." style={{ height: 120 }} />
              </div>
              <button type="submit" className="btn-primary" disabled={sending}>
                {sending ? "Sending..." : "Send Inquiry"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  );
}
