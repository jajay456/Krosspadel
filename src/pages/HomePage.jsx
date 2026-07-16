import { useState, useEffect, useContext } from "react";
import Footer from "../components/Footer";
import MobileCarousel from "../components/MobileCarousel";
import { VenueContext } from "../context/VenueContext";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { locationWord, formatDate } from "../utils/venueUtils";
import { MOCKUP_ACTIVITIES } from "../data/mockActivities";

export default function HomePage({ navigate }) {
    const { venues } = useContext(VenueContext);
    const [stories, setStories] = useState([]);
    const [bookPopup, setBookPopup] = useState(false);
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

    const venueWord = locationWord(venues.length);

    useEffect(() => {
        let cancelled = false;
        const mapDocs = (snap) => snap.docs.map(d => ({ docId: d.id, ...d.data() }));
        getDocs(collection(db, "stories")).then(snap => {
            if (cancelled) return;
            setStories(mapDocs(snap));
        });
        return () => { cancelled = true; };
    }, []);


    return (
        <div>
            {/* VIDEO HERO */}
            <section id="hero" style={{ padding: 0 }}>
                <div className="hero-video-wrap" style={{ isolation: "isolate" }}>
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        disablePictureInPicture
                        controls={false}
                        poster="/images/poster.jpg"
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            pointerEvents: "none",
                            transform: "translateZ(0)",
                            willChange: "transform",
                        }}
                    >
                        <source src="/videos/hero.mp4" type="video/mp4" />
                    </video>
                </div>
                <div className="hero-content" style={{ isolation: "isolate" }}>
                    <div className="hero-eyebrow">Thailand's Premier Padel Clubs</div>
                    <div className="hero-title">KROSS</div>
                    <div className="hero-sub">Onnut · Asoke · Thonglor · Rama IV</div>
                    <div className="hero-actions">
                        <div style={{ position: "relative", display: "inline-block" }}>
                            <button className="btn-primary" onClick={() => setBookPopup(o => !o)}>Book Padel</button>
                            {bookPopup && (
                                <>
                                    <div onClick={() => setBookPopup(false)} style={{ position: "fixed", inset: 0, zIndex: 98 }} />
                                    <div style={{
                                        position: "absolute", top: "calc(100% + 10px)", left: 0,
                                        background: "var(--mid)", border: "1px solid var(--border)",
                                        zIndex: 99, minWidth: 220, padding: "8px 0",
                                        boxShadow: "0 16px 48px rgba(0,0,0,0.6)"
                                    }}>
                                        <a href="https://apps.apple.com/kz/app/kross-padel/id6741785490" target="_blank" rel="noreferrer" onClick={() => setBookPopup(false)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", textDecoration: "none", color: "var(--white)", fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                            <span style={{ fontSize: 18 }}>📱</span> KROSS App
                                        </a>
                                        <a href="https://line.me/ti/p/~@krosspadel" target="_blank" rel="noreferrer" onClick={() => setBookPopup(false)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", textDecoration: "none", color: "var(--white)", fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                            <span style={{ fontSize: 18 }}>💬</span> LINE Official
                                        </a>
                                    </div>
                                </>
                            )}
                        </div>
                        <button className="btn-ghost" onClick={() => navigate("venues")}>Our Venues</button>
                    </div>
                </div>
                <div className="scroll-ind"><div className="scroll-line" /></div>
            </section>

            {/* VENUES */}
            <section style={{ padding: "100px clamp(24px, 5vw, 72px) 0" }}>
                <div style={{ padding: "0 0 52px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
                    <div>
                        <div className="tag">Our Venues</div>
                        <div className="heading" style={{ marginBottom: 0 }}>{venueWord}<br />Locations.</div>
                    </div>
                    <div>
                        <p className="body-txt" style={{ marginBottom: 24 }}>World-class padel across Bangkok — each venue designed for the neighbourhood it serves.</p>
                        <button className="btn-ghost" onClick={() => navigate("venues")}>Explore All Venues</button>
                    </div>
                </div>
                <MobileCarousel>
                <div className="venues-grid" data-scroll>
                    {venues.map(v => {
                        const courtCount = v.courts || (v.courtsInfo ? v.courtsInfo.match(/\d+/)?.[0] : null);
                        return (
                            <div className="venue-card" key={v.id} onClick={() => navigate("venue-" + v.id)}>
                                <div className="venue-bg-div" style={{
                                    background: v.bgImage ? `url(${v.bgImage}) center/cover no-repeat` : v.bg
                                }} />
                                <div className="venue-card-inner">
                                    <div className="venue-overlay" />
                                    <div className="venue-info">
                                        <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", opacity: 0.55, marginBottom: 10 }}>Est. {v.est || "2025"}</div>
                                        <div className="venue-name">{v.name}</div>
                                        <div className="venue-loc">{v.loc}</div>
                                        <div className="venue-cta">View Venue →</div>
                                    </div>
                                    {courtCount && (
                                        <div style={{
                                            position: "absolute", bottom: 24, right: 24,
                                            fontSize: 14, letterSpacing: "2px", textTransform: "uppercase", opacity: 0.55
                                        }}>{courtCount} Courts</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                </MobileCarousel>
            </section>

            {/* ACTIVITIES */}
            {activities.length > 0 && (
                <section style={{ padding: "100px clamp(24px, 5vw, 72px) 0" }}>
                    <div style={{ padding: "0 0 52px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
                        <div>
                            <div className="tag">What We Offer</div>
                            <div className="heading" style={{ marginBottom: 0 }}>Activities.</div>
                        </div>
                        <button className="btn-ghost" onClick={() => navigate("activities")}>All Activities</button>
                    </div>

                    <MobileCarousel>
                        <div className="venues-grid activities-mob-scroll" data-scroll>
                            {activities.map((a) => (
                                <div
                                    className="venue-card"
                                    key={a.docId}
                                    onClick={() =>
                                        a.url
                                            ? window.open(a.url, "_blank", "noopener,noreferrer")
                                            : navigate("activities")
                                    }
                                >
                                    <div
                                        className="venue-bg-div"
                                        style={{
                                            background: a.imageUrl
                                                ? `url(${a.imageUrl}) center/cover no-repeat`
                                                : "linear-gradient(135deg, var(--green-dark), var(--green-mid))",
                                        }}
                                    />

                                    <div className="venue-card-inner">
                                        <div className="venue-overlay" />

                                        {a.level && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: 20,
                                                    right: 20,
                                                    background: "rgba(0,0,0,0.55)",
                                                    backdropFilter: "blur(8px)",
                                                    border: "1px solid rgba(45,168,79,0.5)",
                                                    color: "var(--green-highlight)",
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    letterSpacing: "1.5px",
                                                    textTransform: "uppercase",
                                                    padding: "5px 10px",
                                                    borderRadius: 2,
                                                }}
                                            >
                                                {a.level}
                                            </div>
                                        )}

                                        <div className="venue-info">
                                            {a.date && (
                                                <div
                                                    style={{
                                                        fontSize: 10,
                                                        letterSpacing: "2px",
                                                        textTransform: "uppercase",
                                                        opacity: 0.55,
                                                        marginBottom: 10,
                                                    }}
                                                >
                                                    {formatDate(a.date?.toDate ? a.date.toDate() : a.date)}
                                                </div>
                                            )}

                                            <div className="venue-name">{a.name}</div>
                                            <div className="venue-loc">{a.club}</div>
                                            <div className="venue-cta">View Activity →</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </MobileCarousel>
                </section>
            )}

            {/* STORIES */}
            <section style={{ background: "var(--mid)", padding: "100px clamp(24px, 5vw, 72px) 0" }}>
                <div style={{ padding: "0", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 52, flexWrap: "wrap", gap: 24 }}>
                    <div>
                        <div className="tag">Our Stories</div>
                        <div className="heading" style={{ marginBottom: 0 }}>Latest<br />News.</div>
                    </div>
                    <button className="btn-ghost" onClick={() => navigate("stories")}>All Stories</button>
                </div>
                {stories.length > 0 ? (
                    <MobileCarousel>
                    <div className="stories-gallery" data-scroll>
                        {/* Featured — large left */}
                        <div className="story-gallery-feature" onClick={() => navigate("stories")}>
                            <div className="story-gallery-bg" style={{
                                background: stories[0].imageUrl
                                    ? `url(${stories[0].imageUrl}) center/cover no-repeat`
                                    : (stories[0].bg || "var(--mid2)")
                            }} />
                            <div className="story-gallery-overlay" />
                            <div className="story-gallery-feature-body">
                                {stories[0].cat && <div className="story-gallery-cat">{stories[0].cat}</div>}
                                <div className="story-gallery-title-lg">{stories[0].title}</div>
                                <div className="story-gallery-date">{formatDate(stories[0].date)}</div>
                                {stories[0].excerpt && <p className="story-gallery-excerpt">{stories[0].excerpt}</p>}
                                <div className="story-gallery-read">Read More →</div>
                            </div>
                        </div>
                        {/* Side — 2 stacked small cards */}
                        <div className="story-gallery-side">
                            {stories.slice(1, 3).map(s => (
                                <div key={s.docId} className="story-gallery-small" onClick={() => navigate("stories")}>
                                    <div className="story-gallery-bg" style={{
                                        background: s.imageUrl
                                            ? `url(${s.imageUrl}) center/cover no-repeat`
                                            : (s.bg || "var(--mid2)")
                                    }} />
                                    <div className="story-gallery-overlay" />
                                    <div className="story-gallery-small-body">
                                        {s.cat && <div className="story-gallery-cat">{s.cat}</div>}
                                        <div className="story-gallery-title-sm">{s.title}</div>
                                        <div className="story-gallery-date">{formatDate(s.date)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    </MobileCarousel>
                ) : (
                    <div style={{ padding: "80px 0", opacity: .3, fontSize: 12, letterSpacing: 3, textTransform: "uppercase" }}>No stories yet</div>
                )}

            </section>

            {/* APP SHOWCASE */}
            <section className="app-showcase-grid" style={{ background: "linear-gradient(145deg, var(--green-dark) 0%, #0a0f0a 100%)" }}>
                {/* Header — tag + heading */}
                <div className="app-header" style={{ padding: "80px clamp(24px, 5vw, 72px) 0" }}>
                    <div className="tag">The App</div>
                    <div className="heading">Join The<br />Kross App.</div>
                </div>
                {/* Details — features + CTA */}
                <div className="app-details" style={{ padding: "0 clamp(24px, 5vw, 72px) 80px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, margin: "32px 0 40px" }}>
                        {[
                            { title: "Profile & Level", desc: "Track your profile, stats and player level in one place." },
                            { title: "Book Courts & Coaches", desc: "Easily book courts and coaching sessions anytime." },
                            { title: "Open Matches", desc: "Join open matches and play with the community." },
                            { title: "Activities & Lessons", desc: "Discover events, classes and training activities." },
                        ].map((item, i) => (
                            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green-highlight)", marginTop: 7, flexShrink: 0 }} />
                                <p className="body-txt" style={{ margin: 0, fontSize: 14 }}>
                                    <strong style={{ color: "var(--white)" }}>{item.title}</strong> — {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                    <a href="https://apps.apple.com/kz/app/kross-padel/id6741785490" target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: "none", display: "inline-block", alignSelf: "flex-start" }}>Download on App Store</a>
                </div>
                {/* Image */}
                <div className="app-img-col" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <img src="/image/kross_app.png" alt="Kross App" style={{ width: "100%", height: "auto", display: "block", borderRadius: 12 }}
                        onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
                    />
                    <div style={{ display: "none", width: 260, height: 520, border: "2px solid var(--border)", borderRadius: 32, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, opacity: 0.3 }}>
                        <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase" }}>App Image</div>
                        <div style={{ fontSize: 10, opacity: 0.6 }}>Drop app_mockup.png in /public</div>
                    </div>
                </div>
            </section>

            {/* BOOK CTA */}
            <div id="book-cta">
                <div className="book-bg-text">BOOK PADEL BOOK PADEL BOOK PADEL BOOK PADEL &nbsp;BOOK PADEL BOOK PADEL BOOK PADEL BOOK PADEL &nbsp;</div>
                <div className="book-content">
                    <div className="book-title">Ready To Play?</div>
                    <div style={{ fontSize: 26, letterSpacing: "4px", textTransform: "uppercase", opacity: 0.55, marginBottom: 40 }}>Join Our Community</div>
                    <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                        <button className="book-cta-btn" onClick={() => window.open("https://wa.me/66XXXXXXXXX", "_blank")} style={{ background: "transparent", border: "2px solid var(--white)", color: "var(--white)" }}>WhatsApp</button>
                        <a href="https://line.me/ti/p/~@krosspadel" target="_blank" rel="noreferrer" className="book-cta-btn" style={{ textDecoration: "none" }}>LINE</a>
                    </div>
                </div>
            </div>

            <Footer navigate={navigate} />
        </div>
    );
}