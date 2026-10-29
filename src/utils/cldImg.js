// แปลง URL ต้นฉบับของ Cloudinary เป็นเวอร์ชันย่อ (format/quality อัตโนมัติ + จำกัดความกว้าง)
// URL ที่ไม่ใช่ Cloudinary (เช่น /image/...) จะคืนค่าเดิม
export const cldImg = (url, w = 1200) => {
  if (!url || !url.includes("res.cloudinary.com") || url.includes("/upload/f_auto")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${w},c_limit/`);
};
