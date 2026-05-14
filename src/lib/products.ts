import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import p5 from "@/assets/product-5.jpg";
import p6 from "@/assets/product-6.jpg";
import p7 from "@/assets/product-7.jpg";
import p8 from "@/assets/product-8.jpg";

export type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  image: string;
  category: string;
  badge?: string;
  description: string;
  inStock: number;
};

export const products: Product[] = [
  {
    id: 1,
    name: "تيشيرت أصفر بطبعة كرتونية",
    price: 49,
    image: p1,
    category: "أولاد",
    description: "تيشيرت قطني مريح باللون الأصفر الزاهي مع طبعة كرتونية لطيفة، مثالي للعب والنشاط اليومي.",
    inStock: 15,
  },
  {
    id: 2,
    name: "حذاء بناتي وردي بفيونكة",
    price: 65,
    oldPrice: 95,
    image: p2,
    category: "بنات",
    description: "حذاء بناتي ناعم باللون الوردي المريح مع فيونكة أنيقة، يوفر الراحة والأناقة لطفلتك.",
    inStock: 8,
  },
  {
    id: 3,
    name: "جاكيت جينز أولادي عصري",
    price: 145,
    image: p3,
    category: "أولاد",
    description: "جاكيت جينز متين بتصميم عصري يناسب جميع الأوقات، يمنح طفلك مظهراً رائعاً.",
    inStock: 12,
  },
  {
    id: 4,
    name: "فستان بناتي وردي بنقشة الورود",
    price: 89,
    oldPrice: 125,
    image: p4,
    category: "بنات",
    description: "فستان رقيق بنقشات ورود جميلة، مصنوع من أقمشة ناعمة تناسب بشرة الأطفال.",
    inStock: 5,
  },
  {
    id: 5,
    name: "حذاء رياضي أحمر للأطفال",
    price: 175,
    oldPrice: 199,
    image: p5,
    category: "أحذية",
    description: "حذاء رياضي خفيف الوزن ومريح، يوفر الثبات والدعم لأقدام الأطفال أثناء الحركة.",
    inStock: 20,
  },
  {
    id: 6,
    name: "أفرول رضع مخطط بألوان الباستيل",
    price: 79,
    image: p6,
    category: "رضع",
    description: "أفرول قطني ناعم جداً للرضع، بتصميم مخطط وألوان هادئة لراحة طوال اليوم.",
    inStock: 25,
  },
  {
    id: 7,
    name: "هودي بناتي وردي بطبعة يونيكورن",
    price: 119,
    oldPrice: 145,
    image: p7,
    category: "بنات",
    description: "هودي دافئ ومريح للبنات، مع طبعة يونيكورن محببة وتصميم عصري.",
    inStock: 10,
  },
  {
    id: 8,
    name: "قميص أولادي مربعات أزرق",
    price: 95,
    image: p8,
    category: "أولاد",
    description: "قميص قطني أنيق بنقشة المربعات الزرقاء، مناسب للمناسبات والزيارات العائلية.",
    inStock: 18,
  },
];

export const categories = [
  { name: "ملابس بنات", count: 12, color: "bg-banner-pink" },
  { name: "ملابس أولاد", count: 11, color: "bg-banner-mint" },
  { name: "ملابس رضع", count: 8, color: "bg-banner-peach" },
  { name: "أحذية أطفال", count: 9, color: "bg-secondary" },
];
