import { Link } from "@tanstack/react-router";
import { Search, User, Heart, ShoppingBag, Sparkles, Menu, X } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full relative">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-xs">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2">
          <p className="text-center sm:text-right w-full sm:w-auto">
            شحن مجاني لجميع الطلبات فوق 500 ل.ت{" "}
            <Link to="/shop" className="underline font-semibold">تسوق الآن</Link>
          </p>
          <nav className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1 w-full sm:w-auto">
            <Link to="/about">من نحن</Link>
            <Link to="/blog">المدونة</Link>
            <Link to="/contact">اتصل بنا</Link>
            <Link to="/faqs">الأسئلة الشائعة</Link>
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
              <img src={logo} alt="Treemass" className="h-10 md:h-12 w-auto object-contain" />
            </Link>
          </div>

          <div className="flex-1 hidden md:flex items-stretch rounded-md border bg-secondary overflow-hidden">
            <select className="bg-secondary px-3 text-sm border-l outline-none">
              <option>كل الأقسام</option>
              <option>أولاد</option>
              <option>بنات</option>
              <option>رضع</option>
              <option>أحذية</option>
            </select>
            <input
              placeholder="ابحث عن منتج..."
              className="flex-1 bg-transparent px-3 text-sm outline-none"
            />
            <button className="bg-primary text-primary-foreground px-4">
              <Search className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 text-sm shrink-0">
            <Link to="/login" className="flex items-center gap-2 hover:text-primary transition-colors">
              <User className="h-5 w-5" />
              <span className="hidden sm:flex flex-col leading-tight text-right">
                <span className="text-xs text-muted-foreground">تسجيل الدخول</span>
                <span className="font-semibold">حسابي</span>
              </span>
            </Link>
            <Link to="/wishlist" className="relative hover:text-primary transition-colors">
              <Heart className="h-5 w-5" />
              <span className="absolute -top-2 -left-2 bg-primary text-primary-foreground text-[10px] rounded-full h-4 w-4 grid place-items-center">0</span>
            </Link>
            <Link to="/cart" className="flex items-center gap-2 hover:text-primary transition-colors">
              <div className="relative">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-2 -left-2 bg-primary text-primary-foreground text-[10px] rounded-full h-4 w-4 grid place-items-center">0</span>
              </div>
              <span className="hidden sm:flex flex-col leading-tight text-right">
                <span className="text-xs text-muted-foreground">0.00 ل.ت</span>
                <span className="font-semibold">سلتي</span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="border-b overflow-hidden hidden md:block">
        <div className="container mx-auto flex flex-nowrap items-center justify-between gap-4 px-4 py-3 text-sm overflow-x-auto scrollbar-hide">
          <nav className="flex flex-nowrap items-center gap-4 md:gap-6 font-semibold whitespace-nowrap">
            <Link to="/" activeProps={{ className: "text-primary" }} className="hover:text-primary transition-colors">الرئيسية</Link>
            <Link to="/shop" activeProps={{ className: "text-primary" }} className="hover:text-primary transition-colors">المتجر</Link>
            <Link to="/shop" className="flex items-center gap-1 hover:text-primary transition-colors">
              الأقسام
              <span className="bg-emerald-500 text-white text-[10px] px-1.5 rounded">تخفيض</span>
            </Link>
            <Link to="/shop" className="flex items-center gap-1 hover:text-primary transition-colors">
              المنتجات
              <span className="bg-primary text-primary-foreground text-[10px] px-1.5 rounded">جديد</span>
            </Link>
            <Link to="/offers" activeProps={{ className: "text-primary" }} className="hover:text-primary transition-colors">أفضل العروض</Link>
          </nav>
          <Link to="/offers" className="flex items-center gap-2 text-primary font-semibold hover:opacity-80 transition-opacity">
            <Sparkles className="h-4 w-4" /> عروض اليوم
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Sidebar Content */}
      <div className={`fixed top-0 right-0 bottom-0 w-[280px] bg-background z-[101] shadow-2xl transition-transform duration-300 transform md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
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
            <div className="flex items-stretch rounded-md border bg-secondary overflow-hidden">
              <input
                placeholder="ابحث عن منتج..."
                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
              />
              <button className="bg-primary text-primary-foreground px-3">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
              <li>
                <Link 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-secondary font-semibold transition-colors"
                  activeProps={{ className: "text-primary bg-primary/5" }}
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-secondary font-semibold transition-colors"
                  activeProps={{ className: "text-primary bg-primary/5" }}
                >
                  المتجر
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-secondary font-semibold transition-colors"
                >
                  <span>الأقسام</span>
                  <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded">تخفيض</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-secondary font-semibold transition-colors"
                >
                  <span>المنتجات</span>
                  <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded">جديد</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/offers" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-secondary font-semibold transition-colors"
                  activeProps={{ className: "text-primary bg-primary/5" }}
                >
                  أفضل العروض
                </Link>
              </li>
              <li>
                <Link 
                  to="/offers" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-primary hover:bg-primary/5 font-bold transition-colors"
                >
                  <Sparkles className="h-4 w-4" /> عروض اليوم
                </Link>
              </li>
            </ul>

            <div className="mt-8 pt-8 border-t px-4 space-y-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">المزيد</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>من نحن</Link></li>
                <li><Link to="/blog" onClick={() => setIsMenuOpen(false)}>المدونة</Link></li>
                <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>اتصل بنا</Link></li>
                <li><Link to="/faqs" onClick={() => setIsMenuOpen(false)}>الأسئلة الشائعة</Link></li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
