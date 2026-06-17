import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useCart } from "@/lib/cart-context";
import { useSettings } from "@/lib/firestore-hooks";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useLang, getLocalizedCurrency } from "@/lib/i18n";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({
    meta: [
      { title: "سلة المشتريات | Treemass" },
      { name: "description", content: "سلة مشترياتك في متجر Treemass." },
    ],
  }),
});

function CartPage() {
  const { items: cartItems, total: subtotal, remove, setQty } = useCart();
  const { settings } = useSettings();
  const { t, dir, lang } = useLang();
  
  const shippingFee = settings?.shippingFee ?? 50;
  const freeThreshold = settings?.freeShippingThreshold ?? 500;
  const currency = getLocalizedCurrency(settings?.currency, lang);

  const shipping = (freeThreshold > 0 && subtotal >= freeThreshold) || cartItems.length === 0 ? 0 : shippingFee;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background flex flex-col text-start" dir={dir}>
      <Header />

      <div className="bg-secondary/30 py-8 border-b">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-ethno uppercase">{t("cart.title")}</h1>
            <p className="text-sm text-muted-foreground">{cartItems.length} {t("shop.products")}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-10">
        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-card border rounded-2xl overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-secondary/50 font-semibold text-sm text-muted-foreground">
                  <div className="col-span-6">{t("cart.product")}</div>
                  <div className="col-span-2 text-center">{t("cart.price")}</div>
                  <div className="col-span-2 text-center">{t("cart.quantity")}</div>
                  <div className="col-span-2 text-center">{t("cart.total_item")}</div>
                </div>
                
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-6 items-center">
                      <div className="col-span-1 md:col-span-6 flex gap-4">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-secondary/40 rounded-lg overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <Link to={`/product/${item.id.split("-")[0]}`} className="font-bold hover:text-primary transition-colors line-clamp-2 mb-1">
                            {item.name}
                          </Link>
                          {item.color && <p className="text-xs text-muted-foreground">{t("product.selected_color")} {item.color}</p>}
                          {item.size && <p className="text-xs text-muted-foreground">{t("product.selected_size")} {item.size}</p>}
                          <button 
                            onClick={() => remove(item.id)}
                            className="text-xs text-destructive font-medium flex items-center gap-1 hover:underline w-max mt-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {t("cart.remove")}
                          </button>
                        </div>
                      </div>
                      
                      <div className="hidden md:block col-span-2 text-center font-semibold">
                        {item.price} {currency}
                      </div>
                      
                      <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center">
                        <span className="md:hidden font-semibold text-sm">{t("cart.quantity")}:</span>
                        <div className="flex items-center border rounded-lg overflow-hidden w-24">
                          <button 
                            onClick={() => setQty(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-secondary/50 hover:bg-secondary transition"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="flex-1 text-center text-sm font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => setQty(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-secondary/50 hover:bg-secondary transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center font-bold text-primary">
                        <span className="md:hidden text-foreground text-sm">{t("cart.total_item")}:</span>
                        <span>{item.price * item.quantity} {currency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary transition font-ethno">
                  <ArrowRight className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
                  {t("cart.continue_shopping")}
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <div className="bg-card border rounded-2xl p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b font-ethno uppercase">{t("cart.summary")}</h2>
                
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t("cart.subtotal")}</span>
                    <span className="font-medium text-foreground">{subtotal} {currency}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t("cart.shipping")}</span>
                    <span className="font-medium text-foreground">
                      {shipping === 0 ? <span className="text-emerald-600 font-bold">{t("cart.free")}</span> : `${shipping} ${currency}`}
                    </span>
                  </div>
                  {shipping > 0 && freeThreshold > 0 && (
                    <div className="bg-primary/10 text-primary text-xs p-3 rounded-lg flex items-start gap-2">
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      <p>{t("cart.add_more_for_free").replace("{amount}", (freeThreshold - subtotal).toString()).replace("{currency}", currency)}</p>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-lg font-ethno uppercase">{t("cart.total")}</span>
                    <div className="text-left">
                      <span className="font-black text-2xl text-primary">{total} {currency}</span>
                      <p className="text-[10px] text-muted-foreground">{t("cart.vat_included")}</p>
                    </div>
                  </div>
                </div>
                
                <Link 
                  to="/checkout"
                  className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl shadow-md hover:opacity-90 transition mb-4 font-ethno uppercase tracking-widest flex items-center justify-center"
                >
                  {t("cart.checkout")}
                </Link>
                
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t("cart.secure_payment")}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-muted-foreground mb-6">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t("cart.empty")}</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              {lang === "ar" 
                ? "ليس لديك أي منتجات في سلة المشتريات حالياً. تصفح منتجاتنا واكتشف التشكيلات الرائعة."
                : lang === "tr"
                ? "Sepetinizde şu an ürün bulunmamaktadır. Ürünlerimize göz atın ve harika koleksiyonları keşfedin."
                : "You currently have no products in your cart. Browse our products and discover great collections."}
            </p>
            <Link to="/shop" className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-lg shadow-sm hover:opacity-90 transition">
              {t("cart.start_shopping")}
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function Lock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}