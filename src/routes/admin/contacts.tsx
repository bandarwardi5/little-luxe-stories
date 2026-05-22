import { createFileRoute } from "@tanstack/react-router";
import { useContacts } from "@/lib/firestore-hooks";
import { db } from "@/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { Trash2, Mail, Loader2, Search, MessageSquare, User, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/contacts")({
  component: AdminContacts,
});

function AdminContacts() {
  const { data: contacts, loading } = useContacts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
    try {
      await deleteDoc(doc(db, "contacts", id));
      toast.success("تم حذف الرسالة بنجاح");
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (error) {
      toast.error("فشل حذف الرسالة");
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div>
        <h1 className="text-2xl font-black mb-1">رسائل التواصل</h1>
        <p className="text-muted-foreground">عرض وإدارة رسائل العملاء الواردة ({contacts.length}).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative mb-6">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="بحث في الرسائل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-white border rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
            {loading ? (
              <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
            ) : filteredContacts.map((contact) => (
              <button 
                key={contact.id}
                onClick={() => setSelectedMessage(contact)}
                className={`w-full text-right p-4 rounded-2xl border transition-all ${selectedMessage?.id === contact.id ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" : "bg-white hover:border-primary"}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold line-clamp-1">{contact.name}</p>
                  <span className={`text-[10px] ${selectedMessage?.id === contact.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {contact.createdAt?.toDate?.()?.toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <p className={`text-xs line-clamp-2 ${selectedMessage?.id === contact.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {contact.message}
                </p>
              </button>
            ))}
            {filteredContacts.length === 0 && !loading && (
              <div className="text-center py-10 text-muted-foreground">لا توجد رسائل</div>
            )}
          </div>
        </div>

        {/* Message View */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-3xl border p-8 space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                    <User size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black">{selectedMessage.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail size={14} />
                      {selectedMessage.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg">
                    <Calendar size={14} />
                    {selectedMessage.createdAt?.toDate?.()?.toLocaleString('ar-EG')}
                  </div>
                  <button 
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <MessageSquare size={18} />
                  الرسالة:
                </div>
                <div className="bg-secondary/30 p-6 rounded-2xl leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message || "لا يوجد نص للرسالة"}
                </div>
              </div>

              <div className="pt-6">
                <a 
                  href={`mailto:${selectedMessage.email}`}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                  <Mail size={18} />
                  الرد عبر البريد الإلكتروني
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-secondary/20 rounded-3xl border border-dashed border-muted text-muted-foreground">
              <MessageSquare size={64} className="opacity-10 mb-4" />
              <p className="font-bold">اختر رسالة لعرض تفاصيلها</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
