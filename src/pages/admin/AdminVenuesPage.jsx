import { useState, useEffect, useContext, useRef } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { VenueContext } from "../../context/VenueContext";
import { uploadImage } from "../../cloudinaryClient";
import { ChromePicker } from "react-color";

const EMPTY = {
    name: "", loc: "", region: "", num: "", status: "Open", hours: "", address: "", phone: "", courts: "", est: "", courtsInfo: "", intro: "", lat: "", lon: "", mapUrl: "",
    bg: "", bg1: "", bgImage: "", bg1Image: "", courtsImageBg: "", clubImageBg: "", courtsImageBgImage: "", clubImageBgImage: "", courtsImageCaption: "", clubImageCaption: "",
    courtText: "", courtText2: "", clubText: "", clubText2: "", features: [], imageUrl: "", gallery: []
};

function VenuePreview({ form }) {
    return (
        <div style={{ background: "var(--mid)", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green-highlight)" }} />
                <div style={{ fontSize: 11, opacity: 0.5, textTransform: "uppercase", letterSpacing: 2 }}>Live Preview</div>
            </div>
            <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
                {/* Hero */}
                <div style={{
                    height: 180,
                    background: form.bg1Image ? `url(${form.bg1Image}) center/cover no-repeat` : (form.bg1 || "#111"),
                    position: "relative",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: "20px 24px"
                }}>
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                        <div style={{ fontSize: 10, opacity: 0.55, marginBottom: 6, letterSpacing: 1 }}>
                            {form.num || "01"} / {form.region || "Region"} · {form.status || "Open"}
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1, marginBottom: 4 }}>
                            {form.name || "Venue Name"}
                        </div>
                        <div style={{ fontSize: 12, opacity: 0.55 }}>
                            {form.loc || "Location"} · {form.courts ? `${form.courts} Courts` : "Courts"}
                        </div>
                    </div>
                </div>

                {/* Intro */}
                {form.intro && (
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ fontSize: 12, opacity: 0.65, lineHeight: 1.7 }}>
                            {form.intro.slice(0, 180)}{form.intro.length > 180 ? "…" : ""}
                        </div>
                    </div>
                )}

                {/* Courts section */}
                <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{
                        height: 130,
                        background: form.courtsImageBgImage
                            ? `url(${form.courtsImageBgImage}) center/cover no-repeat`
                            : (form.courtsImageBg || "#1a1a1a")
                    }} />
                    {form.courtsImageCaption && (
                        <div style={{ padding: "8px 20px", fontSize: 10, opacity: 0.35 }}>{form.courtsImageCaption}</div>
                    )}
                    <div style={{ padding: "14px 20px" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>The Courts</div>
                        {form.courtText && (
                            <div style={{ fontSize: 11, opacity: 0.55, lineHeight: 1.6 }}>
                                {form.courtText.slice(0, 160)}{form.courtText.length > 160 ? "…" : ""}
                            </div>
                        )}
                    </div>
                </div>

                {/* Features */}
                {(form.features || []).length > 0 && (
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", flexWrap: "wrap", gap: 20 }}>
                        {form.features.map((f, i) => (
                            <div key={i} style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--green-highlight)" }}>{f.num || "—"}</div>
                                <div style={{ fontSize: 10, opacity: 0.45, marginTop: 2 }}>{f.label || "label"}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Club section */}
                <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{
                        height: 130,
                        background: form.clubImageBgImage
                            ? `url(${form.clubImageBgImage}) center/cover no-repeat`
                            : (form.clubImageBg || "#1a1a1a")
                    }} />
                    {form.clubImageCaption && (
                        <div style={{ padding: "8px 20px", fontSize: 10, opacity: 0.35 }}>{form.clubImageCaption}</div>
                    )}
                    <div style={{ padding: "14px 20px" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>The Club</div>
                        {form.clubText && (
                            <div style={{ fontSize: 11, opacity: 0.55, lineHeight: 1.6 }}>
                                {form.clubText.slice(0, 160)}{form.clubText.length > 160 ? "…" : ""}
                            </div>
                        )}
                    </div>
                </div>

                {/* Cover image */}
                {form.imageUrl && (
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ fontSize: 10, opacity: 0.4, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Cover Image</div>
                        <img src={form.imageUrl} alt="cover" style={{ width: "100%", borderRadius: 4, maxHeight: 140, objectFit: "cover" }} />
                    </div>
                )}

                {/* Gallery */}
                {(form.gallery || []).length > 0 && (
                    <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ fontSize: 10, opacity: 0.4, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Gallery ({form.gallery.length})</div>
                        <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                            {form.gallery.map((url, i) => (
                                <img key={i} src={url} alt="" style={{ flexShrink: 0, width: 80, height: 55, objectFit: "cover", borderRadius: 3 }} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Info sidebar */}
                <div style={{ padding: "16px 20px", background: "rgba(0,0,0,0.2)" }}>
                    <div style={{ fontSize: 10, opacity: 0.4, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Sidebar Info</div>
                    {[["Status", form.status], ["Hours", form.hours], ["Address", form.address], ["Phone", form.phone]].map(([label, val]) => val ? (
                        <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            <div style={{ fontSize: 11, opacity: 0.4 }}>{label}</div>
                            <div style={{ fontSize: 11, opacity: 0.75, textAlign: "right", maxWidth: "60%" }}>{val}</div>
                        </div>
                    ) : null)}
                </div>
            </div>
        </div>
    );
}

export default function AdminVenuesPage({ navigate }) {
    const { refreshVenues } = useContext(VenueContext);
    const [venues, setVenues] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
    const [galleryDragOver, setGalleryDragOver] = useState(false);
    const [colorPickerOpen, setColorPickerOpen] = useState(null);
    const colorPickerRef = useRef(null);
    const [dragIdx, setDragIdx] = useState(null);
    const [dragOverIdx, setDragOverIdx] = useState(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
                setColorPickerOpen(null);
            }
        };
        if (colorPickerOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [colorPickerOpen]);

    const load = async () => {
        const snap = await getDocs(collection(db, "venues"));
        const list = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
        list.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
        setVenues(list);
    };

    useEffect(() => {
        let cancelled = false;
        getDocs(collection(db, "venues")).then(snap => {
            if (cancelled) return;
            const list = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
            list.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
            setVenues(list);
        });
        return () => { cancelled = true; };
    }, []);

    const handleDragStart = (i) => { setDragIdx(i); };
    const handleDragOver = (e, i) => { e.preventDefault(); setDragOverIdx(i); };
    const handleDrop = async (i) => {
        setDragOverIdx(null);
        const from = dragIdx;
        if (from === null || from === i) {
            setDragIdx(null);
            return;
        }
        const reordered = [...venues];
        const [moved] = reordered.splice(from, 1);
        reordered.splice(i, 0, moved);
        setVenues(reordered);
        setDragIdx(null);
        await Promise.all(
            reordered.map((v, idx) => updateDoc(doc(db, "venues", v.docId), { displayOrder: idx }))
        );
        await refreshVenues();
    };

    const handleEdit = (v) => { setForm(v); setEditing(v.docId); };
    const handleNew = () => { setForm(EMPTY); setEditing("new"); };
    const handleBack = () => { setEditing(null); load(); };

    const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const getImageFieldName = (key) => {
        if (key === "bg") return "bgImage";
        if (key === "bg1") return "bg1Image";
        if (key === "courtsImageBg") return "courtsImageBgImage";
        if (key === "clubImageBg") return "clubImageBgImage";
        return null;
    };

    const getImageField = (key) => {
        const imageName = getImageFieldName(key);
        return imageName ? form[imageName] : null;
    };

    const handleFeatureChange = (index, key, value) => setForm(f => {
        const features = [...(f.features || [])];
        features[index] = { ...features[index], [key]: value };
        return { ...f, features };
    });
    const handleFeatureAdd = () => setForm(f => ({ ...f, features: [...(f.features || []), { num: "", label: "" }] }));
    const handleFeatureRemove = (index) => setForm(f => ({ ...f, features: (f.features || []).filter((_, i) => i !== index) }));

    const uploadGalleryFiles = async (files) => {
        if (!files.length) return;
        const docId = editing === "new" ? "temp" : editing;
        setUploading(true);
        setUploadProgress({ done: 0, total: files.length });
        const urls = [];
        for (const file of files) {
            const url = await uploadImage(file, "venues", docId);
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
        setGalleryDragOver(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
        await uploadGalleryFiles(files);
    };

    const handleGalleryRemove = (index) => {
        setForm(f => ({ ...f, gallery: (f.gallery || []).filter((_, i) => i !== index) }));
    };

    const handleSave = async () => {
        setSaving(true);
        const { docId: _docId, ...data } = form;
        if (editing === "new") {
            await addDoc(collection(db, "venues"), data);
        } else {
            await updateDoc(doc(db, "venues", editing), data);
        }
        await refreshVenues();
        setSaving(false);
        handleBack();
    };

    const handleDelete = async (docId) => {
        if (!confirm("ลบ venue นี้?")) return;
        await deleteDoc(doc(db, "venues", docId));
        load();
    };

    const handleImageUpload = async (e, fieldName) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const docId = editing === "new" ? "temp" : editing;
            const imageUrl = await uploadImage(file, "venues", docId);

            if (fieldName === "cover") {
                setForm(f => ({ ...f, imageUrl }));
            } else if (fieldName === "bg" || fieldName === "bg1" || fieldName === "courtsImageBg" || fieldName === "clubImageBg") {
                const imageFieldName = fieldName === "bg" ? "bgImage" : fieldName === "bg1" ? "bg1Image" : fieldName === "courtsImageBg" ? "courtsImageBgImage" : "clubImageBgImage";
                setForm(f => ({ ...f, [imageFieldName]: imageUrl }));
            }
            setUploading(false);
        } catch (error) {
            console.error("Image upload error:", error);
            setUploading(false);
        }
    };

    if (!editing) return (
        <div style={{ minHeight: "100vh", background: "var(--dark)", padding: "120px 40px 40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
                <div>
                    <button className="back-btn" onClick={() => navigate("admin")}>← Dashboard</button>
                    <div className="heading" style={{ fontSize: 32, marginBottom: 0 }}>Venues</div>
                </div>
                <button className="btn-primary" onClick={handleNew}>+ Add Venue</button>
            </div>
            <div style={{ fontSize: 11, opacity: 0.35, marginBottom: 8, letterSpacing: 1 }}>
                ลากเพื่อเรียงลำดับ
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {venues.map((v, i) => (
                    <div
                        key={v.docId}
                        draggable
                        onDragStart={() => handleDragStart(i)}
                        onDragOver={(e) => handleDragOver(e, i)}
                        onDrop={() => handleDrop(i)}
                        onDragEnd={() => { setDragOverIdx(null); setDragIdx(null); }}
                        style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "18px 20px", background: "var(--mid)", borderRadius: 6,
                            border: dragOverIdx === i ? "1px solid var(--green-highlight)" : "1px solid transparent",
                            opacity: dragIdx === i ? 0.45 : 1,
                            transition: "border-color 0.15s, opacity 0.15s",
                            cursor: "grab",
                            userSelect: "none",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div style={{
                                display: "flex", flexDirection: "column", gap: 4,
                                opacity: 0.25, flexShrink: 0
                            }}>
                                {[0,1,2].map(n => (
                                    <div key={n} style={{ display: "flex", gap: 3 }}>
                                        <div style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--white)" }} />
                                        <div style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--white)" }} />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 600 }}>{v.name}</div>
                                <div style={{ opacity: 0.45, fontSize: 12, marginTop: 2 }}>{v.loc} · {v.status}</div>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 10 }} onClick={e => e.stopPropagation()}>
                            <button className="btn-ghost" style={{ cursor: "pointer" }} onClick={() => handleEdit(v)}>Edit</button>
                            <button onClick={() => handleDelete(v.docId)} style={{ background: "none", border: "1px solid #ff6b6b", color: "#ff6b6b", padding: "8px 16px", cursor: "pointer", borderRadius: 2, fontSize: 13 }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // FORM
    const fields = [
        ["name", "Name"], ["loc", "Location"], ["region", "Region"],
        ["num", "Number (01)"], ["status", "Status"], ["hours", "Hours"],
        ["address", "Address"], ["phone", "Phone"], ["courts", "Number of Courts"],
        ["est", "Est. Year (เช่น 2025)"], ["courtsInfo", "Courts Info (เช่น 4 Courts · International Standard)"],
        ["intro", "Intro"], ["lat", "Latitude (เช่น 13.7381)"], ["lon", "Longitude (เช่น 100.5601)"],
        ["mapUrl", "Google Maps Embed URL (optional — แทน lat/lon)"], ["bg", "BG Gradient"], ["bg1", "Hero BG"],
        ["courtsImageBg", "Courts Section Image"], ["clubImageBg", "Club Section Image"],
        ["courtsImageCaption", "Courts Image Caption"], ["clubImageCaption", "Club Image Caption"],
        ["courtText", "Court Section Text"], ["courtText2", "Court Section Text 2"],
        ["clubText", "Club Section Text"], ["clubText2", "Club Section Text 2"],
    ];

    return (
        <div style={{ minHeight: "100vh", background: "var(--dark)", padding: "120px 40px 40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
                <button className="back-btn" onClick={handleBack}>← Back to List</button>
                <button className="back-btn" onClick={() => navigate("admin")}>← Dashboard</button>
            </div>
            <div className="heading" style={{ fontSize: 32, marginBottom: 32 }}>{editing === "new" ? "New Venue" : "Edit Venue"}</div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 640px) minmax(280px, 1fr)", gap: 48, alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {fields.map(([key, label]) => (
                    <div key={key}>
                        <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 6, textTransform: "uppercase" }}>{label}</div>
                        {key === "bg" || key === "bg1" || key === "courtsImageBg" || key === "clubImageBg" ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {/* IMAGE UPLOAD */}
                                <div style={{ padding: 12, background: "rgba(45, 168, 79, 0.1)", border: "1px solid rgba(45, 168, 79, 0.3)", borderRadius: 4 }}>
                                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>📸 Upload Background Image</div>
                                    <label style={{ display: "inline-block", cursor: "pointer" }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, key)}
                                            disabled={uploading}
                                            style={{ display: "none" }}
                                        />
                                        <button
                                            type="button"
                                            className="btn-ghost"
                                            disabled={uploading}
                                            onClick={(e) => { e.currentTarget.previousElementSibling?.click(); }}
                                            style={{ fontSize: 12, padding: "8px 12px" }}
                                        >
                                            {uploading ? "Uploading..." : "Choose Image"}
                                        </button>
                                    </label>
                                    {getImageField(key) && (
                                        <div style={{ marginTop: 8 }}>
                                            <img src={getImageField(key)} alt="Preview" style={{ maxWidth: "100%", height: "auto", borderRadius: 4, maxHeight: 120 }} />
                                            <button
                                                onClick={() => handleChange(getImageFieldName(key), "")}
                                                style={{ marginTop: 8, fontSize: 11, background: "none", border: "1px solid #ff6b6b", color: "#ff6b6b", padding: "6px 12px", cursor: "pointer", borderRadius: 3 }}
                                            >
                                                Remove Image
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* COLOR PICKER */}
                                <div>
                                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>🎨 Or Select Color</div>
                                    <div style={{ display: "flex", gap: 12, alignItems: "center", position: "relative" }}>
                                        <div
                                            onClick={() => setColorPickerOpen(colorPickerOpen === key ? null : key)}
                                            style={{
                                                width: 60, height: 60, background: form[key] || "#000",
                                                borderRadius: 4, cursor: "pointer", border: "2px solid rgba(255,255,255,0.2)"
                                            }}
                                        />
                                        <input
                                            value={form[key] || ""}
                                            onChange={e => handleChange(key, e.target.value)}
                                            placeholder="#000000"
                                            style={{ flex: 1, padding: "12px 16px", background: "var(--mid)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", borderRadius: 4 }}
                                        />
                                        {colorPickerOpen === key && (
                                            <div ref={colorPickerRef} style={{ position: "absolute", top: 0, left: 80, zIndex: 1000, background: "var(--mid)", padding: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)" }}>
                                                <ChromePicker
                                                    color={form[key] || "#000"}
                                                    onChange={(color) => handleChange(key, color.hex)}
                                                />
                                                <button
                                                    onClick={() => setColorPickerOpen(null)}
                                                    style={{ width: "100%", marginTop: 12, padding: "8px 12px", background: "var(--green-highlight)", border: "none", color: "white", borderRadius: 4, cursor: "pointer", fontSize: 12 }}
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : key === "courts" ? (
                            <input
                                type="number"
                                min="0"
                                value={form[key] || ""}
                                onChange={e => handleChange(key, e.target.value === "" ? "" : parseInt(e.target.value))}
                                style={{ width: "100%", padding: "12px 16px", background: "var(--mid)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", borderRadius: 4 }}
                            />
                        ) : (key === "intro" || key.includes("Text") || key.includes("Caption")) ? (
                            <textarea
                                value={form[key] || ""}
                                onChange={e => handleChange(key, e.target.value)}
                                rows={key === "intro" || key.includes("Text") ? 4 : 2}
                                style={{ width: "100%", padding: "12px 16px", background: "var(--mid)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", borderRadius: 4, resize: "vertical" }}
                            />
                        ) : (
                            <>
                                <input
                                    value={form[key] || ""}
                                    onChange={e => handleChange(key, e.target.value)}
                                    style={{ width: "100%", padding: "12px 16px", background: "var(--mid)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", borderRadius: 4 }}
                                />
                                {key === "mapUrl" && (
                                    <div style={{ marginTop: 8, padding: "10px 14px", background: "rgba(45,168,79,0.06)", border: "1px solid rgba(45,168,79,0.2)", borderRadius: 4 }}>
                                        <div style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.7 }}>
                                            วิธีเอา URL: Google Maps → ค้นหาสถานที่ → Share → Embed a map → คัดลอก URL ใน <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: 3 }}>src="..."</code> มาวางตรงนี้
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
                <div style={{ padding: 20, background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                    <div style={{ marginBottom: 16 }}>
                        <div className="tag">Image Upload</div>
                        <div style={{ opacity: 0.7, fontSize: 13, marginBottom: 12 }}>Upload venue cover image</div>
                        <label style={{ display: "inline-block", cursor: "pointer" }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, "cover")}
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
                    </div>
                    {form.imageUrl && (
                        <img
                            src={form.imageUrl}
                            alt="Venue cover"
                            style={{ maxWidth: 200, borderRadius: 4, marginTop: 12 }}
                        />
                    )}
                </div>
                <div style={{ padding: 20, background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <div>
                            <div className="tag">Venue Features</div>
                            <div style={{ opacity: 0.7, fontSize: 13 }}>Add or remove feature cards shown on venue detail pages.</div>
                        </div>
                        <button className="btn-ghost" onClick={handleFeatureAdd}>+ Add Feature</button>
                    </div>
                    {(form.features || []).map((feature, idx) => (
                        <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
                            <div>
                                <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 6 }}>Feature Number</div>
                                <input
                                    value={feature.num || ""}
                                    onChange={e => handleFeatureChange(idx, "num", e.target.value)}
                                    style={{ width: "100%", padding: "10px 14px", background: "var(--mid)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", borderRadius: 4 }}
                                />
                            </div>
                            <div>
                                <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 6 }}>Feature Label</div>
                                <input
                                    value={feature.label || ""}
                                    onChange={e => handleFeatureChange(idx, "label", e.target.value)}
                                    style={{ width: "100%", padding: "10px 14px", background: "var(--mid)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", borderRadius: 4 }}
                                />
                            </div>
                            <button
                                onClick={() => handleFeatureRemove(idx)}
                                style={{ background: "none", border: "1px solid #ff6b6b", color: "#ff6b6b", padding: "10px 16px", cursor: "pointer", borderRadius: 4 }}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <div style={{ padding: 20, background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <div>
                            <div className="tag">Gallery</div>
                            <div style={{ opacity: 0.7, fontSize: 13 }}>รูปภาพ gallery ที่แสดงด้านล่างของหน้า venue</div>
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
                        onDragOver={(e) => { e.preventDefault(); setGalleryDragOver(true); }}
                        onDragLeave={() => setGalleryDragOver(false)}
                        onDrop={handleGalleryDrop}
                        style={{
                            display: "block",
                            border: `2px dashed ${galleryDragOver ? "var(--green-highlight)" : "rgba(255,255,255,0.15)"}`,
                            borderRadius: 8,
                            padding: "28px 20px",
                            textAlign: "center",
                            cursor: uploading ? "default" : "pointer",
                            background: galleryDragOver ? "rgba(45,168,79,0.06)" : "transparent",
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
                    {saving ? "Saving..." : "Save Venue"}
                </button>
                </div>
                <div style={{ position: "sticky", top: 120 }}>
                    <VenuePreview form={form} />
                </div>
            </div>
        </div>
    );
}