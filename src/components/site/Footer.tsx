import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/logo.jpg";
import newsletterBanner from "@/assets/banner.png";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useSettings } from "@/lib/firestore-hooks";
import { useLang } from "@/lib/i18n";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLang();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "newsletter"), { email, createdAt: serverTimestamp() });
      toast.success(t("newsletter.success"));
      setEmail("");
    } catch (error) {
      toast.error("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={newsletterBanner} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-white/60"></div>
      </div>

      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">{t("newsletter.title")}</h2>
        <p className="text-muted-foreground mb-8 font-medium">{t("newsletter.subtitle")}</p>
        <form
          onSubmit={handleSubscribe}
          className="max-w-xl mx-auto flex flex-col sm:flex-row rounded-md overflow-hidden border bg-background/90 backdrop-blur-sm shadow-xl"
        >
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("common.email")}
            className="flex-1 px-4 py-4 outline-none bg-transparent text-sm sm:text-base"
          />
          <button
            disabled={loading}
            className="bg-primary text-primary-foreground px-8 py-4 sm:py-0 font-bold text-sm sm:text-base hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "..." : t("common.subscribe")}
          </button>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  const { settings } = useSettings();
  const { t, dir, tl } = useLang();

  return (
    <footer className="bg-background border-t" dir={dir}>
      <Newsletter />
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 px-4 py-14">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="inline-block mb-4">
            <img src={logo} alt={settings?.siteName || "Treemass"} className="h-10 w-auto object-contain" />
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tl(settings?.siteDescription) || "Treemass"}
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-4">{t("footer.quick_links")}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about">{t("nav.about")}</Link></li>
            <li><Link to="/contact">{t("nav.contact")}</Link></li>
            <li><Link to="/blog">{t("nav.blog")}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">{t("footer.account")}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/account">{t("header.account")}</Link></li>
            <li><Link to="/cart">{t("header.cart")}</Link></li>
            <li><Link to="/faqs">{t("nav.faqs")}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">{t("footer.contact_us")}</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2 items-center"><MapPin className="h-4 w-4 text-primary shrink-0" /> {tl(settings?.address) || t("contact.address_value")}</li>
            <li className="flex gap-2 items-center"><Phone className="h-4 w-4 text-primary shrink-0" /> {settings?.contactPhone || "+90 507 022 2149"}</li>
            <li className="flex gap-2 items-center">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <a href={`mailto:${settings?.contactEmail || "info@treemass.com.tr"}`} className="hover:text-primary transition-colors">
                {settings?.contactEmail || "info@treemass.com.tr"}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-5 text-sm">
          <div className="flex items-center gap-3 text-muted-foreground w-full md:w-auto justify-center md:justify-start">
            <a href={settings?.facebook || "https://www.facebook.com/profile.php?id=61550770286748"} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-primary transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={settings?.instagram || "https://www.instagram.com/_treemass_"} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-primary transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://wa.me/905070222149" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="hover:text-primary transition-colors">
              {/* WhatsApp custom SVG */}
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.774 9.774 0 0 0-6.979-2.878c-5.43 0-9.854 4.37-9.858 9.8a9.673 9.673 0 0 0 1.503 5.176l-.99 3.616 3.72-.962zm10.749-6.395c-.3-.15-1.77-.875-2.045-.976-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.487-.892-.796-1.493-1.78-1.668-2.08-.175-.3-.018-.463.13-.611.134-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.589-.493-.51-.675-.52-.172-.007-.368-.009-.565-.009-.197 0-.518.074-.789.374-.27.3-1.03 1.01-1.03 2.46 0 1.45 1.05 2.85 1.196 3.05.147.2 2.07 3.16 5.01 4.43.7.3 1.25.48 1.67.61.7.22 1.34.19 1.85.11.57-.08 1.77-.72 2.025-1.425.25-.705.25-1.31.175-1.425-.075-.115-.275-.19-.575-.34z" />
              </svg>
            </a>
            {settings?.twitter && (
              <a href={settings.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            )}
          </div>
          <p className="text-xs text-muted-foreground w-full md:w-auto text-center">
            © {new Date().getFullYear()} {settings?.siteName || "Treemass"} - {t("footer.rights")}
          </p>
          <div className="text-[10px] md:text-xs text-muted-foreground font-ethno uppercase tracking-widest w-full md:w-auto text-center">VISA · MASTERCARD · MADA · APPLE PAY</div>
        </div>
      </div>
    </footer>
  );
}
