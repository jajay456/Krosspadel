import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { uploadImage } from "../../imagekitClient";

const EMPTY = { name: "", role: "", bio: "", imageUrl: "", displayOrder: 0 };

export default function AdminTeamPage() {
    const [team, setTeam] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const load = async () => {
        const snap = await getDocs(collection(db, "team"));
        const list = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
        list.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
        setTeam(list);
    };

    useEffect(() => {
        let cancelled = false;
        getDocs(collection(db, "team")).then(snap => {
            if (cancelled) return;
            const list = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
            list.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
            setTeam(list);
        });
        return () => { cancelled = true; };
    }, []);

    const handleEdit = (m) => { setForm(m); setEditing(m.docId); };
    const handleNew = () => { setForm({ ...EMPTY, displayOrder: team.length }); setEditing("new"); };
    const handleBack = () => { setEditing(null); load(); };
    const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleSave = async () => {
        setSaving(true);
        const { docId: _docId, ...data } = form;
        if (editing === "new") {
            await addDoc(collection(db, "team"), data);
        } else {
            await updateDoc(doc(db, "team", editing), data);
        }
        setSaving(false);
        handleBack();
    };

    const handleDelete = async (docId) => {
        if (!confirm("Delete this team member?")) return;
        await deleteDoc(doc(db, "team", docId));
        load();
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const docId = editing === "new" ? "temp" : editing;
            const url = await uploadImage(file, "team", docId);
            setForm(f => ({ ...f, imageUrl: url }));
        } catch (err) {
            console.error(err);
        }
        setUploading(false);
    };

    // LIST
    if (!editing) return (
        <div className="adm-page">
            <div className="adm-head">
                <div>
                    <div className="adm-title">Team</div>
                </div>
                <button className="btn-primary" onClick={handleNew}>+ Add Member</button>
            </div>
            <div className="adm-list">
                {team.map(m => (
                    <div key={m.docId} className="adm-row">
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            {m.imageUrl
                                ? <img src={m.imageUrl} alt="" style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover" }} />
                                : <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, var(--green-dark), var(--green-mid))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{m.name?.[0] || "?"}</div>
                            }
                            <div>
                                <div className="adm-row-title">{m.name}</div>
                                <div className="adm-row-meta">{m.role}</div>
                            </div>
                        </div>
                        <div className="adm-row-actions">
                            <button className="btn-ghost" onClick={() => handleEdit(m)}>Edit</button>
                            <button onClick={() => handleDelete(m.docId)} className="adm-btn-danger">Delete</button>
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
            <div className="adm-title">{editing === "new" ? "New Member" : "Edit Member"}</div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 560px) minmax(240px, 1fr)", gap: 48, alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Name */}
                    <div>
                        <div className="adm-label">Full Name</div>
                        <input value={form.name || ""} onChange={e => handleChange("name", e.target.value)}
                            className="adm-input" />
                    </div>
                    {/* Role */}
                    <div>
                        <div className="adm-label">Role / Title</div>
                        <input value={form.role || ""} onChange={e => handleChange("role", e.target.value)}
                            placeholder="e.g. CEO & Co-Founder"
                            className="adm-input" />
                    </div>
                    {/* Bio */}
                    <div>
                        <div className="adm-label">Bio</div>
                        <textarea value={form.bio || ""} onChange={e => handleChange("bio", e.target.value)}
                            rows={4}
                            className="adm-input" />
                    </div>
                    {/* Order */}
                    <div>
                        <div className="adm-label">Display Order</div>
                        <input type="number" min="0" value={form.displayOrder ?? 0} onChange={e => handleChange("displayOrder", parseInt(e.target.value) || 0)}
                            className="adm-input" />
                    </div>
                    {/* Photo upload */}
                    <div className="adm-panel">
                        <div className="tag" style={{ marginBottom: 8 }}>Photo</div>
                        <label style={{ display: "inline-block", cursor: "pointer" }}>
                            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ display: "none" }} />
                            <button type="button" className="btn-ghost" disabled={uploading}
                                onClick={e => e.currentTarget.previousElementSibling?.click()}>
                                {uploading ? "Uploading..." : "Choose Photo"}
                            </button>
                        </label>
                        {form.imageUrl && (
                            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
                                <img src={form.imageUrl} alt="" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }} />
                                <button type="button" onClick={() => handleChange("imageUrl", "")}
                                    style={{ background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", fontSize: 13 }}>
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                    <button className="btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Member"}
                    </button>
                </div>

                {/* Preview */}
                <div style={{ position: "sticky", top: 24, background: "var(--mid)", borderRadius: 8, padding: 32, textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: 11, opacity: 0.4, textTransform: "uppercase", letterSpacing: 2, marginBottom: 24 }}>Preview</div>
                    {form.imageUrl
                        ? <img src={form.imageUrl} alt="" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", margin: "0 auto 20px" }} />
                        : <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, var(--green-dark), var(--green-mid))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 20px" }}>{form.name?.[0] || "?"}</div>
                    }
                    <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{form.name || "Name"}</div>
                    <div style={{ fontSize: 13, color: "var(--green-highlight)", marginBottom: 12 }}>{form.role || "Role"}</div>
                    <p style={{ fontSize: 13, opacity: 0.5, lineHeight: 1.7 }}>{form.bio || "Bio..."}</p>
                </div>
            </div>
        </div>
    );
}
