import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { TechnicalSpec } from '../data/storeData';

interface TechSpecsSectionProps {
  specs: TechnicalSpec[];
  productName: string;
}

export const TechSpecsSection: React.FC<TechSpecsSectionProps> = ({ specs, productName }) => {
  return (
    <section id="specs" className="py-20 bg-[#0d080b] border-t border-rose-950/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 mb-2">
            <span>بيانات المصنع الأصلية</span>
            <span aria-hidden="true">·</span>
            <span>معايير الاتحاد الأوروبي CE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            المواصفات التقنية الأوروبية
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400">
            أعلى معايير الجودة والسلامة الغذائية الأوروبية لضمان أداء فائق وموفر للطاقة.
          </p>
        </div>

        {/* Specs Table */}
        <div className="bg-[#140c11]/80 border border-rose-950 rounded-3xl overflow-hidden shadow-xl">
          <div className="divide-y divide-rose-950/70">
            {specs.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 p-4 sm:px-6 hover:bg-[#1a1017]/60 transition-colors gap-2 sm:gap-4 items-center"
              >
                <div className="sm:col-span-3 text-xs font-bold text-rose-400">
                  {item.category}
                </div>
                <div className="sm:col-span-3 text-xs sm:text-sm font-semibold text-white">
                  {item.spec}
                </div>
                <div className="sm:col-span-6 text-xs sm:text-sm text-neutral-300 font-medium tabular-nums">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality guarantee badge */}
        <div className="mt-8 p-4 rounded-2xl bg-[#140c11]/60 border border-rose-950 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-rose-400" />
            <span>منتج معتمد 100% ومفحوص مخبرياً من طرف فريق متجر روزا كيتشن</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-emerald-400 font-medium">جاهز للاستخدام الفوري فور الاستلام</span>
          </div>
        </div>
      </div>
    </section>
  );
};
