import { useState, useEffect } from "react";
import Footer from "../components/Footer";

export default function VenueDetailPage({ venue, navigate, openBook }) {
  const [geocoded, setGeocoded] = useState(null);
  const [geocodeFailed, setGeocodeFailed] = useState(false);

  const needsGeocode = !venue.mapUrl && !(venue.lat && venue.lon) && !!venue.address;

  useEffect(() => {
    if (!needsGeocode) return;
    const simplified = venue.address.replace(/^([\w\s]+floor[^,]*,\s*[^,]+,\s*)/i, "").trim();
    const controller = new AbortController();
    const timeout = setTimeout(() => { controller.abort(); setGeocodeFailed(true); }, 5000);
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(simplified + " Bangkok Thailand")}&format=json&limit=1`, {
      headers: { "User-Agent": "KrossPadel/1.0" },
      signal: controller.signal
    })
      .then(r => r.json())
      .then(data => {
        clearTimeout(timeout);
        if (data[0]) setGeocoded({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) });
        else setGeocodeFailed(true);
      })
      .catch(() => setGeocodeFailed(true));
    return () => { controller.abort(); clearTimeout(timeout); };
  }, [needsGeocode, venue.address]);

  const mapCoords = venue.lat && venue.lon
    ? { lat: parseFloat(venue.lat), lon: parseFloat(venue.lon) }
    : geocoded;
  const mapFailed = !venue.mapUrl && !mapCoords && (geocodeFailed || !venue.address);
  const courtText = venue.courtText || `Every court at KROSS ${venue.name} is built to World Padel Tour specifications — premium glass walls, artificial grass turf, and professional LED lighting for day and evening play.`;
  const courtText2 = venue.courtText2 || `Court hire is available from opening to close, with online booking up to 7 days in advance. Members receive priority windows and guaranteed slots during peak hours.`;
  const clubText = venue.clubText || `Beyond the courts, KROSS ${venue.name} is a place to stay. The club lounge is designed for post-match recovery and pre-match preparation.`;
  const clubText2 = venue.clubText2 || `Locker rooms are available for members. Equipment rental and restringing services are available at the front desk.`;
  const courtsImageCaption = venue.courtsImageCaption || `KROSS ${venue.name} — Courts Overview`;
  const clubImageCaption = venue.clubImageCaption || `KROSS ${venue.name} — Club Space`;

  return (
    <div>
      <div className="venue-detail-hero">
        <div className="venue-detail-hero-bg" style={{
          background: venue.bg1Image ? `url(${venue.bg1Image}) center/cover no-repeat` : venue.bg1
        }} />
        <div className="venue-detail-hero-overlay" />
        <div className="venue-detail-content">
          <button className="back-btn" onClick={() => navigate("venues")}>← All Venues</button>
          <div className="venue-detail-tag">{venue.num} / {venue.region} · {venue.status}</div>
          <div className="venue-detail-title">{venue.name}</div>
          <div className="venue-detail-sub">{venue.loc}{venue.courts ? ` · ${venue.courts} Courts` : ""}</div>
        </div>
      </div>
      <div className="venue-detail-body">
        <div>
          <div className="venue-detail-sticky">
            <div className="tag" style={{ marginBottom: 24 }}>Venue Info</div>
            <div className="venue-sidebar-item">
              <div className="venue-sidebar-label">Status</div>
              <div className="venue-sidebar-val" style={{ color: venue.status === "Open" ? "var(--green-highlight)" : "var(--white)" }}>{venue.status}</div>
            </div>
            <div className="venue-sidebar-divider" />
            <div className="venue-sidebar-item" style={{ alignItems: "flex-start" }}>
              <div className="venue-sidebar-label">Hours</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => (
                  <div key={day} style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <div style={{ fontSize: 14, opacity: 0.5 }}>{day}</div>
                    <div className="venue-sidebar-val" style={{ fontSize: 14 }}>{venue.hours || "—"}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="venue-sidebar-divider" />
            <div className="venue-sidebar-item">
              <div className="venue-sidebar-label">Address</div>
              <div className="venue-sidebar-val" style={{ fontSize: 13, opacity: .65 }}>{venue.address}</div>
            </div>
            <div className="venue-sidebar-divider" />
            <div className="venue-sidebar-item">
              <div className="venue-sidebar-label">Phone</div>
              <div className="venue-sidebar-val">{venue.phone}</div>
            </div>
            <div className="venue-sidebar-divider" />
            {venue.courtsInfo && (
              <>
                <div className="venue-sidebar-item">
                  <div className="venue-sidebar-label">Courts</div>
                  <div className="venue-sidebar-val" style={{ fontSize: 13, whiteSpace: "pre-line", lineHeight: 1.8 }}>{venue.courtsInfo}</div>
                </div>
                <div className="venue-sidebar-divider" />
              </>
            )}
            {venue.coachingInfo && (
              <>
                <div className="venue-sidebar-item">
                  <div className="venue-sidebar-label">Coaching</div>
                  <div className="venue-sidebar-val" style={{ fontSize: 13, whiteSpace: "pre-line", lineHeight: 1.8 }}>{venue.coachingInfo}</div>
                </div>
                <div className="venue-sidebar-divider" />
              </>
            )}
            {(venue.staff || []).length > 0 && (
              <>
                <div className="venue-sidebar-item" style={{ alignItems: "flex-start" }}>
                  <div className="venue-sidebar-label">Staff</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {venue.staff.map((s, i) => (
                      <div key={i}>
                        <div className="venue-sidebar-val" style={{ fontSize: 14, marginBottom: 2 }}>{s.name}</div>
                        <div style={{ fontSize: 11, opacity: 0.45, letterSpacing: 1, textTransform: "uppercase" }}>{s.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="venue-sidebar-divider" />
              </>
            )}
            <br />
            <button className="btn-primary" onClick={openBook} style={{ width: "100%", textAlign: "center" }}>Book Here</button>
          </div>
        </div>
        <div style={{ minWidth: 0 }}>
          <p className="venue-intro">{venue.intro}</p>
          {venue.address && (
            <div style={{ marginBottom: 56 }}>
              <div className="venue-section-heading">Location</div>
              {(() => {
                const src = venue.mapUrl ||
                  (mapCoords
                    ? `https://www.openstreetmap.org/export/embed.html?bbox=${mapCoords.lon - 0.005},${mapCoords.lat - 0.005},${mapCoords.lon + 0.005},${mapCoords.lat + 0.005}&layer=mapnik&marker=${mapCoords.lat},${mapCoords.lon}`
                    : null);
                return src ? (
                  <iframe
                    title={`Map – KROSS ${venue.name}`}
                    src={src}
                    width="100%"
                    height="360"
                    style={{ border: 0, borderRadius: 4, display: "block", filter: "grayscale(1) invert(1) hue-rotate(180deg) brightness(0.88)" }}
                    allowFullScreen
                    loading="lazy"
                  />
                ) : mapFailed ? (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("KROSS " + venue.name + " " + venue.address)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 24px", background: "var(--mid2)", border: "1px solid var(--border)", borderRadius: 4, textDecoration: "none", color: "var(--white)" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-highlight)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>View on Google Maps</div>
                      <div style={{ fontSize: 12, opacity: 0.5 }}>{venue.address}</div>
                    </div>
                  </a>
                ) : (
                  <div style={{ height: 360, background: "var(--mid2)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.4, fontSize: 13 }}>
                    Loading map…
                  </div>
                );
              })()}
              <div style={{ marginTop: 10, fontSize: 12, opacity: 0.45, letterSpacing: 1 }}>{venue.address}</div>
            </div>
          )}
          <div className="venue-img-block"><div className="venue-img-inner" style={{
            background: venue.courtsImageBgImage && venue.courtsImageBgImage.startsWith('http') ? `url(${venue.courtsImageBgImage}) center/cover no-repeat` : (venue.courtsImageBg || "var(--mid2)")
          }} /></div>
          <div className="venue-img-caption">{courtsImageCaption}</div>
          <div className="venue-section-heading">The Courts</div>
          <p className="venue-body-text">{courtText}</p>
          <p className="venue-body-text">{courtText2}</p>
          <div className="venue-features">
            {(venue.features || []).map(f => (
              <div className="venue-feature" key={`${f.label}-${f.num}`}>
                <div className="venue-feature-num">{f.num}</div>
                <div className="venue-feature-label">{f.label}</div>
              </div>
            ))}
          </div>
          <div className="venue-img-block"><div className="venue-img-inner" style={{
            background: venue.clubImageBgImage && venue.clubImageBgImage.startsWith('http') ? `url(${venue.clubImageBgImage}) center/cover no-repeat` : (venue.clubImageBg || "var(--mid2)")
          }} /></div>
          <div className="venue-img-caption">{clubImageCaption}</div>
          <div className="venue-section-heading">The Club</div>
          <p className="venue-body-text">{clubText}</p>
          <p className="venue-body-text">{clubText2}</p>
          {(venue.gallery || []).length > 0 && (
            <div className="venue-gallery">
              <div className="venue-section-heading">Gallery</div>
              <div className="venue-gallery-strip" onWheel={(e) => { e.preventDefault(); e.currentTarget.scrollLeft += e.deltaY; }}>
                {(venue.gallery || []).map((url, i) => (
                  <img key={i} src={url} alt={`${venue.name} ${i + 1}`} className="venue-gallery-img" />
                ))}
              </div>
            </div>
          )}
          <div className="venue-detail-cta">
            <div className="venue-detail-cta-text">Ready to play at {venue.name}?</div>
            <button className="btn-primary" onClick={openBook}>Book A Court</button>
          </div>
        </div>
      </div>
      <Footer navigate={navigate} />
    </div>
  );
}