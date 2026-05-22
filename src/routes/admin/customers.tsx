import { createFileRoute } from "@tanstack/react-router";
import { useUsers } from "@/lib/firestore-hooks";
import { db } from "@/lib/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Trash2, Users, Loader2, Search, UserCheck, UserX, Shield, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

function AdminCustomers() {
  const { data: customers, loading } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العميل؟")) return;
    try {
      await deleteDoc(doc(db, "users", id));
      toast.success("تم حذف العميل بنجاح");
    } catch (error) {
      toast.error("فشل حذف العميل");
    }
  };

  const toggleAdmin = async (customer: any) => {
    try {
      await updateDoc(doc(db, "users", customer.id), {
        isAdmin: !customer.isAdmin
      });
      toast.success(`تم ${customer.isAdmin ? 'إزالة' : 'منح'} صلاحيات المسؤول بنجاح`);
    } catch (error) {
      toast.error("فشل تحديث الصلاحيات");
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black mb-1">إدارة العملاء</h1>
          <p className="text-muted-foreground">عرض وإدارة حسابات المستخدمين والمسؤولين ({customers.length}).</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="البحث عن اسم أو بريد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-secondary/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-secondary/30 text-muted-foreground text-xs uppercase font-black">
                <tr>
                  <th className="px-6 py-4">العميل</th>
                  <th className="px-6 py-4">معلومات التواصل</th>
                  <th className="px-6 py-4">الصلاحية</th>
                  <th className="px-6 py-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {customer.displayName?.[0] || customer.email?.[0] || "?"}
                        </div>
                        <div>
                          <p className="font-bold">{customer.displayName || "بدون اسم"}</p>
                          <p className="text-xs text-muted-foreground">ID: {customer.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail size={12} />
                          {customer.email}
                        </div>
                        {customer.phoneNumber && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone size={12} />
                            {customer.phoneNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black flex items-center w-fit gap-1 ${customer.isAdmin ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                        {customer.isAdmin ? <Shield size={10} /> : <Users size={10} />}
                        {customer.isAdmin ? "مسؤول" : "عميل"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => toggleAdmin(customer)}
                          className={`p-2 rounded-lg transition-all ${customer.isAdmin ? 'bg-secondary text-muted-foreground hover:bg-rose-50' : 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white'}`}
                          title={customer.isAdmin ? "إلغاء المسؤول" : "جعل مسؤول"}
                        >
                          {customer.isAdmin ? <UserX size={18} /> : <UserCheck size={18} />}
                        </button>
                        <button 
                          onClick={() => handleDelete(customer.id)}
                          className="p-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                          title="حذف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
