import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Truck, RefreshCcw, CreditCard, PackageSearch, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/faqs")({
  component: FaqsPage,
  head: () => ({
    meta: [
      { title: "الأسئلة الشائعة | Treemass" },
      { name: "description", content: "إجابات على الأسئلة الشائعة حول التسوق والشحن في Treemass إسطنبول." },
    ],
  }),
});

function FaqsPage() {
  const faqs = [
    {
      category: "الشحن والتوصيل",
      icon: Truck,
      questions: [
        { q: "كم يستغرق الشحن والتوصيل؟", a: "يستغرق الشحن والتوصيل عادة من 1 إلى 3 أيام عمل داخل إسطنبول، ومن 3 إلى 5 أيام لبقية المدن التركية." },
        { q: "كم تبلغ تكلفة الشحن؟", a: "الشحن مجاني لجميع الطلبات التي تتجاوز 500 ليرة تركية. للطلبات الأقل من ذلك، تبلغ تكلفة الشحن 50 ليرة." },
        { q: "هل يتوفر الشحن الدولي؟", a: "نعم، نوفر الشحن الدولي لجميع دول العالم عبر شركات شحن موثوقة." }
      ]
    },
    {
      category: "الإرجاع والاستبدال",
      icon: RefreshCcw,
      questions: [
        { q: "هل يمكنني إرجاع أو استبدال المنتجات؟", a: "نعم، يمكنك إرجاع أو استبدال المنتجات خلال 30 يوماً من تاريخ الشراء، بشرط أن تكون المنتجات في حالتها الأصلية غير مستخدمة ومع وجود الفاتورة." },
        { q: "كيف أسترد أموالي بعد الإرجاع؟", a: "يتم إرجاع المبلغ إلى نفس طريقة الدفع المستخدمة خلال 7-14 يوم عمل بعد استلامنا للمنتج المرتجع وفحصه." },
        { q: "هل هناك رسوم على الإرجاع؟", a: "الإرجاع مجاني في حال كان هناك عيب مصنعي أو خطأ في الطلب. أما في حالة الإرجاع لأسباب أخرى، يتحمل العميل رسوم الشحن." }
      ]
    },
    {
      category: "الدفع",
      icon: CreditCard,
      questions: [
        { q: "ما هي طرق الدفع المتاحة؟", a: "نقبل الدفع عبر البطاقات الائتمانية (فيزا، ماستركارد)، مدى، Apple Pay، بالإضافة إلى خيار الدفع عند الاستلام في بعض المدن." },
        { q: "هل الدفع آمن على الموقع؟", a: "نعم بالتأكيد. نستخدم أحدث تقنيات التشفير لحماية بياناتك، ولا نحتفظ بأي معلومات لبطاقاتك الائتمانية على خوادمنا." }
      ]
    },
    {
      category: "الطلبات",
      icon: PackageSearch,
      questions: [
        { q: "كيف يمكنني تتبع طلبي؟", a: "بعد إتمام عملية الشراء، ستتلقى رسالة نصية وبريداً إلكترونياً يحتوي على رقم التتبع ورابط لمتابعة حالة طلبك عبر موقع شركة الشحن." },
        { q: "هل يمكنني تعديل الطلب بعد تأكيده؟", a: "يمكنك تعديل طلبك خلال ساعة واحدة من تأكيده عن طريق التواصل مع خدمة العملاء. بعد هذه المدة لا نضمن إمكانية التعديل إذا تم تجهيز الطلب." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="bg-banner-peach/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">كيف يمكننا مساعدتك؟</h1>
          <p className="text-muted-foreground">إجابات سريعة للأسئلة الأكثر شيوعاً</p>
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
          <h3 className="text-2xl font-bold mb-4">لم تجد إجابة لسؤالك؟</h3>
          <p className="mb-6 text-primary-foreground/80">فريق خدمة العملاء متواجد على مدار الساعة للرد على جميع استفساراتك.</p>
          <a href="/contact" className="inline-block bg-background text-primary font-bold px-8 py-3 rounded hover:bg-white transition-colors shadow-sm">
            تواصل معنا الآن
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
