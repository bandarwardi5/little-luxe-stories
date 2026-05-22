import { useState } from "react";
import type { Multilingual } from "@/lib/i18n";

type Value = { ar?: string; tr?: string; en?: string };

function toObject(v: Multilingual | undefined): Value {
  if (!v) return { ar: "", tr: "", en: "" };
  if (typeof v === "string") return { ar: v, tr: "", en: "" };
  return { ar: v.ar || "", tr: v.tr || "", en: v.en || "" };
}

interface Props {
  label: string;
  value: Multilingual | undefined;
  onChange: (v: Value) => void;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}

const LANGS: Array<{ key: "ar" | "tr" | "en"; label: string; dir: "rtl" | "ltr" }> = [
  { key: "ar", label: "العربية", dir: "rtl" },
  { key: "tr", label: "Türkçe", dir: "ltr" },
  { key: "en", label: "English", dir: "ltr" },
];

export function MultiLangInput({ label, value, onChange, required, multiline, rows = 3, placeholder }: Props) {
  const [active, setActive] = useState<"ar" | "tr" | "en">("ar");
  const obj = toObject(value);

  const set = (k: "ar" | "tr" | "en", v: string) => {
    onChange({ ...obj, [k]: v });
  };

  const cur = LANGS.find((l) => l.key === active)!;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-bold">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <div className="flex gap-1 bg-secondary/50 rounded-lg p-1">
          {LANGS.map((l) => (
            <button
              key={l.key}
              type="button"
              onClick={() => setActive(l.key)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                active === l.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              } ${obj[l.key] ? "" : "opacity-60"}`}
              title={obj[l.key] ? "" : "(فارغ)"}
            >
              {l.label}
              {obj[l.key] && <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 align-middle" />}
            </button>
          ))}
        </div>
      </div>
      {multiline ? (
        <textarea
          required={required && active === "ar"}
          rows={rows}
          dir={cur.dir}
          value={obj[active]}
          placeholder={placeholder}
          onChange={(e) => set(active, e.target.value)}
          className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
      ) : (
        <input
          required={required && active === "ar"}
          dir={cur.dir}
          value={obj[active]}
          placeholder={placeholder}
          onChange={(e) => set(active, e.target.value)}
          className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
        />
      )}
    </div>
  );
}
