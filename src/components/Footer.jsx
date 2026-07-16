import { useContext } from "react";
import { VenueContext } from "../context/VenueContext";

const toTitleCase = (str) =>
  str.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");

export default function Footer({ navigate }) {
  const { venues } = useContext(VenueContext);

  return (
    <footer>
      <div className="footer-top">
        <div>
          <img src="/image/kross_logo.png" alt="KROSS" style={{ height: 40, marginBottom: 12 }} />
          <div className="footer-tagline">Thailand's leading padel club.<br />We are more than padel.</div>
        </div>
        <div className="footer-col">
          <h6>Venues</h6>
          {venues.map(v => (
            <a key={v.id} onClick={() => navigate("venue-" + v.id)}>{toTitleCase(v.name)}</a>
          ))}
        </div>
        <div className="footer-col">
          <h6>Club</h6>
          <a onClick={() => navigate("activities")}>Activities</a>
          <a onClick={() => navigate("membership")}>Pricing</a>
          <a href="https://apps.apple.com/kz/app/kross-padel/id6741785490" target="_blank" rel="noreferrer">App</a>
          <a onClick={() => navigate("stories")}>Stories</a>
        </div>
        <div className="footer-col">
          <h6>Connect</h6>
          <a href="https://instagram.com/krosspadel" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://line.me/ti/p/~@krosspadel" target="_blank" rel="noreferrer">Line @krosspadel</a>
          <a onClick={() => navigate("contact")}>Contact</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 KROSS Padel Club</span>
        <span style={{ display: "flex", gap: 16 }}>
          <span>Privacy Policy · Terms</span>
        </span>
      </div>
    </footer>
  );
}
