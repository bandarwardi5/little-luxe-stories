import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/logo.jpg";
import newsletterBanner from "@/assets/banner.png";

export function Newsletter() {
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
        <form className="max-w-xl mx-auto flex flex-col sm:flex-row rounded-md overflow-hidden border bg-background/90 backdrop-blur-sm shadow-xl">
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            className="flex-1 px-4 py-4 outline-none bg-transparent text-sm sm:text-base"
          />
          <button className="bg-primary text-primary-foreground px-8 py-4 sm:py-0 font-bold text-sm sm:text-base hover:bg-primary/90 transition-colors">
            اشتراك
          </button>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <Newsletter />
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 px-4 py-14">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="inline-block mb-4">
            <img src={logo} alt="Treemass" className="h-10 w-auto object-contain" />
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            مرحبًا بكم في Treemass، حيث نفخر بتقديم منتجات مميزة وخدمة عملاء استثنائية لكل من يقدر الجودة والأناقة لأطفاله.
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-4">روابط سريعة</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about">من نحن</Link></li>
            <li><Link to="/contact">اتصل بنا</Link></li>
            <li><Link to="/blog">المدونة</Link></li>
            <li><Link to="/shop">الشحن</Link></li>
            <li><Link to="/shop">الدفع</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">حسابك</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop">دعم المنتجات</Link></li>
            <li><Link to="/shop">الدفع</Link></li>
            <li><Link to="/shop">سياسة الترخيص</Link></li>
            <li><Link to="/shop">المتابعة</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">تواصل معنا</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" /> إسطنبول، تركيا</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" /> ‎+90 507 022 2149</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary shrink-0" /> treemass4a@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-5 text-sm">
          <div className="flex items-center gap-3 text-muted-foreground w-full md:w-auto justify-center md:justify-start">
            <a href="#" aria-label="Facebook"><Facebook className="h-4 w-4" /></a>
            <a href="#" aria-label="Twitter"><Twitter className="h-4 w-4" /></a>
            <a href="#" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Youtube"><Youtube className="h-4 w-4" /></a>
          </div>
          <p className="text-xs text-muted-foreground w-full md:w-auto text-center md:text-right">© 2026 Treemass - جميع الحقوق محفوظة</p>
          <div className="text-[10px] md:text-xs text-muted-foreground font-ethno uppercase tracking-widest w-full md:w-auto text-center md:text-right">VISA · MASTERCARD · MADA · APPLE PAY</div>
        </div>
      </div>
    </footer>
  );
}
