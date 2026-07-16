import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Footer from "../components/Footer";

function StoryBg({ story }) {
  return (
    <div
      className="story-gallery-bg"
      style={{
        background: story.imageUrl
          ? `url(${story.imageUrl}) center/cover no-repeat`
          : (story.bg || "var(--mid2)")
      }}
    />
  );
}

export default function StoriesPage({ navigate }) {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "stories"));
      setStories(snap.docs.map(d => ({ docId: d.id, ...d.data() })));
    };
    load();
  }, []);

  const [featured, second, third, ...rest] = stories;

  return (
    <div>
      {/* HERO */}
      <section id="hero" style={{ padding: 0 }}>
        <div className="hero-video-wrap" style={{
          backgroundImage: " linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),url('/image/backgrounds/DSC09804.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          }} />
        <div className="hero-content">
          <div className="hero-eyebrow">Member Stories</div>
          <div className="hero-title">Our Stories</div>
          <div className="hero-sub">Real experiences from our KROSS community</div>
        </div>
      </section>

      {/* STORIES */}
      <section style={{ padding: "100px clamp(24px, 5vw, 72px)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <div className="tag">Community Highlights</div>
          <div className="heading" style={{ marginBottom: 0 }}>Member Stories &amp; Experiences</div>
        </div>

        {stories.length === 0 && (
          <div style={{ maxWidth: 1200, margin: "0 auto", opacity: 0.4, fontSize: 14, paddingBottom: 40 }}>
            No stories yet.
          </div>
        )}

        {/* EDITORIAL BLOCK — featured (left 2/3) + side cards (right 1/3) */}
        {featured && (
          <div className="stories-gallery">
            {/* FEATURED */}
            <div className="story-gallery-feature" onClick={() => navigate("story-" + featured.docId)}>
              <StoryBg story={featured} />
              <div className="story-gallery-overlay" />
              <div className="story-gallery-feature-body">
                <div className="story-gallery-cat">{featured.cat}</div>
                <div className="story-gallery-title-lg">{featured.title}</div>
                <div className="story-gallery-date">{featured.date}</div>
                {featured.excerpt && (
                  <div className="story-gallery-excerpt">{featured.excerpt}</div>
                )}
                <div className="story-gallery-read">Read Story →</div>
              </div>
            </div>

            {/* SIDE CARDS */}
            {(second || third) && (
              <div className="story-gallery-side">
                {second && (
                  <div className="story-gallery-small" onClick={() => navigate("story-" + second.docId)}>
                    <StoryBg story={second} />
                    <div className="story-gallery-overlay" />
                    <div className="story-gallery-small-body">
                      <div className="story-gallery-cat">{second.cat}</div>
                      <div className="story-gallery-title-sm">{second.title}</div>
                      <div className="story-gallery-date">{second.date}</div>
                    </div>
                  </div>
                )}
                {third && (
                  <div className="story-gallery-small" onClick={() => navigate("story-" + third.docId)}>
                    <StoryBg story={third} />
                    <div className="story-gallery-overlay" />
                    <div className="story-gallery-small-body">
                      <div className="story-gallery-cat">{third.cat}</div>
                      <div className="story-gallery-title-sm">{third.title}</div>
                      <div className="story-gallery-date">{third.date}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* REST — 3-col grid, same bg+overlay style */}
        {rest.length > 0 && (
          <div style={{
            marginTop: 2,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 2
          }}>
            {rest.map(s => (
              <div
                key={s.docId}
                className="story-gallery-small"
                style={{ height: 320 }}
                onClick={() => navigate("story-" + s.docId)}
              >
                <StoryBg story={s} />
                <div className="story-gallery-overlay" />
                <div className="story-gallery-small-body">
                  <div className="story-gallery-cat">{s.cat}</div>
                  <div className="story-gallery-title-sm">{s.title}</div>
                  <div className="story-gallery-date">{s.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "100px clamp(24px, 5vw, 72px)",
        background: "linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 100%)"
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div className="tag" style={{ color: "var(--green-highlight)" }}>Join the Community</div>
          <div className="heading" style={{ marginBottom: 32 }}>Share Your Story With Us</div>
          <p className="body-txt" style={{ fontSize: 18, marginBottom: 48, opacity: 0.95 }}>
            Have an amazing experience at KROSS? We'd love to hear your story and feature it on our platform.
          </p>
          <button className="btn-primary" onClick={() => navigate("contact")}>Get In Touch</button>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  );
}
