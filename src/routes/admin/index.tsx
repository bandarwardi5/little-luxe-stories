import { createFileRoute } from "@tanstack/react-router";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = [
    { title: "إجمالي المبيعات", value: "45,230 ل.ت", icon: DollarSign, trend: "+12.5%", color: "bg-blue-500", positive: true },
    { title: "الطلبات الجديدة", value: "154", icon: ShoppingBag, trend: "+8.2%", color: "bg-emerald-500", positive: true },
    { title: "العملاء الجدد", value: "89", icon: Users, trend: "+5.1%", color: "bg-amber-500", positive: true },
    { title: "معدل التحويل", value: "3.4%", icon: TrendingUp, trend: "-1.2%", color: "bg-rose-500", positive: false },
  ];

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
                {[
                  { id: "#ORD-9542", customer: "أحمد العلي", status: "مكتمل", amount: "245 ل.ت", statusColor: "bg-emerald-100 text-emerald-700" },
                  { id: "#ORD-9541", customer: "سارة محمد", status: "قيد التنفيذ", amount: "120 ل.ت", statusColor: "bg-blue-100 text-blue-700" },
                  { id: "#ORD-9540", customer: "خالد فهد", status: "قيد الانتظار", amount: "89 ل.ت", statusColor: "bg-amber-100 text-amber-700" },
                  { id: "#ORD-9539", customer: "نورة القحطاني", status: "ملغي", amount: "350 ل.ت", statusColor: "bg-rose-100 text-rose-700" },
                ].map((order, i) => (
                  <tr key={i} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4 font-bold">{order.id}</td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">{order.amount}</td>
                  </tr>
                ))}
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
            {[
              { name: "فستان بناتي وردي", sales: "45 مبيعات", growth: "+15%" },
              { name: "جاكيت جينز أولادي", sales: "38 مبيعات", growth: "+12%" },
              { name: "حذاء رياضي أحمر", sales: "32 مبيعات", growth: "+8%" },
              { name: "تيشيرت أصفر كرتوني", sales: "28 مبيعات", growth: "+5%" },
            ].map((product, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary grid place-items-center font-bold text-xs">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{product.name}</h4>
                    <p className="text-[10px] text-muted-foreground">{product.sales}</p>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-500">{product.growth}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
