import { useContext } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { ADMIN_SECTIONS } from "../data/adminSections";
import "../styles/admin.css";

export default function AdminLayout({ page, navigate, children }) {
  const { user } = useContext(AuthContext);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("admin-login");
  };

  return (
    <div className="adm">
      <aside className="adm-side">
        <button className="adm-brand" onClick={() => navigate("admin")}>
          <img src="/image/kross_logo.png" alt="KROSS" />
          <span>Admin</span>
        </button>

        <div className="adm-nav">
          <button className={page === "admin" ? "active" : ""} onClick={() => navigate("admin")}>Overview</button>
          <div className="adm-nav-group">Content</div>
          {ADMIN_SECTIONS.map(s => (
            <button key={s.p} className={page === s.p ? "active" : ""} onClick={() => navigate(s.p)}>
              {s.label}
            </button>
          ))}
        </div>

        <div className="adm-side-foot">
          <a className="adm-site-link" href="/" target="_blank" rel="noopener noreferrer">View site ↗</a>
          <div className="adm-user">{user?.email}</div>
          <button className="adm-logout" onClick={handleLogout}>Log out</button>
        </div>
      </aside>

      <main className="adm-main">{children}</main>
    </div>
  );
}
