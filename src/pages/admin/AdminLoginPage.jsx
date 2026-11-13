import { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../../styles/admin.css";

export default function AdminLoginPage({ navigate }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("admin");
        } catch  {
            setError("Email หรือ Password ไม่ถูกต้อง");
        }
        setLoading(false);
    };

    return (
        <div className="adm-login">
            <form className="adm-login-box" onSubmit={handleLogin}>
                <img src="/image/kross_logo.png" alt="KROSS" />
                <h1>Sign in</h1>
                <p>ระบบจัดการเนื้อหาเว็บไซต์ KROSS</p>

                <div className="adm-label">Email</div>
                <input
                    className="adm-input"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ marginBottom: 14 }}
                />
                <div className="adm-label">Password</div>
                <input
                    className="adm-input"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ marginBottom: 20 }}
                />
                {error && <div className="adm-error">{error}</div>}
                <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </div>
    );
}
