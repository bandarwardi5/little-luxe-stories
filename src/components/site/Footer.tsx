import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/logo.jpg";
import newsletterBanner from "@/assets/banner.png";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useSettings } from "@/lib/firestore-hooks";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "newsletter"), {
        email,
        createdAt: serverTimestamp(),
      });
      toast.success("تم الاشتراك بنجاح! شكراً لك.");
      setEmail("");
    } catch (error) {
      toast.error("حدث خطأ، يرجى المحاولة لاحقاً");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={newsletterBanner} 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/60"></div>
      </div>

      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">اشترك في النشرة البريدية</h2>
        <p className="text-muted-foreground mb-8 font-medium">
          اشترك ليصلك جديد العروض والتخفيضات الحصرية على ملابس أطفالك
        </p>
        <form 
          onSubmit={handleSubscribe}
          className="max-w-xl mx-auto flex flex-col sm:flex-row rounded-md overflow-hidden border bg-background/90 backdrop-blur-sm shadow-xl"
        >
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="البريد الإلكتروني"
            className="flex-1 px-4 py-4 outline-none bg-transparent text-sm sm:text-base"
          />
          <button 
            disabled={loading}
            className="bg-primary text-primary-foreground px-8 py-4 sm:py-0 font-bold text-sm sm:text-base hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "جاري..." : "اشتراك"}
          </button>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-background border-t">
      <Newsletter />
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 px-4 py-14 text-right" dir="rtl">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="inline-block mb-4">
            <img src={logo} alt={settings?.siteName || "Treemass"} className="h-10 w-auto object-contain" />
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {settings?.siteDescription || "مرحباً بكم في Treemass، حيث نفخر بتقديم منتجات مميزة وخدمة عملاء استثنائية."}
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-4">روابط سريعة</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about">من نحن</Link></li>
            <li><Link to="/contact">اتصل بنا</Link></li>
            <li><Link to="/blog">المدونة</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">حسابك</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop">دعم المنتجات</Link></li>
            <li><Link to="/shop">الدفع</Link></li>
            <li><Link to="/shop">سياسة الترخيص</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">تواصل معنا</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2 items-center"><MapPin className="h-4 w-4 text-primary shrink-0" /> {settings?.address || "إسطنبول، تركيا"}</li>
            <li className="flex gap-2 items-center"><Phone className="h-4 w-4 text-primary shrink-0" /> {settings?.contactPhone || "+90 507 022 2149"}</li>
            <li className="flex gap-2 items-center"><Mail className="h-4 w-4 text-primary shrink-0" /> {settings?.contactEmail || "treemass4a@gmail.com"}</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-5 text-sm">
          <div className="flex items-center gap-3 text-muted-foreground w-full md:w-auto justify-center md:justify-start">
            {settings?.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook className="h-4 w-4" /></a>}
            {settings?.twitter && <a href={settings.twitter} target="_blank" rel="noreferrer" aria-label="Twitter"><Twitter className="h-4 w-4" /></a>}
            {settings?.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>}
            <a href="#" aria-label="Youtube"><Youtube className="h-4 w-4" /></a>
          </div>
          <p className="text-xs text-muted-foreground w-full md:w-auto text-center md:text-right">
            © {new Date().getFullYear()} {settings?.siteName || "Treemass"} - جميع الحقوق محفوظة
          </p>
          <div className="text-[10px] md:text-xs text-muted-foreground font-ethno uppercase tracking-widest w-full md:w-auto text-center md:text-right">VISA · MASTERCARD · MADA · APPLE PAY</div>
        </div>
      </div>
    </footer>
  );
}
