import { createFileRoute } from "@tanstack/react-router";
import { useBlogs } from "@/lib/firestore-hooks";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { Plus, Search, Edit2, Trash2, Loader2, X, Save, BookOpen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { MultiLangInput } from "@/components/admin/MultiLangInput";
import { tl } from "@/lib/i18n";

export const Route = createFileRoute("/admin/blogs")({
  component: AdminBlogs,
});

function AdminBlogs() {
  const { data: blogs, loading } = useBlogs();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState<any>({
    title: { ar: "", tr: "", en: "" },
    excerpt: { ar: "", tr: "", en: "" },
    content: { ar: "", tr: "", en: "" },
    author: "فريق Treemass",
    category: "نصائح",
    image: "",
    date: new Date().toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" }),
    readTime: "5 دقائق",
  });

  const filteredBlogs = blogs.filter(b =>
    tl(b.title as any, "ar").toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setFormData({
      title: typeof blog.title === "string" ? { ar: blog.title } : blog.title || { ar: "" },
      excerpt: typeof blog.excerpt === "string" ? { ar: blog.excerpt } : blog.excerpt || { ar: "" },
      content: typeof blog.content === "string" ? { ar: blog.content } : blog.content || { ar: "" },
      author: blog.author || "فريق Treemass",
      category: blog.category || "نصائح",
      image: blog.image || "",
      date: blog.date || "",
      readTime: blog.readTime || "5 دقائق",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه المقالة؟")) return;
    try {
      await deleteDoc(doc(db, "blogs", id));
      toast.success("تم حذف المقالة بنجاح");
    } catch (error) {
      toast.error("فشل حذف المقالة");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const data = {
        ...formData,
        updatedAt: serverTimestamp(),
      };

      if (editingBlog) {
        await updateDoc(doc(db, "blogs", editingBlog.id), data);
        toast.success("تم تحديث المقالة بنجاح");
      } else {
        await addDoc(collection(db, "blogs"), {
          ...data,
          createdAt: serverTimestamp(),
        });
        toast.success("تم إضافة المقالة بنجاح");
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setEditingBlog(null);
    setFormData({
      title: { ar: "", tr: "", en: "" },
      excerpt: { ar: "", tr: "", en: "" },
      content: { ar: "", tr: "", en: "" },
      author: "فريق Treemass",
      category: "نصائح",
      image: "",
      date: new Date().toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" }),
      readTime: "5 دقائق",
    });
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black mb-1 flex items-center gap-2 justify-end">
            إدارة المقالات
            <BookOpen className="text-primary w-7 h-7" />
          </h1>
          <p className="text-muted-foreground">يمكنك إضافة، تعديل أو حذف المقالات والمدونات من هنا.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform self-start md:self-auto"
        >
          <Plus size={20} />
          إضافة مقالة جديدة
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالعنوان، الكاتب أو القسم..." 
            className="w-full bg-secondary/30 border-none rounded-xl pr-10 pl-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-right"
          />
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-secondary/30 text-muted-foreground text-xs uppercase font-black">
                <tr>
                  <th className="px-6 py-4">المقالة</th>
                  <th className="px-6 py-4">الكاتب</th>
                  <th className="px-6 py-4">القسم</th>
                  <th className="px-6 py-4">التاريخ</th>
                  <th className="px-6 py-4">وقت القراءة</th>
                  <th className="px-6 py-4 text-left">العمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 justify-start">
                        <div className="w-16 h-12 rounded-lg bg-secondary/50 overflow-hidden shrink-0">
                          <img src={blog.image} alt={tl(blog.title as any, "ar")} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold line-clamp-1">{tl(blog.title as any, "ar")}</h4>
                          <p className="text-[10px] text-muted-foreground">ID: #{blog.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-muted-foreground">{blog.author}</td>
                    <td className="px-6 py-4 font-bold text-primary">{blog.category}</td>
                    <td className="px-6 py-4 text-muted-foreground">{blog.date}</td>
                    <td className="px-6 py-4 font-bold">{blog.readTime || "5 دقائق"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(blog)}
                          className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors" title="تعديل">
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(blog.id)}
                          className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors" title="حذف">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBlogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-muted-foreground">
                      لا يوجد مقالات لعرضها.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Blog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-black">{editingBlog ? "تعديل مقالة" : "إضافة مقالة جديدة"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-right">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <MultiLangInput
                    label="عنوان المقالة"
                    required
                    value={formData.title}
                    onChange={(v) => setFormData({ ...formData, title: v })}
                  />
                </div>

                <div>
                  <label className="text-sm font-bold block mb-2">الكاتب *</label>
                  <input 
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full border rounded-xl px-4 py-2.5 outline-none text-right"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold block mb-2">القسم *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full border rounded-xl px-4 py-2.5 outline-none text-right"
                  >
                    <option value="نصائح">نصائح</option>
                    <option value="موضة">موضة</option>
                    <option value="صحة الطفل">صحة الطفل</option>
                    <option value="دليل التسوق">دليل التسوق</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold block mb-2">التاريخ *</label>
                  <input 
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full border rounded-xl px-4 py-2.5 outline-none text-right"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold block mb-2">وقت القراءة *</label>
                  <input 
                    type="text"
                    required
                    value={formData.readTime}
                    onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                    className="w-full border rounded-xl px-4 py-2.5 outline-none text-right"
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUpload 
                    label="صورة المقالة الرئيسية"
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                  />
                </div>

                <div className="md:col-span-2">
                  <MultiLangInput
                    label="مقتطف قصير (يظهر في صفحة قائمة المقالات)"
                    multiline
                    rows={2}
                    required
                    value={formData.excerpt}
                    onChange={(v) => setFormData({ ...formData, excerpt: v })}
                  />
                </div>

                <div className="md:col-span-2">
                  <MultiLangInput
                    label="المحتوى الكامل للمقالة (يدعم تنسيق Markdown)"
                    multiline
                    rows={12}
                    required
                    value={formData.content}
                    onChange={(v) => setFormData({ ...formData, content: v })}
                  />
                </div>
              </div>

              <div className="pt-6 border-t flex gap-3">
                <button 
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  {formLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={20} />}
                  {editingBlog ? "حفظ التغييرات" : "إضافة المقالة"}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-secondary text-foreground font-bold py-3 rounded-xl hover:bg-secondary/80 transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
