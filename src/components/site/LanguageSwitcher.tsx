import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useLang, type Lang } from "@/lib/i18n";

const OPTIONS: Array<{ key: Lang; label: string; short: string }> = [
  { key: "ar", label: "العربية", short: "AR" },
  { key: "tr", label: "Türkçe", short: "TR" },
  { key: "en", label: "English", short: "EN" },
];

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = OPTIONS.find((o) => o.key === lang)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 transition-colors text-xs font-bold"
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
        <span>{compact ? current.short : current.label}</span>
      </button>
      {open && (
        <div className="absolute top-full mt-2 right-0 bg-white border rounded-xl shadow-xl z-[200] min-w-[140px] overflow-hidden">
          {OPTIONS.map((o) => (
            <button
              key={o.key}
              onClick={() => {
                setLang(o.key);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-secondary transition text-foreground ${
                lang === o.key ? "font-bold" : ""
              }`}
            >
              <span>{o.label}</span>
              {lang === o.key && <Check className="h-3.5 w-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
