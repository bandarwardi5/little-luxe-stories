import { createFileRoute } from "@tanstack/react-router";
import { Search, Filter, Eye, Download, MoreHorizontal, Calendar } from "lucide-react";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const orders = [
    { id: "#ORD-9542", customer: "أحمد العلي", date: "11 مايو 2026", status: "مكتمل", amount: "245 ل.ت", items: 3, payment: "مدى" },
    { id: "#ORD-9541", customer: "سارة محمد", date: "10 مايو 2026", status: "قيد التنفيذ", amount: "120 ل.ت", items: 1, payment: "فيزا" },
    { id: "#ORD-9540", customer: "خالد فهد", date: "10 مايو 2026", status: "قيد الانتظار", amount: "89 ل.ت", items: 2, payment: "عند الاستلام" },
    { id: "#ORD-9539", customer: "نورة القحطاني", date: "09 مايو 2026", status: "ملغي", amount: "350 ل.ت", items: 5, payment: "Apple Pay" },
    { id: "#ORD-9538", customer: "محمد العتيبي", date: "08 مايو 2026", status: "مكتمل", amount: "560 ل.ت", items: 4, payment: "مدى" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "مكتمل": return "bg-emerald-100 text-emerald-700";
      case "قيد التنفيذ": return "bg-blue-100 text-blue-700";
      case "قيد الانتظار": return "bg-amber-100 text-amber-700";
      case "ملغي": return "bg-rose-100 text-rose-700";
      default: return "bg-secondary text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black mb-1">إدارة الطلبات</h1>
          <p className="text-muted-foreground">تتبع طلبات العملاء وحالات التوصيل.</p>
        </div>
        <button className="bg-white border text-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-secondary transition-colors shadow-sm">
          <Download size={20} />
          تصدير التقارير
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b gap-8">
        {["جميع الطلبات", "قيد الانتظار", "قيد التنفيذ", "المكتملة", "الملغية"].map((tab, i) => (
          <button 
            key={i} 
            className={`pb-4 text-sm font-bold transition-colors relative ${
              i === 0 ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {i === 0 && <span className="absolute bottom-0 right-0 left-0 h-1 bg-primary rounded-full"></span>}
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input 
            type="text" 
            placeholder="بحث برقم الطلب أو اسم العميل..." 
            className="w-full bg-secondary/30 border-none rounded-xl pr-10 pl-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex items-center gap-2 border rounded-xl px-4 py-2.5 text-sm font-bold hover:bg-secondary transition-colors">
            <Calendar size={18} />
            التاريخ
          </button>
          <button className="flex items-center gap-2 border rounded-xl px-4 py-2.5 text-sm font-bold hover:bg-secondary transition-colors">
            <Filter size={18} />
            تصفية متقدمة
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-secondary/30 text-muted-foreground text-xs uppercase font-black">
              <tr>
                <th className="px-6 py-4">رقم الطلب</th>
                <th className="px-6 py-4">العميل</th>
                <th className="px-6 py-4">التاريخ</th>
                <th className="px-6 py-4">الدفع</th>
                <th className="px-6 py-4">الإجمالي</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4 text-left">العمليات</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {orders.map((order, i) => (
                <tr key={i} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-6 py-4 font-bold">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold">{order.customer}</span>
                      <span className="text-[10px] text-muted-foreground">{order.items} منتجات</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                  <td className="px-6 py-4 font-medium">{order.payment}</td>
                  <td className="px-6 py-4 font-black text-primary">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="bg-secondary/50 p-2 rounded-lg hover:bg-secondary transition-colors" title="تفاصيل">
                        <Eye size={18} />
                      </button>
                      <button className="bg-secondary/50 p-2 rounded-lg hover:bg-secondary transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
