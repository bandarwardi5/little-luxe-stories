import { createFileRoute } from "@tanstack/react-router";
import { useProducts, useCategories } from "@/lib/firestore-hooks";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { Plus, Search, Edit2, Trash2, ExternalLink, Filter, Loader2, X, Save, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { MultiLangInput } from "@/components/admin/MultiLangInput";
import { tl } from "@/lib/i18n";
import { uploadImage, imageUrl } from "@/lib/firebase";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function VariationManager({ variations, onChange }: { variations: any[], onChange: (v: any[]) => void }) {
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [uploadingVideoIdx, setUploadingVideoIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [colorSearch, setColorSearch] = useState<{ [key: number]: string }>({});

  const allPossibleColors = [
    { ar: "أبيض", tr: "Beyaz", en: "White" },
    { ar: "أسود", tr: "Siyah", en: "Black" },
    { ar: "أحمر", tr: "Kırmızı", en: "Red" },
    { ar: "أزرق", tr: "Mavi", en: "Blue" },
    { ar: "أخضر", tr: "Yeşil", en: "Green" },
    { ar: "أصفر", tr: "Sarı", en: "Yellow" },
    { ar: "وردي", tr: "Pembe", en: "Pink" },
    { ar: "بنفسجي", tr: "Mor", en: "Purple" },
    { ar: "رمادي", tr: "Gri", en: "Grey" },
    { ar: "بني", tr: "Kahverengi", en: "Brown" },
    { ar: "برتقالي", tr: "Turuncu", en: "Orange" },
    { ar: "كحلي", tr: "Lacivert", en: "Navy" },
    { ar: "بيج", tr: "Bej", en: "Beige" },
  ];

  const normalizeArabic = (text: string) => {
    return text
      .replace(/[أإآ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .toLowerCase();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, variationIdx: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingIdx(variationIdx);
    try {
      const newImages = [...(variations[variationIdx].images || [])];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImage(files[i]);
        newImages.push(url);
      }
      const newVariations = [...variations];
      newVariations[variationIdx].images = newImages;
      onChange(newVariations);
      toast.success("تم رفع الصور بنجاح");
    } catch (error) {
      toast.error("فشل رفع الصور");
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>, variationIdx: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingVideoIdx(variationIdx);
    try {
      const url = await uploadImage(files[0]); // Uses standard endpoint which supports videos
      const newVariations = [...variations];
      newVariations[variationIdx].video = url;
      onChange(newVariations);
      toast.success("تم رفع الفيديو بنجاح");
    } catch (error) {
      toast.error("فشل رفع الفيديو");
    } finally {
      setUploadingVideoIdx(null);
    }
  };

  return (
    <div className="md:col-span-2 space-y-4 border-t pt-6 text-right">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">متغيرات المنتج (اللون، الفيديو، الصور، المقاسات)</h3>
        <button
          type="button"
          onClick={() => {
            onChange([...variations, { color: { ar: "", tr: "", en: "" }, images: [], video: "", sizes: [{ size: "", stock: 10 }] }]);
          }}
          className="text-xs bg-primary text-white px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-colors"
        >
          + إضافة لون جديد
        </button>
      </div>

      <div className="space-y-6">
        {variations.map((v, idx) => {
          const search = colorSearch[idx] || "";
          const normalizedSearch = normalizeArabic(search);
          const filteredColors = allPossibleColors.filter(c => 
            normalizeArabic(c.ar).includes(normalizedSearch) || 
            c.tr.toLowerCase().includes(normalizedSearch) || 
            c.en.toLowerCase().includes(normalizedSearch)
          );

          return (
            <div key={idx} className="p-5 border-2 border-dashed rounded-3xl bg-secondary/5 space-y-4 relative">
              <button 
                type="button" 
                onClick={() => {
                  const next = [...variations];
                  next.splice(idx, 1);
                  onChange(next);
                }} 
                className="absolute top-2 left-2 text-rose-500 hover:text-rose-700 p-1 bg-white rounded-full shadow border"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {/* Color with Search and Manual Entry */}
                <div className="relative group">
                  <label className="text-xs font-bold block mb-1 text-slate-700">اللون *</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="ابحث عن لون أو اكتب يدوياً..."
                        value={search || tl(v.color, "ar")}
                        onChange={(e) => {
                          const val = e.target.value;
                          setColorSearch({ ...colorSearch, [idx]: val });
                          const next = [...variations];
                          next[idx].color = { ...next[idx].color, ar: val };
                          onChange(next);
                        }}
                        className="w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary text-right"
                      />
                    </div>
                    {search && filteredColors.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-xl shadow-xl max-h-40 overflow-y-auto">
                        {filteredColors.map((c, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              const next = [...variations];
                              next[idx].color = c;
                              onChange(next);
                              setColorSearch({ ...colorSearch, [idx]: "" });
                            }}
                            className="w-full text-right px-4 py-2 text-xs hover:bg-secondary transition-colors border-b last:border-0"
                          >
                            {c.ar} ({c.tr} / {c.en})
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Option */}
                <div>
                  <label className="text-xs font-bold block mb-1 text-slate-700">فيديو اللون (رابط أو رفع من الجهاز)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="رابط الفيديو (YouTube أو مباشر)..."
                      value={v.video || ""}
                      onChange={(e) => {
                        const next = [...variations];
                        next[idx].video = e.target.value;
                        onChange(next);
                      }}
                      className="w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary text-right"
                    />
                    
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      id={`video-upload-${idx}`}
                      onChange={(e) => handleVideoUpload(e, idx)}
                    />
                    <label
                      htmlFor={`video-upload-${idx}`}
                      className="px-3 py-2 border rounded-xl text-xs font-bold bg-secondary hover:bg-secondary/80 cursor-pointer flex items-center justify-center shrink-0"
                    >
                      {uploadingVideoIdx === idx ? <Loader2 className="animate-spin w-4 h-4" /> : "رفع فيديو"}
                    </label>
                  </div>
                </div>
              </div>

              {/* Images with upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold block text-slate-700">صور هذا اللون *</label>
                <div className="flex flex-wrap gap-2">
                  {(v.images || []).map((img: string, imgIdx: number) => (
                    <div key={imgIdx} className="relative w-16 h-16 border rounded-lg overflow-hidden group">
                      <img src={imageUrl(img)} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...variations];
                          next[idx].images.splice(imgIdx, 1);
                          onChange(next);
                        }}
                        className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id={`var-upload-${idx}`}
                    onChange={(e) => handleUpload(e, idx)}
                  />
                  <label
                    htmlFor={`var-upload-${idx}`}
                    className="w-16 h-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  >
                    {uploadingIdx === idx ? <Loader2 className="animate-spin w-5 h-5" /> : <Upload size={20} />}
                  </label>
                </div>
              </div>

              {/* Sizes list */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">مقاسات ومخزون هذا اللون</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...variations];
                      next[idx].sizes = [...(next[idx].sizes || []), { size: "", stock: 10 }];
                      onChange(next);
                    }}
                    className="text-[10px] bg-secondary text-foreground px-3 py-1.5 rounded-lg font-bold hover:bg-secondary/80 transition-colors"
                  >
                    + إضافة مقاس
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {(v.sizes || []).map((s: any, sIdx: number) => (
                    <div key={sIdx} className="flex items-center gap-3 bg-white p-3 rounded-2xl border">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold block mb-1 text-slate-600">المقاس</label>
                        <input
                          type="text"
                          placeholder="مثال: 3 سنوات، XL..."
                          value={s.size}
                          onChange={(e) => {
                            const next = [...variations];
                            next[idx].sizes[sIdx].size = e.target.value;
                            onChange(next);
                          }}
                          className="w-full border rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-primary text-right"
                        />
                      </div>

                      <div className="w-28">
                        <label className="text-[10px] font-bold block mb-1 text-slate-600">المخزون</label>
                        <input
                          type="number"
                          value={s.stock}
                          onChange={(e) => {
                            const next = [...variations];
                            next[idx].sizes[sIdx].stock = Number(e.target.value);
                            onChange(next);
                          }}
                          className="w-full border rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-primary text-right"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const next = [...variations];
                          next[idx].sizes.splice(sIdx, 1);
                          onChange(next);
                        }}
                        className="text-rose-500 hover:text-rose-700 self-end mb-1.5"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminProducts() {
  const { data: products, loading } = useProducts();
  const { data: categories } = useCategories();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsMenuOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState<any>({
    code: "",
    name: { ar: "", tr: "", en: "" },
    price: 0,
    oldPrice: 0,
    category: "",
    description: { ar: "", tr: "", en: "" },
    image: "",
    images: [] as string[],
    colors: [] as any[],
    sizes: [] as string[],
    variations: [] as any[],
  });

  const filteredProducts = products.filter(p =>
    tl(p.name, "ar").toLowerCase().includes(search.toLowerCase()) ||
    tl(p.category as any, "ar").toLowerCase().includes(search.toLowerCase()) ||
    (p.code && p.code.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCodeBlur = (code: string) => {
    if (!editingProduct && code.trim()) {
      const matched = products.find(
        (p: any) => p.code && p.code.trim().toLowerCase() === code.trim().toLowerCase()
      );
      if (matched) {
        setFormData({
          code: code,
          name: typeof matched.name === "string" ? { ar: matched.name, tr: "", en: "" } : matched.name || { ar: "", tr: "", en: "" },
          price: matched.price || 0,
          oldPrice: matched.oldPrice || 0,
          category: matched.category || "",
          description: typeof matched.description === "string" ? { ar: matched.description, tr: "", en: "" } : matched.description || { ar: "", tr: "", en: "" },
          image: matched.image || "",
          images: matched.images || [],
          colors: matched.colors || [],
          sizes: matched.sizes || [],
          variations: matched.variations || [],
        });
        toast.success("تم العثور على منتج بنفس الكود. تم ملء الحقول تلقائياً.");
      }
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      code: product.code || "",
      name: typeof product.name === "string" ? { ar: product.name, tr: "", en: "" } : product.name || { ar: "", tr: "", en: "" },
      price: product.price,
      oldPrice: product.oldPrice || 0,
      category: product.category,
      description: typeof product.description === "string" ? { ar: product.description, tr: "", en: "" } : product.description || { ar: "", tr: "", en: "" },
      image: product.image || "",
      images: product.images || [],
      colors: (product.colors || []).map((c: any) => typeof c === "string" ? { ar: c, tr: "", en: "" } : c),
      sizes: product.sizes || [],
      variations: product.variations || [],
    });
    setIsMenuOpen(true);
  };


  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("تم حذف المنتج بنجاح");
    } catch (error) {
      toast.error("فشل حذف المنتج");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      // Auto-compute main image, all images, derived colors, derived sizes and inStock
      const mainImage = formData.variations?.[0]?.images?.[0] || "";
      const allImages = Array.from(new Set(formData.variations?.flatMap((v: any) => v.images || []) || [])) as string[];
      const totalStock = formData.variations?.reduce((acc: number, v: any) => 
        acc + (v.sizes?.reduce((sum: number, s: any) => sum + (Number(s.stock) || 0), 0) || 0)
      , 0) || 0;
      const derivedColors = formData.variations?.map((v: any) => v.color) || [];
      const derivedSizes = Array.from(new Set(formData.variations?.flatMap((v: any) => v.sizes?.map((s: any) => s.size) || []) || [])) as string[];

      const data = {
        ...formData,
        price: Number(formData.price),
        oldPrice: Number(formData.oldPrice),
        image: mainImage,
        images: allImages,
        colors: derivedColors,
        sizes: derivedSizes,
        inStock: totalStock,
        updatedAt: serverTimestamp(),
      };

      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), data);
        toast.success("تم تحديث المنتج بنجاح");
      } else {
        await addDoc(collection(db, "products"), {
          ...data,
          createdAt: serverTimestamp(),
        });
        toast.success("تم إضافة المنتج بنجاح");
      }
      setIsMenuOpen(false);
      resetForm();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      code: "",
      name: { ar: "", tr: "", en: "" },
      price: 0,
      oldPrice: 0,
      category: categories[0] ? (typeof categories[0].name === "string" ? categories[0].name : (categories[0].name as any)?.ar) : "",
      description: { ar: "", tr: "", en: "" },
      image: "",
      images: [],
      colors: [],
      sizes: [],
      variations: [],
    });
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black mb-1">إدارة المنتجات</h1>
          <p className="text-muted-foreground">يمكنك إضافة، تعديل أو حذف المنتجات من هنا.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsMenuOpen(true); }}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          إضافة منتج جديد
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
            placeholder="ابحث بالاسم، الكود، أو القسم..." 
            className="w-full bg-secondary/30 border-none rounded-xl pr-10 pl-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-right"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="flex-1 md:flex-none border rounded-xl px-4 py-2.5 text-sm font-bold bg-transparent outline-none text-right">
            <option>جميع الأقسام</option>
            {categories.map(c => <option key={c.id} value={typeof c.name === "string" ? c.name : (c.name as any)?.ar}>{tl(c.name as any, "ar")}</option>)}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-secondary/30 text-muted-foreground text-xs uppercase font-black">
                <tr>
                  <th className="px-6 py-4">المنتج</th>
                  <th className="px-6 py-4">القسم</th>
                  <th className="px-6 py-4">السعر</th>
                  <th className="px-6 py-4">المخزون</th>
                  <th className="px-6 py-4 text-left">العمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-secondary/50 overflow-hidden shrink-0">
                          <img src={product.image} alt={tl(product.name, "ar")} className="w-full h-full object-contain p-1" />
                        </div>
                        <div>
                          <h4 className="font-bold line-clamp-1">{tl(product.name, "ar")}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            {product.code && <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">كود: {product.code}</span>}
                            <span className="text-[10px] text-muted-foreground">ID: #{product.id.slice(0, 8)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-muted-foreground">{tl(product.category as any, "ar")}</td>
                    <td className="px-6 py-4 font-bold text-primary">{product.price} ل.ت</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">{product.inStock} قطعة</span>
                        <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${product.inStock > 20 ? "bg-emerald-500" : "bg-amber-500"}`} 
                            style={{ width: `${Math.min(product.inStock * 2, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors" title="تعديل">
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors" title="حذف">
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

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-black">{editingProduct ? "تعديل منتج" : "إضافة منتج جديد"}</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-right">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold block mb-2 text-slate-700">كود المنتج (يدوي) *</label>
                  <input 
                    type="text"
                    required
                    value={formData.code || ""}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    onBlur={(e) => handleCodeBlur(e.target.value)}
                    placeholder="TM-514..."
                    className="w-full border rounded-xl px-4 py-2.5 outline-none text-right font-bold focus:border-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <MultiLangInput
                    label="اسم المنتج"
                    required
                    value={formData.name}
                    onChange={(v) => setFormData({ ...formData, name: v })}
                  />
                </div>

                <div>
                  <label className="text-sm font-bold block mb-2 text-slate-700">الفئة *</label>
                  <select 
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full border rounded-xl px-4 py-2.5 outline-none focus:border-primary transition appearance-none bg-background text-right"
                  >
                    <option value="">اختر فئة</option>
                    {categories.map((c) => (
                      <option key={c.id} value={typeof c.name === "string" ? c.name : (c.name as any)?.ar}>{tl(c.name as any, "ar")}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold block mb-2 text-slate-700">السعر الحالي (ل.ت) *</label>
                  <input 
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full border rounded-xl px-4 py-2.5 outline-none text-right font-bold text-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold block mb-2 text-slate-700">السعر قبل الخصم (اختياري)</label>
                  <input 
                    type="number"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({...formData, oldPrice: Number(e.target.value)})}
                    className="w-full border rounded-xl px-4 py-2.5 outline-none text-right text-muted-foreground line-through focus:border-primary"
                  />
                </div>

                <VariationManager
                  variations={formData.variations || []}
                  onChange={(v) => setFormData({ ...formData, variations: v })}
                />

                {/* === Description multilingual === */}
                <div className="md:col-span-2">
                  <MultiLangInput
                    label="الوصف"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={(v) => setFormData({ ...formData, description: v })}
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
                  {editingProduct ? "حفظ التغييرات" : "إضافة المنتج"}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
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
