import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc, serverTimestamp } from "firebase/firestore";
import * as dotenv from "dotenv";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY!,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.VITE_FIREBASE_APP_ID!,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const EXPORT_PATH = join(process.cwd(), "src", "scripts", "products-data.json");

async function exportProducts() {
  console.log("🔄 Exporting products from Firestore...");
  const snapshot = await getDocs(collection(db, "products"));
  const data = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  writeFileSync(EXPORT_PATH, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✅ Exported ${data.length} products to ${EXPORT_PATH}`);
}

async function importProducts() {
  if (!existsSync(EXPORT_PATH)) {
    console.error("⚠️ Export file not found. Run the script with '--export' first.");
    return;
  }
  const raw = readFileSync(EXPORT_PATH, "utf-8");
  const products = JSON.parse(raw);
  console.log(`🔄 Importing ${products.length} products to Firestore...`);
  for (const p of products) {
    const { id, ...rest } = p;
    await setDoc(doc(db, "products", id), {
      ...rest,
      updatedAt: serverTimestamp(),
    });
    console.log(`✔ Updated product ${id}`);
  }
  console.log("✅ Import completed.");
}

(async () => {
  const arg = process.argv[2];
  if (arg === "--export") {
    await exportProducts();
  } else if (arg === "--import") {
    await importProducts();
  } else {
    console.log("Usage: npx tsx src/scripts/export-reimport-products.ts --export|--import");
  }
})();
