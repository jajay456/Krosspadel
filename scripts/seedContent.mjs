import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyAbxjbnHAxPDB4vJ7fX3iemkt3XIQnDNDE",
  authDomain: "kross-backend.firebaseapp.com",
  projectId: "kross-backend",
  storageBucket: "kross-backend.firebasestorage.app",
  messagingSenderId: "894318108715",
  appId: "1:894318108715:web:b199640d29cc241a2e8a6e",
});
const db = getFirestore(app);

/* ── ACTIVITIES ─────────────────────────────────────────────── */
const activities = [
  {
    num: "01",
    name: "Coaching Clinic",
    date: "Daily — all venues",
    text: "Book a private or group coaching session with our certified coaches every day through the KROSS app. Available at On Nut (3 coaches), Asoke (2 coaches), Indoor/Rama 4 (2 coaches), and Thonglor (1 coach).",
    imageUrl: "",
  },
  {
    num: "02",
    name: "Beginner Americano",
    date: "Monday (On Nut) · Thursday (Asoke)",
    text: "Mix-partner format where partners rotate each round and scores are counted individually. Perfect for beginners and social players. Asoke Thursday edition includes free-flow Sangria for 5 couples, 24 points per match.",
    imageUrl: "",
  },
  {
    num: "03",
    name: "Americano Style",
    date: "Wednesday (On Nut) · Saturday (Indoor)",
    text: "Classic Americano format — 24 points per match, partners rotate after each game. On Nut runs every Wednesday; Indoor Rama 4 features an Advance Americano on Saturdays with partners assigned by 24-point results.",
    imageUrl: "",
  },
  {
    num: "04",
    name: "King of the Court",
    date: "Thursday (On Nut) · Tuesday (Indoor)",
    text: "Couples play 15-minute matches and move up or down the court ladder based on results. The last couple standing on Court 1 wins. Indoor Tuesday edition is fixed-couple format across 6 rounds.",
    imageUrl: "",
  },
  {
    num: "05",
    name: "Padel & Drink Friday",
    date: "Friday — On Nut",
    text: "Drink, play, and rotate — 6 players take turns on court in a casual social format. The perfect way to end the week on the padel court.",
    imageUrl: "",
  },
  {
    num: "06",
    name: "Coffee Padel",
    date: "Tuesday — Thonglor",
    text: "Social match play with a complimentary coffee included. A relaxed, fun format to start your Tuesday morning right on the KROSS Sky rooftop courts.",
    imageUrl: "",
  },
  {
    num: "07",
    name: "Mix Tournament",
    date: "Friday — Thonglor",
    text: "Competitive 5-couple tournament in a match-to-6 format with 6-6 tiebreak and deuce at 5. Full competition atmosphere on the Bangkok skyline rooftop at KROSS Sky.",
    imageUrl: "",
  },
  {
    num: "08",
    name: "Fancy Americano",
    date: "Sunday — Thonglor",
    text: "Americano format with a free cocktail or drink included per player. The premium Sunday social event at KROSS Sky — padel, cocktails, and city views.",
    imageUrl: "",
  },
];

/* ── STORIES ─────────────────────────────────────────────────── */
const stories = [
  {
    title: "Thai Padel Series",
    cat: "Tournament",
    date: "Monthly — announcements TBA",
    excerpt: "There are moments in a sport's journey that feel like a turning point. For Bangkok Master Final 2025, registrations have already surpassed 140 unique players — one of the largest padel gatherings ever organized in Southeast Asia.",
    bg: "linear-gradient(135deg, #0a1a0d 0%, #1a3d1a 100%)",
    imageUrl: "",
  },
  {
    title: "Bangkok Padel Tour",
    cat: "Community",
    date: "Monthly — announcements TBA",
    excerpt: "Bangkok Padel Tour is a competitive padel tournament circuit created to support the growth and development of padel in Bangkok — open to local and international participants across clearly defined categories.",
    bg: "linear-gradient(135deg, #000a1a 0%, #001a30 100%)",
    imageUrl: "",
  },
];

async function run() {
  /* ── Clear & reseed ACTIVITIES ── */
  console.log("\n── ACTIVITIES ──");
  const aSnap = await getDocs(collection(db, "activities"));
  for (const d of aSnap.docs) {
    await deleteDoc(doc(db, "activities", d.id));
    console.log(`  Deleted old activity: ${d.data().name}`);
  }
  for (const a of activities) {
    const ref = await addDoc(collection(db, "activities"), a);
    console.log(`  Created: "${a.name}" (${ref.id})`);
  }

  /* ── Clear & reseed STORIES ── */
  console.log("\n── STORIES ──");
  const sSnap = await getDocs(collection(db, "stories"));
  for (const d of sSnap.docs) {
    await deleteDoc(doc(db, "stories", d.id));
    console.log(`  Deleted old story: ${d.data().title}`);
  }
  for (const s of stories) {
    const ref = await addDoc(collection(db, "stories"), s);
    console.log(`  Created: "${s.title}" (${ref.id})`);
  }

  console.log("\nAll done!");
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
