import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

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

const venues = [
  {
    num: "01",
    name: "KROSS ONNUT",
    loc: "On Nut · Bangkok",
    region: "Onnut",
    status: "Open",
    hours: "Mon–Sun 07:00–23:00",
    address: "89 Soi Chinnamat, Phra Khanong, Watthana, Bangkok 10110",
    phone: "097-285-6133",
    courts: 3,
    intro: "KROSS On Nut isn't just a place to play — it's a place to belong. We host regular tournaments, social mixers, and coaching clinics led by experienced instructors passionate about growing the sport in Thailand. With the iconic On Nut BTS skyline as your backdrop and a community that feels like family, KROSS On Nut is your sanctuary in the city.",
    courtText: "Every court at KROSS On Nut is built to premium specifications — 2 inroof courts and 1 outdoor court, offering flexible play in any weather. All courts feature artificial grass turf and professional LED lighting for day and evening sessions.",
    courtText2: "Court hire is available from opening to close, with online booking up to 7 days in advance via the KROSS app. Members receive priority windows and guaranteed slots during peak hours.",
    clubText: "Beyond the courts, KROSS On Nut is a place to stay. The club space is designed for post-match recovery and pre-match preparation, with a welcoming atmosphere that keeps members coming back.",
    clubText2: "Equipment rental and coaching services are available on-site. Our 3 resident coaches are bookable through the app daily.",
    courtsImageCaption: "KROSS On Nut — Courts Overview",
    clubImageCaption: "KROSS On Nut — Club Space",
    features: [
      { num: "3", label: "Courts" },
      { num: "2", label: "Inroof" },
      { num: "1", label: "Outdoor" },
      { num: "3", label: "Coaches" },
    ],
    bg1: "linear-gradient(135deg, #0a1a0d 0%, #1a3a1a 100%)",
    bg: "linear-gradient(135deg, #0a1a0d 0%, #122012 100%)",
    gallery: [],
    imageUrl: "",
  },
  {
    num: "02",
    name: "KROSS ASOKE",
    loc: "Asoke · Bangkok",
    region: "Asoke",
    status: "Open",
    hours: "Mon–Sun 07:00–23:00",
    address: "8th Floor, Parking Building, 30 Sukhumvit 21 Rd, Khlong Toei Nuea, Watthana, Bangkok 10110",
    phone: "084-043-8893",
    courts: 2,
    intro: "The most striking feature of KROSS Asoke is its unique Mediterranean courtyard design — warm sun-kissed orange courts beautifully balanced by soft cream lines and lush greenery, creating a space that feels like a private villa in Spain or Italy. A stylish roof lets you enjoy fresh air and panoramic views all year round. Located steps from Terminal 21, at the intersection of MRT Sukhumvit and BTS Asoke.",
    courtText: "KROSS Asoke features 2 premium outdoor-with-roof courts in a signature Mediterranean aesthetic. The orange turf contrasted against cream architecture creates an atmosphere unlike any other padel venue in Bangkok.",
    courtText2: "Court hire is available daily, with online booking through the KROSS app. The rooftop setting offers fresh air and city views while keeping play sheltered from the elements.",
    clubText: "KROSS Asoke's open-air lounge area complements the courts perfectly — an elegant space to unwind, socialise, and enjoy the Sukhumvit skyline after a match.",
    clubText2: "Café and F&B options are nearby. 2 resident coaches are available for daily bookings through the KROSS app.",
    courtsImageCaption: "KROSS Asoke — Courts Overview",
    clubImageCaption: "KROSS Asoke — Club Space",
    features: [
      { num: "2", label: "Courts" },
      { num: "2", label: "Coaches" },
      { num: "8F", label: "Rooftop" },
    ],
    bg1: "linear-gradient(135deg, #1a1000 0%, #3a2800 100%)",
    bg: "linear-gradient(135deg, #1a1000 0%, #2a1e00 100%)",
    gallery: [],
    imageUrl: "",
  },
  {
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
  },
  {
    num: "04",
    name: "KROSS SKY",
    loc: "Thonglor · Bangkok",
    region: "Thonglor",
    status: "Open",
    hours: "Mon–Sun 08:00–22:00",
    address: "88 Soi Sukhumvit 49, Khlong Tan Nuea, Watthana, Bangkok 10110",
    phone: "080-331-3883",
    courts: 2,
    intro: "The standout feature of KROSS Sky is its rooftop setting with sleek all-black turf courts. Unlike traditional ground-level venues, playing here means panoramic views of Bangkok's skyline — a stunning backdrop against the city sunset. Perfect for players seeking a unique experience, content creation, and post-match drinks with a true rooftop chill vibe.",
    courtText: "Two premium outdoor rooftop courts with signature all-black turf set against the Bangkok skyline. The sleek aesthetic and elevated setting make KROSS Sky one of the most visually striking padel venues in the city.",
    courtText2: "Court hire is available daily via the KROSS app. The open-air setting is ideal for evening sessions with the city lights as your backdrop.",
    clubText: "After your match, the KROSS Sky rooftop lounge offers the perfect wind-down spot — drinks in hand, city views all around. A space designed as much for the vibe as for the sport.",
    clubText2: "1 resident coach is available daily for bookings through the app. Special events including Fancy Americano and Mix Tournaments run weekly.",
    courtsImageCaption: "KROSS Sky — Rooftop Courts",
    clubImageCaption: "KROSS Sky — Rooftop Lounge",
    features: [
      { num: "2", label: "Rooftop Courts" },
      { num: "1", label: "Coach" },
      { num: "360°", label: "City Views" },
    ],
    bg1: "linear-gradient(135deg, #050505 0%, #0f0f10 100%)",
    bg: "linear-gradient(135deg, #050505 0%, #0a0a0a 100%)",
    gallery: [],
    imageUrl: "",
  },
];

async function seed() {
  console.log("Fetching existing venues...");
  const snap = await getDocs(collection(db, "venues"));
  const existing = snap.docs.map(d => ({ id: d.id, name: d.data().name }));
  console.log(`Found ${existing.length} existing venues:`, existing.map(v => v.name));

  for (const venue of venues) {
    const match = existing.find(
      e => e.name.toLowerCase().includes(venue.region.toLowerCase()) ||
           venue.name.toLowerCase().includes((e.name || "").toLowerCase().split(" ").pop())
    );

    if (match) {
      console.log(`Updating existing: "${match.name}" (${match.id}) → "${venue.name}"`);
      await updateDoc(doc(db, "venues", match.id), venue);
    } else {
      console.log(`Creating new venue: "${venue.name}"`);
      const ref = await addDoc(collection(db, "venues"), venue);
      console.log(`  Created with ID: ${ref.id}`);
    }
  }

  console.log("\nDone! All venues seeded.");
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
