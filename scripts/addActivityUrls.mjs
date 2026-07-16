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

const urls = {
  "Bangkok Padel Tour": "https://bangkokpadeltour.com/",
  "Thai Padel Series":  "https://thaipadelseries.com/",
};

const snap = await getDocs(collection(db, "stories"));
for (const d of snap.docs) {
  const title = d.data().title;
  if (urls[title]) {
    await updateDoc(doc(db, "stories", d.id), { url: urls[title] });
    console.log(`✓ ${title} → ${urls[title]}`);
  }
}
console.log("Done.");
