import { useState, useEffect, useRef } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { uploadImage } from "../../imagekitClient";
import { formatDate } from "../../utils/venueUtils";

const EMPTY = { num: "", name: "", text: "", imageUrl: "", date: "", time: "", club: "", level: "", url: "" };

function ActivityPreview({ form }) {
    return (
        <div style={{ background: "var(--mid)", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green-highlight)" }} />
                <div style={{ fontSize: 11, opacity: 0.5, textTransform: "uppercase", letterSpacing: 2 }}>Live Preview</div>
            </div>
            <div style={{ padding: 24 }}>
                <div style={{
                    position: "relative", height: 220, borderRadius: 4, overflow: "hidden",
                    background: form.imageUrl
                        ? `url(${form.imageUrl}) center/cover no-repeat`
                        : "linear-gradient(135deg, var(--green-dark), var(--green-mid))"
                }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.2) 60%, transparent 100%)" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 20px" }}>
                        {form.date && <div style={{ fontSize: 10, opacity: 0.6, letterSpacing: "1.5px", marginBottom: 6, textTransform: "uppercase" }}>{formatDate(form.date)}</div>}
                        <div style={{ fontFamily: "'Gotham Narrow', sans-serif", fontSize: 22, letterSpacing: "1.5px", lineHeight: 1.1 }}>
                            {form.name || "Activity Name"}
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: 12, fontSize: 12, opacity: 0.5, lineHeight: 1.7 }}>
                    {form.text || "Description will appear here..."}
                </div>
                <div style={{ marginTop: 8, fontSize: 10, opacity: 0.3, letterSpacing: 1, textTransform: "uppercase" }}>
                    As shown on Activities page
                </div>
            </div>
        </div>
    );
}

export default function AdminActivitiesPage() {
    const [activities, setActivities] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const load = async () => {
        const snap = await getDocs(collection(db, "activities"));
        setActivities(snap.docs.map(d => ({ docId: d.id, ...d.data() })));
    };

    useEffect(() => {
        let cancelled = false;
        getDocs(collection(db, "activities")).then(snap => {
            if (!cancelled) setActivities(snap.docs.map(d => ({ docId: d.id, ...d.data() })));
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
        if (editing === "new") {
            await addDoc(collection(db, "activities"), data);
        } else {
            await updateDoc(doc(db, "activities", editing), data);
        }
        setSaving(false);
        handleBack();
    };

    const handleDelete = async (docId) => {
        if (!confirm("ลบ activity นี้?")) return;
        await deleteDoc(doc(db, "activities", docId));
        load();
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const docId = editing === "new" ? "temp" : editing;
            const imageUrl = await uploadImage(file, "activities", docId);
            setForm(f => ({ ...f, imageUrl }));
        } catch (error) {
            console.error("Image upload error:", error);
            alert("อัปโหลดรูปไม่สำเร็จ: " + error.message);
        }
        setUploading(false);
        e.target.value = "";
    };

    // LIST
    if (!editing) return (
        <div className="adm-page">
            <div className="adm-head">
                <div>
                    <div className="adm-title">Activities</div>
                </div>
                <button className="btn-primary" onClick={handleNew}>+ Add Activity</button>
            </div>
            <div className="adm-list">
                {activities.map(item => (
                    <div key={item.docId} className="adm-row">
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            {item.imageUrl
                                ? <img src={item.imageUrl} alt="" style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 3, opacity: .8 }} />
                                : <div style={{ width: 56, height: 40, borderRadius: 3, background: "linear-gradient(135deg, var(--green-dark), var(--green-mid))" }} />
                            }
                            <div>
                                <div className="adm-row-title">{item.name}</div>
                                <div className="adm-row-meta">{item.date ? formatDate(item.date) + " · " : ""}{item.text?.slice(0, 60)}...</div>
                            </div>
                        </div>
                        <div className="adm-row-actions">
                            <button className="btn-ghost" onClick={() => handleEdit(item)}>Edit</button>
                            <button onClick={() => handleDelete(item.docId)} className="adm-btn-danger">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // FORM
    return (
        <div className="adm-page">
            <div className="adm-crumbs">
                <button className="adm-back" onClick={handleBack}>← Back to List</button>
            </div>
            <div className="adm-title">{editing === "new" ? "New Activity" : "Edit Activity"}</div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 560px) minmax(280px, 1fr)", gap: 48, alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Number */}
                    <div>
                        <div className="adm-label">Number (e.g. 01)</div>
                        <input
                            value={form.num || ""}
                            onChange={e => handleChange("num", e.target.value)}
                            className="adm-input"
                        />
                    </div>
                    {/* Name */}
                    <div>
                        <div className="adm-label">Activity Name</div>
                        <input
                            value={form.name || ""}
                            onChange={e => handleChange("name", e.target.value)}
                            className="adm-input"
                        />
                    </div>
                    {/* Date */}
                    <div>
                        <div className="adm-label">Day</div>
                        <input
                            type="string"
                            value={form.date || ""}
                            onChange={e => handleChange("date", e.target.value)}
                            className="adm-input"
                        />
                    </div>
                    {/* Time */}
                    <div>
                        <div className="adm-label">Time (e.g. 18:00 – 20:00)</div>
                        <input
                            value={form.time || ""}
                            onChange={e => handleChange("time", e.target.value)}
                            placeholder="e.g. 18:00 – 20:00"
                            className="adm-input"
                        />
                    </div>
                    {/* Club */}
                    <div>
                        <div className="adm-label">Club / Venue</div>
                        <input
                            value={form.club || ""}
                            onChange={e => handleChange("club", e.target.value)}
                            placeholder="e.g. KROSS Onnut"
                            className="adm-input"
                        />
                    </div>
                    {/* Level */}
                    <div>
                        <div className="adm-label">Level (e.g. All Levels / Intermediate+)</div>
                        <input
                            value={form.level || ""}
                            onChange={e => handleChange("level", e.target.value)}
                            placeholder="e.g. All Levels"
                            className="adm-input"
                        />
                    </div>
                    {/* text */}
                    <div>
                        <div className="adm-label">Text</div>
                        <textarea
                            value={form.text || ""}
                            onChange={e => handleChange("text", e.target.value)}
                            rows={5}
                            className="adm-input"
                        />
                    </div>
                   {/* Description */}
                    <div>
                        <div className="adm-label">Detail</div>
                        <textarea
                            value={form.detail || ""}
                            onChange={e => handleChange("detail", e.target.value)}
                            rows={5}
                            className="adm-input"
                        />
                    </div>
                    {/* Image upload */}
                    <div className="adm-panel">
                        <div className="tag" style={{ marginBottom: 8 }}>Cover Image</div>
                        <div style={{ opacity: 0.7, fontSize: 13, marginBottom: 12 }}>Upload activity image (shown as card background)</div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            style={{ display: "none" }}
                        />
                        <button
                            type="button"
                            className="btn-ghost"
                            disabled={uploading}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {uploading ? "Uploading..." : "Choose Image"}
                        </button>
                        {form.imageUrl && (
                            <div style={{ marginTop: 12 }}>
                                <img src={form.imageUrl} alt="Cover" style={{ maxWidth: "100%", maxHeight: 160, borderRadius: 4, objectFit: "cover" }} />
                                <button
                                    type="button"
                                    onClick={() => handleChange("imageUrl", "")}
                                    style={{ display: "block", marginTop: 8, background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", fontSize: 13 }}
                                >
                                    Remove Image
                                </button>
                            </div>
                        )}
                    </div>
                    <button className="btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Activity"}
                    </button>
                </div>
                <div style={{ position: "sticky", top: 24 }}>
                    <ActivityPreview form={form} />
                </div>
            </div>
        </div>
    );
}