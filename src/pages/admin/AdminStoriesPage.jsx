import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { uploadImage } from "../../cloudinaryClient";

const EMPTY = { title: "", author: "", excerpt: "", content: "", date: "", cat: "", bg: "", imageUrl: "", gallery: [] };

function parseGradientColors(bg) {
    const matches = bg?.match(/#[0-9a-fA-F]{3,6}/g);
    if (matches?.length >= 2) return [matches[0], matches[1]];
    if (matches?.length === 1) return [matches[0], matches[0]];
    return ["#0a1a0d", "#1a3d1a"];
}

function StoryPreview({ form }) {
    return (
        <div style={{ background: "var(--mid)", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green-highlight)" }} />
                <div style={{ fontSize: 11, opacity: 0.5, textTransform: "uppercase", letterSpacing: 2 }}>Live Preview</div>
            </div>
            <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
                {/* Gallery card preview (featured) */}
                <div style={{ position: "relative", height: 240, overflow: "hidden" }}>
                    <div style={{
                        position: "absolute", inset: 0,
                        background: form.imageUrl
                            ? `url(${form.imageUrl}) center/cover no-repeat`
                            : (form.bg || "var(--mid2)")
                    }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.9) 0%, rgba(0,0,0,.1) 55%, transparent 100%)" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 24px" }}>
                        {form.cat && <div style={{ fontSize: 9, letterSpacing: "3.5px", textTransform: "uppercase", color: "var(--green-highlight)", marginBottom: 8 }}>{form.cat}</div>}
                        <div style={{ fontFamily: "'Gotham Narrow', sans-serif", fontSize: 26, letterSpacing: "1.5px", lineHeight: 1, marginBottom: 6 }}>
                            {form.title || "Story Title"}
                        </div>
                        <div style={{ fontSize: 10, opacity: .4, letterSpacing: "1.5px" }}>{form.date}</div>
                    </div>
                </div>

                {/* List card preview */}
                <div style={{ padding: 20, borderTop: "2px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ fontSize: 10, opacity: 0.35, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>As Story Card</div>
                    <div style={{ background: "var(--mid2)", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{
                            aspectRatio: "4/3",
                            background: form.imageUrl
                                ? `url(${form.imageUrl}) center/cover no-repeat`
                                : (form.bg || "#1a1a1a")
                        }} />
                        <div style={{ padding: "14px 16px" }}>
                            {form.cat && <div style={{ fontSize: 8, letterSpacing: "3px", textTransform: "uppercase", color: "var(--green-highlight)", marginBottom: 6 }}>{form.cat}</div>}
                            <div style={{ fontFamily: "'Gotham Narrow', sans-serif", fontSize: 18, letterSpacing: "1px", marginBottom: 6, lineHeight: 1.1 }}>
                                {form.title || "Story Title"}
                            </div>
                            <div style={{ fontSize: 10, opacity: .4, marginBottom: 8 }}>{form.date}</div>
                            {form.excerpt && <div style={{ fontSize: 11, opacity: .55, lineHeight: 1.6 }}>{form.excerpt.slice(0, 100)}{form.excerpt.length > 100 ? "…" : ""}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminStoriesPage({ navigate }) {
    const [stories, setStories] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
    const [dragOver, setDragOver] = useState(false);
    const [gradColors, setGradColors] = useState(["#0a1a0d", "#1a3d1a"]);

    const load = async () => {
        const snap = await getDocs(collection(db, "stories"));
        setStories(snap.docs.map(d => ({ docId: d.id, ...d.data() })));
    };

    useEffect(() => {
        let cancelled = false;
        getDocs(collection(db, "stories")).then(snap => {
            if (!cancelled) setStories(snap.docs.map(d => ({ docId: d.id, ...d.data() })));
        });
        return () => { cancelled = true; };
    }, []);

    const handleBack = () => { setEditing(null); load(); };
    const handleEdit = (s) => { setForm(s); setEditing(s.docId); setGradColors(parseGradientColors(s.bg)); };
    const handleNew = () => { setForm(EMPTY); setEditing("new"); setGradColors(["#0a1a0d", "#1a3d1a"]); };

    const handleGradColor = (idx, hex) => {
        const next = idx === 0 ? [hex, gradColors[1]] : [gradColors[0], hex];
        setGradColors(next);
        handleChange("bg", `linear-gradient(135deg, ${next[0]} 0%, ${next[1]} 100%)`);
    };
    const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleSave = async () => {
        setSaving(true);
        const { docId: _docId, ...data } = form;
        if (editing === "new") {
            await addDoc(collection(db, "stories"), data);
        } else {
            await updateDoc(doc(db, "stories", editing), data);
        }
        setSaving(false);
        handleBack();
    };

    const handleDelete = async (docId) => {
        if (!confirm("ลบ story นี้?")) return;
        await deleteDoc(doc(db, "stories", docId));
        load();
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true);
            const docId = editing === "new" ? "temp" : editing;
            const imageUrl = await uploadImage(file, "stories", docId);
            setForm(f => ({ ...f, imageUrl }));
        } catch (error) {
            console.error("Upload error:", error);
            alert("ผิดพลาดในการอัปโหลดรูป");
        } finally {
            setUploading(false);
        }
    };

    const uploadGalleryFiles = async (files) => {
        if (!files.length) return;
        const docId = editing === "new" ? "temp" : editing;
        setUploading(true);
        setUploadProgress({ done: 0, total: files.length });
        const urls = [];
        for (const file of files) {
            const url = await uploadImage(file, "stories", docId);
            urls.push(url);
            setUploadProgress(p => ({ ...p, done: p.done + 1 }));
        }
        setForm(f => ({ ...f, gallery: [...(f.gallery || []), ...urls] }));
        setUploading(false);
        setUploadProgress({ done: 0, total: 0 });
    };

    const handleGalleryUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        e.target.value = "";
        await uploadGalleryFiles(files);
    };

    const handleGalleryDrop = async (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
        await uploadGalleryFiles(files);
    };

    const handleGalleryRemove = (index) => {
        setForm(f => ({ ...f, gallery: (f.gallery || []).filter((_, i) => i !== index) }));
    };

    // LIST
    if (!editing) return (
        <div style={{ minHeight: "100vh", background: "var(--dark)", padding: "120px 40px 40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
                <div>
                    <button className="back-btn" onClick={() => navigate("admin")}>← Dashboard</button>
                    <div className="heading" style={{ fontSize: 32, marginBottom: 0 }}>Stories</div>
                </div>
                <button className="btn-primary" onClick={handleNew}>+ Add Story</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {stories.map(s => (
                    <div key={s.docId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", background: "var(--mid)", borderRadius: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            {s.imageUrl && <img src={s.imageUrl} alt="" style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 3, opacity: .8 }} />}
                            <div>
                                <div className="venue-name" style={{ fontSize: 18 }}>{s.title}</div>
                                <div style={{ opacity: 0.5, fontSize: 13 }}>{s.cat ? `${s.cat} · ` : ""}{s.date}</div>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                            <button className="btn-ghost" onClick={() => handleEdit(s)}>Edit</button>
                            <button onClick={() => handleDelete(s.docId)} style={{ background: "none", border: "1px solid #ff6b6b", color: "#ff6b6b", padding: "8px 20px", cursor: "pointer", borderRadius: 2 }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // FORM
    const inputStyle = { width: "100%", padding: "12px 16px", background: "var(--mid)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", borderRadius: 4 };
    const labelStyle = { fontSize: 12, opacity: 0.5, marginBottom: 6, textTransform: "uppercase" };

    return (
        <div style={{ minHeight: "100vh", background: "var(--dark)", padding: "120px 40px 40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
                <button className="back-btn" onClick={handleBack}>← Back to List</button>
                <button className="back-btn" onClick={() => navigate("admin")}>← Dashboard</button>
            </div>
            <div className="heading" style={{ fontSize: 32, marginBottom: 32 }}>{editing === "new" ? "New Story" : "Edit Story"}</div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 560px) minmax(280px, 1fr)", gap: 48, alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Title */}
                    <div>
                        <div style={labelStyle}>Title</div>
                        <input value={form.title || ""} onChange={e => handleChange("title", e.target.value)} style={inputStyle} />
                    </div>
                    {/* Author */}
                    <div>
                        <div style={labelStyle}>Author</div>
                        <input value={form.author || ""} onChange={e => handleChange("author", e.target.value)} placeholder="e.g. John Smith" style={inputStyle} />
                    </div>
                    {/* Category */}
                    <div>
                        <div style={labelStyle}>Category (e.g. Community, Tournament)</div>
                        <input value={form.cat || ""} onChange={e => handleChange("cat", e.target.value)} style={inputStyle} />
                    </div>
                    {/* Excerpt */}
                    <div>
                        <div style={labelStyle}>Excerpt (shown on cards & as lead paragraph)</div>
                        <textarea
                            value={form.excerpt || ""}
                            onChange={e => handleChange("excerpt", e.target.value)}
                            rows={3}
                            style={{ ...inputStyle, resize: "vertical" }}
                        />
                    </div>
                    {/* Content / Body */}
                    <div>
                        <div style={labelStyle}>Content (body text — use blank lines between paragraphs)</div>
                        <textarea
                            value={form.content || ""}
                            onChange={e => handleChange("content", e.target.value)}
                            rows={10}
                            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }}
                            placeholder={"Write the full story here...\n\nEach blank line becomes a new paragraph."}
                        />
                    </div>
                    {/* BG Gradient Color Picker */}
                    <div>
                        <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 10, textTransform: "uppercase" }}>BG Gradient (fallback if no image)</div>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                                <div style={{ fontSize: 10, opacity: 0.4, textTransform: "uppercase", letterSpacing: 1 }}>Color 1</div>
                                <input
                                    type="color"
                                    value={gradColors[0]}
                                    onChange={e => handleGradColor(0, e.target.value)}
                                    style={{ width: 48, height: 48, padding: 2, background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 4, cursor: "pointer" }}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                                <div style={{ fontSize: 10, opacity: 0.4, textTransform: "uppercase", letterSpacing: 1 }}>Color 2</div>
                                <input
                                    type="color"
                                    value={gradColors[1]}
                                    onChange={e => handleGradColor(1, e.target.value)}
                                    style={{ width: 48, height: 48, padding: 2, background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 4, cursor: "pointer" }}
                                />
                            </div>
                            <div style={{
                                flex: 1, height: 52, borderRadius: 4,
                                background: form.bg || `linear-gradient(135deg, ${gradColors[0]} 0%, ${gradColors[1]} 100%)`,
                                border: "1px solid rgba(255,255,255,0.08)"
                            }} />
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 6, textTransform: "uppercase" }}>Date</div>
                        <input
                            type="date"
                            value={form.date || ""}
                            onChange={e => handleChange("date", e.target.value)}
                            style={{ width: "100%", padding: "12px 16px", background: "var(--mid)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", borderRadius: 4, colorScheme: "dark" }}
                        />
                    </div>
                    {/* Image upload */}
                    <div style={{ padding: 20, background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                        <div className="tag" style={{ marginBottom: 8 }}>Cover Image</div>
                        <div style={{ opacity: 0.7, fontSize: 13, marginBottom: 12 }}>Upload story cover image (overrides BG color)</div>
                        <label style={{ display: "inline-block", cursor: "pointer" }}>
                            <input
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
                                onClick={(e) => { e.currentTarget.previousElementSibling?.click(); }}
                            >
                                {uploading ? "Uploading..." : "Choose Image"}
                            </button>
                        </label>
                        {form.imageUrl && (
                            <div style={{ marginTop: 12 }}>
                                <img src={form.imageUrl} alt="Cover" style={{ maxWidth: "100%", maxHeight: 160, borderRadius: 4, objectFit: "cover" }} />
                                <button
                                    onClick={() => handleChange("imageUrl", "")}
                                    style={{ display: "block", marginTop: 8, fontSize: 11, background: "none", border: "1px solid #ff6b6b", color: "#ff6b6b", padding: "6px 12px", cursor: "pointer", borderRadius: 3 }}
                                >
                                    Remove Image
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Gallery */}
                    <div style={{ padding: 20, background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <div>
                                <div className="tag">Gallery</div>
                                <div style={{ opacity: 0.7, fontSize: 13 }}>รูปภาพ gallery แสดงด้านล่างของหน้า story</div>
                            </div>
                            {(form.gallery || []).length > 0 && !uploading && (
                                <label style={{ cursor: "pointer" }}>
                                    <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display: "none" }} />
                                    <button type="button" className="btn-ghost" style={{ fontSize: 12 }}
                                        onClick={(e) => { e.currentTarget.previousElementSibling?.click(); }}>
                                        + Add More
                                    </button>
                                </label>
                            )}
                        </div>

                        {/* Drop zone */}
                        <label
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleGalleryDrop}
                            style={{
                                display: "block",
                                border: `2px dashed ${dragOver ? "var(--green-highlight)" : "rgba(255,255,255,0.15)"}`,
                                borderRadius: 8,
                                padding: "28px 20px",
                                textAlign: "center",
                                cursor: uploading ? "default" : "pointer",
                                background: dragOver ? "rgba(45,168,79,0.06)" : "transparent",
                                transition: "border-color 0.15s, background 0.15s",
                                marginBottom: 16
                            }}
                        >
                            <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} disabled={uploading} style={{ display: "none" }} />
                            {uploading ? (
                                <div>
                                    <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 6 }}>
                                        Uploading {uploadProgress.done}/{uploadProgress.total}...
                                    </div>
                                    <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                                        <div style={{
                                            height: "100%",
                                            width: `${uploadProgress.total ? (uploadProgress.done / uploadProgress.total) * 100 : 0}%`,
                                            background: "var(--green-highlight)",
                                            transition: "width 0.2s"
                                        }} />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>⬆</div>
                                    <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>ลากรูปมาวางที่นี่ หรือคลิกเพื่อเลือก</div>
                                    <div style={{ fontSize: 11, opacity: 0.35 }}>เลือกหลายรูปพร้อมกันได้</div>
                                </>
                            )}
                        </label>

                        {/* Thumbnails */}
                        {(form.gallery || []).length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {(form.gallery || []).map((url, i) => (
                                    <div key={i} style={{ position: "relative", width: 100, height: 70 }}>
                                        <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }} />
                                        <button
                                            onClick={() => handleGalleryRemove(i)}
                                            style={{
                                                position: "absolute", top: 3, right: 3,
                                                background: "rgba(0,0,0,0.75)", border: "none", color: "white",
                                                width: 20, height: 20, borderRadius: "50%", cursor: "pointer",
                                                fontSize: 13, lineHeight: 1, padding: 0
                                            }}
                                        >×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Story"}
                    </button>
                </div>
                <div style={{ position: "sticky", top: 120 }}>
                    <StoryPreview form={form} />
                </div>
            </div>
        </div>
    );
}
