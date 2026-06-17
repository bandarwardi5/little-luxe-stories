import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { LangCtx } from "@/lib/i18n";

export type AppUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "admin" | "customer";
};

type Ctx = {
  user: AppUser | null;
  firebaseUser: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);

async function ensureUserDoc(u: User): Promise<AppUser> {
  const ref = doc(db, "users", u.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      email: u.email,
      displayName: u.displayName ?? "",
      photoURL: u.photoURL ?? "",
      role: "customer",
      createdAt: serverTimestamp(),
    });
    return {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      photoURL: u.photoURL,
      role: "customer",
    };
  }
  const data = snap.data();
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName ?? data.displayName ?? "",
    photoURL: u.photoURL ?? data.photoURL ?? "",
    role: (data.role as "admin" | "customer") ?? "customer",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const langCtx = useContext(LangCtx);
  const lang = langCtx?.lang || "ar";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setFirebaseUser(u);
      if (u) {
        try {
          const appUser = await ensureUserDoc(u);
          setUser(appUser);
        } catch (e) {
          console.error(e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value: Ctx = {
    user,
    firebaseUser,
    loading,
    isAdmin: user?.role === "admin",
    signIn: async (email, password) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    signUp: async (name, email, password) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      await ensureUserDoc(cred.user);
    },
    signInGoogle: async () => {
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (error: any) {
        if (error.code === 'auth/popup-blocked') {
          throw new Error(lang === "ar" ? "تم حظر النافذة المنبثقة، يرجى السماح بها للمتابعة" : "Popup blocked, please allow it to continue");
        }
        console.error("Google Auth Error:", error);
        throw error;
      }
    },
    resetPassword: async (email) => {
      await sendPasswordResetEmail(auth, email);
    },
    logout: async () => {
      await signOut(auth);
    },
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
