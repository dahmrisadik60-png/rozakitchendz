import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';
import { StoreOwner, ProductConfig } from '../data/storeData';

interface GuaranteesSectionProps {
  owner: StoreOwner;
  product: ProductConfig;
}

export const GuaranteesSection: React.FC<GuaranteesSectionProps> = ({ owner, product }) => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "حق الفحص والمعاينة قبل الدفع",
      desc: `لن تسلم الموزع أي مبلغ إلا بعد فتح الطرد وتفقد ${product.name} ومحتويات العلبة بنفسك.`,
    },
    {
      icon: RotateCcw,
      title: `ضمان استبدال رسمي لمدة ${product.warrantyMonths} شهراً`,
      desc: "في حال حدوث أي عيب مصنعي نقوم باستبدال المنتج فوراً بمنتج جديد بدون أي تكاليف إضافية.",
    },
    {
      icon: Truck,
      title: "توصيل آمن وسريع لـ 58 ولاية",
      desc: "شركاء توصيل موثوقون يسلمونك الطرد خلال 24 إلى 48 ساعة لباب منزلك أو مقر عملك.",
    },
    {
      icon: Headphones,
      title: "خدمة زبائن ومتابعة مباشرة",
      desc: `تواصل مباشر مع المتجر بإشراف الأخ ${owner.name} عبر الهاتف أو البريد الإلكتروني.`,
    },
  ];

  return (
    <section className="py-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
            <span>راحة البال أولاً</span>
            <span aria-hidden="true">·</span>
            <span>التزام رسمي بالثقة</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            لماذا تشتري من متجر {owner.storeName} وأنت مطمئن؟
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 text-right space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
