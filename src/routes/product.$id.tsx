import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { useProduct, useProducts, useSettings } from "@/lib/firestore-hooks";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { Heart, Minus, Plus, Loader2, ShoppingBag, CheckCircle2 } from "lucide-react";
import { imageUrl } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { useLang, getLocalizedCurrency } from "@/lib/i18n";
import { toast } from "sonner";
// @ts-ignore
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';


export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
  head: () => ({
    meta: [
      { title: "منتج | Treemass" },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">المنتج غير موجود</h1>
        <Link to="/shop" className="text-primary font-ethno uppercase">Back to shop</Link>
      </div>
    </div>
  ),
});

function ProductPage() {
  const { id } = Route.useParams();
  const { product, loading } = useProduct(id);
  const { data: allProducts, loading: productsLoading } = useProducts();
  const { settings } = useSettings();
  const { add: addToCart } = useCart();
  const { toggle: toggleWishlist, has: isInWishlist } = useWishlist();
  const { t, tl, dir, lang } = useLang();
  
  const [qty, setQty] = useState(1);
  const [activeMediaType, setActiveMediaType] = useState<"image" | "video">("image");
  const [activeMediaUrl, setActiveMediaUrl] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);

  // Derive colors from variations
  const availableColors = product?.variations?.map(v => v.color) || [];
  
  const activeColorVariation = product?.variations?.find(v => tl(v.color) === selectedColor);
  const availableSizesForColor = activeColorVariation?.sizes?.map(s => s.size) || [];
  const selectedSizeDetail = activeColorVariation?.sizes?.find(s => s.size === selectedSize);

  const availableStock = (() => {
    if (selectedSizeDetail) {
      return Number(selectedSizeDetail.stock) || 0;
    }
    if (activeColorVariation) {
      return activeColorVariation.sizes?.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0) ?? 0;
    }
    return product?.inStock || 0;
  })();

  useEffect(() => {
    if (product) {
      const defaultImage = product.image || product.variations?.[0]?.images?.[0] || "";
      setActiveMediaUrl(defaultImage);
      setActiveMediaType("image");
      
      const firstVar = product.variations?.[0];
      if (firstVar) {
        const colorName = tl(firstVar.color);
        setSelectedColor(colorName);
        const firstSize = firstVar.sizes?.[0]?.size;
        setSelectedSize(firstSize);
      } else {
        setSelectedColor(undefined);
        setSelectedSize(undefined);
      }
    }
  }, [product, lang]);

  // Update active image when color changes
  useEffect(() => {
    if (product?.variations) {
      if (selectedColor) {
        const activeVar = product.variations.find(v => tl(v.color) === selectedColor);
        if (activeVar) {
          if (activeVar.images?.[0]) {
            setActiveMediaUrl(activeVar.images[0]);
            setActiveMediaType("image");
          } else if (activeVar.video) {
            setActiveMediaUrl(activeVar.video);
            setActiveMediaType("video");
          }
        }
      } else {
        const defaultImage = product.image || product.variations?.[0]?.images?.[0] || "";
        setActiveMediaUrl(defaultImage);
        setActiveMediaType("image");
      }
    }
  }, [selectedColor, product]);

  if (loading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) throw notFound();

  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 5);
  const currency = getLocalizedCurrency(settings?.currency, lang);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedColor || !selectedSize) {
      toast.error(lang === "ar" ? "يرجى اختيار اللون والمقاس أولاً" : lang === "tr" ? "Lütfen önce renk ve beden seçin" : "Please select color and size first");
      return;
    }
    if (availableStock <= 0) {
      toast.error(lang === "ar" ? "هذا المتغير غير متوفر حالياً" : lang === "tr" ? "Bu varyasyon şu anda mevcut değil" : "This variation is out of stock");
      return;
    }

    const cartImage = activeMediaType === "image" && activeMediaUrl 
      ? activeMediaUrl 
      : (activeColorVariation?.images?.[0] || product.image || "");

    addToCart({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      name: tl(product.name),
      price: product.price,
      image: cartImage,
      color: selectedColor,
      size: selectedSize,
    }, qty);
  };

  const handleWishlist = () => {
    if (!product) return;
    toggleWishlist({
      id: product.id,
      name: tl(product.name),
      price: product.price,
      image: product.image,
      category: product.category
    });
  };

  // Logic for media: show images and video
  const allVariationImages = product.variations?.flatMap(v => v.images || []) || [];
  const colorSpecificImages = activeColorVariation?.images || [];
  
  const displayImages = selectedColor && colorSpecificImages.length > 0 
    ? Array.from(new Set(colorSpecificImages)) 
    : Array.from(new Set([...(product.images || []), ...(product.image ? [product.image] : []), ...allVariationImages]));

  const currentVideo = selectedColor 
    ? activeColorVariation?.video 
    : product.variations?.find(v => v.video)?.video;

  // Build unified media items list for thumbnails
  const mediaItems: Array<{ type: "image" | "video"; url: string; thumbnail: string }> = [];
  if (displayImages.length > 0) {
    mediaItems.push({ type: "image", url: displayImages[0], thumbnail: displayImages[0] });
    
    if (currentVideo) {
      mediaItems.push({ type: "video", url: currentVideo, thumbnail: displayImages[0] });
    }
    
    for (let i = 1; i < displayImages.length; i++) {
      mediaItems.push({ type: "image", url: displayImages[i], thumbnail: displayImages[i] });
    }
  } else if (currentVideo) {
    mediaItems.push({ type: "video", url: currentVideo, thumbnail: "" });
  }

  // Embed URL helper for YouTube
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(new URL(url).search);
      videoId = urlParams.get("v") || "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("youtube.com/embed/")) {
      return url;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };


  return (
    <div className="min-h-screen bg-background text-start" dir={dir}>
      <Header />

      <div className="bg-secondary/30 py-6 border-b">
        <div className="container mx-auto px-4 text-xs md:text-sm text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-primary transition-colors">{t("nav.home")}</Link> 
          <span>/</span> 
          <Link to="/shop" className="hover:text-primary transition-colors">{t("nav.shop")}</Link> 
          <span>/</span> 
          <span className="text-foreground font-medium">{tl(product.name)}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square bg-secondary/20 rounded-3xl overflow-hidden border-2 border-secondary/50 shadow-inner group relative">
              {activeMediaType === "video" && activeMediaUrl ? (
                activeMediaUrl.includes("youtube.com") || activeMediaUrl.includes("youtu.be") || activeMediaUrl.includes("vimeo.com") ? (
                  <iframe
                    src={getEmbedUrl(activeMediaUrl)}
                    className="w-full h-full rounded-3xl"
                    allowFullScreen
                    title="Product Video"
                  />
                ) : (
                  <video 
                    src={imageUrl(activeMediaUrl)} 
                    controls 
                    className="w-full h-full rounded-3xl object-contain"
                  />
                )
              ) : activeMediaUrl ? (
                // @ts-ignore
                <InnerImageZoom
                  src={imageUrl(activeMediaUrl)}
                  zoomSrc={imageUrl(activeMediaUrl)}
                  zoomType="hover"
                  zoomScale={1.8}
                  fadeDuration={150}
                  className="w-full h-full flex items-center justify-center mix-blend-multiply"
                  imgAttributes={{
                    className: "w-full h-full object-contain"
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                </div>
              )}
            </div>
            {mediaItems.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                {mediaItems.map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setActiveMediaUrl(item.url);
                      setActiveMediaType(item.type);
                    }}
                    className={`aspect-square rounded-2xl border-2 transition-all overflow-hidden bg-white relative ${
                      activeMediaUrl === item.url && activeMediaType === item.type 
                        ? "border-primary shadow-lg shadow-primary/10" 
                        : "border-secondary/50 hover:border-primary/50"
                    }`}
                  >
                    {item.type === "video" ? (
                      <div className="w-full h-full relative">
                        {item.thumbnail ? (
                          <img src={imageUrl(item.thumbnail)} alt="" className="w-full h-full object-contain p-1 opacity-70" />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                            <svg className="w-4 h-4 text-primary fill-primary translate-x-[1px]" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img src={imageUrl(item.url)} alt="" className="w-full h-full object-contain p-1" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full w-max mb-6">
              <span className="text-[10px] font-black uppercase tracking-wider">TreeMass Kids Fashion</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black mb-4 text-foreground leading-tight">{tl(product.name)}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-black text-primary">{product.price} {currency}</span>
              {product.oldPrice && (
                <span className="text-xl text-muted-foreground line-through opacity-50">{product.oldPrice} {currency}</span>
              )}
              <div className="ms-auto">
                {selectedColor ? (
                  availableStock > 0 ? (
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {t("product.in_stock")} ({availableStock})
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-destructive">
                      {t("product.out_of_stock")}
                    </span>
                  )
                ) : null}
              </div>
            </div>

            <div className="p-6 bg-secondary/20 rounded-3xl border border-secondary/50 mb-8">
              <p className="text-muted-foreground leading-relaxed text-lg">
                {tl(product.description) || t("product.no_description")}
              </p>
            </div>

            {/* Colors Selector */}
            {/* Colors Selector */}
            {product?.variations && product.variations.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-foreground/80">
                    {t("product.selected_color")} <span className="text-primary font-black">{selectedColor || (lang === 'ar' ? 'غير محدد' : 'Not selected')}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.variations.map((v: any, idx: number) => {
                    const colorName = tl(v.color);
                    const isSelected = selectedColor === colorName;
                    const firstImage = v.images?.[0];

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedColor(colorName);
                          // Select the first size of the clicked color automatically
                          const firstSize = v.sizes?.[0]?.size;
                          setSelectedSize(firstSize);
                        }}
                        className={`group flex flex-col items-center gap-1.5 p-1 rounded-2xl border-2 transition-all bg-white ${
                          isSelected
                            ? "border-primary shadow-md shadow-primary/10"
                            : "border-secondary/60 hover:border-primary/50"
                        }`}
                        style={{ minWidth: "72px" }}
                      >
                        <div className="w-14 h-20 rounded-xl overflow-hidden bg-secondary/20 relative">
                          {firstImage ? (
                            <img src={imageUrl(firstImage)} alt={colorName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              {colorName}
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-foreground/80 block px-1 truncate max-w-[68px]">{colorName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes Selector */}
            {availableSizesForColor.length > 0 && (
              <div className="mb-8">
                <span className="text-sm font-bold block mb-3 text-foreground/80">
                  {t("product.selected_size")} <span className="text-primary font-black">{selectedSize}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableSizesForColor.map((s: string, idx: number) => {
                    const isSelected = selectedSize === s;
                    const sizeStockDetail = activeColorVariation?.sizes?.find(sz => sz.size === s);
                    const isOutOfStock = (sizeStockDetail?.stock ?? 0) <= 0;

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[48px] h-12 px-4 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                            : isOutOfStock
                            ? "bg-secondary/20 text-muted-foreground/40 border-secondary/30 cursor-not-allowed line-through"
                            : "bg-white text-foreground/75 border-secondary/60 hover:border-primary/50"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center bg-white border-2 border-secondary rounded-2xl p-1">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-secondary rounded-xl transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-black text-xl">{qty}</span>
                  <button 
                    onClick={() => setQty(qty + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-secondary rounded-xl transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={availableStock <= 0}
                  className={`flex-1 font-black py-4 px-8 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 text-lg ${
                    availableStock > 0 
                      ? "bg-primary text-primary-foreground shadow-primary/20 hover:scale-[1.02] active:scale-95" 
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <ShoppingBag className="w-6 h-6" />
                  {availableStock > 0 ? t("common.add_to_cart") : t("product.unavailable")}
                </button>

                <button 
                  onClick={handleWishlist}
                  className={`w-14 h-14 flex items-center justify-center rounded-2xl border-2 transition-all ${
                    isInWishlist(product.id) 
                      ? "bg-rose-50 border-rose-200 text-rose-500 shadow-rose-100" 
                      : "border-secondary hover:bg-secondary text-muted-foreground"
                  } shadow-lg`}
                >
                  <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? "fill-rose-500" : ""}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedColor && (
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800">{t("product.in_stock")}</p>
                      <p className="text-[10px] text-emerald-600">{availableStock} {t("product.available")}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white font-black text-[10px]">!</div>
                  <div>
                    <p className="text-xs font-bold text-amber-800">{lang === "ar" ? "شحن سريع" : lang === "tr" ? "Hızlı Kargo" : "Fast Shipping"}</p>
                    <p className="text-[10px] text-amber-600">{lang === "ar" ? "توصيل خلال 2-4 أيام" : lang === "tr" ? "2-4 gün içinde teslimat" : "Delivery in 2-4 days"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section Below */}
        <div className="mt-20 border-t pt-12">
          <h2 className="text-2xl font-black mb-8">{lang === "ar" ? "تفاصيل المنتج الإضافية" : lang === "tr" ? "Ek Ürün Detayları" : "Additional Product Details"}</h2>
          <div className="prose prose-stone max-w-none text-muted-foreground">
            <p className="text-lg leading-relaxed mb-6">
              {lang === "ar" 
                ? "هذا المنتج مصمم بعناية فائقة من أجل راحة أطفالكم. نستخدم أفضل الخامات القطنية الطبيعية التي تسمح لبشرة الطفل بالتنفس وتمنع التهيج."
                : lang === "tr"
                ? "Bu ürün çocuklarınızın konforu için büyük bir özenle tasarlanmıştır. Bebeğin cildinin nefes almasını sağlayan ve tahrişi önleyen en iyi doğal pamuklu malzemeleri kullanıyoruz."
                : "This product is designed with great care for your children's comfort. We use the best natural cotton materials that allow the baby's skin to breathe and prevent irritation."}
            </p>
            <ul className="grid md:grid-cols-2 gap-4 list-none p-0">
              <li className="flex items-center gap-3 bg-secondary/10 p-4 rounded-xl">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>{lang === "ar" ? "خامات عالية الجودة ومقاومة للغسيل المتكرر" : lang === "tr" ? "Yüksek kaliteli ve sık yıkamaya dayanıklı malzemeler" : "High-quality and frequent-wash resistant materials"}</span>
              </li>
              <li className="flex items-center gap-3 bg-secondary/10 p-4 rounded-xl">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>{lang === "ar" ? "تصميم مريح يسمح بحرية الحركة للطفل" : lang === "tr" ? "Çocuğun hareket özgürlüğünü sağlayan konforlu tasarım" : "Comfortable design that allows the child's freedom of movement"}</span>
              </li>
              <li className="flex items-center gap-3 bg-secondary/10 p-4 rounded-xl">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>{lang === "ar" ? "ألوان ثابتة وزاهية تدوم طويلاً" : lang === "tr" ? "Uzun ömürlü, solmayan ve canlı renkler" : "Long-lasting, fade-resistant and vibrant colors"}</span>
              </li>
              <li className="flex items-center gap-3 bg-secondary/10 p-4 rounded-xl">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>{lang === "ar" ? "مثالي للمناسبات والاستخدام اليومي" : lang === "tr" ? "Özel günler ve günlük kullanım için ideal" : "Ideal for special occasions and daily use"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Related */}
        <div className="mt-24">
          <h2 className="text-2xl font-black text-center mb-12">{t("product.related")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

