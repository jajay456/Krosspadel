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

const data = {
  "KROSS INDOOR": {
    courtsInfo: "3 indoor courts\nTHB 1,000–1,400/hour",
    hours: "07:00 – 00:00",
    staff: [
      { name: "Yurii", role: "Club Assistant Manager" },
      { name: "Karina", role: "Club Assistant" },
      { name: "MJ", role: "Club Assistant" },
      { name: "Lau Daddona", role: "Coach Club" },
    ],
  },
};

const snap = await getDocs(collection(db, "venues"));
for (const d of snap.docs) {
  const name = d.data().name;
  if (data[name]) {
    await updateDoc(doc(db, "venues", d.id), data[name]);
    console.log(`✓ ${name} updated`);
  }
}
console.log("Done.");
