import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { db } from "@/lib/firebase";
import { useSettings } from "@/lib/firestore-hooks";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CreditCard, Truck, ShieldCheck, ShoppingBag, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

  const [form, setForm] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "إسطنبول",
    paymentMethod: "cash_on_delivery",
    notes: "",
  });

  const shippingFee = settings?.shippingFee ?? 50;
  const freeThreshold = settings?.freeShippingThreshold ?? 500;
  
  const shipping = (freeThreshold > 0 && subtotal >= freeThreshold) ? 0 : shippingFee;
  const finalTotal = subtotal + shipping;
  const currency = settings?.currency || "ل.ت";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      toast.error("يرجى إكمال جميع البيانات المطلوبة");
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
        city: form.city,
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
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
      toast.success("تم استلام طلبك بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء إتمام الطلب");
    } finally {
      setLoading(false);
    }
  };

  if (orderId) {
    return (
      <div className="min-h-screen bg-background flex flex-col text-right" dir="rtl">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center bg-card border rounded-3xl p-10 shadow-xl">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-black mb-4">شكراً لك!</h1>
            <p className="text-muted-foreground mb-2">تم تسجيل طلبك بنجاح برقم:</p>
            <p className="font-mono font-bold text-primary bg-secondary/50 py-2 px-4 rounded-lg inline-block mb-8">#{orderId.slice(0, 8)}</p>
            <p className="text-sm text-muted-foreground mb-10 leading-relaxed">
              سنقوم بالتواصل معك قريباً لتأكيد الطلب وترتيب عملية التوصيل. يمكنك متابعة حالة طلبك من خلال حسابك الشخصي.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/account" className="bg-primary text-primary-foreground font-bold py-3.5 rounded-xl shadow-lg hover:opacity-90 transition">
                متابعة الطلب
              </Link>
              <Link to="/" className="text-sm font-bold text-muted-foreground hover:text-foreground transition">
                العودة للرئيسية
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
      <div className="min-h-screen bg-background flex flex-col text-right" dir="rtl">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <ShoppingBag className="w-20 h-20 text-muted-foreground mb-6 opacity-20" />
          <h1 className="text-2xl font-bold mb-2">سلتك فارغة حالياً</h1>
          <p className="text-muted-foreground mb-8">أضف بعض المنتجات إلى سلتك لتتمكن من إتمام الطلب.</p>
          <Link to="/shop" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-md">
            ابدأ التسوق
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col text-right" dir="rtl">
      <Header />
      
      <div className="bg-secondary/30 py-10 border-b">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-ethno uppercase">Checkout</h1>
              <p className="text-sm text-muted-foreground">إكمال عملية الشراء والشحن</p>
            </div>
          </div>
          <Link to="/cart" className="text-sm font-bold text-primary flex items-center gap-2 hover:underline">
            <ArrowRight className="w-4 h-4" />
            العودة للسلة
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
                معلومات التوصيل
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold block mb-2">الاسم الكامل *</label>
                  <input 
                    required
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full border rounded-xl px-4 py-3.5 bg-background outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-2">البريد الإلكتروني</label>
                  <input 
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="w-full border rounded-xl px-4 py-3.5 bg-background outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-2">رقم الهاتف *</label>
                  <input 
                    required
                    placeholder="‎+90 5XX XXX XXXX"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="w-full border rounded-xl px-4 py-3.5 bg-background outline-none focus:border-primary transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold block mb-2">العنوان بالتفصيل *</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="اسم الشارع، رقم المبنى، الطابق، الشقة..."
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
                طريقة الدفع
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
                      <p className="font-bold">الدفع عند الاستلام (Cash on Delivery)</p>
                      <p className="text-xs text-muted-foreground mt-1 text-right">ادفع نقداً لمندوب التوصيل عند استلام طلبك.</p>
                    </div>
                  </div>
                  <CreditCard className="w-6 h-6 text-muted-foreground" />
                </label>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-black">3</span>
                ملاحظات إضافية
              </h2>
              <textarea 
                placeholder="هل لديك أي ملاحظات تود إضافتها للطلب؟ (اختياري)"
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
              <h2 className="text-xl font-bold mb-6 border-b pb-4">ملخص الطلب</h2>
              
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto scrollbar-hide px-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-secondary/40 rounded-lg overflow-hidden shrink-0 border">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate text-right">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.quantity} × {item.price} {currency}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 text-sm border-t pt-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold text-foreground">{subtotal} {currency}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>رسوم الشحن</span>
                  <span>{shipping === 0 ? <span className="text-emerald-600 font-bold">مجاني</span> : `${shipping} ${currency}`}</span>
                </div>
                <div className="flex justify-between items-end border-t pt-4">
                  <span className="font-black text-lg">الإجمالي</span>
                  <div className="text-left">
                    <span className="text-2xl font-black text-primary">{finalTotal} {currency}</span>
                    <p className="text-[10px] text-muted-foreground">شامل الضريبة</p>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground font-black py-4 rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all mt-10 flex items-center justify-center gap-3 text-lg"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "تأكيد الطلب"}
              </button>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground bg-secondary/30 p-3 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <p>طلبك محمي بضمان الجودة وسياسة الاستبدال خلال 30 يوم</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      
      <Footer />
    </div>
  );
}
