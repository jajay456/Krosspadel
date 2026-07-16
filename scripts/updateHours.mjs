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

const hours = {
  "KROSS ON NUT": "07:00 – 23:00",
  "KROSS ASOKE":  "07:00 – 22:00",
};

const snap = await getDocs(collection(db, "venues"));
for (const d of snap.docs) {
  const name = d.data().name;
  if (hours[name]) {
    await updateDoc(doc(db, "venues", d.id), { hours: hours[name] });
    console.log(`✓ ${name} → ${hours[name]}`);
  }
}
console.log("Done.");
