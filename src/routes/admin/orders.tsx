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

const STATUSES = {
  all: {
    label: "الكل",
    desc: "عرض جميع الطلبات بدون تصفية",
    color: "bg-secondary text-muted-foreground"
  },
  pending: {
    label: "جديد (Yeni)",
    desc: "تم إنشاء الطلب. لم تستلمه شركة الشحن بعد.",
    color: "bg-blue-100 text-blue-800"
  },
  processing: {
    label: "تمت المعالجة (İşleme Alınanlar)",
    desc: "تم استلام الشحنة. تم طباعة البوليصة. دخلت مركز الفرز.",
    color: "bg-amber-100 text-amber-800"
  },
  shipping: {
    label: "قيد النقل (Taşıma Durumunda)",
    desc: "الشحنة في الطريق بين المراكز. أو خرجت مع المندوب للتسليم.",
    color: "bg-indigo-100 text-indigo-800"
  },
  delivered: {
    label: "تم التسليم (Teslim Edilen)",
    desc: "تم تسليم الشحنة للعميل.",
    color: "bg-emerald-100 text-emerald-800"
  },
  reshipped: {
    label: "إعادة الإرسال (Yeniden Gönderimler)",
    desc: "فشل التسليم. أعيدت محاولة التوصيل. أو أعيد شحنها من جديد.",
    color: "bg-purple-100 text-purple-800"
  },
  on_hold: {
    label: "معلقة (Askıdaki Siparişler)",
    desc: "عنوان غير مكتمل. رقم هاتف غير صحيح. بانتظار دفع. بانتظار مراجعة إدارية.",
    color: "bg-rose-100 text-rose-800"
  },
  cancelled: {
    label: "ملغي (İptal)",
    desc: "تم إلغاء الطلب.",
    color: "bg-neutral-100 text-neutral-800"
  }
};

function AdminOrders() {
  const { data: orders, loading } = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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

      const districtCity = [order.district, order.city].filter(Boolean).join(', ');

      return `
        <div class="printable-label">
          <!-- Başlık: Kargo Bilgileri -->
          <div class="label-header">
            <div class="header-logo">TREEMASS EXPRESS</div>
            <div class="header-meta">
              <div>Tarih: ${orderDate}</div>
              <div>Paket: 1/1</div>
              <div>Desi: 1.0</div>
            </div>
          </div>

          <!-- Ana Barkod -->
          <div class="barcode-section">
            <div class="barcode-wrapper">
              <svg id="barcode-top-${order.id}"></svg>
            </div>
          </div>

          <!-- Alıcı ve Gönderici Bilgileri -->
          <div class="info-block">
            <div class="info-left">
              <div class="info-section-title">ALICI BİLGİLERİ</div>
              <div class="recipient-name">${order.customerName || ""}</div>
              <div class="recipient-address">${order.address || ""}</div>
              <div class="recipient-district">${districtCity || ""}</div>
              <div class="recipient-city">${(order.city || "").toUpperCase()} / TÜRKİYE</div>
              <div class="recipient-phone">Tel: ${order.phone || ""}</div>
            </div>
            <div class="info-right">
              <div class="info-section-title">GÖNDERİCİ</div>
              <div class="sender-name">TREEMASS</div>
              <div class="sender-details">TREEMASS DEPO<br/>İSTANBUL / TÜRKİYE</div>
              <div class="vertical-barcode-container">
                <svg id="barcode-vert-${order.id}"></svg>
              </div>
            </div>
          </div>

          <!-- Sevk Bölgesi -->
          <div class="route-block">
            <div class="route-title">SEVK BÖLGESİ / ROTA KODU</div>
            <div class="route-value">${routeCode}</div>
          </div>

          <!-- Alt Bilgiler -->
          <div class="label-footer">
            <div class="footer-left">
              <div>Sipariş No: ${order.id}</div>
              <div>Tel: ${order.phone || ""}</div>
            </div>
            <div class="footer-right">
              <div class="destination-hub">${(order.district || order.city || "MERKEZ").toUpperCase()} ŞUBESİ</div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Kargo Etiketleri Yazdır</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: white;
              color: black;
            }
            .printable-label {
              width: 190mm;
              height: 277mm;
              box-sizing: border-box;
              border: 5px solid black;
              padding: 25px;
              margin: 0 auto;
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
              border-bottom: 4px solid black;
              padding-bottom: 12px;
              margin-bottom: 12px;
            }
            .header-logo {
              font-size: 32px;
              font-weight: 900;
              letter-spacing: 1px;
            }
            .header-meta {
              text-align: right;
              font-size: 16px;
              font-weight: bold;
              line-height: 1.4;
            }

            /* Barcode Section */
            .barcode-section {
              text-align: center;
              margin-bottom: 16px;
              padding: 8px 0;
              border-bottom: 2px solid black;
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
              border: 2px solid black;
              margin-bottom: 16px;
              flex: 1;
              min-height: 380px;
            }
            .info-left {
              flex: 7;
              padding: 16px;
              border-right: 2px solid black;
              display: flex;
              flex-direction: column;
              gap: 8px;
              text-align: right;
            }
            .info-right {
              flex: 3;
              padding: 16px;
              display: flex;
              flex-direction: column;
              gap: 8px;
              align-items: center;
              text-align: center;
              background-color: #fafafa;
            }
            .info-section-title {
              font-size: 14px;
              font-weight: 900;
              color: #333;
              border-bottom: 2px dashed black;
              padding-bottom: 4px;
              margin-bottom: 8px;
              width: 100%;
              text-align: center;
              font-family: sans-serif;
            }
            .recipient-name {
              font-size: 26px;
              font-weight: 900;
              margin-bottom: 4px;
              word-break: break-word;
            }
            .recipient-address {
              font-size: 20px;
              font-weight: bold;
              line-height: 1.4;
              word-break: break-word;
              flex: 1;
            }
            .recipient-district {
              font-size: 20px;
              font-weight: 900;
              color: #333;
              font-family: 'Courier New', Courier, monospace;
            }
            .recipient-city {
              font-size: 22px;
              font-weight: 900;
              border-top: 1px solid #ddd;
              padding-top: 6px;
              font-family: 'Courier New', Courier, monospace;
            }
            .recipient-phone {
              font-size: 20px;
              font-weight: 900;
              font-family: 'Courier New', Courier, monospace;
            }
            .sender-name {
              font-size: 20px;
              font-weight: 900;
            }
            .sender-details {
              font-size: 14px;
              line-height: 1.4;
              color: #555;
              margin-bottom: 12px;
            }
            .vertical-barcode-container {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: visible;
              position: relative;
              width: 100%;
              margin-top: 15px;
            }
            .vertical-barcode-container svg {
              transform: rotate(90deg);
              transform-origin: center;
              width: 180px;
              height: 45px;
            }

            /* Route Code Styling */
            .route-block {
              border: 4px solid black;
              background-color: #f3f4f6;
              padding: 16px;
              text-align: center;
              margin-bottom: 16px;
            }
            .route-title {
              font-size: 16px;
              font-weight: 900;
              margin-bottom: 4px;
              letter-spacing: 0.5px;
            }
            .route-value {
              font-size: 54px;
              font-weight: 900;
              letter-spacing: 3px;
              font-family: 'Courier New', Courier, monospace;
            }

            /* Footer Styling */
            .label-footer {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              font-size: 16px;
              font-weight: bold;
              border-top: 2px solid black;
              padding-top: 12px;
            }
            .footer-left {
              text-align: left;
              line-height: 1.5;
            }
            .footer-left div {
              font-family: 'Courier New', Courier, monospace;
            }
            .footer-right {
              text-align: right;
            }
            .destination-hub {
              font-size: 26px;
              font-weight: 900;
              font-family: system-ui, sans-serif;
            }

            @media print {
              .printable-label {
                margin: 0;
                border: 5px solid black;
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
                    height: 90,
                    width: 2.2,
                    displayValue: true,
                    fontSize: 18,
                    margin: 8
                  });
                  JsBarcode("#barcode-vert-" + id, id, {
                    format: "CODE128",
                    height: 35,
                    width: 1.5,
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
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
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
    return STATUSES[status as keyof typeof STATUSES]?.label || status;
  };

  const getStatusStyle = (status: string) => {
    return STATUSES[status as keyof typeof STATUSES]?.color || "bg-secondary text-muted-foreground";
  };

  const getStatusDesc = (status: string) => {
    return STATUSES[status as keyof typeof STATUSES]?.desc || "";
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
      <div className="space-y-4">
        <div className="flex border-b gap-8 overflow-x-auto scrollbar-hide">
          {Object.entries(STATUSES).map(([key, val]) => (
            <button 
              key={key} 
              onClick={() => setStatusFilter(key)}
              title={val.desc}
              className={`pb-4 text-sm font-bold transition-colors relative whitespace-nowrap ${
                statusFilter === key ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {val.label}
              {statusFilter === key && <span className="absolute bottom-0 right-0 left-0 h-1 bg-primary rounded-full"></span>}
            </button>
          ))}
        </div>
        
        {/* Active Status Info Bar */}
        <div className="bg-secondary/20 px-4 py-2.5 rounded-xl text-xs text-muted-foreground flex items-center gap-2 animate-in fade-in duration-200">
          <span className="font-black text-primary">💡 {STATUSES[statusFilter as keyof typeof STATUSES]?.label}:</span>
          <span>{STATUSES[statusFilter as keyof typeof STATUSES]?.desc}</span>
        </div>
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
                      <div className="relative group inline-block">
                        <span 
                          title={getStatusDesc(order.status)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black cursor-help ${getStatusStyle(order.status)}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                        {/* Custom Tooltip */}
                        <div className="absolute z-30 bottom-full right-1/2 translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-gray-900 text-white text-[11px] rounded-lg p-2 text-center shadow-lg font-normal leading-normal whitespace-normal transition-all duration-200">
                          {getStatusDesc(order.status)}
                          <div className="absolute top-full right-1/2 translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
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
                  <p className="text-sm font-bold mt-1">
                    {selectedOrder.district ? `${selectedOrder.district}, ${selectedOrder.city}` : selectedOrder.city}
                  </p>
                </div>
                <div className="bg-secondary/20 p-4 rounded-2xl">
                  <h4 className="text-xs font-bold text-muted-foreground mb-3 uppercase">الدفع والحالة</h4>
                  <p className="text-sm font-bold">{selectedOrder.paymentMethod === 'cash_on_delivery' ? 'عند الاستلام' : selectedOrder.paymentMethod}</p>
                  <div className="relative group inline-block mt-2">
                    <span 
                      title={getStatusDesc(selectedOrder.status)}
                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-black cursor-help ${getStatusStyle(selectedOrder.status)}`}
                    >
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                    {/* Custom Tooltip */}
                    <div className="absolute z-30 bottom-full right-1/2 translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-gray-900 text-white text-[11px] rounded-lg p-2 text-center shadow-lg font-normal leading-normal whitespace-normal transition-all duration-200">
                      {getStatusDesc(selectedOrder.status)}
                      <div className="absolute top-full right-1/2 translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                    </div>
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
                <div className="space-y-2 w-full md:w-80">
                  <h4 className="font-black mb-2">تحديث الحالة</h4>
                  <div className="relative">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                      className="w-full bg-secondary/30 border border-neutral-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary transition font-bold text-sm text-foreground cursor-pointer"
                    >
                      {Object.entries(STATUSES).map(([statusKey, statusVal]) => {
                        if (statusKey === "all") return null;
                        return (
                          <option key={statusKey} value={statusKey} className="font-bold">
                            {statusVal.label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-normal mt-1.5">
                    💡 {STATUSES[selectedOrder.status as keyof typeof STATUSES]?.desc || ""}
                  </p>
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
