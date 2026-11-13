import { auth } from "./firebase";

const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

// ImageKit แสดงรูปได้ไม่เกิน 25MP — ย่อรูปจากกล้องให้ด้านยาวสุดไม่เกินค่านี้ก่อนอัปโหลด
const MAX_SIDE = 3840;

const resizeIfLarge = async (file: File): Promise<Blob> => {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") return file;
  const bitmap = await createImageBitmap(file);
  const scale = MAX_SIDE / Math.max(bitmap.width, bitmap.height);
  if (scale >= 1) {
    bitmap.close();
    return file;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const type = file.type === "image/png" ? "image/png" : "image/jpeg";
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Resize failed"))), type, 0.9)
  );
};

export const uploadImage = async (
  file: File,
  collection: string,
  docId: string
): Promise<string> => {
  // ขอลายเซ็นจาก Netlify Function (ต้องล็อกอิน admin อยู่)
  const idToken = await auth.currentUser?.getIdToken();
  const authRes = await fetch("/.netlify/functions/imagekit-auth", {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (!authRes.ok) {
    throw new Error("Upload auth failed");
  }
  const { token, expire, signature } = await authRes.json();

  const formData = new FormData();

  formData.append("file", await resizeIfLarge(file));
  formData.append("fileName", file.name);
  formData.append("publicKey", publicKey);
  formData.append("token", token);
  formData.append("expire", String(expire));
  formData.append("signature", signature);

  // จะสร้างโฟลเดอร์ collection/docId
  formData.append("folder", `${collection}/${docId}`);

  const response = await fetch(
    "https://upload.imagekit.io/api/v1/files/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Upload failed");
  }

  return data.url;
};
