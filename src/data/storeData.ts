// User and Store Data for rozakitchendz (الكتروميناج الاوروبي) / Sadik Dahmri (dahmrisadik60@gmail.com)
import euAirfryerImg from '../assets/images/eu_electromenager_airfryer_1790882987543.jpg';
import euCoffeeImg from '../assets/images/eu_electromenager_coffee_machine_1790882999606.jpg';
import euMixerImg from '../assets/images/eu_electromenager_standmixer_rose_1790883012326.jpg';

export interface StoreOwner {
  name: string;
  email: string;
  phone: string;
  storeName: string;
  tagline: string;
  wilayaHq: string;
  warrantyPeriod: string;
}

export const initialStoreOwner: StoreOwner = {
  name: "صادق دحمري (Sadik Dahmri)",
  email: "dahmrisadik60@gmail.com",
  phone: "0554921830",
  storeName: "rozakitchendz | الكتروميناج الأوروبي الأصلي",
  tagline: "الوجهة الأولى لأجهزة الكتروميناج والمطبخ الأوروبي المعتمد في الجزائر",
  wilayaHq: "الجزائر العاصمة",
  warrantyPeriod: "ضمان استبدال رسمي معتمد لمدة 24 شهراً",
};

export interface TrackingPixelsConfig {
  metaPixelId: string;
  tiktokPixelId: string;
  web3FormsAccessKey: string;
}

export const defaultTrackingConfig: TrackingPixelsConfig = {
  metaPixelId: "YOUR_META_PIXEL_ID",
  tiktokPixelId: "YOUR_TIKTOK_PIXEL_ID",
  web3FormsAccessKey: "YOUR_WEB3FORMS_ACCESS_KEY", // Free instant email to dahmrisadik60@gmail.com
};

export interface ProductVariant {
  id: string;
  name: string;
  colorName: string;
  colorHex: string;
  strapType: string;
  image: string;
}

export interface PackageOffer {
  id: string;
  title: string;
  subtitle: string;
  qty: number;
  price: number;
  oldPrice: number;
  badge?: string;
  freeShipping: boolean;
  gifts: string[];
}

export interface TechnicalSpec {
  category: string;
  spec: string;
  value: string;
}

export interface ProductFeature {
  title: string;
  desc: string;
}

export interface ProductConfig {
  id: string;
  name: string;
  nameEn: string;
  kicker: string;
  badge: string;
  basePrice: number;
  oldPrice: number;
  description: string;
  stockCount: number;
  bulletBenefits: string[];
  images: {
    hero: string;
    macro: string;
    lifestyle: string;
    kit: string;
  };
  variants: ProductVariant[];
  packageOffers: PackageOffer[];
  features: ProductFeature[];
  macroSpotlight: {
    tag: string;
    title: string;
    desc: string;
    bullets: string[];
  };
  specs: TechnicalSpec[];
  warrantyMonths: number;
}

// Preset 1 (DEFAULT): European Smart Airfryer XXL Rose Gold Edition
export const europeanAirfryerPreset: ProductConfig = {
  id: "eu-airfryer-xxl",
  name: "قلاية فيليبس سمارت XXL الأوروبية الرقمية بدون زيت",
  nameEn: "Philips Airfryer XXL Smart Connected (Électroménager Européen)",
  kicker: "أفضل جهاز الكتروميناج أوروبي للمطبخ الجزائري 2026",
  badge: "معايير الجودة الأوروبية الأصلية CE",
  basePrice: 14800,
  oldPrice: 23500,
  description: "الجهاز الأوروبي الأكثر طلباً في الجزائر! طهي صحي ومقرمش بنسبة دهون أقل 90% مع سعة عائلية ضخمة 7.2 لتر. تصميم روز جولد ميتاليك أنيق مع 16 برنامج طهي ذكي وشاشة لمس ديجيتال موفرة للطاقة.",
  stockCount: 6,
  bulletBenefits: [
    "طهي وشواء صحي بنسبة دهون أقل 90%",
    "سعة عائلية عملاقة 7.2 لتر تكفي حتى 6 أفراد",
    "توفير 70% من استهلاك الكهرباء بمعيار A+++ الأوروبي",
    "تصميم روز جولد ملكي فاخر مقاوم للحرارة",
  ],
  images: {
    hero: euAirfryerImg,
    macro: euAirfryerImg,
    lifestyle: euAirfryerImg,
    kit: euAirfryerImg,
  },
  variants: [
    {
      id: "rose-gold-black",
      name: "أسود ملكي مع حواف روز جولد وردية",
      colorName: "Matte Black & Luxury Rose Gold",
      colorHex: "#e11d48",
      strapType: "هيكل معدني عازل للحرارة مطلي بمادة مانعة للالتصاق ومقاومة للخدش",
      image: euAirfryerImg,
    },
    {
      id: "blush-pink-deluxe",
      name: "وردي ناعم فاخر بلاتينيوم",
      colorName: "Blush Rose Deluxe",
      colorHex: "#f43f5e",
      strapType: "تصميم أنيق متجانس مع أرقى ديكورات المطابخ العصرية",
      image: euAirfryerImg,
    },
  ],
  packageOffers: [
    {
      id: "single-piece",
      title: "قطعة واحدة (جهاز فردي)",
      subtitle: "القلاية الأصلية كاملة مع شبكة الشواء وكتاب الوصفات",
      qty: 1,
      price: 14800,
      oldPrice: 23500,
      badge: "الطلب الفردي القياسي",
      freeShipping: false,
      gifts: [
        "سلة شواء إضافية غير قابلة للالتصاق",
        "كتاب أشهى الوصفات الصحية الجزائرية",
        "ضمان استبدال معتمد لمدة سنتين",
      ],
    },
    {
      id: "duo-upsell",
      title: "عرض التوفير الذكي (قطعتان + شحن مجاني 0 دج)",
      subtitle: "قطعتان لك ولأختك أو لوالدتك مع تخفيض فوري وشحن مجاني 100%",
      qty: 2,
      price: 26900,
      oldPrice: 47000,
      badge: "الأكثر طلباً وتوفيراً 🔥",
      freeShipping: true,
      gifts: [
        "توصيل مجاني فوري لباب المنزل لـ 69 ولاية",
        "طقم أدوات سيليكون حراري هدية مجانية",
        "كتابان للطبخ الجزائري الصحي",
        "ضمان ذهبي ممتد لسنتين كاملتين",
      ],
    },
  ],
  features: [
    {
      title: "تقنية Rapid Air الأوروبية المعززة",
      desc: "تدفق هواء ساخن حلزوني أسرع بـ 7 مرات يمنحك قرمشة ذهبية بدون الحاجة للزيت وطراوة داخلية لا تقاوم.",
    },
    {
      title: "سعة عائلية ضخمة 7.2 لتر (XXL)",
      desc: "تتسع لطهي دجاجة كاملة أو 1.5 كغ من البطاطا المقلية لخدمة كامل أفراد العائلة في وجبة واحدة وسريعة.",
    },
    {
      title: "16 برنامج طهي بلمسة زر واحدة",
      desc: "شاشة لمس LED تتضمن برامج مسبقة للقلي الصحي، الشواء، الخَبز، التحمير، التخمير وحفظ سخونة الطعام.",
    },
    {
      title: "كفاءة طاقوية عالية موفرة للكهرباء",
      desc: "تستهلك طاقة أقل بنسبة 70% وتطهو أسرع مرتين من الفرن الكهربائي التقليدي، معتمدة بالمعيار الأوروبي A+++.",
    },
    {
      title: "طلاء QuickClean غير لاصق وصحي",
      desc: "سلة طهي قابلة للفك مطلية بسيراميك مانع للالتصاق خالٍ 100% من مادة BPA الضارة وسهلة التنظيف بالماء.",
    },
    {
      title: "هيكل آمن عازل للحرارة Cool Wall",
      desc: "جدار خارجي يبقى بارداً عند اللمس طوال فترة الطهي لضمان الأمان التام للأطفال وداخل المطبخ.",
    },
  ],
  macroSpotlight: {
    tag: "الكتروميناج أوروبي فخم",
    title: "لوحة التحكم الديجيتال باللمس مع لمسات الروز جولد",
    desc: "شاشة تحكم تفاعلية توفر لك ضبطاً دقيقاً لدرجة الحرارة من 40° إلى 200° مئوية مع مؤقت ذكي وتنبيه لتقليب الطعام.",
    bullets: ["شاشة LED ذكية", "16 برنامج تلقائي", "خاصية الحفظ الساخن 30 دقيقة"],
  },
  specs: [
    { category: "المواصفات القياسية", spec: "بلد المنشأ والمعايير", value: "مطابقة للمعايير الأوروبية CE مع شهادة الجودة والسلامة الغذائية" },
    { category: "السعة والأبعاد", spec: "سعة الطهي الإجمالية", value: "7.2 لتر XXL (تكفي وجبة عائلية لـ 6 أشخاص)" },
    { category: "الطاقة والأداء", spec: "القوة القصوى للمحرك", value: "2000 واط تسخين فوري توربو عالي الكفاءة" },
    { category: "درجة الحرارة", spec: "نطاق الحرارة والمؤقت", value: "من 40°C حتى 200°C مع مؤقت رقمي حتى 60 دقيقة" },
    { category: "الأمان والتنظيف", spec: "مادة الطلاء والأمان", value: "سيراميك غير لاصق مضاد للخدش خالٍ من PFOA وآمن بغسالة الأواني" },
  ],
  warrantyMonths: 24,
};

export const availableProductPresets = [
  { id: "eu-airfryer-xxl", label: "قلاية فيليبس سمارت XXL الأوروبية بدون زيت (روز جولد)", config: europeanAirfryerPreset },
];

export interface Wilaya {
  code: number;
  name: string;
  nameEn: string;
  homeDeliveryFee: number;
  stopDeskDeliveryFee: number;
  deliveryTime: string;
}

// Complete 69 Wilayas of Algeria for strict logistics and high conversion
export const algerianWilayas: Wilaya[] = [
  { code: 1, name: "أدرار", nameEn: "Adrar", homeDeliveryFee: 800, stopDeskDeliveryFee: 500, deliveryTime: "3 - 5 أيام" },
  { code: 2, name: "الشلف", nameEn: "Chlef", homeDeliveryFee: 500, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 3, name: "الأغواط", nameEn: "Laghouat", homeDeliveryFee: 650, stopDeskDeliveryFee: 450, deliveryTime: "2 - 3 أيام" },
  { code: 4, name: "أم البواقي", nameEn: "Oum El Bouaghi", homeDeliveryFee: 550, stopDeskDeliveryFee: 400, deliveryTime: "24 - 48 ساعة" },
  { code: 5, name: "باتنة", nameEn: "Batna", homeDeliveryFee: 550, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 6, name: "بجاية", nameEn: "Béjaïa", homeDeliveryFee: 500, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 7, name: "بسكرة", nameEn: "Biskra", homeDeliveryFee: 600, stopDeskDeliveryFee: 400, deliveryTime: "24 - 48 ساعة" },
  { code: 8, name: "بشار", nameEn: "Béchar", homeDeliveryFee: 750, stopDeskDeliveryFee: 500, deliveryTime: "3 - 4 أيام" },
  { code: 9, name: "البليدة", nameEn: "Blida", homeDeliveryFee: 400, stopDeskDeliveryFee: 250, deliveryTime: "24 ساعة" },
  { code: 10, name: "البويرة", nameEn: "Bouira", homeDeliveryFee: 450, stopDeskDeliveryFee: 300, deliveryTime: "24 ساعة" },
  { code: 11, name: "تمنراست", nameEn: "Tamanrasset", homeDeliveryFee: 900, stopDeskDeliveryFee: 600, deliveryTime: "4 - 6 أيام" },
  { code: 12, name: "تبسة", nameEn: "Tébessa", homeDeliveryFee: 600, stopDeskDeliveryFee: 400, deliveryTime: "24 - 48 ساعة" },
  { code: 13, name: "تلمسان", nameEn: "Tlemcen", homeDeliveryFee: 550, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 14, name: "تيارت", nameEn: "Tiaret", homeDeliveryFee: 550, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 15, name: "تيزي وزو", nameEn: "Tizi Ouzou", homeDeliveryFee: 450, stopDeskDeliveryFee: 300, deliveryTime: "24 ساعة" },
  { code: 16, name: "الجزائر العاصمة", nameEn: "Alger", homeDeliveryFee: 400, stopDeskDeliveryFee: 250, deliveryTime: "خلال 24 ساعة فقط" },
  { code: 17, name: "الجلفة", nameEn: "Djelfa", homeDeliveryFee: 600, stopDeskDeliveryFee: 400, deliveryTime: "24 - 48 ساعة" },
  { code: 18, name: "جيجل", nameEn: "Jijel", homeDeliveryFee: 550, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 19, name: "سطيف", nameEn: "Sétif", homeDeliveryFee: 500, stopDeskDeliveryFee: 350, deliveryTime: "24 ساعة" },
  { code: 20, name: "سعيدة", nameEn: "Saïda", homeDeliveryFee: 600, stopDeskDeliveryFee: 400, deliveryTime: "24 - 48 ساعة" },
  { code: 21, name: "سكيكدة", nameEn: "Skikda", homeDeliveryFee: 550, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 22, name: "سيدي بلعباس", nameEn: "Sidi Bel Abbès", homeDeliveryFee: 550, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 23, name: "عنابة", nameEn: "Annaba", homeDeliveryFee: 500, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 24, name: "قالمة", nameEn: "Guelma", homeDeliveryFee: 550, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 25, name: "قسنطينة", nameEn: "Constantine", homeDeliveryFee: 500, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 26, name: "المدية", nameEn: "Médéa", homeDeliveryFee: 450, stopDeskDeliveryFee: 300, deliveryTime: "24 ساعة" },
  { code: 27, name: "مستغانم", nameEn: "Mostaganem", homeDeliveryFee: 500, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 28, name: "المسيلة", nameEn: "M'Sila", homeDeliveryFee: 550, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 29, name: "معسكر", nameEn: "Mascara", homeDeliveryFee: 550, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 30, name: "ورقلة", nameEn: "Ouargla", homeDeliveryFee: 700, stopDeskDeliveryFee: 450, deliveryTime: "2 - 3 أيام" },
  { code: 31, name: "وهران", nameEn: "Oran", homeDeliveryFee: 450, stopDeskDeliveryFee: 300, deliveryTime: "24 - 48 ساعة" },
  { code: 32, name: "البيض", nameEn: "El Bayadh", homeDeliveryFee: 700, stopDeskDeliveryFee: 450, deliveryTime: "2 - 3 أيام" },
  { code: 33, name: "إليزي", nameEn: "Illizi", homeDeliveryFee: 900, stopDeskDeliveryFee: 600, deliveryTime: "4 - 5 أيام" },
  { code: 34, name: "برج بوعريريج", nameEn: "Bordj Bou Arréridj", homeDeliveryFee: 500, stopDeskDeliveryFee: 350, deliveryTime: "24 ساعة" },
  { code: 35, name: "بومرداس", nameEn: "Boumerdès", homeDeliveryFee: 400, stopDeskDeliveryFee: 250, deliveryTime: "24 ساعة" },
  { code: 36, name: "الطارف", nameEn: "El Tarf", homeDeliveryFee: 600, stopDeskDeliveryFee: 400, deliveryTime: "24 - 48 ساعة" },
  { code: 37, name: "تندوف", nameEn: "Tindouf", homeDeliveryFee: 950, stopDeskDeliveryFee: 650, deliveryTime: "4 - 6 أيام" },
  { code: 38, name: "تيسمسيلت", nameEn: "Tissemsilt", homeDeliveryFee: 600, stopDeskDeliveryFee: 400, deliveryTime: "24 - 48 ساعة" },
  { code: 39, name: "الوادي", nameEn: "El Oued", homeDeliveryFee: 650, stopDeskDeliveryFee: 450, deliveryTime: "2 - 3 أيام" },
  { code: 40, name: "خنشلة", nameEn: "Khenchela", homeDeliveryFee: 600, stopDeskDeliveryFee: 400, deliveryTime: "24 - 48 ساعة" },
  { code: 41, name: "سوق أهراس", nameEn: "Souk Ahras", homeDeliveryFee: 600, stopDeskDeliveryFee: 400, deliveryTime: "24 - 48 ساعة" },
  { code: 42, name: "تيبازة", nameEn: "Tipaza", homeDeliveryFee: 400, stopDeskDeliveryFee: 250, deliveryTime: "24 ساعة" },
  { code: 43, name: "ميلة", nameEn: "Mila", homeDeliveryFee: 550, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 44, name: "عين الدفلى", nameEn: "Aïn Defla", homeDeliveryFee: 450, stopDeskDeliveryFee: 300, deliveryTime: "24 ساعة" },
  { code: 45, name: "النعامة", nameEn: "Naâma", homeDeliveryFee: 750, stopDeskDeliveryFee: 500, deliveryTime: "3 - 4 أيام" },
  { code: 46, name: "عين تموشنت", nameEn: "Aïn Témouchent", homeDeliveryFee: 550, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 47, name: "غرداية", nameEn: "Ghardaïa", homeDeliveryFee: 650, stopDeskDeliveryFee: 450, deliveryTime: "2 - 3 أيام" },
  { code: 48, name: "غليزان", nameEn: "Relizane", homeDeliveryFee: 500, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 49, name: "المغير", nameEn: "El M'Ghair", homeDeliveryFee: 700, stopDeskDeliveryFee: 450, deliveryTime: "2 - 3 أيام" },
  { code: 50, name: "المنيعة", nameEn: "El Menia", homeDeliveryFee: 750, stopDeskDeliveryFee: 500, deliveryTime: "3 - 4 أيام" },
  { code: 51, name: "أولاد جلال", nameEn: "Ouled Djellal", homeDeliveryFee: 650, stopDeskDeliveryFee: 450, deliveryTime: "2 - 3 أيام" },
  { code: 52, name: "برج باجي مختار", nameEn: "Bordj Baji Mokhtar", homeDeliveryFee: 950, stopDeskDeliveryFee: 650, deliveryTime: "4 - 7 أيام" },
  { code: 53, name: "بني عباس", nameEn: "Béni Abbès", homeDeliveryFee: 800, stopDeskDeliveryFee: 550, deliveryTime: "3 - 5 أيام" },
  { code: 54, name: "تيميمون", nameEn: "Timimoun", homeDeliveryFee: 800, stopDeskDeliveryFee: 550, deliveryTime: "3 - 5 أيام" },
  { code: 55, name: "تقرت", nameEn: "Touggourt", homeDeliveryFee: 700, stopDeskDeliveryFee: 450, deliveryTime: "2 - 3 أيام" },
  { code: 56, name: "جانت", nameEn: "Djanet", homeDeliveryFee: 950, stopDeskDeliveryFee: 650, deliveryTime: "4 - 7 أيام" },
  { code: 57, name: "عين صالح", nameEn: "In Salah", homeDeliveryFee: 850, stopDeskDeliveryFee: 600, deliveryTime: "3 - 5 أيام" },
  { code: 58, name: "عين قزام", nameEn: "In Guezzam", homeDeliveryFee: 950, stopDeskDeliveryFee: 650, deliveryTime: "4 - 7 أيام" },
  // 11 New / Delegated Wilayas completing the 69 Algerian Wilayas
  { code: 59, name: "آفلو", nameEn: "Aflou", homeDeliveryFee: 650, stopDeskDeliveryFee: 450, deliveryTime: "2 - 3 أيام" },
  { code: 60, name: "بريكة", nameEn: "Barika", homeDeliveryFee: 550, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 61, name: "قصر الشلالة", nameEn: "Ksar Chellala", homeDeliveryFee: 550, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 62, name: "مسعد", nameEn: "Messaad", homeDeliveryFee: 600, stopDeskDeliveryFee: 400, deliveryTime: "24 - 48 ساعة" },
  { code: 63, name: "عين وسارة", nameEn: "Aïn Oussera", homeDeliveryFee: 550, stopDeskDeliveryFee: 350, deliveryTime: "24 ساعة" },
  { code: 64, name: "بوسعادة", nameEn: "Bou Saâda", homeDeliveryFee: 550, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 65, name: "الأبيض سيدي الشيخ", nameEn: "El Abiodh Sidi Cheikh", homeDeliveryFee: 700, stopDeskDeliveryFee: 450, deliveryTime: "2 - 3 أيام" },
  { code: 66, name: "شلغوم العيد", nameEn: "Chelghoum Laïd", homeDeliveryFee: 550, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 67, name: "خميس مليانة", nameEn: "Khemis Miliana", homeDeliveryFee: 450, stopDeskDeliveryFee: 300, deliveryTime: "24 ساعة" },
  { code: 68, name: "فرندة", nameEn: "Frenda", homeDeliveryFee: 550, stopDeskDeliveryFee: 350, deliveryTime: "24 - 48 ساعة" },
  { code: 69, name: "العلمة", nameEn: "El Eulma", homeDeliveryFee: 500, stopDeskDeliveryFee: 350, deliveryTime: "24 ساعة" },
];

export interface CustomerReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  variant: string;
  verified: boolean;
}

export const initialReviews: CustomerReview[] = [
  {
    id: "rev-1",
    author: "نادية بن حمادي",
    city: "الجزائر العاصمة (بئر مراد رايس)",
    rating: 5,
    date: "منذ يومين",
    comment: "ما شاء الله القلاية وصلتني في 24 ساعة فقط! لون الروز جولد في الحقيقة أجمل بكثير من الصور، فخامة عالية وجودة أوروبية أصلية. جربت فيها الدجاج والبطاطا طابو مقرمشين بدون قطرة زيت. والأخ صادق دحمري تعامل راقي ومحترم، فتحت وفحصت قبل ما نخلص.",
    variant: "أسود ملكي مع حواف روز جولد وردية",
    verified: true,
  },
  {
    id: "rev-2",
    author: "سهام بلقاسم",
    city: "وهران (المرسى الكبير)",
    rating: 5,
    date: "منذ 3 أيام",
    comment: "أفضل استثمار لمطبخي في 2026. الكتروميناج أوروبي حقيقي بقوة 2000 واط تسخن بسرعة رهيبة وما تستهلكش تريسيتي. شكراً متجر روزا كيتشن ديزاد rozakitchendz.",
    variant: "وردي ناعم فاخر بلاتينيوم",
    verified: true,
  },
  {
    id: "rev-3",
    author: "مريم العباسي",
    city: "سطيف (حي الباز)",
    rating: 5,
    date: "منذ 4 أيام",
    comment: "شريت عرض قطعتين ليا ولأختي العروسة، التغليف فخم ومتقن للغاية مع كتاب الوصفات والهدايا. التوصيل كان مجاني حتى لباب المنزل.",
    variant: "أسود ملكي مع حواف روز جولد وردية",
    verified: true,
  },
  {
    id: "rev-4",
    author: "حكيمة زرواق",
    city: "قسنطينة (الكدية)",
    rating: 5,
    date: "منذ أسبوع",
    comment: "حق المعاينة باليد قبل الدفع يعطيك ثقة عمياء في متجر روزا كيتشن. الماكينة سعتها 7.2 لتر رفدتلي دجاجة كومبلي طابت هايلة وطريقة الاستعمال في غاية السهولة.",
    variant: "وردي ناعم فاخر بلاتينيوم",
    verified: true,
  },
];

export interface CustomerOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  wilayaName: string;
  wilayaCode: number;
  commune: string;
  address: string;
  productName: string;
  variantName: string;
  packTitle: string;
  quantity: number;
  productPrice: number;
  deliveryFee: number;
  totalPrice: number;
  notes?: string;
  deliveryType: "home" | "desk";
  createdAt: string;
  status: "جديد" | "تم التأكيد" | "قيد التوصيل" | "تم التسليم" | "ملغى";
}

export interface AbandonedLead {
  id: string;
  customerName: string;
  customerPhone: string;
  wilayaName?: string;
  timestamp: string;
  productName: string;
}
