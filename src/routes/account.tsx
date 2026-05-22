import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useUserOrders } from "@/lib/firestore-hooks";
import { User, Package, MapPin, Settings, LogOut, ChevronLeft, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

function AccountPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: orders, loading: ordersLoading } = useUserOrders(user?.uid);

  if (authLoading) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;
  }

  if (!user) {
    navigate({ to: "/login" });
    return null;
  }

  const handleLogout = async () => {
    await logout();
    toast.success("تم تسجيل الخروج");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col text-right" dir="rtl">
      <Header />

      <div className="bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-sm">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ""} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-primary" />
              )}
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-2xl font-bold mb-1">{user.displayName || "مستخدم جديد"}</h1>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
            <div className="md:mr-auto">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white text-destructive border border-destructive/20 px-5 py-2 rounded-lg font-semibold hover:bg-destructive hover:text-white transition-all text-sm"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Menu */}
          <aside className="lg:col-span-1 space-y-2">
            {[
              { label: "طلباتي", icon: Package, active: true },
              { label: "عناوين التوصيل", icon: MapPin },
              { label: "إعدادات الحساب", icon: Settings },
            ].map((item, i) => (
              <button 
                key={i}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${item.active ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card border hover:bg-secondary/50'}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ))}
          </aside>

          {/* Content */}
          <main className="lg:col-span-3">
            <div className="bg-card border rounded-2xl overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">آخر الطلبات</h2>
              </div>
              
              {ordersLoading ? (
                <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
              ) : orders.length > 0 ? (
                <div className="divide-y">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-secondary/20 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-bold text-sm mb-1">طلب رقم #{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-muted-foreground">{new Date(order.createdAt?.seconds * 1000).toLocaleDateString('ar-EG')}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground mb-1">الإجمالي</p>
                          <p className="font-bold text-primary">{order.total} ل.ت</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground mb-1">الحالة</p>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                            order.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status === 'pending' ? 'قيد الانتظار' : 
                             order.status === 'delivered' ? 'تم التوصيل' : 'جاري التنفيذ'}
                          </span>
                        </div>
                        <Link to="/shop" className="text-sm font-bold text-primary hover:underline">التفاصيل</Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-20 text-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-muted-foreground mb-6">لم تقم بإجراء أي طلبات بعد</p>
                  <Link to="/shop" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold text-sm inline-block">
                    ابدأ التسوق الآن
                  </Link>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
