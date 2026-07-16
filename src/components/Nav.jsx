import { useState, useRef, useLayoutEffect } from "react";

const LEFT_LINKS = [
  { p: "about", label: "We Are Kross" },
  { p: "venues", label: "Venues" },
  { p: "activities", label: "Activities" },
  { p: "lifestyle", label: "Lifestyle" },
  { p: "stories", label: "Stories" },
];

const RIGHT_LINKS = [
  { p: "krosspark", label: "Kross Park" },
  { p: "partner", label: "Become a Partner" },
  { p: "membership", label: "Book & Pricing" },
  { p: "contact", label: "Contact" },
];

// Minimum breathing room (px) we want to keep between a side menu and the logo.
const GAP = 40;

export default function Nav({ navigate, scrolled, page }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  const navRef = useRef(null);
  const logoRef = useRef(null);
  const leftSizerRef = useRef(null);
  const rightSizerRef = useRef(null);

  const isAdmin = page && page.startsWith("admin");
  const go = (p) => { navigate(p); setMenuOpen(false); };

  // Measure real widths and decide whether the side menus would collide with the
  // centered logo. The hidden "sizer" always holds the full-width menus, so we can
  // measure even while the visible links are hidden (avoids feedback loops).
  useLayoutEffect(() => {
    if (isAdmin) return;
    const nav = navRef.current;
    if (!nav) return;

    const check = () => {
      const navW = nav.clientWidth;
      const padL = parseFloat(getComputedStyle(nav).paddingLeft) || 0;
      const logoW = logoRef.current ? logoRef.current.getBoundingClientRect().width : 0;
      const leftW = leftSizerRef.current ? leftSizerRef.current.getBoundingClientRect().width : 0;
      const rightW = rightSizerRef.current ? rightSizerRef.current.getBoundingClientRect().width : 0;

      // The logo is centered, so each side menu gets exactly one half of the bar,
      // minus the logo's half-width and the breathing GAP. The check is symmetric:
      // if EITHER side can't fit, we collapse both to the hamburger so the spacing
      // around the logo always stays equal and nothing ever overlaps it.
      const avail = navW / 2 - padL - logoW / 2 - GAP;
      const leftHits = leftW > avail;
      const rightHits = rightW > avail;

      setCompact(leftHits || rightHits);
    };

    check();
    const ro = new ResizeObserver(check);
    ro.observe(nav);
    window.addEventListener("resize", check);
    // The logo's width is unknown until its image loads; re-measure once it does so
    // the collapse fires before the logo can overlap the menus.
    const logo = logoRef.current;
    if (logo && !logo.complete) logo.addEventListener("load", check);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
      if (logo) logo.removeEventListener("load", check);
    };
  }, [isAdmin]);

  if (isAdmin) return (
    <nav ref={navRef} className={scrolled ? "scrolled" : ""}>
      <img src="/image/kross_logo.png" alt="KROSS" onClick={() => go("admin")} style={{ height: 48, cursor: "pointer" }} />
    </nav>
  );

  return (
    <>
      <nav ref={navRef} className={`${scrolled ? "scrolled" : ""}${compact ? " nav-compact" : ""}`}>
        <div className="nav-links">
          {LEFT_LINKS.map(l => <a key={l.p} onClick={() => go(l.p)}>{l.label}</a>)}
        </div>
        <img ref={logoRef} className="nav-logo-img" src="/image/kross_logo.png" alt="KROSS" onClick={() => go("home")} />
        <div className="nav-right">
          {RIGHT_LINKS.map(l => <a key={l.p} className="desktop-only" onClick={() => go(l.p)}>{l.label}</a>)}
          <button className={`hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>

        {/* Hidden sizers: always render full menus so widths can be measured even when hidden */}
        <div className="nav-sizer" aria-hidden="true">
          <div className="nav-links" ref={leftSizerRef}>
            {LEFT_LINKS.map(l => <a key={l.p}>{l.label}</a>)}
          </div>
          <div className="nav-right" ref={rightSizerRef}>
            {RIGHT_LINKS.map(l => <a key={l.p}>{l.label}</a>)}
          </div>
        </div>
      </nav>
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {LEFT_LINKS.map(l => <a key={l.p} onClick={() => go(l.p)}>{l.label}</a>)}
        {RIGHT_LINKS.map(l => <a key={l.p} onClick={() => go(l.p)}>{l.label}</a>)}
      </div>
    </>
  );
}
