import Footer from "../components/Footer";

const WHY_ITEMS = [
  { num: "01", title: "Premium Audience", desc: "Connect with a highly engaged community of professionals, entrepreneurs, executives, expatriates, and active lifestyle consumers across Bangkok’s most desirable districts. Our audience values premium experiences, wellness, sport, and community." },
  { num: "02", title: "YEAR-ROUND ENGAGEMENT", desc: "Through clubs, tournaments, leagues, coaching programs, community events, and digital platforms, KROSS delivers consistent brand exposure throughout the year, creating deeper engagement than traditional sponsorship opportunities." },
  { num: "03", title: "INTEGRATED ECOSYSTEM", desc: "KROSS combines sport, fitness, technology, events, hospitality, and community into a single platform. This creates multiple touchpoints where brands can engage authentically with our audience both on and off the court." },
  { num: "04", title: "SCALABLE PARTNERSHIPS", desc: "From venue branding and product sampling to digital campaigns, tournaments, corporate experiences, and strategic collaborations, KROSS offers flexible partnership solutions designed to support a wide range of marketing and business objectives." },
];

const ACTIVATION_TYPES = [
  { title: "TOURNAMENT TITLE SPONSORSHIP", desc: "Secure naming rights and premium visibility across KROSS tournaments, including venue branding, digital promotion, social media amplification, player communications, media exposure, and event content. Position your brand at the center of some of Thailand's largest padel events and connect directly with an active and affluent audience." },
  { title: "VENUE & COURT BRANDING", desc: "Showcase your brand across the KROSS ecosystem through court branding, net branding, venue signage, player areas, LED displays, digital screens, and high-visibility touchpoints throughout the customer journey. Create year-round exposure across multiple venues and thousands of player interactions." },
  { title: "POP-UP & EXPERIENTIAL ACTIVATIONS", desc: "Launch products, engage consumers, and create memorable experiences through bespoke activations integrated into tournaments, community events, and venue experiences.From sampling campaigns and test-drive experiences to wellness activations and product showcases, KROSS provides a unique platform for direct customer engagement." },
  { title: "CONTENT & DIGITAL CAMPAIGNS", desc: "Extend your reach beyond the venue through branded content, social media collaborations, event coverage, influencer partnerships, video production, and digital storytelling.Leverage the KROSS community and content ecosystem to create authentic engagement both online and offline." },
  { title: "F&B PARTNERSHIPS", desc: "Integrate your brand through exclusive pouring rights, product sampling, co-branded menus, hospitality experiences, VIP lounges, and event activations.Perfect for beverage, hospitality, and lifestyle brands looking to build meaningful consumer connections." },
  { title: "MERCHANDISE & APPAREL COLLABORATIONS", desc: "Develop co-branded collections, limited-edition products, player kits, tournament merchandise, and lifestyle apparel that authentically connect your brand with our community.Create products that become part of the everyday experience of players and fans." },
  { title: "CORPORATE EVENTS & HOSPITALITY", desc: "Host client events, team-building activities, executive networking sessions, product launches, and VIP experiences within the KROSS ecosystem.Our venues provide a unique setting where sport, business, lifestyle, and community naturally come together." },
  { title: "CUSTOM PARTNERSHIPS", desc: "Every brand is different. Our team works closely with partners to design bespoke collaborations aligned with their objectives, audience, and marketing strategy.From local activations to long-term strategic partnerships, we create opportunities that generate real value for both brands and the KROSS community." },
];

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

export default function BrandsCollabsPage({ navigate }) {
  return (
    <div>
      {/* HERO */}
      <section id="hero" style={{ padding: 0 }}>
        <div className="hero-video-wrap" style={{
          backgroundImage: " linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),url('/image/backgrounds/Partner2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
        }} />
        <div className="hero-content">
          <div className="hero-eyebrow">Partnerships</div>
          <div className="hero-title">Brands Collabs</div>
          <div className="hero-sub">Partner with Thailand's fastest growing padel brand</div>
          <div className="hero-actions">
            <a href="mailto:info@krosspadel.com" className="btn-primary" style={{ textDecoration: "none" }}>Get In Touch</a>
          </div>
        </div>
      </section>

      {/* WHY COLLAB WITH KROSS */}
      <section className="partner-section">
        <div className="partner-section-inner">
          <div className="tag">Why Partner With Us</div>
          <div className="heading" style={{ marginBottom: 20 }}>Why Collab<br />With Kross.</div>
          <p className="body-txt" style={{ fontSize: 16, lineHeight: 1.9, maxWidth: 560, marginBottom: 64 }}>
            KROSS provides brands with direct access to one of Southeast Asia’s fastest-growing sports communities through a unique ecosystem of venues, events, technology, and lifestyle experiences. More than a padel operator, KROSS is a rapidly growing racquet sports platform connecting brands with an affluent, active, and highly engaged audience across Bangkok and beyond.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 2 }}>
            {WHY_ITEMS.map((item, i) => (
              <div key={i} style={{
                padding: "40px 32px",
                background: "var(--mid)",
                border: "1px solid var(--border)",
                transition: "border-color .3s"
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--green-highlight)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div style={{ fontFamily: "'Gotham Narrow', sans-serif", fontSize: 36, color: "rgba(45,168,79,0.15)", lineHeight: 1, marginBottom: 16 }}>{item.num}</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>{item.title}</div>
                <p className="body-txt" style={{ fontSize: 13, margin: 0, lineHeight: 1.75 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND EVENT & ACTIVATION */}
      <section className="partner-section" style={{ background: "var(--mid)" }}>
        <div className="partner-section-inner">
          <div className="tag">Activations</div>
          <div className="heading" style={{ marginBottom: 20 }}>Brand Event<br />&amp; Activation.</div>
          <p className="body-txt" style={{ fontSize: 16, lineHeight: 1.9, maxWidth: 560, marginBottom: 64 }}>
            <p>
              From premium tournaments and venue takeovers to product launches and corporate experiences, KROSS creates impactful activations that connect brands with one of Southeast Asia’s most engaged sports communities.
            </p>
            <p>
              Whether your objective is brand awareness, customer acquisition, product launches, hospitality, or community engagement, we design tailored experiences that deliver measurable results and meaningful connections.
            </p>
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 2 }}>
            {ACTIVATION_TYPES.map((item, i) => (
              <div key={i} style={{
                padding: "36px 32px",
                border: "1px solid var(--border)",
                background: "var(--mid2)",
                transition: "border-color .3s"
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--green-highlight)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--green-highlight)", marginBottom: 12 }}>{item.title}</div>
                <p className="body-txt" style={{ fontSize: 13, margin: 0, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR BRAND PARTNERS */}
      <section className="partner-section">
        <div className="partner-section-inner">
          <div className="tag">Brand Partners</div>
          <div className="heading" style={{ marginBottom: 20 }}>Our Brand<br />Partners.</div>
          <p className="body-txt" style={{ fontSize: 16, lineHeight: 1.9, maxWidth: 560, marginBottom: 64 }}>
            We work with brands that share our values — premium quality, active lifestyle and community connection.
          </p>
          <div style={{ 
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 20,
          }}>
            {BRAND_PARTNERS.map((b, i) => (
              <div key={i} style={{ 
                padding: "48px 56px",
                background: "linear-gradient(135deg, #084030 100%)",
                border: "1px solid var(--border)",
                minWidth: 220,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}>
                <img
                  src={b.image}
                  alt={b.name}
                  style={{
                    maxWidth: "240px",
                    maxHeight: "100px",
                    objectFit: "contain",
                  }}
                />
                <div style={{ fontSize: 9, letterSpacing: "2px", textTransform: "uppercase", opacity: 0.35 }}>{b.category}</div>
              </div>
            ))}
            {/* Become a partner CTA card */}
            <div style={{
              padding: "48px 56px",
              border: "1px dashed rgba(255,255,255,0.15)",
              minWidth: 220,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              cursor: "pointer",
              transition: "border-color .3s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--green-highlight)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}
              onClick={() => window.location.href = "mailto:info@krosspadel.com"}
            >
              <div style={{ fontSize: 28, opacity: 0.2 }}>+</div>
              <div style={{ fontSize: 9, letterSpacing: "2px", textTransform: "uppercase", opacity: 0.4 }}>Your Brand Here</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="partner-section" style={{ background: "var(--mid)" }}>
        <div className="partner-section-inner">
          <div style={{ padding: "60px 48px", background: "var(--mid2)", borderTop: "2px solid var(--green-highlight)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32 }}>
            <div>
              <div className="heading" style={{ marginBottom: 8, fontSize: "clamp(24px, 4vw, 40px)" }}>Let's Create Something Together</div>
              <p className="body-txt" style={{ margin: 0, opacity: 0.7 }}>Reach out to explore partnership opportunities.</p>
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a href="mailto:info@krosspadel.com" className="btn-primary" style={{ textDecoration: "none" }}>Email Us</a>
              <a href="https://line.me/ti/p/~@krosspadel" target="_blank" rel="noreferrer" className="btn-ghost" style={{ textDecoration: "none" }}>LINE</a>
            </div>
          </div>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  );
}
