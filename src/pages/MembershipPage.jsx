import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Footer from "../components/Footer";

const PRICE_TABS = [
  { key: "court_rental", label: "Court Rental" },
  { key: "coaching", label: "Coaching" },
  { key: "activities", label: "Activities" },
  { key: "racket_rental", label: "Racket Rental" },
];

function parseRows(rows) {
  if (Array.isArray(rows)) return rows;
  try { return JSON.parse(rows); } catch { return []; }
}

export default function MembershipPage({ navigate, notify, openBook }) {
  const [plans, setPlans] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [courtRentals, setCourtRentals] = useState([]);
  const [coaching, setCoaching] = useState([]);
  const [activities, setActivities] = useState([]); // Added activities state
  const [racketRentals, setRacketRentals] = useState([]);
  const [tab, setTab] = useState("court_rental");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getDocs(collection(db, "plans")),
      getDocs(collection(db, "pricing")),
      getDocs(collection(db, "courtRental")),
      getDocs(collection(db, "coaching")),
      getDocs(collection(db, "racketRental")),
      getDocs(collection(db, "activities")), // Added fetch for activities collection
    ]).then(([plansSnap, pricingSnap, courtRentalSnap, coachingSnap, racketRentalSnap, activitiesSnap]) => {
      if (cancelled) return;
      setPlans(plansSnap.docs.map(d => ({ docId: d.id, ...d.data() })).filter(p => !p.hidden));
      setPricing(pricingSnap.docs.map(d => ({ docId: d.id, ...d.data() })));
      setCourtRentals(courtRentalSnap.docs.map(d => ({ docId: d.id, ...d.data() })).filter(v => !v.hidden));
      setCoaching(coachingSnap.docs.map(d => ({ docId: d.id, ...d.data() })).filter(v => !v.hidden));
      setRacketRentals(racketRentalSnap.docs.map(d => ({ docId: d.id, ...d.data() })).filter(v => !v.hidden));
      setActivities(activitiesSnap.docs.map(d => ({ docId: d.id, ...d.data() })).filter(v => !v.hidden)); // Safe mapping assignment
    });
    return () => { cancelled = true; };
  }, []);

  const tabItems = pricing
    .filter(p => p.category === tab)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div>
      {/* HERO */}
      <section id="hero" style={{ padding: 0 }}>
          <div className="hero-video-wrap" style={{
          backgroundImage: " linear-gradient(rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.)),url('https://res.cloudinary.com/vtjrp9sy/image/upload/v1783336186/DSC09854_e17j2p.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          filter: "brightness(1.4)", 
          WebkitFilter: "brightness(1.4)",
          }} />
        <div className="hero-content">
          <div className="hero-eyebrow">Unlimited Access</div>
          <div className="hero-title">Book & Pricing</div>
          <div className="hero-sub">Join thousands of players — priority booking, exclusive events & more</div>
        </div>
      </section>

      {/* ── SECTION 1: APP INFO ── */}
      <section style={{ padding: "100px clamp(24px, 5vw, 72px)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 440px), 1fr))",
            gap: "72px",
            alignItems: "center"
          }}>
            <div>
              <div className="tag">How To Book</div>
              <div className="heading" style={{ marginBottom: 24 }}>The KROSS App</div>
              <p className="body-txt" style={{ marginBottom: 48, lineHeight: 1.8, opacity: 0.75 }}>
                Book courts, track sessions, and manage your membership — all from the KROSS Padel app. Available on iOS.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 28, marginBottom: 48 }}>
                {[
                  { num: "01", title: "Select Venue", desc: "Choose from all KROSS locations across Bangkok" },
                  { num: "02", title: "Pick Your Time", desc: "Browse available slots and book up to 7 days in advance" },
                  { num: "03", title: "Confirm & Play", desc: "Get instant confirmation and head to the court" },
                ].map(step => (
                  <div key={step.num} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                    <div style={{
                      fontFamily: "'Gotham Narrow', sans-serif",
                      fontSize: 12, fontWeight: 700, letterSpacing: "2px",
                      color: "var(--green-highlight)", opacity: 0.7,
                      paddingTop: 3, minWidth: 24, flexShrink: 0
                    }}>{step.num}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{step.title}</div>
                      <div style={{ fontSize: 13, opacity: 0.55, lineHeight: 1.6 }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-primary" onClick={openBook}>
                Download on App Store
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src="/image/kross_app.png"
                alt="KROSS Padel App"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 12,
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: ALL PRICES ── */}
      <section style={{ padding: "100px clamp(24px, 5vw, 72px)", background: "var(--mid2)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="tag">Transparent Pricing</div>
          <div className="heading" style={{ marginBottom: 56 }}>Rates & Services</div>

          {/* Tab bar */}
          <div className="price-tabs" style={{
            display: "flex",
            borderBottom: "1px solid var(--border)",
            marginBottom: 56,
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            gap: 0
          }}>
            {PRICE_TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: "14px 28px",
                  background: "none",
                  border: "none",
                  borderBottom: tab === t.key ? "2px solid var(--green-highlight)" : "2px solid transparent",
                  color: tab === t.key ? "var(--white)" : "rgba(255,255,255,0.4)",
                  fontSize: 12, fontWeight: 700, letterSpacing: "1.5px",
                  textTransform: "uppercase", cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "color 0.2s",
                  marginBottom: -1
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "court_rental" ? (
            courtRentals.length === 0 ? (
              <div style={{ opacity: 0.3, fontSize: 14, textAlign: "center", padding: "64px 0" }}>
                Pricing coming soon
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
                gap: 24
              }}>
                {courtRentals.map(venue => {
                  const indoorSlots = venue.indoor ? Object.values(venue.indoor) : [];
                  const outdoorSlots = venue.outdoor ? Object.values(venue.outdoor) : [];
                  return (
                    <div key={venue.docId} style={{
                      background: "var(--mid)",
                      border: "1px solid var(--border)",
                      padding: "28px 32px"
                    }}>
                      <div style={{
                        fontFamily: "'Gotham Narrow', sans-serif",
                        fontSize: 14, letterSpacing: "2px",
                        textTransform: "uppercase", marginBottom: 20,
                        color: "var(--white)"
                      }}>{venue.name}</div>

                      {indoorSlots.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                          <div style={{
                            fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase",
                            color: "var(--green-highlight)", opacity: 0.8, marginBottom: 8
                          }}>Indoor</div>
                          {indoorSlots.map((slot, i) => (
                            <div key={i} style={{
                              display: "flex", justifyContent: "space-between", alignItems: "baseline",
                              padding: "12px 0",
                              borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none"
                            }}>
                              <div style={{ fontSize: 13, opacity: 0.7 }}>{slot.time}</div>
                              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                                <span style={{ color: "var(--green-highlight)", fontWeight: 700, fontSize: 16 }}>฿{slot.price}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {outdoorSlots.length > 0 && (
                        <div>
                          <div style={{
                            fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase",
                            color: "var(--green-highlight)", opacity: 0.8, marginBottom: 8
                          }}>Outdoor</div>
                          {outdoorSlots.map((slot, i) => (
                            <div key={i} style={{
                              display: "flex", justifyContent: "space-between", alignItems: "baseline",
                              padding: "12px 0",
                              borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none"
                            }}>
                              <div style={{ fontSize: 13, opacity: 0.7 }}>{slot.time}</div>
                              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                                <span style={{ color: "var(--green-highlight)", fontWeight: 700, fontSize: 16 }}>฿{slot.price}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : tab === "coaching" ? (
            coaching.length === 0 ? (
              <div style={{ opacity: 0.3, fontSize: 14, textAlign: "center", padding: "64px 0" }}>
                Pricing coming soon
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
                gap: 24
              }}>
                {coaching.map(item => {
                  const rows = item.row ? Object.values(item.row) : [];
                  return (
                    <div key={item.docId} style={{
                      background: "var(--mid)",
                      border: "1px solid var(--border)",
                      padding: "28px 32px"
                    }}>
                      {item.name && (
                        <div style={{
                          fontFamily: "'Gotham Narrow', sans-serif",
                          fontSize: 14, letterSpacing: "2px",
                          textTransform: "uppercase", marginBottom: 20,
                          color: "var(--white)"
                        }}>{item.name}</div>
                      )}
                      <div>
                        {rows.map((row, i) => (
                          <div key={i} style={{
                            display: "flex", justifyContent: "space-between", alignItems: "baseline",
                            padding: "12px 0",
                            borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none"
                          }}>
                            <div>
                              <div style={{ fontSize: 13, opacity: 0.7 }}>{row.label}</div>
                              {row.note && (
                                <div style={{ fontSize: 11, opacity: 0.35, marginTop: 3, lineHeight: 1.5 }}>{row.note}</div>
                              )}
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                              <span style={{ color: "var(--green-highlight)", fontWeight: 700, fontSize: 16 }}>฿{row.price}</span>
                              {row.unit && (
                                <span style={{ fontSize: 11, opacity: 0.4, marginLeft: 4 }}>{row.unit}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : tab === "activities" ? (
            activities.length === 0 ? (
              <div style={{ opacity: 0.3, fontSize: 14, textAlign: "center", padding: "64px 0" }}>
                Pricing coming soon
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
                gap: 24
              }}>
                {activities.map(item => {
                  const rows = item.row ? Object.values(item.row) : [];
                  return (
                    <div key={item.docId} style={{
                      background: "var(--mid)",
                      border: "1px solid var(--border)",
                      padding: "28px 32px"
                    }}>
                      {item.name && (
                        <div style={{
                          fontFamily: "'Gotham Narrow', sans-serif",
                          fontSize: 14, letterSpacing: "2px",
                          textTransform: "uppercase", marginBottom: 20,
                          color: "var(--white)"
                        }}>{item.name}</div>
                      )}
                      <div>
                        {rows.map((row, i) => (
                          <div key={i} style={{
                            display: "flex", justifyContent: "space-between", alignItems: "baseline",
                            padding: "12px 0",
                            borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none"
                          }}>
                            <div>
                              <div style={{ fontSize: 13, opacity: 0.7 }}>{row.label}</div>
                              {row.note && (
                                <div style={{ fontSize: 11, opacity: 0.35, marginTop: 3, lineHeight: 1.5 }}>{row.note}</div>
                              )}
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                              <span style={{ color: "var(--green-highlight)", fontWeight: 700, fontSize: 16 }}>฿{row.price}</span>
                              {row.unit && (
                                <span style={{ fontSize: 11, opacity: 0.4, marginLeft: 4 }}>{row.unit}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : tab === "racket_rental" ? (
            racketRentals.length === 0 ? (
              <div style={{ opacity: 0.3, fontSize: 14, textAlign: "center", padding: "64px 0" }}>
                Pricing coming soon
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
                gap: 24
              }}>
                {racketRentals.map(item => {
                  const rows = item.row ? Object.values(item.row) : [];
                  return (
                    <div key={item.docId} style={{
                      background: "var(--mid)",
                      border: "1px solid var(--border)",
                      padding: "28px 32px"
                    }}>
                      {item.name && (
                        <div style={{
                          fontFamily: "'Gotham Narrow', sans-serif",
                          fontSize: 14, letterSpacing: "2px",
                          textTransform: "uppercase", marginBottom: 20,
                          color: "var(--white)"
                        }}>{item.name}</div>
                      )}
                      <div>
                        {rows.map((row, i) => (
                          <div key={i} style={{
                            display: "flex", justifyContent: "space-between", alignItems: "baseline",
                            padding: "12px 0",
                            borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none"
                          }}>
                            <div>
                              <div style={{ fontSize: 13, opacity: 0.7 }}>{row.label}</div>
                              {row.note && (
                                <div style={{ fontSize: 11, opacity: 0.35, marginTop: 3, lineHeight: 1.5 }}>{row.note}</div>
                              )}
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                              <span style={{ color: "var(--green-highlight)", fontWeight: 700, fontSize: 16 }}>฿{row.price}</span>
                              {row.unit && (
                                <span style={{ fontSize: 11, opacity: 0.4, marginLeft: 4 }}>{row.unit}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            tabItems.length === 0 ? (
              <div style={{ opacity: 0.3, fontSize: 14, textAlign: "center", padding: "64px 0" }}>
                Pricing coming soon
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
                gap: 24
              }}>
                {tabItems.map(item => {
                  const rows = parseRows(item.rows);
                  return (
                    <div key={item.docId} style={{
                      background: "var(--mid)",
                      border: "1px solid var(--border)",
                      padding: "28px 32px"
                    }}>
                      <div style={{
                        fontFamily: "'Gotham Narrow', sans-serif",
                        fontSize: 14, letterSpacing: "2px",
                        textTransform: "uppercase", marginBottom: 20,
                        color: "var(--white)"
                      }}>{item.name}</div>
                      <div>
                        {rows.map((row, i) => (
                          <div key={i} style={{
                            display: "flex", justifyContent: "space-between", alignItems: "baseline",
                            padding: "12px 0",
                            borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none"
                          }}>
                            <div>
                              <div style={{ fontSize: 13, opacity: 0.7 }}>{row.label}</div>
                              {row.note && (
                                <div style={{ fontSize: 11, opacity: 0.35, marginTop: 3, lineHeight: 1.5 }}>{row.note}</div>
                              )}
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                              <span style={{ color: "var(--green-highlight)", fontWeight: 700, fontSize: 16 }}>฿{row.price}</span>
                              {row.unit && (
                                <span style={{ fontSize: 11, opacity: 0.4, marginLeft: 4 }}>{row.unit}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </section>

      {/* ── SECTION 3: PACKAGES ── */}
      <section style={{ padding: "100px clamp(24px, 5vw, 72px)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="tag">Membership</div>
          <div className="heading" style={{ marginBottom: 24 }}>Packages</div>
          <p className="body-txt" style={{ fontSize: "clamp(14px, 2vw, 18px)", marginBottom: 64, lineHeight: "1.8", opacity: 0.75 }}>
            All plans include access to all KROSS venues, priority booking, coaching discounts, and exclusive member events.
          </p>

          {plans.length === 0 ? (
            <div style={{ opacity: 0.3, fontSize: 14, textAlign: "center", padding: "64px 0" }}>
              Packages coming soon
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
              gap: 24, alignItems: "stretch"
            }}>
              {plans.map(p => (
                <div
                  key={p.docId || p.name}
                  style={{
                    display: "flex", flexDirection: "column",
                    padding: "72px 40px",
                    minHeight: 360,
                    border: `1px solid ${p.featured ? "var(--green-highlight)" : "var(--border)"}`,
                    background: p.featured ? "rgba(45,168,79,0.08)" : "var(--mid2)",
                    position: "relative",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.4)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {p.featured && (
                    <div style={{ position: "absolute", top: -1, left: 0, right: 0, height: 3, background: "var(--green-highlight)" }} />
                  )}
                  <div style={{
                    fontFamily: "'Gotham Narrow', sans-serif",
                    fontSize: "clamp(18px, 2vw, 22px)", letterSpacing: "1.5px",
                    lineHeight: 1.1, marginBottom: 16, opacity: 0.85
                  }}>{p.name}</div>
                  <div>
                    <span style={{ fontFamily: "'Gotham Narrow', sans-serif", fontSize: 13, opacity: 0.5, verticalAlign: "super" }}>฿</span>
                    <span style={{ fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 700, color: "var(--green-highlight)", letterSpacing: "-1px" }}>
                      {p.price}
                    </span>
                  </div>
                  {p.validity && (
                    <div style={{ fontSize: 11, opacity: 0.38, lineHeight: 1.6, marginTop: 10 }}>{p.validity}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  );
}