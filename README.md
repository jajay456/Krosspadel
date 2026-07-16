# KROSS Padel

เว็บไซต์สำหรับ **KROSS Padel** แบรนด์สนามพาเดิลในไทย — เป็นทั้ง marketing site สำหรับลูกค้า และมี admin panel จัดการข้อมูลหลังบ้าน

> สำหรับ **ฟอร์มเก็บคอนเทนต์จากลูกค้า** (venues / activities / membership ฯลฯ) ดูที่ [`CLIENT_CONTENT_FORM.md`](./CLIENT_CONTENT_FORM.md)

## สารบัญ
- [Tech Stack](#tech-stack)
- [เริ่มใช้งาน](#เริ่มใช้งาน)
- [โครงสร้างไฟล์](#โครงสร้างไฟล์)
- [Routing](#routing)
- [Data Model — Venue](#data-model--venue-firestore)
- [Admin Panel](#admin-panel)
- [Design System](#design-system)
- [Firebase & Supabase](#firebase--supabase)
- [Contact Form (mailto)](#contact-form-mailto)
- [Testing](#testing)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Routing | Custom SPA routing ผ่าน `page` state ใน App.jsx (ไม่ใช้ React Router) |
| Database | Firebase Firestore (Realtime data) |
| Auth | Firebase Auth |
| Image Storage | Supabase Storage (bucket: `kross_backend`) |
| Styling | CSS Variables ใน `global.css` (dark theme) |
| Color Picker | `react-color` (ChromePicker) |
| Contact form | Web3Forms (ส่งอีเมลจาก frontend ตรงๆ) |
| Testing | Vitest + @testing-library/react + jsdom |

---

## เริ่มใช้งาน

```bash
npm install
npm run dev      # dev server (Vite + HMR) ที่ http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview production build
npm run lint     # eslint
```

---

## โครงสร้างไฟล์

```
src/
├── App.jsx                    # Root — routing logic, providers wrap
├── main.jsx
├── firebase.js                # Firebase config (db, auth)
├── supabaseClient.ts          # Supabase client + uploadImage()
├── vite-env.d.ts
│
├── context/
│   ├── AuthContext.js         # Context สำหรับ user state
│   ├── AuthProvider.jsx       # Firebase onAuthStateChanged
│   ├── VenueContext.jsx       # Context สำหรับ venues
│   └── VenueProvider.jsx      # โหลด venues จาก Firestore ผ่าน venueService
│
├── service/
│   └── venueService.js        # getVenues() — query Firestore collection "venues"
│
├── components/
│   ├── Nav.jsx                # Navbar (รับ scrolled state จาก App)
│   ├── Footer.jsx
│   ├── BookModal.jsx          # Modal จองคอร์ท
│   ├── MobileCarousel.jsx     # Carousel สำหรับ mobile
│   └── Notif.jsx              # Toast notification
│
├── pages/
│   ├── HomePage.jsx
│   ├── VenuesPage.jsx         # รายการ venues ทั้งหมด
│   ├── VenueDetailPage.jsx    # หน้า detail ของ venue แต่ละอัน
│   ├── ActivitiesPage.jsx
│   ├── ActivityDetailPage.jsx # หน้า detail ของ activity แต่ละอัน
│   ├── StoriesPage.jsx
│   ├── StoryDetailPage.jsx    # หน้า detail ของ story แต่ละอัน
│   ├── MembershipPage.jsx
│   ├── ContactPage.jsx
│   ├── AboutPage.jsx
│   ├── LifestylePage.jsx
│   ├── BecomePartnerPage.jsx  # Partner hub
│   ├── BePartOfKrossPage.jsx  # Partner — เข้าร่วมกับ KROSS
│   ├── FranchiseesPage.jsx    # Partner — แฟรนไชส์ (มีฟอร์ม)
│   ├── BrandsCollabsPage.jsx  # Partner — brand collaborations
│   ├── ComingSoonPage.jsx     # Placeholder สำหรับ feature ที่ยังไม่เปิด
│   └── admin/
│       ├── AdminLoginPage.jsx
│       ├── AdminDashboard.jsx         # เมนูหลัก admin
│       ├── AdminVenuesPage.jsx        # CRUD venues
│       ├── AdminStoriesPage.jsx       # CRUD stories
│       ├── AdminActivitiesPage.jsx    # CRUD activities
│       ├── AdminMembershipPage.jsx    # จัดการ membership plans
│       ├── AdminPricingPage.jsx       # จัดการ pricing
│       └── AdminTeamPage.jsx          # จัดการ team members
│
├── data/
│   └── mockActivities.js      # Mock data สำหรับ activities
│
├── test/
│   └── setup.js               # import @testing-library/jest-dom
│
├── utils/
│   ├── venueUtils.js          # pure functions
│   └── venueUtils.test.js     # unit tests
│
└── styles/
    └── global.css             # Design system — CSS variables, utility classes
```

---

## Routing

ใช้ `page` state string แทน URL routing:

```
// public
"home" | "venues" | "venue-{id}" | "activities" | "activity-{id}"
"stories" | "story-{id}" | "membership" | "contact" | "about" | "lifestyle"

// partner
"partner" | "partner-be-part" | "partner-franchisees" | "partner-brands"

// coming soon (placeholder)
"whatsapp" | "krosspark"

// admin
"admin-login" | "admin" | "admin-venues" | "admin-stories"
"admin-activities" | "admin-membership" | "admin-pricing" | "admin-team"
```

- `navigate(p)` ฟังก์ชันเดียวใช้ทั้ง app — `setPage(p)` + `scrollTo(0,0)` + เคลียร์ hash
- `#admin` ใน URL hash → เปิดหน้า admin ตรงๆ (ใช้ตอน bootstrap / กลับมาจาก hash)
- detail page ใช้ pattern `venue-{docId}` / `activity-{id}` / `story-{id}` แล้ว match กับ data

---

## Data Model — Venue (Firestore)

```js
{
  name, loc, region, num, status,   // ข้อมูลพื้นฐาน
  hours, address, phone, courts,
  intro,                             // paragraph แนะนำ venue

  // Hero / Background
  bg,          // gradient color hex (hero section)
  bgImage,     // URL รูป hero background (override bg)
  bg1,         // gradient color hex (detail hero)
  bg1Image,    // URL รูป detail hero (override bg1)

  // Courts Section
  courtsImageBg,      // color หรือ gradient
  courtsImageBgImage, // URL รูป courts section
  courtsImageCaption,
  courtText,
  courtText2,

  // Club Section
  clubImageBg,
  clubImageBgImage,   // URL รูป club section
  clubImageCaption,
  clubText,
  clubText2,

  imageUrl,    // cover image ของ venue card

  features: [{ num: string, label: string }]  // stats cards เช่น "4 / Courts"
}
```

---

## Admin Panel

- เข้าผ่าน `#admin` hash หรือ `navigate("admin")` (guard ด้วย Firebase Auth — ถ้าไม่ login จะ render AdminLoginPage แทน)
- **AdminVenuesPage** — CRUD venue: form รองรับ image upload (Supabase) + color picker (ChromePicker) สำหรับ bg fields
- **AdminStoriesPage** — CRUD stories
- **AdminActivitiesPage** — CRUD activities
- **AdminMembershipPage** — จัดการ membership plans
- **AdminPricingPage** — จัดการ pricing
- **AdminTeamPage** — จัดการ team members

### Image Upload Flow

```
user เลือกไฟล์ → uploadImage() ใน supabaseClient.ts
→ อัพโหลดไปที่ Supabase Storage bucket "kross_backend"
→ path: {collection}/{docId}/{timestamp}.{ext}
→ คืน public URL → เก็บใน Firestore field
```

---

## Design System

CSS Variables หลักใน `global.css`:
- `--dark` — background หลัก (near black)
- `--mid` / `--mid2` — card backgrounds
- `--white` — text
- `--green-highlight` — accent color (CTA, active states)

Utility classes: `.btn-primary`, `.btn-ghost`, `.back-btn`, `.heading`, `.tag`, `.venue-name`

---

## Firebase & Supabase

**Firebase**
- Project ID: `kross-backend`
- Auth Domain: `kross-backend.firebaseapp.com`
- Firestore collections: `venues`, `stories`, `activities`, `membership` (คาดว่ามี)

**Supabase**
- Bucket: `kross_backend`
- URL/Key อยู่ใน `.env` ตัวแปร `VITE_SUPABASE_URL` และ `VITE_SUPABASE_PUBLISHABLE_KEY`

---

## Contact Form (mailto)

ฟอร์มหน้า **Contact** (`src/pages/ContactPage.jsx`) ใช้ **`mailto:`** — พอลูกค้ากด **Send Message** เว็บจะเปิดแอปเมลของเครื่องลูกค้าเอง (Mail / Gmail / Outlook) พร้อมเนื้อหาที่กรอกไว้ครบ จ่าหน้าถึง KROSS แล้วลูกค้ากด Send ส่งเอง

> ไม่ต้องใช้ backend / API key ใดๆ — เว็บเป็น frontend ล้วน

**เปลี่ยนกล่องปลายทาง** — แก้ค่าตัวแปรเดียวบนสุดของ `src/pages/ContactPage.jsx`:
```js
const CONTACT_EMAIL = "info@krosspadel.com";
```

**หมายเหตุ**
- ข้อความถูกส่งจาก**อีเมลส่วนตัวของลูกค้า** ไม่ใช่ระบบกลาง
- ถ้าเครื่องลูกค้าไม่ได้ตั้ง default mail app (เช่นใช้ Gmail บนเว็บที่ยังไม่ผูกกับ `mailto:`) การกดอาจไม่เด้ง — เป็นข้อจำกัดปกติของ `mailto:`
- เดิมเคยใช้ EmailJS แล้ว Web3Forms — ถอดออกทั้งคู่แล้ว

---

## Testing

| Tool | หน้าที่ |
|---|---|
| Vitest | Test runner (ทำงานร่วมกับ Vite โดยตรง) |
| @testing-library/react | Test React components |
| @testing-library/jest-dom | Custom matchers เช่น `toBeInTheDocument()` |
| jsdom | จำลอง browser environment |

```bash
npm test           # watch mode
npm run test:run   # รันครั้งเดียวแล้วจบ (ใช้ใน CI)
npm run test:ui    # เปิด browser UI ดู test results
```

**Tests ที่มีอยู่ — `src/utils/venueUtils.test.js`** (pure functions)
- `locationWord(count)` — แปลงจำนวน venues เป็นคำอังกฤษ (เช่น `4` → `"Four"`, เกิน 10 คืน string ตัวเลข)
- `totalCourts(venues)` — บวกจำนวน courts ทั้งหมด (ข้าม undefined/ค่าว่าง, รับ string ตัวเลขได้)

**เพิ่ม test ใหม่:** สร้างไฟล์ `*.test.js` / `*.test.jsx` ข้างๆ ไฟล์ที่จะ test

```js
import { describe, it, expect } from "vitest";
import { myFunction } from "./myFile";

describe("myFunction", () => {
    it("should do X when Y", () => {
        expect(myFunction(input)).toBe(expected);
    });
});
```

**ควร test เพิ่มในอนาคต**
- [ ] Component test — `VenuePreview`, `StoryPreview` renders ถูกต้อง
- [ ] Integration test — form admin บันทึกแล้ว Firestore ได้รับข้อมูลถูก
- [ ] E2E test (Playwright) — navigate ครบทุก page ไม่ crash
