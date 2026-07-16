import Footer from "../components/Footer";

const BRAND_PARTNERS = [
  { name: "Corona",         category: "Beverage",    image:  "/image/logos/1.png" },
  { name: "Brew Yoga",      category: "Wellness",    image:  "/image/logos/2.png" },
  { name: "Meliã",          category: "Hospitality", image:  "/image/logos/3.png" },
  { name: "Marriott",       category: "Hospitality", image:  "/image/logos/4.png" },
  { name: "White Claw",     category: "Beverage",    image:  "/image/logos/5.png" },
  { name: "Hilton",         category: "Hospitality", image:  "/image/logos/6.png" },
  { name: "Lancôme",        category: "Beauty",      image:  "/image/logos/7.png" },
  { name: "Fliquid",        category: "Hydration",   image:  "/image/logos/8.png" },
  { name: "Espresso",       category: "Coffee",      image:  "/image/logos/9.png" },
  { name: "Monte Carlo/AP", category: "Sports",      image:  "/image/logos/10.png" },
];

const CARDS = [
  {
    id: "partner-brands",
    label: "Brands Collabs",
  },
  {
    id: "partner-be-part",
    label: "Be Part Of Kross",
  },
  {
    id: "partner-franchisees",
    label: "Kross Franchisees",
  },
];

export default function BecomePartnerPage({ navigate }) {
  return (
    <div>
      {/* HERO */}
      <section id="hero" style={{ padding: 0 }}>
        <div className="hero-video-wrap" style={{
          backgroundImage: " linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),url('/image/backgrounds/Partner.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
        }} />
        <div className="hero-content">
          <div className="hero-eyebrow">Business Opportunity</div>
          <div className="hero-title">Become A Partner</div>
          <div className="hero-sub">Join Asia's Growing Padel Revolution</div>
          <div className="hero-actions">
            {CARDS.map(card => (
              <button key={card.id} className="btn-ghost" onClick={() => navigate(card.id)}>
                {card.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* STRONG PARTNERS SECTION */}
      <section style={{ background: "var(--black)", padding: "80px clamp(24px, 5vw, 72px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="tag" style={{ marginBottom: 24 }}>Brands Collaboration</div>
          <div style={{ fontFamily: "'Gotham Narrow', sans-serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, textTransform: "uppercase", lineHeight: 1.05, marginBottom: 24 }}>
            Strong Partners.<br />Better Together.
          </div>
          <p className="body-txt" style={{ fontSize: 15, lineHeight: 1.8, maxWidth: 480, marginBottom: 56, opacity: 0.7 }}>
            We team up with global brands that share our passion for sport, lifestyle and community. Together, we create unique experiences on and off the court.
          </p>

          {/* Partner logos grid */}
            <div style={{
              display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                background:"linear-gradient(135deg, #084030 100%)",
                borderTop: "1px solid rgba(255,255,255,0.15)",
                borderLeft: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "24px",
                overflow: "hidden", 
            }}>
              {BRAND_PARTNERS.map((b, i) => (
                <div
                  key={i}
                  style={{
                    padding: "clamp(16px, 3vw, 32px) clamp(12px, 2vw, 20px)",
                    borderRight: "1px solid rgba(255,255,255,0.15)",
                    borderBottom: "1px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "80px",
                    transition: "background .25s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {b.image ? (
                    <img
                      src={b.image}
                      alt={b.name}
                      style={{
                      maxWidth: "clamp(120px, 12vw, 180px)",
                      maxHeight: "clamp(50px, 6vw, 80px)",
                      objectFit: "contain",
                      }}
                      onError={e => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.insertAdjacentHTML("afterend",
                          `<span style="font-size:clamp(10px,1.5vw,14px);font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#fff;text-align:center;">${b.name}</span>`
                        );
                      }}
                    />
                  ) : (
                    <span style={{
                      fontSize: "clamp(10px, 1.5vw, 14px)",
                      fontWeight: 800,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      color: "#fff",
                      textAlign: "center",
                    }}>
                      {b.name}
                    </span>
                  )}
                </div>
              ))}
            </div>

          <button
            onClick={() => navigate("partner-brands")}
            style={{ marginTop: 32, background: "none", border: "none", color: "var(--green-highlight)", fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 8 }}
          >
            AND MORE →
          </button>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  );
}
