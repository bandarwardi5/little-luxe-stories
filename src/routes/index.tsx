import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import {
  useProducts,
  useCategories,
  useBanners,
  useHero,
} from "@/lib/firestore-hooks";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import heroKids from "@/assets/hero-kids.jpg";
import bannerBoys from "@/assets/banner-boys.jpg";
import bannerGirls from "@/assets/banner-girls.jpg";
import pageHeaderBaby from "@/assets/page-header-baby.jpg";
import { Truck, ShieldCheck, Tag, Headphones, Loader2 } from "lucide-react";
import { imageUrl } from "@/lib/firebase";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data: products, loading: productsLoading } = useProducts();
  const { data: categories, loading: categoriesLoading } = useCategories();
  const { data: banners, loading: bannersLoading } = useBanners();
  const { data: heroItems, loading: heroLoading } = useHero();
  const { t, tl, dir } = useLang();

  if (productsLoading || categoriesLoading || bannersLoading || heroLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const activeBanners = banners.filter(b => b.active !== false);

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />

      {/* Hero Slider */}
      <section className="container mx-auto px-4 py-6 font-ethno">
        <Carousel
          opts={{ loop: true }}
          plugins={[Autoplay({ delay: 5000 })]}
          className="w-full relative rounded-xl overflow-hidden group"
        >
          <CarouselContent className="ml-0">
            {heroItems.length > 0 ? (
              heroItems.map((item) => (
                <CarouselItem key={item.id} className="pl-0 relative min-h-[400px] md:min-h-[600px] flex items-center bg-secondary/20">
                  <img
                    src={imageUrl(item.image)}
                    alt={tl(item.title)}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-${dir === "rtl" ? "l" : "r"} from-white/90 via-white/40 to-transparent`}></div>
                  <div className="relative z-10 px-6 md:px-16 max-w-2xl ms-auto">
                    <p className="text-xs md:text-lg tracking-[0.2em] text-primary font-black mb-4 uppercase">
                      {tl(item.subtitle) || "NEW COLLECTION"}
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-8 text-foreground">
                      {tl(item.title)}
                    </h1>
                    {item.ctaText && (
                      <Link
                        to={item.ctaLink || "/shop"}
                        className="inline-flex items-center justify-center bg-primary text-primary-foreground px-10 py-5 rounded-xl font-black text-sm hover:scale-105 transition-transform shadow-xl shadow-primary/20"
                      >
                        {tl(item.ctaText)}
                      </Link>
                    )}
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="pl-0 relative min-h-[400px] md:min-h-[500px] flex items-center bg-banner-pink">
                <img
                  src={heroKids}
                  alt="Treemass Fashion"
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-white/80 via-white/40 to-transparent"></div>
                <div className="relative z-10 px-6 md:px-16 max-w-lg ml-auto text-right">
                  <p className="text-xs md:text-base tracking-widest text-primary font-bold mb-3 drop-shadow-sm">TREEMASS FASHION</p>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-foreground drop-shadow-md">
                    مجموعة ملابس الأطفال الجديدة
                  </h1>
                  <Link
                    to="/shop"
                    className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-md font-bold text-sm hover:scale-105 transition-transform shadow-lg"
                  >
                    تسوق التشكيلة كاملة
                  </Link>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <CarouselPrevious className="static translate-y-0 h-12 w-12 bg-white/80 hover:bg-white text-foreground pointer-events-auto" />
            <CarouselNext className="static translate-y-0 h-12 w-12 bg-white/80 hover:bg-white text-foreground pointer-events-auto" />
          </div>
        </Carousel>
      </section>

      {/* Categories */}
      <section className="relative px-4 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-banner-pink/50 to-transparent"></div>
        <div className="container mx-auto relative z-10">
          <p className="text-xs tracking-widest text-primary font-bold mb-2 text-center uppercase font-ethno">{t("home.categories.pretitle")}</p>
          <h2 className="text-3xl font-extrabold mb-10 text-center font-ethno">{t("home.categories.title")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((c) => {
              const catName = tl(c.name);
              return (
              <Link
                key={c.id}
                to="/shop"
                search={{ category: typeof c.name === "string" ? c.name : (c.name as any)?.ar || catName }}
                className={`${c.color || 'bg-white'} rounded-2xl p-4 md:p-6 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-white/50`}
              >
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/80 backdrop-blur-sm mb-4 grid place-items-center overflow-hidden shadow-sm">
                  <img src={imageUrl(c.image)} alt={catName} className="w-full h-full object-contain p-2 hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-extrabold text-base md:text-lg mb-1 text-foreground/90">{catName}</h3>
                <p className="text-[10px] md:text-xs font-semibold text-foreground/60 bg-white/40 px-3 py-1 rounded-full mt-2">{c.count || 0} {t("home.products_count")}</p>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="container mx-auto px-4 py-6 overflow-hidden">
        <div className="relative rounded-2xl overflow-hidden bg-banner-peach flex items-center min-h-[250px] md:min-h-[300px]">
          <img src={pageHeaderBaby} alt="عروض خاصة" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-white/90 via-white/40 to-transparent"></div>
          <div className="relative z-10 p-6 md:p-12 max-w-lg h-full flex flex-col justify-center ml-auto text-right">
            <span className="inline-block bg-primary text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full w-max mb-4 font-ethno">SPECIAL OFFER</span>
            <h2 className="text-xl md:text-4xl font-bold mb-4 font-ethno text-foreground drop-shadow-sm">خصومات تصل إلى 50% على ملابس الرضع</h2>
            <p className="text-xs md:text-base text-muted-foreground mb-6 font-medium">تشكيلة واسعة من ملابس الرضع المريحة والناعمة بأسعار لا تفوت. تسوق الآن قبل نفاذ الكمية!</p>
            <Link to="/shop" className="bg-foreground text-background px-6 py-3 rounded font-semibold text-sm w-max hover:bg-primary transition font-ethno shadow-md">
              اكتشف العروض
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Grid - Different from typical cards */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs tracking-widest text-primary font-bold mb-2">تنسيقات مميزة</p>
            <h2 className="text-2xl md:text-3xl font-bold">تشكيلات الموسم</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px] md:h-[500px]">
          <Link to="/shop" className="relative group overflow-hidden rounded-2xl md:col-span-2 md:row-span-2">
            <img src={heroKids} alt="تشكيلة الصيف" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <span className="bg-primary px-3 py-1 text-xs font-bold rounded-full mb-3 inline-block">الأكثر طلباً</span>
              <h3 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-md">تشكيلة العيد والصيف</h3>
              <p className="text-white/90 text-sm mb-4 max-w-md font-medium drop-shadow-sm">ألوان مبهجة وتصاميم مريحة تمنح طفلك حرية الحركة والأناقة في نفس الوقت.</p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold hover:underline">
                تسوق التشكيلة <span className="rotate-180">→</span>
              </span>
            </div>
          </Link>
          <Link to="/shop" className="relative group overflow-hidden rounded-2xl md:col-span-1">
            <img src={bannerBoys} alt="ملابس ولادي" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
              <h3 className="text-xl font-bold mb-2">كولكشن الأولاد</h3>
              <span className="border border-white px-4 py-2 text-xs font-medium rounded hover:bg-white hover:text-black transition">اكتشف الآن</span>
            </div>
          </Link>
          <Link to="/shop" className="relative group overflow-hidden rounded-2xl md:col-span-1">
            <img src={bannerGirls} alt="ملابس بناتي" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
              <h3 className="text-xl font-bold mb-2">فساتين البنات</h3>
              <span className="border border-white px-4 py-2 text-xs font-medium rounded hover:bg-white hover:text-black transition">اكتشف الآن</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Shop by Age - Minimal Design */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">تسوق حسب العمر</h2>
            <p className="text-muted-foreground">اختر الفئة العمرية المناسبة لطفلك للوصول السريع للمقاسات</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {[
              { age: "0 - 24", label: "أشهر", title: "حديثي الولادة", color: "bg-banner-peach" },
              { age: "2 - 5", label: "سنوات", title: "الأطفال الصغار", color: "bg-banner-pink" },
              { age: "6 - 10", label: "سنوات", title: "الأطفال", color: "bg-banner-mint" },
              { age: "11 - 14", label: "سنة", title: "المراهقين", color: "bg-secondary" },
            ].map((item, i) => (
              <Link key={i} to="/shop" className="group flex flex-col items-center w-32 md:w-40">
                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full ${item.color} flex flex-col items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-2`}>
                  <span className="text-2xl md:text-3xl font-black text-foreground/80">{item.age}</span>
                  <span className="text-xs font-medium text-foreground/60">{item.label}</span>
                </div>
                <h3 className="font-bold text-center group-hover:text-primary transition-colors">{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Offers */}
      <section className="relative px-4 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-banner-mint/30 via-white to-banner-peach/30"></div>
        <div className="container mx-auto relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div className="font-ethno text-right">
              <p className="text-xs tracking-widest text-primary font-bold mb-2">HOT OFFERS</p>
              <h2 className="text-2xl md:text-3xl font-extrabold">أقوى العروض</h2>
            </div>
            <Link to="/shop" className="text-xs md:text-sm font-bold bg-white px-4 md:px-6 py-2 rounded-full text-primary hover:bg-primary hover:text-white transition-colors shadow-sm font-ethno">VIEW ALL</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {products.filter(p => p.oldPrice).slice(0, 4).map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow p-1 md:p-2">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="bg-secondary/40 py-14 overflow-hidden">
        <div className="container mx-auto px-4">
          <p className="text-xs tracking-widest text-primary font-bold text-center mb-2 font-ethno uppercase">Trending</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-ethno">منتجاتنا الرائجة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Carousel */}
      <section className="container mx-auto px-4 py-14 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="font-ethno text-right">
            <p className="text-xs tracking-widest text-primary font-bold mb-2 uppercase">New Arrivals</p>
            <h2 className="text-xl md:text-3xl font-bold">وصل حديثاً</h2>
          </div>
          <Link to="/shop" className="text-xs md:text-sm font-medium text-primary hover:underline font-ethno">SHOP NOW</Link>
        </div>
        <div className="relative px-0 md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              direction: "rtl",
            }}
            className="w-full"
          >
            <CarouselContent>
              {[...products].reverse().map((p) => (
                <CarouselItem key={p.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 pl-2 md:pl-4">
                  <div className="p-0.5 md:p-1">
                    <ProductCard product={p} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -right-12 left-auto" />
            <CarouselNext className="hidden md:flex -left-12 right-auto" />
          </Carousel>
        </div>
      </section>

      {/* Features */}
      <section className="relative bg-primary text-primary-foreground py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-primary-foreground)_1px,_transparent_1px)] [background-size:24px_24px]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {[
              { icon: Truck, title: "شحن لجميع المدن", text: "لكل الطلبات فوق 500 ل.ت" },
              { icon: ShieldCheck, title: "ضمان استرجاع المال", text: "خلال 30 يومًا" },
              { icon: Tag, title: "عروض وتخفيضات", text: "أفضل الأسعار" },
              { icon: Headphones, title: "دعم 24/7", text: "تواصل معنا في أي وقت" },
            ].map((f) => (
              <div key={f.title} className="flex flex-col items-center text-center gap-4 group">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-colors duration-300">
                  <f.icon className="h-8 w-8 shrink-0" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base md:text-lg mb-1">{f.title}</h4>
                  <p className="text-sm text-primary-foreground/80">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/40 py-14">
        <div className="container mx-auto px-4">
          <p className="text-xs tracking-widest text-primary font-bold text-center mb-2 font-ethno uppercase">Testimonials</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-ethno">ماذا يقول عملاؤنا</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "نورة العتيبي", role: "أم لطفلين", text: "جودة ممتازة وأسعار مناسبة. ملابس مريحة جدًا لأطفالي وألوان رائعة." },
              { name: "محمد القحطاني", role: "أب", text: "خدمة سريعة وتغليف أنيق. أصبح متجري المفضل لكل احتياجات الأطفال." },
              { name: "هدى الزهراني", role: "زبونة دائمة", text: "تشكيلة واسعة وعصرية، وفريق دعم متعاون جدًا. أنصح به بشدة." },
            ].map((t) => (
              <div key={t.name} className="bg-card border rounded-lg p-6">
                <p className="text-sm leading-relaxed text-muted-foreground mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/15 grid place-items-center text-primary font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{t.name}</h4>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
