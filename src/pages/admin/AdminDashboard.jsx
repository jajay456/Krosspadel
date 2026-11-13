import { ADMIN_SECTIONS } from "../../data/adminSections";

export default function AdminDashboard({ navigate }) {
    return (
        <div className="adm-page">
            <div className="adm-head">
                <div>
                    <div className="adm-title">Overview</div>
                    <div className="adm-sub">เลือกส่วนที่ต้องการแก้ไข การเปลี่ยนแปลงจะขึ้นบนเว็บทันทีที่กดบันทึก</div>
                </div>
            </div>

            <div className="adm-index">
                {ADMIN_SECTIONS.map(s => (
                    <button key={s.p} onClick={() => navigate(s.p)}>
                        <span className="adm-index-name">{s.label}</span>
                        <span className="adm-index-desc">{s.desc}</span>
                        <span className="adm-index-go">→</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
