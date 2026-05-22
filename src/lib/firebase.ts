import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const UPLOAD_BASE = import.meta.env.VITE_UPLOAD_BASE as string;
export const UPLOAD_API = import.meta.env.VITE_UPLOAD_API as string;

export function imageUrl(path: string | undefined | null): string {
  if (!path) return "";
  
  // If it's already a full URL or data URI, return it as is
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  
  // If it starts with / but not /assets or /uploads, it's a local absolute path
  if (path.startsWith("/") && !path.startsWith("/uploads") && !path.startsWith("/assets")) return path;

  // Normalize the path by removing leading slashes
  const cleanPath = path.replace(/^\/+/, "");
  const base = UPLOAD_BASE || "https://cyan-frog-373577.hostingersite.com/uploads";

  // If it's an upload path (contains 'uploads/' or we're forced to use the base)
  if (cleanPath.startsWith("uploads/")) {
    const fileName = cleanPath.replace(/^uploads\//, "");
    return `${base.replace(/\/+$/, "")}/${fileName}`;
  }

  // Fallback for simple filenames that might be in assets
  if (cleanPath.includes(".") && !cleanPath.includes("/")) {
    return `/assets/${cleanPath}`;
  }
  
  // Default fallback to base if it's not an asset
  return `${base.replace(/\/+$/, "")}/${cleanPath}`;
}


export async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(UPLOAD_API, { method: "POST", body: fd });
  if (!res.ok) throw new Error("فشل رفع الصورة");
  const json = await res.json();
  if (!json.url) throw new Error("لم يتم استلام رابط الصورة");
  return imageUrl(json.url);
}
