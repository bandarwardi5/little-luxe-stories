/**
 * Seed Firestore with demo data.
 * Uploads local images via the external Hostinger upload API, then writes
 * products, categories, banners, offers, hero slides, and an admin user.
 *
 * Usage: bun run src/scripts/seed-firestore.ts <ADMIN_EMAIL>
 *   - ADMIN_EMAIL is the email that gets role="admin" in users collection.
 */
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import * as dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY!,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.VITE_FIREBASE_APP_ID!,
};

const UPLOAD_API = "https://cyan-frog-373577.hostingersite.com/api/upload.php";
const UPLOAD_BASE = "https://cyan-frog-373577.hostingersite.com/uploads";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ASSETS = join(process.cwd(), "src/assets");

async function uploadFile(filename: string): Promise<string> {
  const path = join(ASSETS, filename);
  if (!existsSync(path)) {
    console.warn(`⚠ Missing: ${filename}`);
    return "";
  }
  const buf = readFileSync(path);
  // Detect mime type
  const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  const blob = new Blob([buf], { type: mime });
  const fd = new FormData();
  fd.append("file", blob, filename);
  const res = await fetch(UPLOAD_API, { method: "POST", body: fd });
  if (!res.ok) {
    console.error(`Upload failed for ${filename}: ${res.status}`);
    return "";
  }
  const json: any = await res.json();
  if (!json.url) {
    console.error(`No URL returned for ${filename}`, json);
    return "";
  }
  const url = json.url.startsWith("http") ? json.url : `${UPLOAD_BASE}/${json.url.replace(/^\/+/, "")}`;
  console.log(`✓ ${filename} -> ${url}`);
  return url;
}

const PRODUCTS_SEED = [
  { file: "product-1.jpg", name: "تيشيرت أصفر بطبعة كرتونية", price: 49, category: "أولاد", description: "تيشيرت قطني مريح باللون الأصفر الزاهي مع طبعة كرتونية لطيفة، مثالي للعب والنشاط اليومي.", inStock: 15, rating: 4.5, badge: "جديد", featured: true },
  { file: "product-2.jpg", name: "حذاء بناتي وردي بفيونكة", price: 65, oldPrice: 95, category: "بنات", description: "حذاء بناتي ناعم باللون الوردي المريح مع فيونكة أنيقة، يوفر الراحة والأناقة لطفلتك.", inStock: 8, rating: 4.8, badge: "خصم", featured: true },
  { file: "product-3.jpg", name: "جاكيت جينز أولادي عصري", price: 145, category: "أولاد", description: "جاكيت جينز متين بتصميم عصري يناسب جميع الأوقات، يمنح طفلك مظهراً رائعاً.", inStock: 12, rating: 4.6, featured: true },
  { file: "product-4.jpg", name: "فستان بناتي وردي بنقشة الورود", price: 89, oldPrice: 125, category: "بنات", description: "فستان رقيق بنقشات ورود جميلة، مصنوع من أقمشة ناعمة تناسب بشرة الأطفال.", inStock: 5, rating: 4.9, badge: "الأكثر مبيعاً", featured: true },
  { file: "product-5.jpg", name: "حذاء رياضي أحمر للأطفال", price: 175, oldPrice: 199, category: "أحذية", description: "حذاء رياضي خفيف الوزن ومريح، يوفر الثبات والدعم لأقدام الأطفال أثناء الحركة.", inStock: 20, rating: 4.7, badge: "خصم" },
  { file: "product-6.jpg", name: "أفرول رضع مخطط بألوان الباستيل", price: 79, category: "رضع", description: "أفرول قطني ناعم جداً للرضع، بتصميم مخطط وألوان هادئة لراحة طوال اليوم.", inStock: 25, rating: 4.5 },
  { file: "product-7.jpg", name: "بدلة أولاد كاجوال أنيقة", price: 199, category: "أولاد", description: "بدلة كاجوال راقية تجمع بين الأناقة والراحة لإطلالة مميزة لطفلك.", inStock: 10, rating: 4.6 },
  { file: "product-8.jpg", name: "تنورة بناتي بألوان زاهية", price: 69, oldPrice: 99, category: "بنات", description: "تنورة بألوان مرحة وزاهية، مصممة لتحرك بحرية مع طفلتك أثناء اللعب.", inStock: 14, rating: 4.4, badge: "خصم" },
];

const CATEGORIES_SEED = [
  { name: "ملابس بنات", slug: "girls", color: "bg-banner-pink", order: 1, image: "banner-girls.jpg" },
  { name: "ملابس أولاد", slug: "boys", color: "bg-banner-mint", order: 2, image: "banner-boys.jpg" },
  { name: "ملابس رضع", slug: "babies", color: "bg-banner-peach", order: 3, image: "page-header-baby.jpg" },
  { name: "أحذية أطفال", slug: "shoes", color: "bg-secondary", order: 4, image: "product-5.jpg" },
];

const BANNERS_SEED = [
  { title: "مجموعة ملابس الأطفال الجديدة", subtitle: "TREEMASS FASHION", ctaText: "تسوق التشكيلة كاملة", ctaLink: "/shop", image: "hero-kids.jpg", bgColor: "bg-banner-pink", order: 1, active: true },
  { title: "ملابس أولاد عصرية وعملية", subtitle: "FOR BOYS", ctaText: "اكتشف الجديد", ctaLink: "/shop", image: "banner-boys.jpg", bgColor: "bg-banner-mint", order: 2, active: true },
  { title: "فساتين بنات أنيقة لكل المناسبات", subtitle: "FOR GIRLS", ctaText: "تسوقي الآن", ctaLink: "/shop", image: "banner-girls.jpg", bgColor: "bg-banner-peach", order: 3, active: true },
];

const OFFERS_SEED = [
  { title: "خصم 30% على ملابس البنات", description: "احصلي على خصم 30% على جميع فساتين البنات لفترة محدودة", discount: 30, code: "GIRLS30", image: "banner-girls.jpg", active: true },
  { title: "شحن مجاني فوق 500 ل.ت", description: "استمتع بالشحن المجاني لجميع الطلبات فوق 500 ليرة", discount: 0, code: "FREESHIP", image: "banner-boys.jpg", active: true },
  { title: "اشترِ 2 واحصل على الثالث مجاناً", description: "عرض حصري على ملابس الرضع - اشترِ قطعتين واحصل على الثالثة مجاناً", discount: 33, code: "BABY3", image: "page-header-baby.jpg", active: true },
];

async function isCollectionEmpty(name: string): Promise<boolean> {
  const snap = await getDocs(collection(db, name));
  return snap.empty;
}

async function seed() {
  console.log("🌱 Starting seed...\n");

  // Cache uploads to avoid duplicates
  const uploadCache = new Map<string, string>();
  const upload = async (file: string) => {
    if (uploadCache.has(file)) return uploadCache.get(file)!;
    const url = await uploadFile(file);
    uploadCache.set(file, url);
    return url;
  };

  // Categories
  if (await isCollectionEmpty("categories")) {
    console.log("\n📂 Seeding categories...");
    for (let i = 0; i < CATEGORIES_SEED.length; i++) {
      const c = CATEGORIES_SEED[i];
      const image = await upload(c.image);
      await setDoc(doc(db, "categories", c.slug), {
        name: c.name,
        slug: c.slug,
        color: c.color,
        order: c.order,
        image,
        createdAt: serverTimestamp(),
      });
    }
  } else console.log("📂 categories already populated, skipping.");

  // Products
  if (await isCollectionEmpty("products")) {
    console.log("\n🛍️ Seeding products...");
    for (let i = 0; i < PRODUCTS_SEED.length; i++) {
      const p = PRODUCTS_SEED[i];
      const image = await upload(p.file);
      const id = `prod-${i + 1}`;
      await setDoc(doc(db, "products", id), {
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        category: p.category,
        description: p.description,
        inStock: p.inStock,
        rating: p.rating ?? 4.5,
        badge: p.badge ?? null,
        featured: p.featured ?? false,
        image,
        images: [image],
        createdAt: serverTimestamp(),
      });
    }
  } else console.log("🛍️ products already populated, skipping.");

  // Banners
  if (await isCollectionEmpty("banners")) {
    console.log("\n🎨 Seeding banners...");
    for (let i = 0; i < BANNERS_SEED.length; i++) {
      const b = BANNERS_SEED[i];
      const image = await upload(b.image);
      await setDoc(doc(db, "banners", `banner-${i + 1}`), { ...b, image, createdAt: serverTimestamp() });
    }
  } else console.log("🎨 banners already populated, skipping.");

  // Offers
  if (await isCollectionEmpty("offers")) {
    console.log("\n💰 Seeding offers...");
    for (let i = 0; i < OFFERS_SEED.length; i++) {
      const o = OFFERS_SEED[i];
      const image = o.image ? await upload(o.image) : "";
      await setDoc(doc(db, "offers", `offer-${i + 1}`), { ...o, image, createdAt: serverTimestamp() });
    }
  } else console.log("💰 offers already populated, skipping.");

  // Settings (site-wide)
  const defaultSettings = {
    siteName: "Treemass Kids",
    siteDescription: "أفضل ملابس الأطفال في إسطنبول",
    contactEmail: "info@treemass.com.tr",
    contactPhone: "+90 507 022 2149",
    address: "إسطنبول، تركيا",
    facebook: "https://www.facebook.com/profile.php?id=61550770286748",
    instagram: "https://www.instagram.com/_treemass_",
    twitter: "",
    currency: "ل.ت",
    shippingFee: 20,
    freeShippingThreshold: 500,
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, "settings", "general"), defaultSettings, { merge: true });
  await setDoc(doc(db, "settings", "site"), defaultSettings, { merge: true });

  console.log("\n✅ Seed completed!");
  console.log("\n👉 To make a user admin, sign up via the app first then run:");
  console.log("   bun run src/scripts/make-admin.ts <email>");
  process.exit(0);
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
