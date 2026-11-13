import { auth } from "./firebase";

const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

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

  formData.append("file", file);
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
