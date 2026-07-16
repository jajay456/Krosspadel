import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Footer from "../components/Footer";
import { formatDate } from "../utils/venueUtils";
import { MOCKUP_ACTIVITIES } from "../data/mockActivities";

export default function ActivitiesPage({ navigate, openBook }) {

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "activities"));

        const docs = snap.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));

        setActivities(docs);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  const displayActivities = activities;

  return (
    <div>
      {/* HERO SECTION */}
      <section id="hero" style={{ padding: 0 }}>
        <div className="hero-video-wrap" style={{
          backgroundImage: " linear-gradient(rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.4)),url('/image/backgrounds/DSC03067.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          filter: "brightness(1.4)", 
          WebkitFilter: "brightness(1.4)",
          }} />
        <div className="hero-content">
          <div className="hero-eyebrow">What We Offer</div>
          <div className="hero-title">Our Activities</div>
          <div className="hero-sub">From casual play to elite competitions</div>
        </div>
      </section>

      {/* ACTIVITIES SECTION */}
      <section style={{ padding: "100px clamp(24px, 5vw, 72px)" }}>
  <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
    <div className="tag">Our Programs</div>

    <div className="heading" style={{ marginBottom: 64 }}>
      Activities & Programs
    </div>

    <p
      className="body-txt"
      style={{
        fontSize: 18,
        marginBottom: 64,
        lineHeight: 1.8,
        opacity: 0.9,
      }}
    >
      From elite competition to casual weekend rallies — something for every
      player. Whether you're a beginner looking to learn or an advanced player
      seeking competitive challenges, KROSS has the perfect program for you.
    </p>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 40,
      }}
    >
      {displayActivities.map((a) => (
        <div
          key={a.docId || a.name}
          onClick={() =>
            a.url
              ? window.open(a.url, "_blank", "noopener,noreferrer")
              : navigate("activity-" + (a.docId || a.name))
          }
          style={{
            position: "relative",
            height: 320,
            overflow: "hidden",
            borderRadius: 4,
            border: "1px solid var(--border)",
            background: "#000",
            cursor: "pointer",
            boxSizing: "border-box",
            willChange: "transform",
            transition:
              "transform .35s ease, border-color .35s ease, box-shadow .35s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translate3d(0,-6px,0)";
            e.currentTarget.style.borderColor = "var(--green-highlight)";
            e.currentTarget.style.boxShadow =
              "0 18px 40px rgba(0,0,0,.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translate3d(0,0,0)";
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {a.imageUrl && (
            <img
              src={a.imageUrl}
              alt={a.name}
              loading="lazy"
              draggable={false}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transform: "scale(1.01)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                userSelect: "none",
                pointerEvents: "none",
            }}
            />
          )}

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,.92) 0%, rgba(0,0,0,.45) 45%, rgba(0,0,0,.08) 75%, transparent 100%)",
            }}
          />

          {a.level && (
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                padding: "5px 10px",
                background: "rgba(0,0,0,.55)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(45,168,79,.45)",
                color: "var(--green-highlight)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "1.6px",
                textTransform: "uppercase",
                borderRadius: 2,
              }}
            >
              {a.level}
            </div>
          )}

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: "24px 28px",
            }}
          >
            {a.date && (
              <div
                style={{
                  fontSize: 11,
                  opacity: 0.6,
                  letterSpacing: "1.6px",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {formatDate(a.date)}
              </div>
            )}

            <div
              style={{
                fontFamily: "'Gotham Narrow', sans-serif",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "1.5px",
                lineHeight: 1.1,
                marginBottom: 12,
              }}
            >
              {a.name}
            </div>

            <p
              className="body-txt"
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.8,
                opacity: 0.78,
              }}
            >
              {a.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* BENEFITS SECTION */}
      <section style={{
        padding: "100px clamp(24px, 5vw, 72px)",
        background: "linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 100%)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="tag" style={{ color: "var(--green-highlight)" }}>Why Join</div>
          <div className="heading" style={{ marginBottom: 64 }}>What You'll Gain</div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 40
          }}>
            {[
              { title: "Community", desc: "Connect with fellow padel enthusiasts and build lasting friendships" },
              { title: "Skill Development", desc: "Improve your technique under professional coaching guidance" },
              { title: "Competitions", desc: "Participate in tournaments and test your skills against others" },
              { title: "Flexible Scheduling", desc: "Play at your convenience with 24/7 court availability" },
              { title: "Fitness", desc: "Get a full-body workout while having fun on the court" },
              { title: "Social Events", desc: "Join exclusive member events and networking opportunities" }
            ].map((item, i) => (
              <div key={i} style={{
                padding: 32,
                border: `1px solid rgba(45, 168, 79, 0.3)`,
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
                <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: 8 }}>{item.title}</div>
                <p className="body-txt">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: "100px clamp(24px, 5vw, 72px)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div className="tag" style={{ textAlign: "center", marginBottom: 16 }}>Start Your Journey</div>
          <div className="heading" style={{ marginBottom: 32 }}>Find Your Perfect Activity</div>
          <p className="body-txt" style={{ fontSize: "18px", marginBottom: 48, opacity: 0.9, margin: "0 auto 48px" }}>
            Discover which activity suits your style and level, then book your first session today.
          </p>
          <button className="btn-primary" onClick={openBook}>Book Now</button>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  );
}