import { createFileRoute } from "@tanstack/react-router";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import { useOrders, useProducts, useUsers, useSettings } from "@/lib/firestore-hooks";
import { useMemo } from "react";
import { tl } from "@/lib/i18n";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function toDate(ts: any): Date | null {
  if (!ts) return null;
  if (ts.toDate) return ts.toDate();
  if (ts.seconds) return new Date(ts.seconds * 1000);
  return null;
}

function pct(curr: number, prev: number): { value: string; positive: boolean } {
  if (prev === 0 && curr === 0) return { value: "0%", positive: true };
  if (prev === 0) return { value: "+100%", positive: true };
  const diff = ((curr - prev) / prev) * 100;
  return { value: `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`, positive: diff >= 0 };
}

function AdminDashboard() {
  const { data: orders, loading: ordersLoading } = useOrders();
  const { data: products, loading: productsLoading } = useProducts();
  const { data: users, loading: usersLoading } = useUsers();
  const { settings } = useSettings();

  const stats = useMemo(() => {
    const now = Date.now();
    const day = 86400000;
    const within = (d: Date | null, fromDays: number, toDays: number) =>
      d && now - d.getTime() >= fromDays * day && now - d.getTime() < toDays * day;

    const recentOrders = orders.filter((o) => within(toDate(o.createdAt), 0, 30));
    const prevOrders = orders.filter((o) => within(toDate(o.createdAt), 30, 60));
    const recentSales = recentOrders.reduce((s, o) => s + (o.total || 0), 0);
    const prevSales = prevOrders.reduce((s, o) => s + (o.total || 0), 0);
    const recentUsers = users.filter((u: any) => within(toDate(u.createdAt), 0, 30)).length;
    const prevUsers = users.filter((u: any) => within(toDate(u.createdAt), 30, 60)).length;

    return {
      totalSales: orders.reduce((s, o) => s + (o.total || 0), 0),
      salesTrend: pct(recentSales, prevSales),
      ordersCount: orders.length,
      ordersTrend: pct(recentOrders.length, prevOrders.length),
      usersCount: users.length,
      usersTrend: pct(recentUsers, prevUsers),
      productsCount: products.length,
    };
  }, [orders, users, products]);

  const topProducts = useMemo(() => {
    const counts = new Map<string, { id: string; name: any; category: any; qty: number; revenue: number }>();
    orders.forEach((o) => {
      (o.items || []).forEach((it: any) => {
        const prev = counts.get(it.id) || { id: it.id, name: it.name, category: "", qty: 0, revenue: 0 };
        prev.qty += it.quantity || 0;
        prev.revenue += (it.price || 0) * (it.quantity || 0);
        counts.set(it.id, prev);
      });
    });
    // enrich with current product info
    counts.forEach((v, k) => {
      const p = products.find((p) => p.id === k);
      if (p) {
        v.name = p.name;
        v.category = p.category;
      }
    });
    return Array.from(counts.values()).sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [orders, products]);

  if (ordersLoading || productsLoading || usersLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    );
  }

  const currency = settings?.currency || "ل.ت";
  const recentOrders = orders.slice(0, 5);

  const cards = [
    { title: "إجمالي المبيعات", value: `${stats.totalSales.toLocaleString()} ${currency}`, icon: DollarSign, trend: stats.salesTrend.value, color: "bg-blue-500", positive: stats.salesTrend.positive },
    { title: "إجمالي الطلبات", value: stats.ordersCount.toString(), icon: ShoppingBag, trend: stats.ordersTrend.value, color: "bg-emerald-500", positive: stats.ordersTrend.positive },
    { title: "إجمالي العملاء", value: stats.usersCount.toString(), icon: Users, trend: stats.usersTrend.value, color: "bg-amber-500", positive: stats.usersTrend.positive },
    { title: "عدد المنتجات", value: stats.productsCount.toString(), icon: TrendingUp, trend: "—", color: "bg-rose-500", positive: true },
  ];

  const statusColor = (s: string) => ({
    delivered: "bg-emerald-100 text-emerald-700",
    processing: "bg-blue-100 text-blue-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-rose-100 text-rose-700",
  } as any)[s] || "bg-secondary text-foreground";

  const statusText = (s: string) => ({
    delivered: "مكتمل", processing: "جاري التنفيذ", pending: "قيد الانتظار", cancelled: "ملغي",
  } as any)[s] || s;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black mb-1">مرحباً بك مجدداً 👋</h1>
        <p className="text-muted-foreground">إحصائيات متجرك مباشرة من قاعدة البيانات.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} text-white shadow-lg shadow-black/5`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stat.positive ? "text-emerald-500" : "text-rose-500"}`}>
                {stat.trend}
                {stat.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </div>
            </div>
            <p className="text-muted-foreground font-bold text-sm mb-1">{stat.title}</p>
            <h3 className="text-2xl font-black">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="font-black text-lg">آخر الطلبات</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-secondary/30 text-muted-foreground text-xs uppercase font-black">
                <tr>
                  <th className="px-6 py-4">رقم الطلب</th>
                  <th className="px-6 py-4">العميل</th>
                  <th className="px-6 py-4">الحالة</th>
                  <th className="px-6 py-4">الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4 font-bold">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4">{order.customerName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black ${statusColor(order.status)}`}>{statusText(order.status)}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">{order.total} {currency}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">لا توجد طلبات بعد</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="font-black text-lg">الأكثر مبيعاً</h2>
          </div>
          <div className="p-6 space-y-6">
            {topProducts.map((product, i) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary grid place-items-center font-bold text-xs">{i + 1}</div>
                  <div>
                    <h4 className="text-sm font-bold line-clamp-1">{tl(product.name, "ar")}</h4>
                    <p className="text-[10px] text-muted-foreground">{product.qty} مبيعات • {product.revenue} {currency}</p>
                  </div>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="text-center py-10 text-muted-foreground text-sm">لا توجد مبيعات بعد</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
