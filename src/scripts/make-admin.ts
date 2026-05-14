/**
 * Promote a user to admin role.
 * Usage: bun run src/scripts/make-admin.ts <email>
 *
 * Requires the user to have signed up at least once already (so the auth user exists).
 * This script searches the `users` collection by email and sets role="admin".
 */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, updateDoc } from "firebase/firestore";

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

const email = process.argv[2];
if (!email) {
  console.error("Usage: bun run src/scripts/make-admin.ts <email>");
  process.exit(1);
}

const q = query(collection(db, "users"), where("email", "==", email));
const snap = await getDocs(q);
if (snap.empty) {
  console.error(`No user found with email ${email}. Sign up via the app first.`);
  process.exit(1);
}
for (const d of snap.docs) {
  await updateDoc(d.ref, { role: "admin" });
  console.log(`✓ Promoted ${email} (uid: ${d.id}) to admin`);
}
process.exit(0);
