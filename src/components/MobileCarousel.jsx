import { useRef } from "react";

export default function MobileCarousel({ children }) {
  const wrapRef = useRef(null);
  const scroll = (dir) => {
    const el = wrapRef.current?.querySelector("[data-scroll]");
    el?.scrollBy({ left: dir * el.clientWidth * 0.88, behavior: "smooth" });
  };
  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <button className="mob-arrow mob-arrow-l" onClick={() => scroll(-1)}>‹</button>
      {children}
      <button className="mob-arrow mob-arrow-r" onClick={() => scroll(1)}>›</button>
    </div>
  );
}
