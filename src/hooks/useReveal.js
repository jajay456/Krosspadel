import { useEffect, useRef } from "react";

// เพิ่มคลาส "in" ให้ทุก .reveal ภายใน ref เมื่อเลื่อนมาถึง (เล่นครั้งเดียว)
// deps: ส่งค่าที่ทำให้มี .reveal ใหม่ (เช่นรายการที่โหลดทีหลัง) เพื่อให้ observe ใหม่
export function useReveal(deps = []) {
  const ref = useRef(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll(".reveal:not(.in)") ?? [];
    if (!("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
