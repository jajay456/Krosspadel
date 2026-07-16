import { useContext } from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { AuthContext } from "../../context/AuthContext";

export default function AdminDashboard({ navigate }) {
    const { user } = useContext(AuthContext);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("admin-login");
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--dark)", padding: "120px 40px 40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
                <div className="heading" style={{ fontSize: 32, marginBottom: 0 }}>Admin Dashboard</div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ opacity: 0.5, fontSize: 13 }}>{user?.email}</div>
                    <button className="btn-ghost" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 24, maxWidth: 800 }}>
                <div
                    onClick={() => navigate("admin-venues")}
                    style={{ padding: 32, background: "var(--mid)", borderRadius: 8, cursor: "pointer" }}
                >
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🏟️</div>
                    <div className="venue-name">Venues</div>
                    <div style={{ opacity: 0.5, fontSize: 13, marginTop: 8 }}>Add / Edit / Delete venues, courts, text, and images</div>
                </div>
                <div
                    onClick={() => navigate("admin-stories")}
                    style={{ padding: 32, background: "var(--mid)", borderRadius: 8, cursor: "pointer" }}
                >
                    <div style={{ fontSize: 32, marginBottom: 12 }}>📰</div>
                    <div className="venue-name">Stories</div>
                    <div style={{ opacity: 0.5, fontSize: 13, marginTop: 8 }}>Add / Edit / Delete stories</div>
                </div>
                <div
                    onClick={() => navigate("admin-activities")}
                    style={{ padding: 32, background: "var(--mid)", borderRadius: 8, cursor: "pointer" }}
                >
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🎾</div>
                    <div className="venue-name">Activities</div>
                    <div style={{ opacity: 0.5, fontSize: 13, marginTop: 8 }}>Edit activity cards and descriptions</div>
                </div>
                <div
                    onClick={() => navigate("admin-membership")}
                    style={{ padding: 32, background: "var(--mid)", borderRadius: 8, cursor: "pointer" }}
                >
                    <div style={{ fontSize: 32, marginBottom: 12 }}>💳</div>
                    <div className="venue-name">Membership</div>
                    <div style={{ opacity: 0.5, fontSize: 13, marginTop: 8 }}>Edit membership plans and pricing</div>
                </div>
                <div
                    onClick={() => navigate("admin-team")}
                    style={{ padding: 32, background: "var(--mid)", borderRadius: 8, cursor: "pointer" }}
                >
                    <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
                    <div className="venue-name">Team</div>
                    <div style={{ opacity: 0.5, fontSize: 13, marginTop: 8 }}>Add / Edit founders and leadership team</div>
                </div>
                <div
                    onClick={() => navigate("admin-pricing")}
                    style={{ padding: 32, background: "var(--mid)", borderRadius: 8, cursor: "pointer" }}
                >
                    <div style={{ fontSize: 32, marginBottom: 12 }}>💰</div>
                    <div className="venue-name">Pricing</div>
                    <div style={{ opacity: 0.5, fontSize: 13, marginTop: 8 }}>Manage court rental, coaching, activities, and racket rental rates</div>
                </div>
            </div>
        </div>
    );
}