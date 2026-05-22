import { createFileRoute } from "@tanstack/react-router";
import { useOrders } from "@/lib/firestore-hooks";
import { db } from "@/lib/firebase";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Search, Filter, Eye, Download, MoreHorizontal, Calendar, Loader2, X, Package, Truck, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const { data: orders, loading } = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                         o.customerName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "الكل" || 
                         (statusFilter === "قيد الانتظار" && o.status === "pending") ||
                         (statusFilter === "قيد التنفيذ" && o.status === "processing") ||
                         (statusFilter === "المكتملة" && o.status === "delivered") ||
                         (statusFilter === "الملغية" && o.status === "cancelled");
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      toast.success("تم تحديث حالة الطلب");
      if (selectedOrder) setSelectedOrder({...selectedOrder, status: newStatus});
    } catch (error) {
      toast.error("فشل تحديث الحالة");
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "قيد الانتظار";
      case "processing": return "جاري التنفيذ";
      case "delivered": return "تم التوصيل";
      case "cancelled": return "ملغي";
      default: return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "delivered": return "bg-emerald-100 text-emerald-700";
      case "processing": return "bg-blue-100 text-blue-700";
      case "pending": return "bg-amber-100 text-amber-700";
      case "cancelled": return "bg-rose-100 text-rose-700";
      default: return "bg-secondary text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black mb-1">إدارة الطلبات</h1>
          <p className="text-muted-foreground">تتبع طلبات العملاء وحالات التوصيل في الوقت الفعلي.</p>
        </div>
        <button className="bg-white border text-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-secondary transition-colors shadow-sm">
          <Download size={20} />
          تصدير التقارير
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b gap-8 overflow-x-auto scrollbar-hide">
        {["الكل", "قيد الانتظار", "قيد التنفيذ", "المكتملة", "الملغية"].map((tab, i) => (
          <button 
            key={i} 
            onClick={() => setStatusFilter(tab)}
            className={`pb-4 text-sm font-bold transition-colors relative whitespace-nowrap ${
              statusFilter === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {statusFilter === tab && <span className="absolute bottom-0 right-0 left-0 h-1 bg-primary rounded-full"></span>}
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث برقم الطلب أو اسم العميل..." 
            className="w-full bg-secondary/30 border-none rounded-xl pr-10 pl-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-right"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-secondary/30 text-muted-foreground text-xs uppercase font-black">
                <tr>
                  <th className="px-6 py-4">رقم الطلب</th>
                  <th className="px-6 py-4">العميل</th>
                  <th className="px-6 py-4">التاريخ</th>
                  <th className="px-6 py-4">الإجمالي</th>
                  <th className="px-6 py-4">الحالة</th>
                  <th className="px-6 py-4 text-left">العمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-xs">#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold">{order.customerName}</span>
                        <span className="text-[10px] text-muted-foreground">{order.items?.length || 0} منتجات</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('ar-EG') : 'جاري التحميل...'}
                    </td>
                    <td className="px-6 py-4 font-black text-primary">{order.total} ل.ت</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black ${getStatusStyle(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="bg-secondary/50 p-2 rounded-lg hover:bg-secondary transition-colors" title="تفاصيل">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-black">تفاصيل الطلب #{selectedOrder.id.slice(0, 8)}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[80vh] space-y-8 text-right">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-secondary/20 p-4 rounded-2xl">
                  <h4 className="text-xs font-bold text-muted-foreground mb-3 uppercase">العميل</h4>
                  <p className="font-bold">{selectedOrder.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
                  <p className="text-sm font-mono mt-2">{selectedOrder.phone}</p>
                </div>
                <div className="bg-secondary/20 p-4 rounded-2xl">
                  <h4 className="text-xs font-bold text-muted-foreground mb-3 uppercase">العنوان</h4>
                  <p className="text-sm leading-relaxed">{selectedOrder.address}</p>
                  <p className="text-sm font-bold mt-1">{selectedOrder.city}</p>
                </div>
                <div className="bg-secondary/20 p-4 rounded-2xl">
                  <h4 className="text-xs font-bold text-muted-foreground mb-3 uppercase">الدفع والحالة</h4>
                  <p className="text-sm font-bold">{selectedOrder.paymentMethod === 'cash_on_delivery' ? 'عند الاستلام' : selectedOrder.paymentMethod}</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black mt-2 ${getStatusStyle(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-black mb-4">المنتجات</h4>
                <div className="border rounded-2xl divide-y overflow-hidden">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white">
                      <div className="flex items-center gap-3">
                        <img src={item.image} className="w-12 h-12 rounded-lg object-contain bg-secondary/30" />
                        <div>
                          <p className="font-bold text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.quantity} × {item.price} ل.ت</p>
                        </div>
                      </div>
                      <p className="font-black text-primary">{item.price * item.quantity} ل.ت</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-end md:items-start justify-between border-t pt-6">
                <div className="space-y-2 w-full md:w-auto">
                  <h4 className="font-black mb-4">تحديث الحالة</h4>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => updateStatus(selectedOrder.id, 'processing')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-bold hover:bg-blue-100 transition">
                      <Truck size={16} /> جاري التنفيذ
                    </button>
                    <button onClick={() => updateStatus(selectedOrder.id, 'delivered')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold hover:bg-emerald-100 transition">
                      <CheckCircle2 size={16} /> تم التوصيل
                    </button>
                    <button onClick={() => updateStatus(selectedOrder.id, 'cancelled')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-sm font-bold hover:bg-rose-100 transition">
                      <AlertCircle size={16} /> إلغاء الطلب
                    </button>
                  </div>
                </div>
                
                <div className="bg-secondary/10 p-6 rounded-2xl w-full md:w-64 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">المجموع الفرعي</span>
                    <span className="font-bold">{selectedOrder.subtotal} ل.ت</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">الشحن</span>
                    <span className="font-bold">{selectedOrder.shipping === 0 ? 'مجاني' : `${selectedOrder.shipping} ل.ت`}</span>
                  </div>
                  <div className="flex justify-between items-end pt-2 border-t">
                    <span className="font-black">الإجمالي</span>
                    <span className="text-xl font-black text-primary">{selectedOrder.total} ل.ت</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
