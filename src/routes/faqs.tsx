import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Truck, RefreshCcw, CreditCard, PackageSearch, HelpCircle } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/faqs")({
  component: FaqsPage,
  head: () => ({
    meta: [
      { title: "FAQs | Treemass" },
      { name: "description", content: "Frequently asked questions about shopping and shipping at Treemass Istanbul." },
    ],
  }),
});

function FaqsPage() {
  const { t, lang } = useLang();

  const faqs = [
    {
      category: lang === "ar" ? "الشحن والتوصيل" : lang === "tr" ? "Kargo ve Teslimat" : "Shipping & Delivery",
      icon: Truck,
      questions: lang === "ar" ? [
        { q: "كم يستغرق الشحن والتوصيل؟", a: "يستغرق الشحن والتوصيل عادة من 1 إلى 3 أيام عمل داخل إسطنبول، ومن 3 إلى 5 أيام لبقية المدن التركية." },
        { q: "كم تبلغ تكلفة الشحن؟", a: "الشحن مجاني لجميع الطلبات التي تتجاوز 500 ليرة تركية. للطلبات الأقل من ذلك، تبلغ تكلفة الشحن 50 ليرة." },
        { q: "هل يتوفر الشحن الدولي؟", a: "نعم، نوفر الشحن الدولي لجميع دول العالم عبر شركات شحن موثوقة." },
      ] : lang === "tr" ? [
        { q: "Kargo ne kadar sürer?", a: "İstanbul içinde 1-3, diğer şehirlere 3-5 iş günü sürmektedir." },
        { q: "Kargo ücreti ne kadar?", a: "500 TL üzeri siparişlerde kargo ücretsizdir. Altında 50 TL ücret alınmaktadır." },
        { q: "Uluslararası kargo var mı?", a: "Evet, güvenilir kargo şirketleri aracılığıyla dünya geneline kargo yapıyoruz." },
      ] : [
        { q: "How long does shipping take?", a: "Shipping takes 1-3 business days within Istanbul, and 3-5 days for other Turkish cities." },
        { q: "How much does shipping cost?", a: "Free shipping on orders over 500 TL. Below that, shipping costs 50 TL." },
        { q: "Do you offer international shipping?", a: "Yes, we ship worldwide through reliable courier services." },
      ],
    },
    {
      category: lang === "ar" ? "الإرجاع والاستبدال" : lang === "tr" ? "İade ve Değişim" : "Returns & Exchanges",
      icon: RefreshCcw,
      questions: lang === "ar" ? [
        { q: "هل يمكنني إرجاع أو استبدال المنتجات؟", a: "نعم، يمكنك إرجاع أو استبدال المنتجات خلال 30 يوماً من تاريخ الشراء، بشرط أن تكون المنتجات في حالتها الأصلية غير مستخدمة ومع وجود الفاتورة." },
        { q: "كيف أسترد أموالي بعد الإرجاع؟", a: "يتم إرجاع المبلغ إلى نفس طريقة الدفع المستخدمة خلال 7-14 يوم عمل بعد استلامنا للمنتج المرتجع وفحصه." },
        { q: "هل هناك رسوم على الإرجاع؟", a: "الإرجاع مجاني في حال كان هناك عيب مصنعي أو خطأ في الطلب. أما في حالة الإرجاع لأسباب أخرى، يتحمل العميل رسوم الشحن." },
      ] : lang === "tr" ? [
        { q: "Ürünleri iade veya değiştirebilir miyim?", a: "Evet, satın alma tarihinden itibaren 30 gün içinde iade veya değişim yapabilirsiniz." },
        { q: "İade sonrası para iadesi nasıl yapılır?", a: "Tutarı, ürün teslim alındıktan ve kontrol edildikten sonra 7-14 iş günü içinde iade edilir." },
        { q: "İade ücreti var mı?", a: "Üretim hatası veya yanlış ürün gönderimi durumunda iade ücretsizdir." },
      ] : [
        { q: "Can I return or exchange products?", a: "Yes, you can return or exchange products within 30 days of purchase, provided they are unused and in original condition." },
        { q: "How do I get a refund after return?", a: "Refunds are issued to the original payment method within 7-14 business days after we receive and inspect the returned item." },
        { q: "Are there return fees?", a: "Returns are free for manufacturing defects or incorrect orders. Otherwise, the customer covers shipping costs." },
      ],
    },
    {
      category: lang === "ar" ? "الدفع" : lang === "tr" ? "Ödeme" : "Payment",
      icon: CreditCard,
      questions: lang === "ar" ? [
        { q: "ما هي طرق الدفع المتاحة؟", a: "نقبل الدفع عبر البطاقات الائتمانية (فيزا، ماستركارد)، بالإضافة إلى خيار الدفع عند الاستلام." },
        { q: "هل الدفع آمن على الموقع؟", a: "نعم بالتأكيد. نستخدم أحدث تقنيات التشفير لحماية بياناتك." },
      ] : lang === "tr" ? [
        { q: "Hangi ödeme yöntemleri kabul ediliyor?", a: "Kredi kartları (Visa, Mastercard) ve kapıda ödeme seçeneğini kabul ediyoruz." },
        { q: "Sitede ödeme güvenli mi?", a: "Evet. Verilerinizi korumak için en son şifreleme teknolojilerini kullanıyoruz." },
      ] : [
        { q: "What payment methods are accepted?", a: "We accept credit cards (Visa, Mastercard) and cash on delivery." },
        { q: "Is payment on the site secure?", a: "Yes. We use the latest encryption technology to protect your data." },
      ],
    },
    {
      category: lang === "ar" ? "الطلبات" : lang === "tr" ? "Siparişler" : "Orders",
      icon: PackageSearch,
      questions: lang === "ar" ? [
        { q: "كيف يمكنني تتبع طلبي؟", a: "بعد إتمام عملية الشراء، ستتلقى رسالة نصية وبريداً إلكترونياً يحتوي على رقم التتبع." },
        { q: "هل يمكنني تعديل الطلب بعد تأكيده؟", a: "يمكنك تعديل طلبك خلال ساعة واحدة من تأكيده عن طريق التواصل مع خدمة العملاء." },
      ] : lang === "tr" ? [
        { q: "Siparişimi nasıl takip edebilirim?", a: "Satın alma işleminin ardından takip numarası içeren bir SMS ve e-posta alacaksınız." },
        { q: "Siparişi onayladıktan sonra değiştirebilir miyim?", a: "Onaydan sonraki bir saat içinde müşteri hizmetleriyle iletişime geçerek değiştirebilirsiniz." },
      ] : [
        { q: "How can I track my order?", a: "After your purchase, you'll receive an SMS and email with a tracking number." },
        { q: "Can I modify my order after placing it?", a: "You can modify your order within one hour of confirmation by contacting customer service." },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="bg-banner-peach/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("faqs.title")}</h1>
          <p className="text-muted-foreground">{t("faqs.subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="grid gap-12">
          {faqs.map((section, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <section.icon className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">{section.category}</h2>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {section.questions.map((item, i) => (
                  <AccordionItem key={i} value={`item-${idx}-${i}`} className="border-b-0 mb-2">
                    <AccordionTrigger className="text-right bg-secondary/30 px-4 rounded-lg hover:no-underline hover:bg-secondary/50 font-semibold">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground px-4 py-4 leading-relaxed bg-white border border-t-0 rounded-b-lg shadow-sm">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-primary text-primary-foreground p-8 rounded-2xl text-center">
          <h3 className="text-2xl font-bold mb-4">{t("faqs.cta_title")}</h3>
          <p className="mb-6 text-primary-foreground/80">{t("faqs.cta_desc")}</p>
          <Link to="/contact" className="inline-block bg-background text-primary font-bold px-8 py-3 rounded hover:bg-white transition-colors shadow-sm">
            {t("faqs.cta_btn")}
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
