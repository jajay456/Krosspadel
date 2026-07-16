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

const pricing = {
  "KROSS ON NUT": {
    courtsInfo: "1 outdoor court\nTHB 800–1,200/hour\n\n2 indoor courts\nTHB 1,000–1,400/hour",
    coachingInfo: "1 person\nTHB 2,200/hour\n\n1 person\nTHB 1,600/hour",
  },
};

const snap = await getDocs(collection(db, "venues"));
for (const d of snap.docs) {
  const name = d.data().name;
  const p = pricing[name];
  if (p) {
    await updateDoc(doc(db, "venues", d.id), p);
    console.log(`✓ ${name} pricing updated`);
  }
}
console.log("Done.");
