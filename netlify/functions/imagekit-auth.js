import crypto from "node:crypto";

// สร้างลายเซ็นสำหรับอัปโหลดรูปขึ้น ImageKit (private key อยู่ฝั่งเซิร์ฟเวอร์เท่านั้น)
// อนุญาตเฉพาะผู้ที่ล็อกอิน Firebase อยู่ (admin)
export default async (req) => {
  const idToken = req.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!idToken) return new Response("Unauthorized", { status: 401 });

  // ตรวจ Firebase ID token ผ่าน REST API (ไม่ต้องลง firebase-admin)
  const apiKey = process.env.VITE_FIREBASE_API_KEY;
  const lookup = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );
  if (!lookup.ok) return new Response("Unauthorized", { status: 401 });

  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 30 * 60;
  const signature = crypto
    .createHmac("sha1", process.env.IMAGEKIT_PRIVATE_KEY)
    .update(token + expire)
    .digest("hex");

  return Response.json({ token, expire, signature });
};
