import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadImage, imageUrl } from "@/lib/firebase";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "صورة المنتج" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صالح");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة كبير جداً (الحد الأقصى 5 ميجابايت)");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success("تم رفع الصورة بنجاح");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("فشل رفع الصورة، يرجى المحاولة لاحقاً");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-black block">{label}</label>
      
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Preview Container */}
        <div className="relative w-32 h-32 rounded-2xl border-2 border-dashed border-muted flex items-center justify-center bg-secondary/30 overflow-hidden group">
          {value ? (
            <>
              <img 
                src={imageUrl(value)} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <ImageIcon size={32} className="text-muted" />
          )}
          
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="animate-spin text-white" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-3 w-full">
          <div className="flex gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Upload size={18} />
              {value ? "تغيير الصورة" : "رفع صورة جديدة"}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            * يمكنك رفع ملف (JPG, PNG, WebP) بحد أقصى 5 ميجابايت.
          </p>
        </div>
      </div>
    </div>
  );
}
