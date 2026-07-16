import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Footer from "../components/Footer";

const MAX_VISIBLE = 22;
// Indices (0-based) that get 2×2 treatment in the bento grid
const LARGE_AT = new Set([0, 6, 13, 19]);

function BentoGallery({ gallery, onOpen }) {
  const shown = gallery.slice(0, MAX_VISIBLE);
  const overflow = gallery.length - MAX_VISIBLE;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gridAutoRows: "160px",
      gridAutoFlow: "dense",
      gap: 6
    }}>
      {shown.map((url, i) => {
        const isLarge = LARGE_AT.has(i);
        const isLastShown = i === shown.length - 1 && overflow > 0;
        return (
          <div
            key={i}
            onClick={() => onOpen(i)}
            style={{
              gridColumn: isLarge ? "span 2" : "span 1",
              gridRow: isLarge ? "span 2" : "span 1",
              position: "relative",
              overflow: "hidden",
              borderRadius: 8,
              cursor: "pointer",
              background: "rgba(255,255,255,0.04)"
            }}
          >
            <img
              src={url}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.3s ease"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            />
            {isLastShown && (
              <div style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(2px)"
              }}>
                <div style={{
                  fontFamily: "'Gotham Narrow', sans-serif",
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "1px"
                }}>+{overflow}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Lightbox({ gallery, index, onClose, onNav }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNav]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.92)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 24, right: 28,
          background: "none", border: "none", color: "rgba(255,255,255,0.6)",
          fontSize: 32, cursor: "pointer", lineHeight: 1, padding: 0
        }}
      >×</button>

      {/* Counter */}
      <div style={{
        position: "absolute", top: 28, left: 0, right: 0, textAlign: "center",
        fontSize: 12, opacity: 0.4, letterSpacing: "2px"
      }}>
        {index + 1} / {gallery.length}
      </div>

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNav(-1); }}
          style={{
            position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.08)", border: "none", color: "white",
            width: 48, height: 48, borderRadius: "50%", fontSize: 20,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >‹</button>
      )}

      {/* Image */}
      <img
        src={gallery[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "88vw",
          maxHeight: "88vh",
          objectFit: "contain",
          borderRadius: 6,
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)"
        }}
      />

      {/* Next */}
      {index < gallery.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNav(1); }}
          style={{
            position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.08)", border: "none", color: "white",
            width: 48, height: 48, borderRadius: "50%", fontSize: 20,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >›</button>
      )}
    </div>
  );
}

export default function StoryDetailPage({ navigate, page }) {
  const docId = page?.replace("story-", "");
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    if (!docId) return;
    const load = async () => {
      const snap = await getDoc(doc(db, "stories", docId));
      if (snap.exists()) setStory({ docId: snap.id, ...snap.data() });
      setLoading(false);
    };
    load();
  }, [docId]);

  const gallery = story?.gallery || [];
  const openLightbox = (i) => setLightboxIdx(i);
  const closeLightbox = () => setLightboxIdx(null);
  const navLightbox = (dir) => setLightboxIdx(idx => Math.max(0, Math.min(gallery.length - 1, idx + dir)));

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: 0.4, fontSize: 14, letterSpacing: 2, textTransform: "uppercase" }}>Loading...</div>
      </div>
    );
  }

  if (!story) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 40px", textAlign: "center" }}>
        <div className="tag" style={{ marginBottom: 16 }}>Not Found</div>
        <div className="heading" style={{ fontSize: 40, marginBottom: 24 }}>Story not found</div>
        <button className="btn-primary" onClick={() => navigate("stories")}>← Back to Stories</button>
      </div>
    );
  }

  const paragraphs = story.content
    ? story.content.split("\n").filter(p => p.trim())
    : [];

  const formattedDate = story.date
    ? new Date(story.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div>
      {/* HERO */}
      <div style={{ position: "relative", height: "clamp(380px, 60vh, 620px)", overflow: "hidden" }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: story.imageUrl
            ? `url(${story.imageUrl}) center/cover no-repeat`
            : (story.bg || "linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 100%)")
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.15) 100%)"
        }} />
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          padding: "clamp(32px, 5vw, 64px) clamp(20px, 6vw, 80px)"
        }}>
          <button
            onClick={() => navigate("stories")}
            style={{
              background: "none", border: "none", color: "rgba(255,255,255,0.55)",
              fontSize: 13, letterSpacing: "1.5px", textTransform: "uppercase",
              cursor: "pointer", marginBottom: 20, padding: 0,
              display: "flex", alignItems: "center", gap: 6
            }}
          >
            ← Stories
          </button>
          {story.cat && <div className="story-gallery-cat" style={{ marginBottom: 14 }}>{story.cat}</div>}
          <h1 style={{
            fontFamily: "'Gotham Narrow', sans-serif",
            fontSize: "clamp(28px, 5vw, 60px)",
            letterSpacing: "1.5px", lineHeight: 1.05,
            marginBottom: 16, maxWidth: 800
          }}>
            {story.title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            {story.author && <div style={{ fontSize: 13, opacity: 0.7 }}>By {story.author}</div>}
            {story.author && formattedDate && <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />}
            {formattedDate && <div style={{ fontSize: 13, opacity: 0.5 }}>{formattedDate}</div>}
          </div>
        </div>
      </div>

      {/* BODY */}
      <section style={{ padding: "clamp(48px, 7vw, 96px) clamp(20px, 6vw, 80px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {story.excerpt && (
            <p style={{
              fontSize: "clamp(17px, 2vw, 21px)", lineHeight: 1.7, opacity: 0.85,
              marginBottom: 40, paddingBottom: 40,
              borderBottom: "1px solid rgba(255,255,255,0.08)", fontStyle: "italic"
            }}>
              {story.excerpt}
            </p>
          )}
          {paragraphs.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {paragraphs.map((p, i) => (
                <p key={i} style={{ fontSize: "clamp(15px, 1.6vw, 17px)", lineHeight: 1.9, opacity: 0.8 }}>{p}</p>
              ))}
            </div>
          ) : (
            !story.excerpt && <p style={{ opacity: 0.35, fontSize: 14 }}>No content yet.</p>
          )}
          <div style={{ marginTop: 64, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button className="btn-ghost" onClick={() => navigate("stories")}>← Back to Stories</button>
          </div>
        </div>
      </section>

      {/* BENTO GALLERY */}
      {gallery.length > 0 && (
        <section style={{ padding: "0 clamp(20px, 4vw, 56px) clamp(64px, 8vw, 100px)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ fontSize: 11, opacity: 0.3, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 20 }}>
              Photos · {gallery.length}
            </div>
            <BentoGallery gallery={gallery} onOpen={openLightbox} />
          </div>
        </section>
      )}

      {/* LIGHTBOX */}
      {lightboxIdx !== null && (
        <Lightbox
          gallery={gallery}
          index={lightboxIdx}
          onClose={closeLightbox}
          onNav={navLightbox}
        />
      )}

      <Footer navigate={navigate} />
    </div>
  );
}
