import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

import Footer from "../components/Footer";

export default function AboutPage({ navigate }) {
    const team = [
        {
            id: 1,
            name: "NACHO CARBONERO",
            position: "CEO & Co-Founder",
            bio:"Entrepreneur and operator who relocated to Thailand to build KROSS from the ground up. Nacho leads the company's strategy, expansion, fundraising, partnerships, and overall growth across Southeast Asia.",
            image: "/image/team/Nacho.png",
        },
        {
            id: 2,
            name: "RAFAEL CARBONERO",
            position: "Co-Founder & Strategic Advisor",
            bio:"Former CEO of The99Investments and experienced entrepreneur with a strong background in investment, business development, and corporate strategy. Rafael supports KROSS on growth strategy, capital allocation, and long-term value creation.",
            image: "/image/team/Rafael.png",
        },
        {
            id: 3,
            name: "ROBERTO VILLALOBOS",
            position: "COO",
            bio:"With extensive experience in operations, business development, and large-scale customer service environments, Roberto leads KROSS's operational execution, systems, processes, and team performance across the group's growing network of venues.",
            image: "/image/team/Roberto.png",
        },
        {
            id: 4,
            name: "MARKUS HENNE",
            position: "Board Advisor",
            bio:"Former CEO of Genesis Motor China and former CEO of Mercedes-Benz Taiwan. Markus brings decades of leadership experience across global brands, with expertise in premium business scaling, governance, and international expansion.",
            image: "/image/team/Markus.png",
        },
    ];


    const milestones = [
        { year: "2022", title: "The Vision", desc: "KROSS was founded with the ambition of building the leading padel ecosystem in Southeast Asia and introducing world-class padel experiences to a new generation of players." },
        { year: "2023", title: "First Club Launch", desc: "Opened the first KROSS Padel club in Bangkok, creating the foundation of a fast-growing community." },
        { year: "2024", title: "Expansion", desc: "Accelerated growth through the launch of multiple venues across Bangkok, establishing KROSS as one of Thailand's leading padel operators." },
        { year: "2025", title: "Ecosystem Development", desc: "Expanded beyond clubs with tournaments, coaching programs, events, technology solutions, and strategic partnerships." },
        { year: "2026", title: "The Next Chapter", desc: "Scaling towards becoming Southeast Asia's leading racquet sports ecosystem through padel, fitness, technology, and community-driven experiences." },
    ];

    const reasons = [
        { title: "Multi-Location Network", desc: "Play across Bangkok's leading padel venues with access to a growing ecosystem of clubs and experiences." },
        { title: "Professional Coaching", desc: "Learn from experienced international coaches through private lessons, academies, clinics, and performance programs." },
        { title: "Active Community", desc: "Join one of Southeast Asia's most engaged padel communities through leagues, social games, tournaments, and events." },
        { title: "Technology-Driven Experience", desc: "Seamlessly book courts, join matches, track rankings, and access club services through the KROSS platform." },
        { title: "Tournaments & Competition", desc: "Compete year-round through TPS, leagues, ladders, social tournaments, and high-performance events." },
        { title: "Beyond Padel", desc: "Experience a complete lifestyle ecosystem combining sport, fitness, social spaces, events, food & beverage, and community." },
    ];

    return (
        <div>
            {/* HERO SECTION */}
            <section id="hero" style={{ padding: 0 }}>
                <div className="hero-video-wrap"
                style={{
                    backgroundImage: " linear-gradient(rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.4)),url('/image/backgrounds/KROSS - Brand deck.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                    filter: "brightness(1.4)", 
                    WebkitFilter: "brightness(1.4)",
                }}
                />
                <div className="hero-content">
                    <div className="hero-eyebrow">Our Story</div>
                    <div className="hero-title">About KROSS</div>
                    <div className="hero-sub">Building Asia's Premier Padel Community</div>
                </div>
            </section>

            {/* OUR STORY TIMELINE */}
            <section style={{ padding: "100px clamp(24px, 5vw, 72px)" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <div className="tag">Our Journey</div>
                    <div className="heading" style={{ marginBottom: 64 }}>Our Story</div>
                    <p className="body-txt" style={{ marginBottom: 64, fontSize: "18px", lineHeight: "1.8", opacity: 0.9 }}>
                        KROSS was born from a simple vision: to bring world-class padel experiences to Asia and build a thriving community around one of the world's fastest-growing sports. What started as a single idea quickly evolved into a complete ecosystem encompassing clubs, coaching, tournaments, technology, events, and lifestyle experiences. Today, KROSS is helping shape the future of padel in Southeast Asia, driven by a commitment to excellence, innovation, and community.
                    </p>
                    <div style={{ display: "grid", gap: 48 }}>
                        {milestones.map((m, i) => (
                            <div key={i} style={{
                                display: "flex",
                                gap: 32,
                                paddingBottom: i < milestones.length - 1 ? 48 : 0,
                                borderBottom: i < milestones.length - 1 ? `1px solid var(--border)` : "none"
                            }}>
                                <div style={{
                                    minWidth: "100px",
                                    fontSize: "28px",
                                    fontWeight: 600,
                                    color: "var(--green-highlight)"
                                }}>{m.year}</div>
                                <div>
                                    <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: 8 }}>{m.title}</div>
                                    <p className="body-txt">{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MISSION & VISION */}
            <section style={{
                padding: "100px clamp(24px, 5vw, 72px)",
                background: "linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 100%)",
                marginTop: 0
            }}>
                <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                    <div className="grid-about" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
                        <div>
                            <div className="tag" style={{ color: "var(--green-highlight)" }}>Our Purpose</div>
                            <div className="heading" style={{ marginBottom: 24 }}>Mission</div>
                            <p className="body-txt" style={{ fontSize: "18px", lineHeight: "1.8", opacity: 0.95 }}>
                                To accelerate the growth of racquet sports across Southeast Asia by creating exceptional venues, experiences, and technology that connect people through sport.
                            </p>
                        </div>
                        <div>
                            <div className="tag" style={{ color: "var(--green-highlight)" }}>Where We're Headed</div>
                            <div className="heading" style={{ marginBottom: 24 }}>Vision</div>
                            <p className="body-txt" style={{ fontSize: "18px", lineHeight: "1.8", opacity: 0.95 }}>
                                To build Southeast Asia's leading racquet sports ecosystem, combining world-class facilities, technology, events, and community under one unified platform.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHY KROSS */}
            <section style={{ padding: "100px clamp(24px, 5vw, 72px)" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <div className="tag">The KROSS Difference</div>
                    <div className="heading" style={{ marginBottom: 64 }}>Why Choose KROSS?</div>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: 40
                    }}>
                        {reasons.map((r, i) => (
                            <div key={i} style={{
                                padding: 32,
                                border: `1px solid var(--border)`,
                                borderRadius: "8px",
                                background: "var(--mid2)",
                                transition: "all 0.3s ease"
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "var(--green-highlight)";
                                    e.currentTarget.style.background = "rgba(45, 168, 79, 0.05)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--border)";
                                    e.currentTarget.style.background = "var(--mid2)";
                                }}>
                                <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: 8 }}>{r.title}</div>
                                <p className="body-txt">{r.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {team.length > 0 && (
            <section style={{ padding: "100px clamp(24px, 5vw, 72px)" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div className="tag">Meet The Team</div>
                <div className="heading" style={{ marginBottom: 64 }}>
                    Our Founders & Leadership
                </div>

                <div
                    style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: 48,
                    }}
                >
                    {team.map((member) => (
                    <div
                        key={member.id}
                        style={{
                        textAlign: "center",
                        padding: "32px 0",
                        }}
                    >
                        {member.image ? (
                        <img
                            src={member.image}
                            alt={member.name}
                            style={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            objectFit: "cover",
                            margin: "0 auto 24px",
                            display: "block",
                            border: "2px solid var(--border)",
                            }}
                        />
                        ) : (
                        <div
                            style={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            background:
                                "linear-gradient(135deg, var(--green-dark), var(--green-bright))",
                            margin: "0 auto 24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 48,
                            }}
                        >
                            👤
                        </div>
                        )}

                        <div
                        style={{
                            fontSize: 18,
                            fontWeight: 600,
                            marginBottom: 4,
                        }}
                        >
                        {member.name}
                        </div>

                        <div
                        style={{
                            fontSize: 13,
                            color: "var(--green-highlight)",
                            marginBottom: 12,
                            letterSpacing: "1px",
                        }}
                        >
                        {member.position}
                        </div>

                        <p className="body-txt">{member.bio}</p>
                    </div>
                    ))}
                </div>
                </div>
            </section>
            )}

            {/* FINAL CTA */}
            <section style={{
                padding: "100px clamp(24px, 5vw, 72px)",
                background: "linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 100%)"
            }}>
                <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
                    <div className="tag" style={{ color: "var(--green-highlight)" }}>Join Us</div>
                    <div className="heading" style={{ marginBottom: 32 }}>Join the KROSS Community</div>
                    <p className="body-txt" style={{ fontSize: "18px", marginBottom: 48, opacity: 0.95 }}>
                        Ready to experience premium padel? Become part of our thriving community today.
                    </p>
                    <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="https://line.me/ti/p/~@krosspadel" target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: "none" }}>LINE</a>
                        <button className="btn-ghost" onClick={() => window.open("https://wa.me/66XXXXXXXXX", "_blank")}>WhatsApp</button>
                    </div>
                </div>
            </section>

            <Footer navigate={navigate} />
        </div>
    );
}
