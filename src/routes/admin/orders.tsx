import { createFileRoute } from "@tanstack/react-router";
import { useOrders } from "@/lib/firestore-hooks";
import { db } from "@/lib/firebase";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Search, Filter, Eye, Download, MoreHorizontal, Calendar, Loader2, X, Package, Truck, CheckCircle2, AlertCircle, Printer } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const getCityPlateCode = (city: string) => {
  const c = (city || "").toLowerCase().trim();
  const cityCodes: Record<string, string> = {
    istanbul: "34", ist: "34", "إسطنبول": "34", "اسطنبول": "34",
    ankara: "06", ank: "06", "أنقرة": "06", "انقرة": "06",
    izmir: "35", izm: "35", "إزمير": "35", "ازمير": "35",
    bursa: "16", "بورصة": "16", "بورصه": "16",
    corum: "19", "çorum": "19", "چوروم": "19", "خوروم": "19", "كوروم": "19",
    adana: "01", antalya: "07", "أنطاليا": "07", "انطاليا": "07",
    gaziantep: "27", "غازي عنتاب": "27", "عنتاب": "27",
    konya: "42", "قونية": "42", "قونيه": "42",
    trabzon: "61", "طرابزون": "61",
    samsun: "55", "سامسون": "55",
    sakarya: "54", "سكاريا": "54",
    kocaeli: "41", "كوجالي": "41"
  };

  for (const key of Object.keys(cityCodes)) {
    if (c.includes(key)) {
      return cityCodes[key];
    }
  }
  return "34";
};

function AdminOrders() {
  const { data: orders, loading } = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>, filtered: any[]) => {
    if (e.target.checked) {
      setSelectedOrderIds(filtered.map(o => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(prev => [...prev, orderId]);
    } else {
      setSelectedOrderIds(prev => prev.filter(id => id !== orderId));
    }
  };

  const handlePrintLabels = (ordersToPrint: any[]) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("يرجى السماح بالنوافذ المنبثقة لطباعة البوليصات");
      return;
    }

    const labelsHtml = ordersToPrint.map((order) => {
      const plateCode = getCityPlateCode(order.city);
      const routeCode = `1 - ${plateCode} - ${order.id.slice(-4).toUpperCase().replace(/[^0-9]/g, '8') || '486'}`;
      const orderDate = order.createdAt?.seconds 
        ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('tr-TR') 
        : new Date().toLocaleDateString('tr-TR');

      return `
        <div class="printable-label">
          <!-- Header: Carrier Info & Shipment Details -->
          <div class="label-header">
            <div class="header-logo">TREEMASS EXPRESS</div>
            <div class="header-meta">
              <div>Tarih: ${orderDate}</div>
              <div>Paket: 1/1</div>
              <div>Desi: 1.0</div>
            </div>
          </div>

          <!-- Main Barcode Section -->
          <div class="barcode-section">
            <div class="barcode-wrapper">
              <svg id="barcode-top-${order.id}"></svg>
            </div>
          </div>

          <!-- Address & Sender Block -->
          <div class="info-block">
            <div class="info-left">
              <div class="info-section-title">ALICI / RECIPIENT</div>
              <div class="recipient-name" dir="auto">${order.customerName || ""}</div>
              <div class="recipient-address" dir="auto">${order.address || ""}</div>
              <div class="recipient-city">${(order.city || "").toUpperCase()} / TURKEY</div>
              <div class="recipient-phone">${order.phone || ""}</div>
            </div>
            <div class="info-right">
              <div class="info-section-title">GÖNDERİCİ / SENDER</div>
              <div class="sender-name">TREEMASS</div>
              <div class="sender-details">TREEMASS DEPO<br/>ISTANBUL / TURKEY</div>
              <div class="vertical-barcode-container">
                <svg id="barcode-vert-${order.id}"></svg>
              </div>
            </div>
          </div>

          <!-- Route / Sorting Code Block -->
          <div class="route-block">
            <div class="route-title">SEVK BÖLGESİ / ROUTE CODE</div>
            <div class="route-value">${routeCode}</div>
          </div>

          <!-- Footer Details -->
          <div class="label-footer">
            <div class="footer-left">
              <div>Sipariş ID: ${order.id}</div>
              <div>Tel: ${order.phone || ""}</div>
            </div>
            <div class="footer-right">
              <div class="destination-hub">${(order.city || "MERKEZ").toUpperCase()} ŞUBE</div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>طباعة بوليصات الشحن</title>
          <style>
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: white;
              color: black;
            }
            .printable-label {
              width: 100mm;
              height: 150mm;
              box-sizing: border-box;
              border: 3px solid black;
              padding: 10px;
              margin: 15px auto;
              page-break-after: always;
              break-after: page;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              background-color: white;
            }
            
            /* Header Styling */
            .label-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid black;
              padding-bottom: 6px;
              margin-bottom: 6px;
            }
            .header-logo {
              font-size: 16px;
              font-weight: 900;
              letter-spacing: 1px;
            }
            .header-meta {
              text-align: right;
              font-size: 8px;
              font-weight: bold;
              line-height: 1.3;
            }

            /* Barcode Section */
            .barcode-section {
              text-align: center;
              margin-bottom: 8px;
              padding: 4px 0;
              border-bottom: 1px solid black;
            }
            .barcode-wrapper {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
            }
            .barcode-wrapper svg {
              max-width: 100%;
              height: auto;
            }

            /* Info Block (Sender & Recipient) */
            .info-block {
              display: flex;
              border: 1px solid black;
              margin-bottom: 8px;
              flex: 1;
              min-height: 180px;
            }
            .info-left {
              flex: 7;
              padding: 8px;
              border-right: 1px solid black;
              display: flex;
              flex-direction: column;
              gap: 4px;
              text-align: right;
            }
            .info-right {
              flex: 3;
              padding: 8px;
              display: flex;
              flex-direction: column;
              gap: 4px;
              align-items: center;
              text-align: center;
              background-color: #fafafa;
            }
            .info-section-title {
              font-size: 8px;
              font-weight: 900;
              color: #333;
              border-bottom: 1px dashed black;
              padding-bottom: 2px;
              margin-bottom: 4px;
              width: 100%;
              text-align: center;
              font-family: sans-serif;
            }
            .recipient-name {
              font-size: 14px;
              font-weight: 900;
              margin-bottom: 2px;
              word-break: break-word;
            }
            .recipient-address {
              font-size: 11px;
              font-weight: bold;
              line-height: 1.3;
              word-break: break-word;
              flex: 1;
            }
            .recipient-city {
              font-size: 12px;
              font-weight: 900;
              border-top: 1px solid #ddd;
              padding-top: 4px;
              font-family: 'Courier New', Courier, monospace;
            }
            .recipient-phone {
              font-size: 11px;
              font-weight: 900;
              font-family: 'Courier New', Courier, monospace;
            }
            .sender-name {
              font-size: 11px;
              font-weight: 900;
            }
            .sender-details {
              font-size: 8px;
              line-height: 1.2;
              color: #555;
              margin-bottom: 6px;
            }
            .vertical-barcode-container {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: visible;
              position: relative;
              width: 100%;
              margin-top: 5px;
            }
            .vertical-barcode-container svg {
              transform: rotate(90deg);
              transform-origin: center;
              width: 90px;
              height: 25px;
            }

            /* Route Code Styling */
            .route-block {
              border: 2px solid black;
              background-color: #f3f4f6;
              padding: 8px;
              text-align: center;
              margin-bottom: 8px;
            }
            .route-title {
              font-size: 9px;
              font-weight: 900;
              margin-bottom: 2px;
              letter-spacing: 0.5px;
            }
            .route-value {
              font-size: 24px;
              font-weight: 900;
              letter-spacing: 2px;
              font-family: 'Courier New', Courier, monospace;
            }

            /* Footer Styling */
            .label-footer {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              font-size: 8px;
              font-weight: bold;
              border-top: 1px solid black;
              padding-top: 6px;
            }
            .footer-left {
              text-align: left;
              line-height: 1.4;
            }
            .footer-left div {
              font-family: 'Courier New', Courier, monospace;
            }
            .footer-right {
              text-align: right;
            }
            .destination-hub {
              font-size: 12px;
              font-weight: 900;
              font-family: system-ui, sans-serif;
            }

            @media print {
              .printable-label {
                margin: 0;
                border: 3px solid black;
              }
              body {
                background: white;
              }
            }
          </style>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        </head>
        <body>
          ${labelsHtml}
          <script>
            window.onload = function() {
              const orders = ${JSON.stringify(ordersToPrint.map(o => o.id))};
              orders.forEach(id => {
                try {
                  JsBarcode("#barcode-top-" + id, id, {
                    format: "CODE128",
                    height: 50,
                    width: 1.3,
                    displayValue: true,
                    fontSize: 11,
                    margin: 5
                  });
                  JsBarcode("#barcode-vert-" + id, id, {
                    format: "CODE128",
                    height: 20,
                    width: 1.0,
                    displayValue: false,
                    margin: 0
                  });
                } catch (e) {
                  console.error(e);
                }
              });
              
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

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

      {/* Selected Action Bar */}
      {selectedOrderIds.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2">
            <span className="font-black text-primary text-lg">{selectedOrderIds.length}</span>
            <span className="font-bold text-sm">طلبات محددة</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const ordersToPrint = orders.filter(o => selectedOrderIds.includes(o.id));
                handlePrintLabels(ordersToPrint);
              }}
              className="bg-primary hover:bg-primary/95 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all text-sm"
            >
              <Printer size={16} />
              طباعة بوليصات الشحن المحددة
            </button>
            <button
              onClick={() => setSelectedOrderIds([])}
              className="bg-white border hover:bg-secondary px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
            >
              إلغاء التحديد
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-secondary/30 text-muted-foreground text-xs uppercase font-black">
                <tr>
                  <th className="px-4 py-4 text-center w-12">
                    <input 
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e, filteredOrders)}
                      checked={filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length}
                      className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                    />
                  </th>
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
                    <td className="px-4 py-4 text-center">
                      <input 
                        type="checkbox"
                        checked={selectedOrderIds.includes(order.id)}
                        onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                      />
                    </td>
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
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-black">تفاصيل الطلب #{selectedOrder.id.slice(0, 8)}</h2>
                <button 
                  onClick={() => handlePrintLabels([selectedOrder])}
                  className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition"
                >
                  <Printer size={16} />
                  طباعة البوليصة
                </button>
              </div>
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
                          <div className="flex flex-wrap gap-2 mt-1 items-center">
                            <span className="text-xs text-muted-foreground">{item.quantity} × {item.price} ل.ت</span>
                            {item.color && (
                              <span className="text-xs font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                اللون: {item.color}
                              </span>
                            )}
                            {item.size && (
                              <span className="text-xs font-bold px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded-full">
                                المقاس: {item.size}
                              </span>
                            )}
                          </div>
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
