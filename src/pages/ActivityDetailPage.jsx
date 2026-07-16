import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { formatDate } from "../utils/venueUtils";
import { MOCKUP_ACTIVITIES } from "../data/mockActivities";
import Footer from "../components/Footer";

export default function ActivityDetailPage({ navigate, activityId }) {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activityId) { setLoading(false); return; }
    const mock = MOCKUP_ACTIVITIES.find(a => (a.docId || a.name) === activityId);
    if (mock) { setActivity(mock); setLoading(false); return; }
    getDoc(doc(db, "activities", activityId)).then(d => {
      setActivity(d.exists() ? { docId: d.id, ...d.data() } : null);
      setLoading(false);
    });
  }, [activityId]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 11, letterSpacing: "3px", textTransform: "uppercase", opacity: 0.3 }}>Loading...</div>
    </div>
  );

  if (!activity) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: "3px", textTransform: "uppercase", opacity: 0.3 }}>Activity not found</div>
      <button className="btn-ghost" onClick={() => navigate("activities")}>← Back to Activities</button>
    </div>
  );

  return (
    <div>
      {/* HERO IMAGE */}
      <div style={{
        height: "70vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
        marginTop: 64,
        background: activity.imageUrl
          ? `url(${activity.imageUrl}) center/cover no-repeat`
          : "linear-gradient(135deg, var(--green-dark), var(--green-mid))"
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.88) 0%, rgba(0,0,0,.15) 60%, transparent 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "0 clamp(24px, 5vw, 72px) 56px", width: "100%" }}>
          <button className="back-btn" onClick={() => navigate("activities")}>← All Activities</button>
          <div className="tag" style={{ marginBottom: 16 }}>Activity</div>
          <div style={{
            fontFamily: "'Gotham Narrow', sans-serif",
            fontSize: "clamp(40px, 8vw, 96px)",
            lineHeight: 0.9,
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: 20,
          }}>{activity.name}</div>
          {activity.date && (
            <div style={{ fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", opacity: 0.55 }}>
              {formatDate(activity.date)}
            </div>
          )}
        </div>
      </div>

      {/* DETAIL BODY */}
      <section style={{ padding: "80px clamp(24px, 5vw, 72px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "start", marginTop: 16 }}>

            {/* LEFT — info cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { label: "Date", value: activity.date ? formatDate(activity.date) : null, icon: "📅" },
                { label: "Time", value: activity.time, icon: "🕐" },
                { label: "Club / Venue", value: activity.club, icon: "📍" },
                { label: "Level", value: activity.level, icon: "🎯" },
              ].filter(item => item.value).map((item, i) => (
                <div key={i} style={{
                  padding: "24px 28px",
                  background: "var(--mid)",
                  borderLeft: "2px solid var(--green-highlight)",
                }}>
                  <div style={{ fontSize: 9, letterSpacing: "2.5px", textTransform: "uppercase", opacity: 0.4, marginBottom: 8 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 15, lineHeight: 1.5 }}>{item.value}</div>
                </div>
              ))}

              {activity.url && (
                <a
                  href={activity.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ textDecoration: "none", textAlign: "center", marginTop: 16 }}
                >
                  Register Now
                </a>
              )}
            </div>

            {/* RIGHT — description */}
            <div>
              <div className="tag" style={{ marginBottom: 20 }}>About This Event</div>
              <p style={{ fontSize: 17, lineHeight: 2, opacity: 0.8, whiteSpace: "pre-line" }}>
                {activity.detail || "No description available."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  );
}
