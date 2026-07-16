import Footer from "../components/Footer";

const BRANDS = [
  {
    num: "01",
    name: "KROSS PARK",
    sub: "The future of active lifestyle destinations.",
    body: "KROSS PARK combines racquet sports, fitness, wellness, and social experiences into a single destination designed for modern urban communities.From padel and pickleball to HYROX training, group fitness classes, wellness facilities, food & beverage, and community events, KROSS PARK is designed to keep people active, connected, and engaged every day.",
    img: "/image/backgrounds/KrossPark.png",
    accent: "var(--green-highlight)",
    products: [
      { label: "Padel Courts", icon: "⬡" },
      { label: "Pickleball Courts ", icon: "⬡" },
      { label: "HYROX Training ", icon: "⬡" },
      { label: "Fitness Classes ", icon: "⬡" },
      { label: "Wellness Spaces ", icon: "⬡" },
      { label: "Rooftop Social Areas ", icon: "⬡" },
      { label: "F&B · Community Events ", icon: "⬡" },
    ],
  },
  {
    num: "02",
    name: "KROSS ACTION",
    sub: "Move more. Stay consistent.",
    body: "KROSS ACTION is our activity and wellness platform designed to help members build healthy habits through daily movement, challenges, rewards, and community accountability.Users can track workouts, sports activities, fitness classes, running sessions, and overall activity while earning points, maintaining streaks, and competing with friends.",
    img: "/image/backgrounds/DSC03446.jpg",
    accent: "#4FC3F7",
    products: [
      { label: "Activity Tracking ", icon: "⬡" },
      { label: "Daily Streaks ", icon: "⬡" },
      { label: "Challenges", icon: "⬡" },
      { label: "Rewards Program ", icon: "⬡" },
      { label: "Community Feed ", icon: "⬡" },
      { label: "Leaderboards", icon: "⬡" },
      { label: "Wellness Goals ", icon: "⬡" },
      { label: "Habit Building", icon: "⬡" },
    ],
  },
  {
    num: "03",
    name: "KROSS ACTIVE",
    sub: "Built for players. Designed for movement.",
    body: "KROSS ACTIVE is our retail and equipment division, providing high-quality products for players and active lifestyles both on and off the court.From apparel and accessories to padel rackets, balls, equipment, and exclusive collaborations, KROSS ACTIVE extends the brand beyond the venue experience.",
    img: "/image/backgrounds/DSC02168.jpg",
    accent: "#FFD54F",
    products: [
      { label: "Performance Apparel ", icon: "⬡" },
      { label: "Padel Rackets ", icon: "⬡" },
      { label: "Padel Balls ", icon: "⬡" },
      { label: "Accessories", icon: "⬡" },
      { label: "Training Equipment ", icon: "⬡" },
      { label: "Limited Collections ", icon: "⬡" },
      { label: "Teamwear ", icon: "⬡" },
      { label: "Brand Collaborations", icon: "⬡" },
    ],
  },
];

export default function LifestylePage({ navigate }) {
  return (
    <div>
      {/* HERO */}
      <section id="hero" style={{ padding: 0 }}>
        <div className="hero-video-wrap" style={{
          backgroundImage: " linear-gradient(rgba(0, 0, 0, 0.7),rgba(0, 0, 0, 0.7)),url('/image/backgrounds/DSC02039.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
        }} />
        <div className="hero-content">
          <div className="hero-eyebrow">The KROSS Universe</div>
          <div className="hero-title">We Are Lifestyle</div>
          <div className="hero-sub">Sport, style and community — beyond the court</div>
        </div>
      </section>

      {/* BRANDS SECTION */}
      <section style={{ padding: "100px clamp(24px, 5vw, 72px) 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(24px, 5vw, 72px)" }}>
          <div className="tag">Our Brands</div>
          <div className="heading" style={{ marginBottom: 16 }}>What We Build.</div>
          <p className="body-txt" style={{ fontSize: 16, lineHeight: 1.9, maxWidth: 560, marginBottom: 80, opacity: 0.7 }}>
            At KROSS, sport goes beyond the court. We build brands and experiences that inspire people to move, connect and live better.
          </p>
        </div>

        {/* Brand rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {BRANDS.map((b, idx) => (
            <div key={b.num} style={{
              display: "grid",
              gridTemplateColumns: idx % 2 === 0 ? "1fr 1fr" : "1fr 1fr",
              minHeight: 480,
              background: idx % 2 === 0 ? "var(--mid)" : "var(--black)",
              border: "1px solid var(--border)",
            }}>
              {/* Image side */}
              <div style={{
                order: idx % 2 === 0 ? 0 : 1,
                background: `url(${b.img}) center/cover no-repeat, linear-gradient(135deg, var(--green-dark), var(--green-mid))`,
                position: "relative",
                minHeight: 320,
              }}>
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
                <div style={{ position: "absolute", top: 28, left: 28 }}>
                  <span style={{ fontFamily: "'Gotham Narrow', sans-serif", fontSize: 72, fontWeight: 900, color: b.accent, opacity: 0.12, lineHeight: 1 }}>{b.num}</span>
                </div>
              </div>

              {/* Content side */}
              <div style={{
                order: idx % 2 === 0 ? 1 : 0,
                padding: "56px clamp(32px, 5vw, 64px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: b.accent, marginBottom: 12 }}>
                  {b.sub}
                </div>
                <div style={{ fontFamily: "'Gotham Narrow', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, letterSpacing: "1px", textTransform: "uppercase", lineHeight: 1.0, marginBottom: 20 }}>
                  {b.name}
                </div>
                <p className="body-txt" style={{ fontSize: 14, lineHeight: 1.8, opacity: 0.65, marginBottom: 36, maxWidth: 440 }}>
                  {b.body}
                </p>

                {/* Products grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                  {b.products.map((p, i) => (
                    <div key={i} style={{
                      padding: "12px 16px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      color: "var(--white)",
                      opacity: 0.75,
                      transition: "opacity .2s, border-color .2s",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.borderColor = b.accent; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = 0.75; e.currentTarget.style.borderColor = "var(--border)"; }}
                    >
                      {p.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PILLARS SECTION */}
      <section style={{
        padding: "100px clamp(24px, 5vw, 72px)",
        background: "linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 100%)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="tag" style={{ color: "var(--green-highlight)" }}>Our Philosophy</div>
          <div className="heading" style={{ marginBottom: 64 }}>Built On Three Pillars</div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 2
          }}>
            {[
              { title: "COMMUNITY", desc: "We create communities through sport, events, fitness, and shared experiences that bring people together both on and off the court." },
              { title: "WELLNESS", desc: "We promote active lifestyles by combining racquet sports, fitness, recovery, and healthy habits into a holistic ecosystem focused on long-term wellbeing." },
              { title: "SCALE", desc: "We develop scalable concepts, technology, and operational systems that enable sustainable growth across Thailand and Southeast Asia." },
            ].map((item, i) => (
              <div key={i} style={{
                padding: "40px 36px",
                border: "1px solid rgba(45, 168, 79, 0.3)",
                background: "rgba(45, 168, 79, 0.05)",
                transition: "all 0.3s ease"
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--green-highlight)";
                  e.currentTarget.style.background = "rgba(45, 168, 79, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(45, 168, 79, 0.3)";
                  e.currentTarget.style.background = "rgba(45, 168, 79, 0.05)";
                }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{item.title}</div>
                <p className="body-txt" style={{ margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px clamp(24px, 5vw, 72px)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div className="tag" style={{ textAlign: "center", marginBottom: 16 }}>Join The Movement</div>
          <div className="heading" style={{ marginBottom: 32 }}>Be Part Of The Lifestyle</div>
          <p className="body-txt" style={{ fontSize: "18px", marginBottom: 48, opacity: 0.9, margin: "0 auto 48px" }}>
            Discover the full KROSS universe — from padel courts to performance apparel.
          </p>
          <button className="btn-primary" onClick={() => navigate("contact")}>Get In Touch</button>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  );
}
