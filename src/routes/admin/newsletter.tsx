import { createFileRoute } from "@tanstack/react-router";
import { useNewsletter } from "@/lib/firestore-hooks";
import { db } from "@/lib/firebase";
import { deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { Trash2, Mail, Loader2, Download, Search, UserMinus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/newsletter")({
  component: AdminNewsletter,
});

function AdminNewsletter() {
  const { data: subscribers, loading } = useNewsletter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المشترك؟")) return;
    try {
      await deleteDoc(doc(db, "newsletter", id));
      toast.success("تم حذف المشترك بنجاح");
    } catch (error) {
      toast.error("فشل حذف المشترك");
    }
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Subscribed At\n"
      + subscribers.map(s => `${s.email},${s.createdAt?.toDate?.()?.toLocaleString() || ''}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "newsletter_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black mb-1">النشرة البريدية</h1>
          <p className="text-muted-foreground">قائمة المشتركين في النشرة البريدية ({subscribers.length}).</p>
        </div>
        <button 
          onClick={exportCSV}
          className="bg-secondary text-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-secondary/80 transition-colors"
        >
          <Download size={20} />
          تصدير القائمة (CSV)
        </button>
      </div>

      <div className="bg-white rounded-3xl border overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="البحث عن بريد إلكتروني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-secondary/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="text-sm font-bold text-muted-foreground">
            عرض {filteredSubscribers.length} من أصل {subscribers.length}
          </div>
        </div>

        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-secondary/30 text-muted-foreground text-xs uppercase font-black">
                <tr>
                  <th className="px-6 py-4">البريد الإلكتروني</th>
                  <th className="px-6 py-4">تاريخ الاشتراك</th>
                  <th className="px-6 py-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4 font-bold flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Mail size={14} />
                      </div>
                      {sub.email}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {sub.createdAt?.toDate?.()?.toLocaleDateString('ar-EG') || "---"}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDelete(sub.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                        title="حذف"
                      >
                        <UserMinus size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredSubscribers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-20 text-center text-muted-foreground">
                      <Mail size={48} className="mx-auto mb-4 opacity-10" />
                      <p>لا يوجد مشتركين مطابقين للبحث</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
