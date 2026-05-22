import { createFileRoute } from "@tanstack/react-router";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { useOrders, useProducts, useUsers } from "@/lib/firestore-hooks";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: orders, loading: ordersLoading } = useOrders();
  const { data: products, loading: productsLoading } = useProducts();
  const { data: users, loading: usersLoading } = useUsers();

  if (ordersLoading || productsLoading || usersLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    );
  }

  const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const recentOrders = orders.slice(0, 5);
  const topProducts = products.slice(0, 4); // For now, just show first 4 products as "top"

  const stats = [
    { 
      title: "إجمالي المبيعات", 
      value: `${totalSales.toLocaleString()} ل.ت`, 
      icon: DollarSign, 
      trend: "+12.5%", 
      color: "bg-blue-500", 
      positive: true 
    },
    { 
      title: "إجمالي الطلبات", 
      value: orders.length.toString(), 
      icon: ShoppingBag, 
      trend: "+8.2%", 
      color: "bg-emerald-500", 
      positive: true 
    },
    { 
      title: "إجمالي العملاء", 
      value: users.length.toString(), 
      icon: Users, 
      trend: "+5.1%", 
      color: "bg-amber-500", 
      positive: true 
    },
    { 
      title: "عدد المنتجات", 
      value: products.length.toString(), 
      icon: TrendingUp, 
      trend: "-1.2%", 
      color: "bg-rose-500", 
      positive: false 
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-emerald-100 text-emerald-700";
      case "processing": return "bg-blue-100 text-blue-700";
      case "pending": return "bg-amber-100 text-amber-700";
      case "cancelled": return "bg-rose-100 text-rose-700";
      default: return "bg-secondary text-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered": return "مكتمل";
      case "processing": return "جاري التنفيذ";
      case "pending": return "قيد الانتظار";
      case "cancelled": return "ملغي";
      default: return status;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black mb-1">مرحباً بك مجدداً، أدمن Treemass 👋</h1>
        <p className="text-muted-foreground">إليك نظرة سريعة على أداء متجرك اليوم في إسطنبول.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
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
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-black text-lg">آخر الطلبات</h2>
            <button className="text-primary text-sm font-bold hover:underline">عرض الكل</button>
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
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">{order.total} ل.ت</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">لا توجد طلبات بعد</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="font-black text-lg">الأكثر مبيعاً</h2>
          </div>
          <div className="p-6 space-y-6">
            {topProducts.map((product, i) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary grid place-items-center font-bold text-xs">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{product.name}</h4>
                    <p className="text-[10px] text-muted-foreground">{product.category}</p>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-500">+{Math.floor(Math.random() * 20) + 5}%</span>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="text-center py-10 text-muted-foreground text-sm">لا توجد منتجات</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
