import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

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

const indoorData = {
  num: "03",
  name: "KROSS INDOOR",
  loc: "Rama 4 · Bangkok",
  region: "Rama 4",
  status: "Open",
  hours: "Mon–Sun 07:00–23:00",
  address: "135 Ardnarong Road, Khlong Toei, Bangkok 10110",
  phone: "091-860-7150",
  courts: 3,
  intro: "KROSS Indoor features three premium indoor courts in a fully controlled environment with high ceilings and professional-grade surfaces. Unlike outdoor venues where humidity or rain can affect play, KROSS Indoor delivers a consistent, all-weather experience — ideal for serious players, competitive matches, and tournaments.",
  courtText: "Three full-size indoor courts with high ceilings and professional-grade surfaces guarantee consistent ball bounce and playing conditions regardless of weather. The indoor setting is particularly suited to advanced players and competitive training.",
  courtText2: "Court hire is available daily via the KROSS app. Advance coaching classes and group sessions are available — perfect for players looking to sharpen skills in a structured environment.",
  clubText: "The KROSS Indoor club space is built for serious players. Clean, professional, and fully equipped — the environment sets the tone from the moment you walk in.",
  clubText2: "2 resident coaches specialize in advance coaching and are bookable through the app. Group sessions of up to 4 players are available for targeted skill development.",
  courtsImageCaption: "KROSS Indoor — Courts Overview",
  clubImageCaption: "KROSS Indoor — Club Space",
  features: [
    { num: "3", label: "Indoor Courts" },
    { num: "2", label: "Coaches" },
    { num: "100%", label: "All-Weather" },
  ],
  bg1: "linear-gradient(135deg, #000a1a 0%, #001a30 100%)",
  bg: "linear-gradient(135deg, #000a1a 0%, #00121f 100%)",
  gallery: [],
  imageUrl: "",
};

async function fix() {
  const snap = await getDocs(collection(db, "venues"));
  const docs = snap.docs.map(d => ({ id: d.id, name: d.data().name }));
  console.log("All venues:", docs);

  const rama4 = docs.find(d => d.name === "RAMA IV");
  const duplicate = docs.find(d => d.name === "KROSS INDOOR");

  if (rama4) {
    console.log(`Updating RAMA IV (${rama4.id}) → KROSS INDOOR`);
    await updateDoc(doc(db, "venues", rama4.id), indoorData);
  }

  if (duplicate) {
    console.log(`Deleting duplicate KROSS INDOOR (${duplicate.id})`);
    await deleteDoc(doc(db, "venues", duplicate.id));
  }

  console.log("Done!");
  process.exit(0);
}

fix().catch(e => { console.error(e); process.exit(1); });
