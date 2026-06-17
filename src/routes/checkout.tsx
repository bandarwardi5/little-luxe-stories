import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { db } from "@/lib/firebase";
import { useSettings, useOffers } from "@/lib/firestore-hooks";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CreditCard, Truck, ShieldCheck, ShoppingBag, Loader2, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLang, getLocalizedCurrency } from "@/lib/i18n";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { user } = useAuth();
  const { items, total: subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { settings } = useSettings();
  const { data: offers } = useOffers();
  const { t, dir, lang } = useLang();

  const [form, setForm] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "cash_on_delivery",
    notes: "",
  });

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; title?: any } | null>(null);

  const shippingFee = settings?.shippingFee ?? 50;
  const freeThreshold = settings?.freeShippingThreshold ?? 500;

  const shipping = (freeThreshold > 0 && subtotal >= freeThreshold) ? 0 : shippingFee;
  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discount) / 100) : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + shipping);
  const currency = getLocalizedCurrency(settings?.currency, lang);

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const offer = offers.find((o: any) => (o.code || "").toUpperCase() === code && o.active !== false);
    if (!offer) {
      toast.error(lang === "ar" ? "كود الخصم غير صالح أو منتهي" : lang === "tr" ? "Geçersiz kupon kodu" : "Invalid coupon code");
      return;
    }
    setAppliedCoupon({ code, discount: offer.discount || 0, title: offer.title });
    toast.success(lang === "ar" ? `تم تطبيق خصم ${offer.discount}%` : lang === "tr" ? `${offer.discount}% indirim uygulandı` : `${offer.discount}% discount applied`);
  };


  // Keep city in sync with default translation until user types something else
  useEffect(() => {
    const defaultCities = ["إسطنبول", "Istanbul", "İstanbul", ""];
    if (defaultCities.includes(form.city)) {
      setForm(prev => ({ ...prev, city: t("checkout.city_default") }));
    }
  }, [lang, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      toast.error(t("checkout.error_missing_fields"));
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: user?.uid || null,
        customerName: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city || t("checkout.city_default"),
        items: items.map(i => ({ 
          id: i.id, 
          name: i.name, 
          price: i.price, 
          quantity: i.quantity, 
          image: i.image || null,
          color: i.color || null,
          size: i.size || null
        })),
        subtotal,
        shipping,
        total: finalTotal,
        status: "pending",
        paymentMethod: form.paymentMethod,
        notes: form.notes,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      setOrderId(docRef.id);
      clear();
      toast.success(t("checkout.order_received"));
    } catch (error) {
      console.error(error);
      toast.error(t("checkout.error_generic"));
    } finally {
      setLoading(false);
    }
  };

  if (orderId) {
    return (
      <div className="min-h-screen bg-background flex flex-col text-start" dir={dir}>
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center bg-card border rounded-3xl p-10 shadow-xl">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-black mb-4">{t("checkout.success_title")}</h1>
            <p className="text-muted-foreground mb-2">{t("checkout.success_msg")}</p>
            <p className="font-mono font-bold text-primary bg-secondary/50 py-2 px-4 rounded-lg inline-block mb-8">#{orderId.slice(0, 8)}</p>
            <p className="text-sm text-muted-foreground mb-10 leading-relaxed">
              {t("checkout.success_desc")}
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/account" className="bg-primary text-primary-foreground font-bold py-3.5 rounded-xl shadow-lg hover:opacity-90 transition">
                {t("checkout.follow_order")}
              </Link>
              <Link to="/" className="text-sm font-bold text-muted-foreground hover:text-foreground transition">
                {t("checkout.back_home")}
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col text-start" dir={dir}>
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <ShoppingBag className="w-20 h-20 text-muted-foreground mb-6 opacity-20" />
          <h1 className="text-2xl font-bold mb-2">{t("checkout.empty_title")}</h1>
          <p className="text-muted-foreground mb-8">{t("checkout.empty_desc")}</p>
          <Link to="/shop" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-md">
            {t("checkout.start_shopping")}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col text-start" dir={dir}>
      <Header />
      
      <div className="bg-secondary/30 py-10 border-b">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-ethno uppercase">{t("checkout.title")}</h1>
              <p className="text-sm text-muted-foreground">{t("checkout.subtitle")}</p>
            </div>
          </div>
          <Link to="/cart" className="text-sm font-bold text-primary flex items-center gap-2 hover:underline">
            <ArrowRight className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
            {t("checkout.back_to_cart")}
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-black">1</span>
                {t("checkout.delivery_info")}
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold block mb-2">{t("checkout.full_name")}</label>
                  <input 
                    required
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full border rounded-xl px-4 py-3.5 bg-background outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-2">{t("checkout.email")}</label>
                  <input 
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="w-full border rounded-xl px-4 py-3.5 bg-background outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-2">{t("checkout.phone")}</label>
                  <input 
                    required
                    placeholder="‎+90 5XX XXX XXXX"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="w-full border rounded-xl px-4 py-3.5 bg-background outline-none focus:border-primary transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold block mb-2">{t("checkout.address")}</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder={t("checkout.address_placeholder")}
                    value={form.address}
                    onChange={(e) => setForm({...form, address: e.target.value})}
                    className="w-full border rounded-xl px-4 py-3.5 bg-background outline-none focus:border-primary transition"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-black">2</span>
                {t("checkout.payment_method")}
              </h2>
              <div className="space-y-4">
                <label className={`flex items-center justify-between p-5 border rounded-2xl cursor-pointer transition-all ${form.paymentMethod === 'cash_on_delivery' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-secondary/30'}`}>
                  <div className="flex items-center gap-4">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={form.paymentMethod === 'cash_on_delivery'}
                      onChange={() => setForm({...form, paymentMethod: 'cash_on_delivery'})}
                      className="w-4 h-4 text-primary" 
                    />
                    <div>
                      <p className="font-bold">{t("checkout.cod")}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t("checkout.cod_desc")}</p>
                    </div>
                  </div>
                  <CreditCard className="w-6 h-6 text-muted-foreground" />
                </label>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-black">3</span>
                {t("checkout.notes")}
              </h2>
              <textarea 
                placeholder={t("checkout.notes_placeholder")}
                rows={4}
                value={form.notes}
                onChange={(e) => setForm({...form, notes: e.target.value})}
                className="w-full border rounded-xl px-4 py-3.5 bg-background outline-none focus:border-primary transition"
              />
            </section>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-3xl p-8 sticky top-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">{t("checkout.summary")}</h2>
              
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto scrollbar-hide px-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-secondary/40 rounded-lg overflow-hidden shrink-0 border">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity} x {item.price} {currency}</p>
                      {item.color && <p className="text-[10px] text-muted-foreground">{t("product.selected_color")} {item.color}</p>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm border-t pt-6 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("cart.subtotal")}</span>
                  <span className="font-bold text-foreground">{subtotal} {currency}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("cart.shipping")}</span>
                  <span className="font-bold text-foreground">
                    {shipping === 0 ? <span className="text-emerald-600">{t("cart.free")}</span> : `${shipping} ${currency}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-black border-t pt-3 mt-3">
                  <span>{t("cart.total")}</span>
                  <span className="text-primary">{finalTotal} {currency}</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground font-black py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                {loading ? t("checkout.processing") : t("checkout.place_order")}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                <Lock className="w-3 h-3" />
                {t("cart.secure_payment")}
              </div>
            </div>
          </div>
        </div>
      </form>

      <Footer />
    </div>
  );
}
