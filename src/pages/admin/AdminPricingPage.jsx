import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, writeBatch, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

// กำหนดปุ่มเมนู และ Map ให้ตรงกับชื่อ Collection ใน Firebase Firestore
const CATEGORIES = [
  { key: "courtRental", label: "Court Rental" },
  { key: "coaching", label: "Coaching" },
  { key: "activities", label: "Activities" },
  { key: "racketRental", label: "Racket Rental" },
];

const EMPTY_ROW = { label: "", price: "", unit: "", note: "", time: "" };
const EMPTY = { category: "courtRental", name: "", order: 0, rows: [{ ...EMPTY_ROW }] };

const inputStyle = {
  width: "100%", padding: "10px 14px",
  background: "var(--mid)", border: "1px solid rgba(255,255,255,0.1)",
  color: "var(--white)", borderRadius: 4, fontSize: 13,
};

const smallInput = { ...inputStyle, padding: "8px 12px" };

export default function AdminPricingPage({ navigate }) {
  // เก็บข้อมูลทั้งหมดแยกตาม Category (เช่น { courtRental: [...], coaching: [...] })
  const [dbData, setDbData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // เก็บไอดี document ที่กำลังแก้ไข หรือ "new"
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  // ฟังก์ชันดึงข้อมูลจากทุก Collection พร้อมกัน
  const loadAllCollections = async () => {
    setLoading(true);
    try {
      const results = {};
      
      // วนลูปยิง Query ไปยังแต่ละ Collection ที่เรากำหนดไว้ใน CATEGORIES
      await Promise.all(
        CATEGORIES.map(async (cat) => {
          const snap = await getDocs(collection(db, cat.key));
          results[cat.key] = snap.docs.map(d => {
            const data = d.data();
            
            // แปลงโครงสร้างข้อมูล (Adapter) ให้เข้ากับ Form UI ของเรา
            let normalizedRows = [];
            
            // กรณี racketRental หรือ coaching ที่เก็บแถวไว้ในฟิลด์ row
            if (data.row && Array.isArray(data.row)) {
              normalizedRows = data.row;
            } else if (data.rows && Array.isArray(data.rows)) {
              normalizedRows = data.rows;
            } 
            // กรณี courtRental ที่เก็บแบบแยกโซน (outdoor / indoor)
            else if (data.outdoor && Array.isArray(data.outdoor)) {
              normalizedRows = data.outdoor.map(item => ({
                label: "Outdoor",
                price: item.price,
                time: item.time,
                unit: "/ hr"
              }));
            }

            return {
              docId: d.id,
              category: cat.key,
              name: data.name || data.label || "Untitled Item",
              order: data.order ?? 0,
              rows: normalizedRows.length ? normalizedRows : [{ ...EMPTY_ROW }]
            };
          });
        })
      );
      
      setDbData(results);
    } catch (error) {
      console.error("Error loading pricing data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllCollections();
  }, []);

  const handleEdit = (item) => {
    setForm({ ...item });
    setEditing(item.docId);
  };

  const handleNew = () => {
    setForm({ ...EMPTY, rows: [{ ...EMPTY_ROW }] });
    setEditing("new");
  };

  const handleBack = () => {
    setEditing(null);
    loadAllCollections();
  };

  const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleRowChange = (i, key, val) => {
    setForm(f => {
      const rows = [...f.rows];
      rows[i] = { ...rows[i], [key]: val };
      return { ...f, rows };
    });
  };

  const addRow = () => setForm(f => ({ ...f, rows: [...f.rows, { ...EMPTY_ROW }] }));
  const removeRow = (i) => setForm(f => ({ ...f, rows: f.rows.filter((_, idx) => idx !== i) }));

  // ฟังก์ชันเซฟข้อมูลกลับไปยัง Collection ที่ถูกต้องตามประเภทสินค้า
  const handleSave = async () => {
    setSaving(true);
    try {
      const { docId, category, name, order, rows } = form;

      // เตรียม Data ก่อนยิงเข้า Firebase (แปลงประเภทของตัวเลขให้ถูกต้อง)
      const formattedRows = rows.map(r => ({
        label: r.label || "",
        price: r.price !== "" ? Number(r.price) : 0,
        unit: r.unit || "",
        note: r.note || "",
        ...(r.time && { time: r.time }) // ถ้ามีฟิลด์ time ให้แนบไปด้วย
      }));

      const payload = {
        name: name,
        order: Number(order) || 0,
        row: formattedRows // บันทึกเป็นชื่อฟิลด์ row เพื่อให้สอดคล้องกับของเดิมใน DB
      };

      const targetCollection = collection(db, category);

      if (editing === "new") {
        await addDoc(targetCollection, payload);
      } else {
        await updateDoc(doc(db, category, editing), payload);
      }

      handleBack();
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category, docId) => {
    if (!confirm("ลบรายการนี้?")) return;
    try {
      await deleteDoc(doc(db, category, docId));
      loadAllCollections();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  // ----------------------------------------------------
  // หน้าแรก: แสดงรายการทั้งหมดแยกตาม Collection
  // ----------------------------------------------------
  if (!editing) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--dark)", padding: "120px 40px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <button className="back-btn" onClick={() => navigate("admin")}>← Dashboard</button>
            <div className="heading" style={{ fontSize: 32, marginBottom: 0 }}>Pricing Manager</div>
          </div>
          <button className="btn-primary" onClick={handleNew}>+ Add Item</button>
        </div>

        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "100px 0" }}>
            Loading database collections...
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {CATEGORIES.map(cat => {
              const itemsOfCategory = (dbData[cat.key] || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
              
              return (
                <div key={cat.key}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: "2px",
                    textTransform: "uppercase", opacity: 0.4, marginBottom: 12
                  }}>{cat.label} (Collection: {cat.key})</div>

                  {itemsOfCategory.length === 0 ? (
                    <div style={{ opacity: 0.25, fontSize: 13, padding: "16px 0" }}>No items in this collection</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {itemsOfCategory.map(item => (
                        <div key={item.docId} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "16px 20px", background: "var(--mid)", borderRadius: 6
                        }}>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                            <div style={{ opacity: 0.4, fontSize: 12 }}>
                              {item.rows.length} row{item.rows.length !== 1 ? "s" : ""} · ID: {item.docId}
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 10 }}>
                            <button className="btn-ghost" onClick={() => handleEdit(item)}>Edit</button>
                            <button
                              onClick={() => handleDelete(item.category, item.docId)}
                              style={{ background: "none", border: "1px solid #ff6b6b", color: "#ff6b6b", padding: "8px 18px", cursor: "pointer", borderRadius: 2, fontSize: 13 }}
                            >Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // หน้าฟอร์ม: แก้ไข/เพิ่ม ข้อมูล
  // ----------------------------------------------------
  return (
    <div style={{ minHeight: "100vh", background: "var(--dark)", padding: "120px 40px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <button className="back-btn" onClick={handleBack}>← Back</button>
        <button className="back-btn" onClick={() => navigate("admin")}>← Dashboard</button>
      </div>
      <div className="heading" style={{ fontSize: 32, marginBottom: 32 }}>
        {editing === "new" ? "New Pricing Item" : "Edit Pricing Item"}
      </div>

      <div style={{ maxWidth: 640, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Category (ระบุว่าข้อมูลนี้จะเซฟลง Collection ไหน) */}
        <div>
          <div style={{ fontSize: 11, opacity: 0.45, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Target Collection</div>
          <select
            value={form.category}
            onChange={e => handleChange("category", e.target.value)}
            style={{ ...inputStyle, appearance: "none" }}
            disabled={editing !== "new"} // ปิดไม่ให้ย้าย Collection ตอน Edit เพื่อป้องกันบั๊ก ID ซ้ำซ้อน
          >
            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>

        {/* Name */}
        <div>
          <div style={{ fontSize: 11, opacity: 0.45, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>
            Name
          </div>
          <input
            value={form.name}
            onChange={e => handleChange("name", e.target.value)}
            style={inputStyle}
            placeholder="เช่น KROSS Onnut, Premium Coaching"
          />
        </div>

        {/* Display Order */}
        <div>
          <div style={{ fontSize: 11, opacity: 0.45, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Display Order</div>
          <input
            type="number"
            value={form.order}
            onChange={e => handleChange("order", e.target.value)}
            style={{ ...inputStyle, width: 120 }}
          />
        </div>

        {/* Rows */}
        <div>
          <div style={{ fontSize: 11, opacity: 0.45, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>
            Pricing Rows
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {form.rows.map((row, i) => (
              <div key={i} style={{
                background: "var(--mid)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 6, padding: "16px"
              }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 2 }}>
                    <div style={{ fontSize: 10, opacity: 0.4, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Label / Time</div>
                    <input
                      value={row.label || row.time || ""}
                      onChange={e => handleRowChange(i, "label", e.target.value)}
                      placeholder="เช่น sky / indoor หรือ 7:00 am - 5:00 pm"
                      style={smallInput}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, opacity: 0.4, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Price (฿)</div>
                    <input
                      value={row.price}
                      onChange={e => handleRowChange(i, "price", e.target.value)}
                      placeholder="150"
                      style={smallInput}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, opacity: 0.4, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Unit (optional)</div>
                    <input
                      value={row.unit || ""}
                      onChange={e => handleRowChange(i, "unit", e.target.value)}
                      placeholder="/ hr"
                      style={smallInput}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, opacity: 0.4, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Note (optional)</div>
                    <input
                      value={row.note || ""}
                      onChange={e => handleRowChange(i, "note", e.target.value)}
                      placeholder="เช่น Mon–Fri before 17:00"
                      style={smallInput}
                    />
                  </div>
                  {form.rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      style={{ background: "none", border: "1px solid rgba(255,107,107,0.4)", color: "#ff6b6b", padding: "8px 14px", cursor: "pointer", borderRadius: 3, fontSize: 13, flexShrink: 0 }}
                    >✕</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addRow}
            style={{ marginTop: 10, background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", padding: "8px 20px", cursor: "pointer", borderRadius: 3, fontSize: 13 }}
          >+ Add Row</button>
        </div>

        <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ marginTop: 8 }}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}