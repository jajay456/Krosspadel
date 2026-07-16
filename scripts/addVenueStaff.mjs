import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

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

const staffData = {
  "KROSS ON NUT": [
    { name: "AE", role: "Club Assistant" },
    { name: "Nikkie", role: "Club Assistant Manager" },
    { name: "Aon", role: "Club Assistant" },
  ],
};

const snap = await getDocs(collection(db, "venues"));
for (const d of snap.docs) {
  const name = d.data().name;
  const staff = staffData[name];
  if (staff) {
    await updateDoc(doc(db, "venues", d.id), { staff });
    console.log(`✓ ${name} — ${staff.length} staff added`);
  }
}
console.log("Done.");
