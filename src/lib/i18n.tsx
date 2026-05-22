import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "ar" | "tr" | "en";
export type Multilingual = string | { ar?: string; tr?: string; en?: string } | null | undefined;

const STORAGE_KEY = "lang";

const dict: Record<Lang, Record<string, string>> = {
  ar: {
    "nav.home": "الرئيسية",
    "nav.shop": "المتجر",
    "nav.offers": "أفضل العروض",
    "nav.about": "من نحن",
    "nav.contact": "اتصل بنا",
    "nav.blog": "المدونة",
    "nav.faqs": "الأسئلة الشائعة",
    "header.search": "ابحث عن منتج...",
    "header.account": "حسابي",
    "header.login": "دخول",
    "header.cart": "سلتي",
    "header.shipping_free": "شحن مجاني لجميع الطلبات!",
    "header.shipping_over": "شحن مجاني للطلبات فوق",
    "header.shop_now": "تسوق الآن",
    "header.today_offers": "عروض اليوم",
    "common.add_to_cart": "أضف إلى السلة",
    "common.view_all": "عرض الكل",
    "common.loading": "جاري التحميل...",
    "common.subscribe": "اشتراك",
    "common.email": "البريد الإلكتروني",
    "newsletter.title": "اشترك في النشرة البريدية",
    "newsletter.subtitle": "اشترك ليصلك جديد العروض والتخفيضات الحصرية على ملابس أطفالك",
    "newsletter.success": "تم الاشتراك بنجاح! شكراً لك.",
    "footer.quick_links": "روابط سريعة",
    "footer.account": "حسابك",
    "footer.contact_us": "تواصل معنا",
    "footer.rights": "جميع الحقوق محفوظة",
    "home.categories.pretitle": "Categories",
    "home.categories.title": "أقسامنا الرئيسية",
    "home.products_count": "منتجات",
    "home.trending.pretitle": "Trending",
    "home.trending.title": "منتجاتنا الرائجة",
    "home.new_arrivals": "وصل حديثاً",
    "home.hot_offers": "أقوى العروض",
    "home.shop_now": "SHOP NOW",
    "home.by_age": "تسوق حسب العمر",
    "home.collections": "تشكيلات الموسم",
    "shop.title": "Shop",
    "shop.all": "جميع المنتجات",
    "shop.by_category": "تصفح حسب القسم",
    "shop.showing": "عرض",
    "shop.of": "من",
    "shop.products": "منتجات",
    "cart.title": "سلة المشتريات",
    "cart.empty": "سلة مشترياتك فارغة",
    "cart.start_shopping": "ابدأ التسوق",
    "cart.summary": "ملخص الطلب",
    "cart.subtotal": "المجموع الفرعي",
    "cart.shipping": "رسوم الشحن",
    "cart.free": "مجاني",
    "cart.total": "الإجمالي",
    "cart.checkout": "إتمام الشراء",
    "cart.remove": "حذف",
    "cart.quantity": "الكمية",
    "product.in_stock": "متوفر في المخزن",
    "product.available": "قطعة متاحة",
    "product.related": "منتجات قد تنال إعجابك",
    "lang.label": "اللغة",
  },
  tr: {
    "nav.home": "Ana Sayfa",
    "nav.shop": "Mağaza",
    "nav.offers": "Fırsatlar",
    "nav.about": "Hakkımızda",
    "nav.contact": "İletişim",
    "nav.blog": "Blog",
    "nav.faqs": "SSS",
    "header.search": "Ürün ara...",
    "header.account": "Hesabım",
    "header.login": "Giriş",
    "header.cart": "Sepetim",
    "header.shipping_free": "Tüm siparişlerde ücretsiz kargo!",
    "header.shipping_over": "Şu tutarın üzerinde ücretsiz kargo:",
    "header.shop_now": "Şimdi alışveriş yap",
    "header.today_offers": "Günün fırsatları",
    "common.add_to_cart": "Sepete ekle",
    "common.view_all": "Tümünü gör",
    "common.loading": "Yükleniyor...",
    "common.subscribe": "Abone ol",
    "common.email": "E-posta",
    "newsletter.title": "Bültene abone olun",
    "newsletter.subtitle": "Çocuk giyimine özel teklif ve indirimlerden ilk siz haberdar olun",
    "newsletter.success": "Abone olundu! Teşekkürler.",
    "footer.quick_links": "Hızlı Bağlantılar",
    "footer.account": "Hesabınız",
    "footer.contact_us": "Bize Ulaşın",
    "footer.rights": "Tüm hakları saklıdır",
    "home.categories.pretitle": "Kategoriler",
    "home.categories.title": "Ana Kategorilerimiz",
    "home.products_count": "ürün",
    "home.trending.pretitle": "Trend",
    "home.trending.title": "Trend Ürünlerimiz",
    "home.new_arrivals": "Yeni Gelenler",
    "home.hot_offers": "Sıcak Fırsatlar",
    "home.shop_now": "ALIŞVERİŞE BAŞLA",
    "home.by_age": "Yaşa göre alışveriş",
    "home.collections": "Sezon Koleksiyonları",
    "shop.title": "Mağaza",
    "shop.all": "Tüm Ürünler",
    "shop.by_category": "Kategoriye göre",
    "shop.showing": "Gösterilen",
    "shop.of": "/",
    "shop.products": "ürün",
    "cart.title": "Sepetim",
    "cart.empty": "Sepetiniz boş",
    "cart.start_shopping": "Alışverişe başla",
    "cart.summary": "Sipariş özeti",
    "cart.subtotal": "Ara toplam",
    "cart.shipping": "Kargo",
    "cart.free": "Ücretsiz",
    "cart.total": "Toplam",
    "cart.checkout": "Ödeme",
    "cart.remove": "Sil",
    "cart.quantity": "Adet",
    "product.in_stock": "Stokta",
    "product.available": "adet mevcut",
    "product.related": "Beğenebileceğiniz ürünler",
    "lang.label": "Dil",
  },
  en: {
    "nav.home": "Home",
    "nav.shop": "Shop",
    "nav.offers": "Offers",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.blog": "Blog",
    "nav.faqs": "FAQs",
    "header.search": "Search products...",
    "header.account": "Account",
    "header.login": "Login",
    "header.cart": "Cart",
    "header.shipping_free": "Free shipping on all orders!",
    "header.shipping_over": "Free shipping on orders over",
    "header.shop_now": "Shop now",
    "header.today_offers": "Today's offers",
    "common.add_to_cart": "Add to cart",
    "common.view_all": "View all",
    "common.loading": "Loading...",
    "common.subscribe": "Subscribe",
    "common.email": "Email",
    "newsletter.title": "Subscribe to our newsletter",
    "newsletter.subtitle": "Get exclusive offers and discounts on kids fashion",
    "newsletter.success": "Subscribed! Thank you.",
    "footer.quick_links": "Quick Links",
    "footer.account": "Your Account",
    "footer.contact_us": "Contact Us",
    "footer.rights": "All rights reserved",
    "home.categories.pretitle": "Categories",
    "home.categories.title": "Our Main Categories",
    "home.products_count": "products",
    "home.trending.pretitle": "Trending",
    "home.trending.title": "Our Trending Products",
    "home.new_arrivals": "New Arrivals",
    "home.hot_offers": "Hot Offers",
    "home.shop_now": "SHOP NOW",
    "home.by_age": "Shop by age",
    "home.collections": "Season Collections",
    "shop.title": "Shop",
    "shop.all": "All Products",
    "shop.by_category": "Browse by category",
    "shop.showing": "Showing",
    "shop.of": "of",
    "shop.products": "products",
    "cart.title": "Cart",
    "cart.empty": "Your cart is empty",
    "cart.start_shopping": "Start shopping",
    "cart.summary": "Order summary",
    "cart.subtotal": "Subtotal",
    "cart.shipping": "Shipping",
    "cart.free": "Free",
    "cart.total": "Total",
    "cart.checkout": "Checkout",
    "cart.remove": "Remove",
    "cart.quantity": "Quantity",
    "product.in_stock": "In stock",
    "product.available": "items available",
    "product.related": "You may also like",
    "lang.label": "Language",
  },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  tl: (value: Multilingual) => string;
  dir: "rtl" | "ltr";
};

const LangCtx = createContext<Ctx | null>(null);

export function tl(value: Multilingual, lang: Lang = "ar"): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.ar || value.en || value.tr || "";
}

export function LanguageProvider({ children, defaultLang = "ar" }: { children: ReactNode; defaultLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return defaultLang;
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    return stored || defaultLang;
  });

  const dir: "rtl" | "ltr" = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    }
  }, [lang, dir]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, l);
  };

  const t = (key: string) => dict[lang][key] ?? dict.ar[key] ?? key;
  const tlFn = (v: Multilingual) => tl(v, lang);

  return (
    <LangCtx.Provider value={{ lang, setLang, t, tl: tlFn, dir }}>
      {children}
    </LangCtx.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be inside LanguageProvider");
  return ctx;
}
