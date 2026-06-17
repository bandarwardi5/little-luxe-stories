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
import { Truck, ShieldCheck, Tag, Headphones, Loader2, Leaf, Sparkles, Heart } from "lucide-react";
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
  const { settings } = useSettings();
  const { t, tl, dir, lang } = useLang();


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
      <section className="w-full font-ethno">
        <Carousel
          opts={{ loop: true }}
          plugins={[Autoplay({ delay: 5000 })]}
          className="w-full relative overflow-hidden group"
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
                  <div className="relative z-10 px-6 md:px-16 max-w-2xl me-auto text-start">
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
                <div className={`absolute inset-0 bg-gradient-to-${dir === "rtl" ? "l" : "r"} from-white/80 via-white/40 to-transparent`}></div>
                <div className="relative z-10 px-6 md:px-16 max-w-lg me-auto text-start">
                  <p className="text-xs md:text-base tracking-widest text-primary font-bold mb-3 drop-shadow-sm">TREEMASS FASHION</p>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-foreground drop-shadow-md">
                    {t("home.hero.title")}
                  </h1>
                  <Link
                    to="/shop"
                    className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-md font-bold text-sm hover:scale-105 transition-transform shadow-lg"
                  >
                    {t("home.hero.cta")}
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
              const categoryProductsCount = products.filter(p => {
                const pCat = tl(p.category);
                return pCat === catName || (typeof p.category === 'string' && p.category === (typeof c.name === 'string' ? c.name : (c.name as any)?.ar));
              }).length;
              
              return (
                <Link
                  key={c.id}
                  to="/shop"
                  search={{ category: typeof c.name === "string" ? c.name : (c.name as any)?.ar || catName }}
                  className="group relative rounded-3xl overflow-hidden flex flex-col bg-[#FFF2F2] border border-rose-100/40 hover:shadow-2xl hover:shadow-rose-100/60 hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="aspect-[4/5] w-full overflow-hidden bg-white">
                    <img src={imageUrl(c.image)} alt={catName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-extrabold text-base md:text-lg mb-2 text-foreground/90 transition-colors group-hover:text-primary">{catName}</h3>
                    <p className="inline-block text-[10px] md:text-xs font-semibold text-primary bg-white px-4 py-1.5 rounded-full shadow-sm border border-rose-50/50">{categoryProductsCount} {t("home.products_count")}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* New Arrivals Carousel */}
      <section className="container mx-auto px-4 py-14 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="font-ethno text-right">
            <p className="text-xs tracking-widest text-primary font-bold mb-2 uppercase">New Arrivals</p>
            <h2 className="text-xl md:text-3xl font-bold">{t("home.new_arrivals")}</h2>
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

      {/* Offers */}
      <section className="relative px-4 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-banner-mint/30 via-white to-banner-peach/30"></div>
        <div className="container mx-auto relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div className="font-ethno text-right">
              <p className="text-xs tracking-widest text-primary font-bold mb-2">HOT OFFERS</p>
              <h2 className="text-2xl md:text-3xl font-extrabold">{t("home.hot_offers")}</h2>
            </div>
            <Link to="/shop" className="text-xs md:text-sm font-bold bg-white px-4 md:px-6 py-2 rounded-full text-primary hover:bg-primary hover:text-white transition-colors shadow-sm font-ethno">VIEW ALL</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {products.filter(p => p.oldPrice).slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="bg-secondary/40 py-14 overflow-hidden">
        <div className="container mx-auto px-4">
          <p className="text-xs tracking-widest text-primary font-bold text-center mb-2 font-ethno uppercase">Trending</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-ethno">{t("home.trending.title")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Colorful Brand Values Strip */}
      <section className="relative overflow-hidden py-14 bg-foreground text-background">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_var(--color-primary)_0%,_transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,_var(--color-banner-mint)_0%,_transparent_50%)]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-3 gap-10 text-center">
            {[
              { icon: Leaf, title: t("home.values.val1.title"), text: t("home.values.val1.desc"), color: "text-emerald-400" },
              { icon: Sparkles, title: t("home.values.val2.title"), text: t("home.values.val2.desc"), color: "text-amber-400" },
              { icon: Heart, title: t("home.values.val3.title"), text: t("home.values.val3.desc"), color: "text-rose-400" },
            ].map((v) => (
              <div key={v.title} className="flex flex-col items-center group">
                <div className={`w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-500 ${v.color}`}>
                  <v.icon className="w-10 h-10" strokeWidth={1.5} />
                </div>
                <h3 className="font-ethno font-black text-xl mb-2">{v.title}</h3>
                <p className="text-background/70 text-sm max-w-xs">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="container mx-auto px-4 py-6 overflow-hidden">
        <div className="relative rounded-2xl overflow-hidden bg-banner-peach flex items-center min-h-[250px] md:min-h-[300px]">
          <img src={pageHeaderBaby} alt="عروض خاصة" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-white/90 via-white/40 to-transparent"></div>
          <div className="relative z-10 p-6 md:p-12 max-w-lg h-full flex flex-col justify-center ml-auto text-right">
            <span className="inline-block bg-primary text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full w-max mb-4 font-ethno">{t("home.promo.badge")}</span>
            <h2 className="text-xl md:text-4xl font-bold mb-4 font-ethno text-foreground drop-shadow-sm">{t("home.promo.title")}</h2>
            <p className="text-xs md:text-base text-muted-foreground mb-6 font-medium">{t("home.promo.desc")}</p>
            <Link to="/shop" className="bg-foreground text-background px-6 py-3 rounded font-semibold text-sm w-max hover:bg-primary transition font-ethno shadow-md">
              {t("home.promo.cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Grid - Different from typical cards */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs tracking-widest text-primary font-bold mb-2">{t("home.collections.pretitle")}</p>
            <h2 className="text-2xl md:text-3xl font-bold">{t("home.collections")}</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px] md:h-[500px]">
          <Link to="/shop" className="relative group overflow-hidden rounded-2xl md:col-span-2 md:row-span-2">
            <img src={heroKids} alt={t("home.collections.summer.title")} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <span className="bg-primary px-3 py-1 text-xs font-bold rounded-full mb-3 inline-block">{t("home.collections.badge")}</span>
              <h3 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-md">{t("home.collections.summer.title")}</h3>
              <p className="text-white/90 text-sm mb-4 max-w-md font-medium drop-shadow-sm">{t("home.collections.summer.desc")}</p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold hover:underline">
                {t("home.collections.shop")} <span className="rotate-180">→</span>
              </span>
            </div>
          </Link>
          <Link to="/shop" className="relative group overflow-hidden rounded-2xl md:col-span-1">
            <img src={bannerBoys} alt={t("home.collections.boys.title")} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
              <h3 className="text-xl font-bold mb-2">{t("home.collections.boys.title")}</h3>
              <span className="border border-white px-4 py-2 text-xs font-medium rounded hover:bg-white hover:text-black transition">{t("home.collections.discover")}</span>
            </div>
          </Link>
          <Link to="/shop" className="relative group overflow-hidden rounded-2xl md:col-span-1">
            <img src={bannerGirls} alt={t("home.collections.girls.title")} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
              <h3 className="text-xl font-bold mb-2">{t("home.collections.girls.title")}</h3>
              <span className="border border-white px-4 py-2 text-xs font-medium rounded hover:bg-white hover:text-black transition">{t("home.collections.discover")}</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Shop by Age - Colorful Design */}
      {/* <section className="relative py-20 overflow-hidden bg-gradient-to-br from-banner-peach/40 via-white to-banner-mint/40">
        <div className="absolute -top-20 -start-20 w-80 h-80 rounded-full bg-banner-pink/60 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -end-20 w-96 h-96 rounded-full bg-banner-mint/50 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 start-1/2 w-2 h-2 rounded-full bg-primary/20 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <span className="inline-block bg-primary/10 text-primary text-[10px] tracking-[0.3em] font-black px-4 py-1.5 rounded-full mb-4 font-ethno uppercase">By Age</span>
            <h2 className="text-3xl md:text-5xl font-black mb-3 font-ethno">{t("home.by_age")}</h2>
            <p className="text-muted-foreground text-sm md:text-base">اختر الفئة العمرية المناسبة لطفلك للوصول السريع للمقاسات</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { age: "0 - 24", label: "أشهر", title: "حديثي الولادة", color: "from-rose-200 to-rose-100", dot: "bg-rose-400" },
              { age: "2 - 5", label: "سنوات", title: "الأطفال الصغار", color: "from-amber-200 to-amber-100", dot: "bg-amber-400" },
              { age: "6 - 10", label: "سنوات", title: "الأطفال", color: "from-emerald-200 to-emerald-100", dot: "bg-emerald-400" },
              { age: "11 - 14", label: "سنة", title: "المراهقين", color: "from-sky-200 to-sky-100", dot: "bg-sky-400" },
            ].map((item, i) => (
              <Link key={i} to="/shop" className="group relative bg-white rounded-3xl p-6 md:p-8 text-center shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-3xl opacity-50 group-hover:opacity-80 transition-opacity`}></div>
                <div className="relative z-10">
                  <div className={`w-3 h-3 ${item.dot} rounded-full mx-auto mb-4 group-hover:scale-150 transition-transform`}></div>
                  <div className="text-3xl md:text-5xl font-black text-foreground mb-1">{item.age}</div>
                  <div className="text-xs font-bold text-foreground/60 mb-4 uppercase tracking-widest">{item.label}</div>
                  <h3 className="font-extrabold text-base md:text-lg group-hover:text-primary transition-colors">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section> */}


      {/* Features */}
      <section className="relative bg-primary text-primary-foreground py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-primary-foreground)_1px,_transparent_1px)] [background-size:24px_24px]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {[
              { icon: Truck, title: t("home.features.feat1.title"), text: t("home.features.feat1.desc") },
              { icon: ShieldCheck, title: t("home.features.feat2.title"), text: t("home.features.feat2.desc") },
              { icon: Tag, title: t("home.features.feat3.title"), text: t("home.features.feat3.desc") },
              { icon: Headphones, title: t("home.features.feat4.title"), text: t("home.features.feat4.desc") },
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
      <section className="bg-gradient-to-br from-banner-pink via-white to-banner-mint py-16">
        <div className="container mx-auto px-4">
          <p className="text-xs tracking-widest text-primary font-bold text-center mb-2 font-ethno uppercase">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12 font-ethno">{t("home.testimonials.title")}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: t("home.testimonials.client1.name"), role: t("home.testimonials.client1.role"), text: t("home.testimonials.client1.text"), color: "from-rose-100 to-pink-50" },
              { name: t("home.testimonials.client2.name"), role: t("home.testimonials.client2.role"), text: t("home.testimonials.client2.text"), color: "from-amber-100 to-orange-50" },
              { name: t("home.testimonials.client3.name"), role: t("home.testimonials.client3.role"), text: t("home.testimonials.client3.text"), color: "from-emerald-100 to-teal-50" },
            ].map((tt) => (
              <div key={tt.name} className={`bg-gradient-to-br ${tt.color} border border-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow`}>
                <div className="text-5xl text-primary/30 mb-3 leading-none">"</div>
                <p className="text-sm leading-relaxed text-foreground/80 mb-6">{tt.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary text-white grid place-items-center font-black text-lg shadow-md">
                    {tt.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black">{tt.name}</h4>
                    <p className="text-xs text-muted-foreground">{tt.role}</p>
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
