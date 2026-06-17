import { useLang } from "@/lib/i18n";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  const { lang, dir } = useLang();

  const tooltipText = {
    ar: "تواصل معنا عبر واتساب",
    tr: "WhatsApp ile iletişime geçin",
    en: "Chat with us on WhatsApp",
  }[lang] || "WhatsApp";

  return (
    <a
      href="https://wa.me/905070222149"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp Contact"
      dir="ltr"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-2"
    >
      {/* Tooltip text */}
      <span className="max-w-0 overflow-hidden opacity-0 bg-background text-foreground border text-xs font-bold px-3 py-2 rounded-xl shadow-lg transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 whitespace-nowrap">
        {tooltipText}
      </span>

      {/* Pulsing button container */}
      <div className="relative">
        {/* Ring wave animation */}
        <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping duration-1000"></span>
        
        {/* Main WhatsApp Button */}
        <div className="relative w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer">
          {/* Custom WhatsApp SVG Icon */}
          <svg
            className="w-7 h-7 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.774 9.774 0 0 0-6.979-2.878c-5.43 0-9.854 4.37-9.858 9.8a9.673 9.673 0 0 0 1.503 5.176l-.99 3.616 3.72-.962zm10.749-6.395c-.3-.15-1.77-.875-2.045-.976-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.487-.892-.796-1.493-1.78-1.668-2.08-.175-.3-.018-.463.13-.611.134-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.589-.493-.51-.675-.52-.172-.007-.368-.009-.565-.009-.197 0-.518.074-.789.374-.27.3-1.03 1.01-1.03 2.46 0 1.45 1.05 2.85 1.196 3.05.147.2 2.07 3.16 5.01 4.43.7.3 1.25.48 1.67.61.7.22 1.34.19 1.85.11.57-.08 1.77-.72 2.025-1.425.25-.705.25-1.31.175-1.425-.075-.115-.275-.19-.575-.34z" />
          </svg>
        </div>
      </div>
    </a>
  );
}
