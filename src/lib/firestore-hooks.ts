import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Multilingual } from "./i18n";

export type ProductVariation = {
  color: Multilingual;
  images?: string[];
  video?: string;
  sizes: Array<{
    size: string;
    stock: number;
  }>;
};

export type FsProduct = {
  id: string;
  code?: string;
  name: Multilingual;
  slug?: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  colors?: Multilingual[];
  sizes?: string[];
  variations?: ProductVariation[];
  category: string;
  description: Multilingual;
  inStock: number;
  rating?: number;
  badge?: string;
  featured?: boolean;
  createdAt?: any;
};

export type FsCategory = {
  id: string;
  name: string;
  image?: string;
  color?: string;
  count?: number;
  order?: number;
};

export type FsBanner = {
  id: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  image: string;
  bgColor?: string;
  order?: number;
  active?: boolean;
};

export type FsOffer = {
  id: string;
  title: string;
  description?: string;
  discount?: number;
  image?: string;
  code?: string;
  expiresAt?: any;
  active?: boolean;
};

export type FsBlog = {
  id: string;
  title: any; // Can be Multilingual
  excerpt: any; // Can be Multilingual
  content: any; // Can be Multilingual
  author: string;
  category: string;
  image: string;
  date: string;
  readTime?: string;
  createdAt?: any;
};

export type FsOrder = {
  id: string;
  userId?: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  items: Array<{ id: string; name: string; price: number; quantity: number; image: string }>;
  subtotal: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  notes?: string;
  createdAt?: any;
};

function useCollection<T>(name: string, ...constraints: QueryConstraint[]) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, name), ...constraints);
    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as T[]);
        setLoading(false);
      },
      (err) => {
        console.error(`[${name}]`, err);
        setError(err);
        setLoading(false);
      }
    );
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, JSON.stringify(constraints.map((c: any) => c?._field?.segments ?? c))]);

  return { data, loading, error };
}

export const useProducts = () => useCollection<FsProduct>("products", orderBy("createdAt", "desc"));
export const useCategories = () => useCollection<FsCategory>("categories", orderBy("order", "asc"));
export const useBanners = () => useCollection<FsBanner>("banners", orderBy("order", "asc"));
export const useOffers = () => useCollection<FsOffer>("offers");
export const useBlogs = () => useCollection<FsBlog>("blogs", orderBy("createdAt", "desc"));
export const useOrders = () => useCollection<FsOrder>("orders", orderBy("createdAt", "desc"));
export const useUsers = () => useCollection<any>("users");
export const useNewsletter = () => useCollection<any>("newsletter");
export const useContacts = () => useCollection<any>("contacts");
export const useHero = () => useCollection<any>("hero", orderBy("order", "asc"));

export function useSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "general"), (snap) => {
      setSettings(snap.exists() ? snap.data() : null);
      setLoading(false);
    });
    return () => unsub();
  }, []);
  return { settings, loading };
}

export function useUserOrders(userId: string | undefined) {
  return useCollection<FsOrder>("orders", ...(userId ? [where("userId", "==", userId), orderBy("createdAt", "desc")] : []));
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<FsProduct | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) { setLoading(false); return; }
    getDoc(doc(db, "products", id)).then((snap) => {
      setProduct(snap.exists() ? ({ id: snap.id, ...snap.data() } as FsProduct) : null);
      setLoading(false);
    });
  }, [id]);
  return { product, loading };
}

export function useBlog(id: string | undefined) {
  const [blog, setBlog] = useState<FsBlog | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) { setLoading(false); return; }
    getDoc(doc(db, "blogs", id)).then((snap) => {
      setBlog(snap.exists() ? ({ id: snap.id, ...snap.data() } as FsBlog) : null);
      setLoading(false);
    });
  }, [id]);
  return { blog, loading };
}

