import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/lib/auth-context";
import { useUserOrders, useSettings } from "@/lib/firestore-hooks";
import { User, Package, MapPin, Settings, LogOut, ChevronLeft, Loader2, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { useLang, getLocalizedCurrency } from "@/lib/i18n";
import { useState } from "react";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

function AccountPage() {
  const { t, tl, dir, lang } = useLang();
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: orders, loading: ordersLoading } = useUserOrders(user?.uid);
  const { settings } = useSettings();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const currency = getLocalizedCurrency(settings?.currency, lang);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":    return t("account.status_pending");
      case "processing": return t("account.status_processing");
      case "delivered":  return t("account.status_delivered");
      case "cancelled":  return t("account.status_cancelled");
      default: return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "delivered":  return "bg-emerald-100 text-emerald-700";
      case "processing": return "bg-blue-100 text-blue-700";
      case "pending":    return "bg-amber-100 text-amber-700";
      case "cancelled":  return "bg-rose-100 text-rose-700";
      default: return "bg-secondary text-muted-foreground";
    }
  };

  if (authLoading) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;
  }

  if (!user) {
    navigate({ to: "/login" });
    return null;
  }

  const handleLogout = async () => {
    await logout();
    toast.success(t("account.logout_success"));
    navigate({ to: "/" });
  };

  const menuItems = [
    { labelKey: "account.my_orders", icon: Package, active: true },
    { labelKey: "account.delivery",  icon: MapPin },
    { labelKey: "account.settings",  icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={dir}>
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
            <div className="text-center md:text-start">
              <h1 className="text-2xl font-bold mb-1">{user.displayName || t("account.new_user")}</h1>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
            <div className="md:ms-auto">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white text-destructive border border-destructive/20 px-5 py-2 rounded-lg font-semibold hover:bg-destructive hover:text-white transition-all text-sm"
              >
                <LogOut className="w-4 h-4" />
                {t("account.logout")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Menu */}
          <aside className="lg:col-span-1 space-y-2">
            {menuItems.map((item, i) => (
              <button
                key={i}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${item.active ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card border hover:bg-secondary/50'}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-bold text-sm">{t(item.labelKey)}</span>
                </div>
                <ChevronLeft className={`w-4 h-4 ${dir === "ltr" ? "rotate-180" : ""}`} />
              </button>
            ))}
          </aside>

          {/* Content */}
          <main className="lg:col-span-3">
            <div className="bg-card border rounded-2xl overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">{t("account.orders")}</h2>
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
                          <p className="font-bold text-sm mb-1">{t("account.order_num")} #{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString(lang === "ar" ? "ar-EG" : lang === "tr" ? "tr-TR" : "en-US") : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-6">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t("account.total")}</p>
                          <p className="font-bold text-primary">{order.total} {currency}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t("account.status")}</p>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${getStatusStyle(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-sm font-bold text-primary hover:underline"
                        >
                          {t("account.details")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-20 text-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-muted-foreground mb-6">{t("account.no_orders")}</p>
                  <Link to="/shop" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold text-sm inline-block">
                    {t("account.start_shopping")}
                  </Link>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-black">{t("account.order_details")} #{selectedOrder.id.slice(0, 8)}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[80vh] space-y-8" dir={dir}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-secondary/20 p-4 rounded-2xl">
                  <h4 className="text-xs font-bold text-muted-foreground mb-3 uppercase">{t("account.recipient")}</h4>
                  <p className="font-bold">{selectedOrder.customerName}</p>
                  <p className="text-sm font-mono mt-1">{selectedOrder.phone}</p>
                </div>
                <div className="bg-secondary/20 p-4 rounded-2xl">
                  <h4 className="text-xs font-bold text-muted-foreground mb-3 uppercase">{t("account.address")}</h4>
                  <p className="text-sm leading-relaxed">{selectedOrder.address}</p>
                  <p className="text-sm font-bold mt-1">
                    {selectedOrder.district ? `${selectedOrder.district}, ${selectedOrder.city}` : selectedOrder.city}
                  </p>
                </div>
                <div className="bg-secondary/20 p-4 rounded-2xl">
                  <h4 className="text-xs font-bold text-muted-foreground mb-3 uppercase">{t("account.payment_status")}</h4>
                  <p className="text-sm font-bold">
                    {selectedOrder.paymentMethod === 'cash_on_delivery' ? t("account.cod") : selectedOrder.paymentMethod}
                  </p>
                  <div className={"inline-block px-3 py-1 rounded-full text-[10px] font-black mt-2 " + getStatusStyle(selectedOrder.status)}>
                    {getStatusLabel(selectedOrder.status)}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-black mb-4">{t("account.products")}</h4>
                <div className="border rounded-2xl divide-y overflow-hidden">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white">
                      <div className="flex items-center gap-3">
                        <img src={item.image} className="w-12 h-12 rounded-lg object-contain bg-secondary/30" />
                        <div>
                          <p className="font-bold text-sm">{item.name}</p>
                          <div className="flex flex-wrap gap-2 mt-1 items-center">
                            <span className="text-xs text-muted-foreground">{item.quantity} × {item.price} {currency}</span>
                            {item.color && (
                              <span className="text-xs font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                {item.color}
                              </span>
                            )}
                            {item.size && (
                              <span className="text-xs font-bold px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded-full">
                                {item.size}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="font-black text-primary">{item.price * item.quantity} {currency}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end border-t pt-6">
                <div className="bg-secondary/10 p-6 rounded-2xl w-full md:w-64 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("account.subtotal")}</span>
                    <span className="font-bold">{selectedOrder.subtotal} {currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("account.shipping")}</span>
                    <span className="font-bold">
                      {selectedOrder.shipping === 0 ? t("account.free_shipping") : `${selectedOrder.shipping} ${currency}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-end pt-2 border-t">
                    <span className="font-black">{t("account.total")}</span>
                    <span className="text-xl font-black text-primary">{selectedOrder.total} {currency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
