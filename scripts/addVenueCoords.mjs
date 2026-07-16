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

const coords = {
  "KROSS ONNUT":   { lat: "13.7012", lon: "100.5998" },
  "KROSS ASOKE":    { lat: "13.7376", lon: "100.5600" },
  "KROSS INDOOR":   { lat: "13.7306", lon: "100.5839" },
  "KROSS SKY":      { lat: "13.7217", lon: "100.5494" },
};

const snap = await getDocs(collection(db, "venues"));
for (const d of snap.docs) {
  const name = d.data().name;
  const c = coords[name];
  if (c) {
    await updateDoc(doc(db, "venues", d.id), c);
    console.log(`✓ ${name} → lat ${c.lat}, lon ${c.lon}`);
  } else {
    console.log(`– skipped: ${name}`);
  }
}
console.log("Done.");
