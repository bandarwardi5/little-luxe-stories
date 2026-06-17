import { Link, useNavigate } from "@tanstack/react-router";
import { Search, User, Heart, ShoppingBag, Sparkles, Menu, X } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useSettings } from "@/lib/firestore-hooks";
import { useLang, getLocalizedCurrency } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { useAuth } from "@/lib/auth-context";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { count: cartCount, total: cartTotal } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { settings } = useSettings();
  const { t, dir, lang } = useLang();
  const { user, firebaseUser } = useAuth();
  
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/shop",
      search: {
        search: searchQuery || undefined,
        category: undefined,
      }
    });
  };

  const currency = getLocalizedCurrency(settings?.currency, lang);

  const isUserLoggedIn = !!firebaseUser;
  const userDisplayName = user?.displayName || firebaseUser?.displayName || t("header.account");

  return (
    <header className="w-full relative" dir={dir}>
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-xs">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2">
          <p className="text-center sm:text-start w-full sm:w-auto">
            {settings?.shippingFee === 0
              ? t("header.shipping_free")
              : `${t("header.shipping_over")} ${settings?.freeShippingThreshold || 500} ${currency}`}
            {" "}
            <Link to="/shop" className="underline font-semibold">{t("header.shop_now")}</Link>
          </p>
          <nav className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1 w-full sm:w-auto">
            <Link to="/about">{t("nav.about")}</Link>
            <Link to="/contact">{t("nav.contact")}</Link>
            <LanguageSwitcher compact />
          </nav>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b overflow-hidden bg-background">
        <div className="container mx-auto flex items-center justify-between gap-4 md:gap-6 px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-1 hover:bg-secondary rounded-md transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img src={logo} alt={settings?.siteName || "Treemass"} className="h-10 md:h-12 w-auto object-contain" />
            </Link>
          </div>

          <form onSubmit={handleSearch} className="flex-1 hidden md:flex items-center rounded-full border border-secondary/80 bg-secondary/20 hover:border-primary/50 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300 overflow-hidden h-12 shadow-sm">
            <input
              placeholder={t("header.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent px-6 text-sm outline-none border-none placeholder:text-muted-foreground/60 text-start"
            />
            <button type="submit" className="bg-primary hover:bg-primary/95 text-primary-foreground px-6 h-full flex items-center justify-center transition-colors cursor-pointer shrink-0">
              <Search className="h-4 w-4" />
            </button>
          </form>

          <div className="flex items-center gap-3 sm:gap-5 text-sm shrink-0">
            <Link to={isUserLoggedIn ? "/account" : "/login"} className="flex items-center gap-2 hover:text-primary transition-colors">
              <User className="h-5 w-5" />
              <span className="hidden sm:flex flex-col leading-tight">
                <span className="text-xs text-muted-foreground font-cairo line-clamp-1 max-w-[100px]">
                  {isUserLoggedIn ? t("header.account") : t("header.login")}
                </span>
                <span className="font-bold line-clamp-1 max-w-[100px]">{userDisplayName}</span>
              </span>
            </Link>
            <Link to="/wishlist" className="relative hover:text-primary transition-colors group">
              <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -end-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 grid place-items-center animate-in zoom-in">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="flex items-center gap-2 hover:text-primary transition-colors group">
              <div className="relative">
                <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -end-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 grid place-items-center animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:flex flex-col leading-tight">
                <span className="text-xs text-muted-foreground font-cairo">{cartTotal} {currency}</span>
                <span className="font-bold">{t("header.cart")}</span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="border-b overflow-hidden hidden md:block">
        <div className="container mx-auto flex flex-nowrap items-center justify-between gap-4 px-4 py-3 text-sm overflow-x-auto scrollbar-hide">
          <nav className="flex flex-nowrap items-center gap-4 md:gap-6 font-semibold whitespace-nowrap">
            <Link to="/" activeProps={{ className: "text-primary" }} className="hover:text-primary transition-colors">{t("nav.home")}</Link>
            <Link to="/shop" activeProps={{ className: "text-primary" }} className="hover:text-primary transition-colors">{t("nav.shop")}</Link>
            <Link to="/offers" activeProps={{ className: "text-primary" }} className="hover:text-primary transition-colors">{t("nav.offers")}</Link>
          </nav>
          <Link to="/offers" className="flex items-center gap-2 text-primary font-semibold hover:opacity-80 transition-opacity">
            <Sparkles className="h-4 w-4" /> {t("header.today_offers")}
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Sidebar Content */}
      <div className={`fixed top-0 ${dir === "rtl" ? "right-0" : "left-0"} bottom-0 w-[280px] bg-background z-[101] shadow-2xl transition-transform duration-300 transform md:hidden ${isMenuOpen ? "translate-x-0" : dir === "rtl" ? "translate-x-full" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <img src={logo} alt="Treemass" className="h-8 w-auto object-contain" />
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 border-b">
            <form onSubmit={handleSearch} className="flex items-center rounded-full border border-secondary/80 bg-secondary/20 hover:border-primary/50 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300 overflow-hidden h-11 shadow-sm">
              <input 
                placeholder={t("header.search")} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none border-none placeholder:text-muted-foreground/60 text-start" 
              />
              <button type="submit" className="bg-primary hover:bg-primary/95 text-primary-foreground px-5 h-full flex items-center justify-center transition-colors cursor-pointer shrink-0">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
              {[
                { to: "/", label: t("nav.home") },
                { to: "/shop", label: t("nav.shop") },
                { to: "/offers", label: t("nav.offers") },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-secondary font-semibold transition-colors"
                    activeProps={{ className: "text-primary bg-primary/5" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-8 border-t px-4 space-y-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("lang.label")}</h4>
              <LanguageSwitcher />
              <ul className="space-y-3 text-sm pt-4">
                <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>{t("nav.about")}</Link></li>
                <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>{t("nav.contact")}</Link></li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
