import { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function AdminLoginPage({ navigate }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("admin");
        } catch  {
            setError("Email หรือ Password ไม่ถูกต้อง");
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--dark)" }}>
            <div style={{ width: 360, padding: 40, background: "var(--mid)", borderRadius: 8 }}>
                <div className="heading" style={{ fontSize: 32, marginBottom: 32 }}>Admin</div>
                <input
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ width: "100%", marginBottom: 16, padding: "12px 16px", background: "var(--dark)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", borderRadius: 4 }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    style={{ width: "100%", marginBottom: 24, padding: "12px 16px", background: "var(--dark)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--white)", borderRadius: 4 }}
                />
                {error && <div style={{ color: "#ff6b6b", marginBottom: 16, fontSize: 13 }}>{error}</div>}
                <button className="btn-primary" style={{ width: "100%" }} onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
}