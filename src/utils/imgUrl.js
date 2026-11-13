// แปลง URL ต้นฉบับของ ImageKit เป็นเวอร์ชันย่อ (จำกัดความกว้าง ไม่ขยายรูปเล็ก)
// ImageKit เลือก format/quality ให้อัตโนมัติอยู่แล้ว
// URL ที่ไม่ใช่ ImageKit (เช่น /image/...) จะคืนค่าเดิม
export const imgUrl = (url, w = 1200) => {
  if (!url || !url.includes("ik.imagekit.io") || url.includes("tr=")) return url;
  return `${url}${url.includes("?") ? "&" : "?"}tr=w-${w},c-at_max`;
};
