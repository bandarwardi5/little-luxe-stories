import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { toast } from "sonner";

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
};

type Ctx = {
  items: WishlistItem[];
  has: (id: string) => boolean;
  toggle: (item: WishlistItem) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const WCtx = createContext<Ctx | null>(null);
const KEY = "treemass_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const has = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  const toggle = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === item.id)) {
        toast.success("تمت الإزالة من المفضلة");
        return prev.filter((p) => p.id !== item.id);
      }
      toast.success("تمت الإضافة إلى المفضلة");
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return (
    <WCtx.Provider value={{ items, has, toggle, remove, clear }}>{children}</WCtx.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WCtx);
  if (!ctx) throw new Error("useWishlist must be inside WishlistProvider");
  return ctx;
}
