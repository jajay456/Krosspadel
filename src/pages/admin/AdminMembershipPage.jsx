import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const EMPTY = { name: "", price: "", priceLabel: "", validity: "", perks: "", featured: false, hidden: false };

function MembershipPreview({ form }) {
    return (
        <div style={{ background: "var(--mid)", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green-highlight)" }} />
                <div style={{ fontSize: 11, opacity: 0.5, textTransform: "uppercase", letterSpacing: 2 }}>Live Preview</div>
            </div>
            <div style={{ padding: 24 }}>
                {/* Full plan card preview */}
                <div style={{
                    padding: 32,
                    border: `1px solid ${form.featured ? "var(--green-highlight)" : "rgba(255,255,255,0.08)"}`,
                    background: form.featured ? "rgba(45, 168, 79, 0.08)" : "var(--mid2)",
                    borderRadius: 4,
                    position: "relative"
                }}>
                    {form.featured && (
                        <div style={{
                            position: "absolute", top: -1, left: 20,
                            background: "var(--green-highlight)", color: "#fff",
                            fontSize: 8, letterSpacing: "2px", padding: "4px 10px", fontWeight: 600
                        }}>
                            POPULAR
                        </div>
                    )}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontFamily: "'Gotham Narrow', sans-serif", fontSize: 28, letterSpacing: "1.5px", marginBottom: 10, lineHeight: 1 }}>
                            {form.name || "Plan Name"}
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                            <div style={{ fontSize: 30, fontWeight: 700, color: "var(--green-highlight)" }}>
                                ฿{form.price || "0"}
                            </div>
                            {form.priceLabel && <div style={{ fontSize: 11, opacity: 0.5 }}>{form.priceLabel}</div>}
                        </div>
                        {form.validity && <div style={{ fontSize: 11, opacity: 0.4, marginTop: 6 }}>{form.validity}</div>}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.55, lineHeight: 1.9, marginBottom: 20 }}>
                        {(form.perks || "Perks will appear here...").split("\n").filter(l => l.trim()).map((line, i) => (
                            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                                <span style={{ color: "var(--green-highlight)", flexShrink: 0 }}>·</span>
                                <span>{line.replace(/^[-•·]\s*/, "")}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{
                        padding: "12px 20px", textAlign: "center", fontSize: 10, letterSpacing: "2px",
                        textTransform: "uppercase", fontWeight: 600,
                        background: form.featured ? "var(--green-bright)" : "none",
                        border: form.featured ? "none" : "1px solid rgba(255,255,255,0.2)",
                        opacity: 0.8
                    }}>
                        Get Started
                    </div>
                </div>

                {/* Homepage mini card preview */}
                <div style={{ marginTop: 20 }}>
                    <div style={{ fontSize: 10, opacity: 0.35, marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>As Homepage Card</div>
                    <div style={{
                        padding: "20px 24px",
                        border: `1px solid ${form.featured ? "var(--green-highlight)" : "rgba(255,255,255,0.08)"}`,
                        background: form.featured ? "rgba(45,168,79,0.07)" : "transparent",
                        borderRadius: 2
                    }}>
                        <div style={{ fontFamily: "'Gotham Narrow', sans-serif", fontSize: 22, letterSpacing: "1.5px", marginBottom: 4 }}>
                            {form.name || "Plan Name"}
                        </div>
                        <div style={{ fontSize: 12, opacity: 0.5 }}>฿<strong style={{ color: "var(--white)", opacity: 1 }}>{form.price || "0"}</strong>{form.priceLabel ? ` · ${form.priceLabel}` : ""}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminMembershipPage({ navigate }) {
    const [plans, setPlans] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        const snap = await getDocs(collection(db, "plans"));
        setPlans(snap.docs.map(d => ({ docId: d.id, ...d.data() })));
    };

    useEffect(() => {
        let cancelled = false;
        getDocs(collection(db, "plans")).then(snap => {
            if (!cancelled) setPlans(snap.docs.map(d => ({ docId: d.id, ...d.data() })));
        });
        return () => { cancelled = true; };
    }, []);

    const handleEdit = (item) => { setForm(item); setEditing(item.docId); };
    const handleNew = () => { setForm(EMPTY); setEditing("new"); };
    const handleBack = () => { setEditing(null); load(); };
    const handleChange = (key, value) => setForm(f => ({ ...f, [key]: value }));

    const handleSave = async () => {
        setSaving(true);
        const { docId: _docId, ...data } = form;
        data.featured = !!data.featured;
        if (editing === "new") {
            await addDoc(collection(db, "plans"), data);
        } else {
            await updateDoc(doc(db, "plans", editing), data);
        }
        setSaving(false);
        handleBack();
    };

    const handleDelete = async (docId) => {
        if (!confirm("ลบแผนสมาชิกนี้?")) return;
        await deleteDoc(doc(db, "plans", docId));
        load();
    };

    // LIST
    if (!editing) return (
        <div style={{ minHeight: "100vh", background: "var(--dark)", padding: "120px 40px 40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
                <div>
                    <button className="back-btn" onClick={() => navigate("admin")}>← Dashboard</button>
                    <div className="heading" style={{ fontSize: 32, marginBottom: 0 }}>Membership Plans</div>
                </div>
                <button className="btn-primary" onClick={handleNew}>+ Add Plan</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {plans.map(item => (
                    <div key={item.docId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", background: "var(--mid)", borderRadius: 8 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div className="venue-name" style={{ fontSize: 18 }}>{item.name}</div>
                                {item.featured && <span style={{ fontSize: 8, letterSpacing: "2px", background: "var(--green-highlight)", color: "#fff", padding: "2px 8px", fontWeight: 600 }}>POPULAR</span>}
                                {item.hidden && <span style={{ fontSize: 8, letterSpacing: "2px", background: "#555", color: "#fff", padding: "2px 8px", fontWeight: 600 }}>HIDDEN</span>}
                            </div>
                            <div style={{ opacity: 0.5, fontSize: 13 }}>{item.price} · {item.perks?.slice(0, 60)}...</div>
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                            <button className="btn-ghost" onClick={() => handleEdit(item)}>Edit</button>
                            <button onClick={() => handleDelete(item.docId)} style={{ background: "none", border: "1px solid #ff6b6b", color: "#ff6b6b", padding: "8px 20px", cursor: "pointer", borderRadius: 2 }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // FORM
    return (
        <div style={{ minHeight: "100vh", background: "var(--dark)", padding: "120px 40px 40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
                <button className="back-btn" onClick={handleBack}>← Back to List</button>
                <button className="back-btn" onClick={() => navigate("admin")}>← Dashboard</button>
            </div>
            <div className="heading" style={{ fontSize: 32, marginBottom: 32 }}>{editing === "new" ? "New Plan" : "Edit Plan"}</div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 560px) minmax(280px, 1fr)", gap: 48, alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Name */}
                    <div>
                        <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 6, textTransform: "uppercase" }}>Name</div>
                        <input
                            value={form.name || ""}
                            onChange={e => handleChange("name", e.target.value)}
                            style={{ width: "100%", padding: "12px 16px", background: "var(--mid)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", borderRadius: 4 }}
                        />
                    </div>
                    {/* Price */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                            <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 6, textTransform: "uppercase" }}>Package Price (THB)</div>
                            <input
                                value={form.price || ""}
                                onChange={e => handleChange("price", e.target.value)}
                                placeholder="e.g. 9,200"
                                style={{ width: "100%", padding: "12px 16px", background: "var(--mid)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", borderRadius: 4 }}
                            />
                        </div>
                        <div>
                            <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 6, textTransform: "uppercase" }}>Price Label</div>
                            <input
                                value={form.priceLabel || ""}
                                onChange={e => handleChange("priceLabel", e.target.value)}
                                placeholder="e.g. All Kross Clubs"
                                style={{ width: "100%", padding: "12px 16px", background: "var(--mid)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", borderRadius: 4 }}
                            />
                        </div>
                    </div>
                    {/* Validity */}
                    <div>
                        <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 6, textTransform: "uppercase" }}>Conditions / Validity</div>
                        <input
                            value={form.validity || ""}
                            onChange={e => handleChange("validity", e.target.value)}
                            placeholder="e.g. Valid 3 months, Non-transferable. Use for regular booking."
                            style={{ width: "100%", padding: "12px 16px", background: "var(--mid)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", borderRadius: 4 }}
                        />
                    </div>
                    {/* Perks */}
                    <div>
                        <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 6, textTransform: "uppercase" }}>Key Perks (bullet list)</div>
                        <div style={{ fontSize: 11, opacity: 0.4, marginBottom: 8 }}>แต่ละบรรทัด = 1 bullet · กด Enter ขึ้นบรรทัดใหม่</div>
                        <textarea
                            value={form.perks || ""}
                            onChange={e => handleChange("perks", e.target.value)}
                            rows={7}
                            placeholder={"Kross Pass: 20 hrs 17,400 B\nKross Pass: 30 hrs 25,600 B\n50/100 hours none expired date."}
                            style={{ width: "100%", padding: "12px 16px", background: "var(--mid)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", borderRadius: 4, resize: "vertical", lineHeight: 1.7 }}
                        />
                    </div>
                    {/* Featured toggle */}
                    <div
                        onClick={() => handleChange("featured", !form.featured)}
                        style={{
                            display: "flex", alignItems: "center", gap: 14, padding: "16px 20px",
                            background: form.featured ? "rgba(45,168,79,0.1)" : "var(--mid)",
                            border: `1px solid ${form.featured ? "var(--green-highlight)" : "rgba(255,255,255,0.1)"}`,
                            borderRadius: 4, cursor: "pointer", transition: "all .2s"
                        }}
                    >
                        <div style={{
                            width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                            background: form.featured ? "var(--green-highlight)" : "none",
                            border: `2px solid ${form.featured ? "var(--green-highlight)" : "rgba(255,255,255,0.3)"}`,
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12
                        }}>
                            {form.featured ? "✓" : ""}
                        </div>
                        <div>
                            <div style={{ fontSize: 13, marginBottom: 2 }}>Mark as Popular / Featured</div>
                            <div style={{ fontSize: 11, opacity: 0.45 }}>แสดง badge "POPULAR" และ highlight สีเขียว</div>
                        </div>
                    </div>
                    {/* Hidden toggle */}
                    <div
                        onClick={() => handleChange("hidden", !form.hidden)}
                        style={{
                            display: "flex", alignItems: "center", gap: 14, padding: "16px 20px",
                            background: form.hidden ? "rgba(255,100,100,0.07)" : "var(--mid)",
                            border: `1px solid ${form.hidden ? "rgba(255,100,100,0.4)" : "rgba(255,255,255,0.1)"}`,
                            borderRadius: 4, cursor: "pointer", transition: "all .2s"
                        }}
                    >
                        <div style={{
                            width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                            background: form.hidden ? "#ff6464" : "none",
                            border: `2px solid ${form.hidden ? "#ff6464" : "rgba(255,255,255,0.3)"}`,
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12
                        }}>
                            {form.hidden ? "✓" : ""}
                        </div>
                        <div>
                            <div style={{ fontSize: 13, marginBottom: 2 }}>Hide from customers</div>
                            <div style={{ fontSize: 11, opacity: 0.45 }}>ไม่โชว์ให้ลูกค้าเห็นในหน้า Book & Pricing</div>
                        </div>
                    </div>
                    <button className="btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Plan"}
                    </button>
                </div>
                <div style={{ position: "sticky", top: 120 }}>
                    <MembershipPreview form={form} />
                </div>
            </div>
        </div>
    );
}
