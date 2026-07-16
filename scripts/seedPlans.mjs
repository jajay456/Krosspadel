import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbxjbnHAxPDB4vJ7fX3iemkt3XIQnDNDE",
  authDomain: "kross-backend.firebaseapp.com",
  projectId: "kross-backend",
  storageBucket: "kross-backend.firebasestorage.app",
  messagingSenderId: "894318108715",
  appId: "1:894318108715:web:b199640d29cc241a2e8a6e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// clear existing plans
const existing = await getDocs(collection(db, "plans"));
for (const d of existing.docs) await deleteDoc(doc(db, "plans", d.id));

const plans = [
  {
    name: "Kross Pass package",
    price: "9,200",
    priceLabel: "All Kross Clubs",
    validity: "Valid 3 months, Non-transferable. Use for regular booking.",
    featured: true,
    order: 1,
    perks: "Kross Pass: 20 hrs 17,400 B\nKross Pass: 30 hrs 25,600 B\nKross Pass: 50 hrs 41,000 B\nKross Pass: 100 hrs 78,000 B\n50/100 hours none expired date.",
  },
  {
    name: "Club Pass package",
    price: "8,400",
    priceLabel: "Only 1 club play",
    validity: "Valid 3 months, Non-transferable. Use for regular booking.",
    featured: false,
    order: 2,
    perks: "Kross Pass: 20 hrs 16,000 B\nKross Pass: 30 hrs 24,000 B\nKross Pass: 50 hrs 37,000 B\nKross Pass: 100 hrs 70,000 B\n50/100 hours none expired date.",
  },
];

for (const p of plans) {
  await addDoc(collection(db, "plans"), p);
  console.log(`✓ ${p.name} added`);
}
console.log("Done.");
