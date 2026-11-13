// เอฟเฟกต์ยุบตัวตอนกด แล้วเด้งกลับตอนปล่อย
// ใช้กับทุกอย่างที่กดได้ทั้งเว็บ (ดูจาก cursor: pointer) รวมถึงการ์ดที่ใช้ inline style
// ใช้ composite: "add" ต่อ transform เดิมของ element (เช่น hover scale) แทนการเขียนทับ

const INTERACTIVE = "button, a, [role='button'], label, summary";

const findTarget = (start) => {
  let el = start instanceof Element ? start : null;
  while (el && el !== document.body && getComputedStyle(el).cursor !== "pointer") el = el.parentElement;
  if (!el || el === document.body) return null;
  // cursor สืบทอดลงลูก — ไล่ขึ้นไปหาตัวนอกสุดที่กดได้ แต่หยุดที่ปุ่ม/ลิงก์
  while (!el.matches(INTERACTIVE)) {
    const parent = el.parentElement;
    if (!parent || parent === document.body || getComputedStyle(parent).cursor !== "pointer") break;
    el = parent;
  }
  return el;
};

export function installPressFeedback() {
  if (typeof window === "undefined" || !Element.prototype.animate) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let pressed = null;

  const release = () => {
    if (!pressed) return;
    const { el, anim, scale } = pressed;
    pressed = null;
    anim.cancel();
    el.animate(
      [{ transform: `scale(${scale})` }, { transform: "scale(1)" }],
      { duration: 380, easing: "cubic-bezier(.34, 1.56, .64, 1)", composite: "add" }
    );
  };

  document.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    const el = findTarget(e.target);
    if (!el || el.disabled || el.matches("input, select, textarea")) return;

    const r = el.getBoundingClientRect();
    // ข้ามพื้นหลังเต็มจอ (เช่น overlay ของ modal) และ element แบบ inline ที่ transform ไม่มีผล
    if (r.width * r.height > window.innerWidth * window.innerHeight * 0.6) return;
    if (getComputedStyle(el).display === "inline") return;

    // ปุ่มเล็กยุบมากกว่าการ์ดใหญ่ เพื่อให้รู้สึกเท่ากัน
    const scale = 1 - Math.min(0.05, Math.max(0.015, 8 / Math.max(r.width, r.height)));
    const anim = el.animate(
      [{ transform: "scale(1)" }, { transform: `scale(${scale})` }],
      { duration: 140, easing: "cubic-bezier(.2, .7, .2, 1)", fill: "forwards", composite: "add" }
    );
    pressed = { el, anim, scale };
  });

  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);
  window.addEventListener("blur", release);
}
