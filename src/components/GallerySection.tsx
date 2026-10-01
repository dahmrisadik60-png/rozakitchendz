import React, { useState } from 'react';
import { ProductConfig } from '../data/storeData';
import { CheckCircle2 } from 'lucide-react';

interface GallerySectionProps {
  product: ProductConfig;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ product }) => {
  const images = [
    {
      url: product.images.hero,
      title: product.name,
      caption: "الإطلالة الرئيسية الفاخرة بجودة فائقة الدقة والوضوح",
    },
    {
      url: product.images.macro || product.images.hero,
      title: "تفاصيل الجودة ودقة التصنيع الأوروبي",
      caption: "خامات متينة تم اختبارها لتدوم طويلاً وفق معايير CE",
    },
    {
      url: product.images.lifestyle || product.images.hero,
      title: "أناقة وتناسق في المطبخ العصري",
      caption: "تصميم روز جولد ووردي يضفي لمسة رقي وراحة مطلقة",
    },
    {
      url: product.images.kit || product.images.hero,
      title: "صندوق الملحقات والعرض المتكامل",
      caption: "يشمل الجهاز الأصلي مع كامل الملحقات والضمان الرسمي",
    },
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <section id="gallery" className="py-20 bg-[#10090d]/50 border-t border-rose-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 mb-2">
              <span>معرض الصور الحقيقية</span>
              <span aria-hidden="true">·</span>
              <span>rozakitchendz</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              عاين تفاصيل {product.name}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
            ما تشاهده في الصور هو ما ستستلمه بالضبط، في العلبة الأصلية بكامل الملحقات مع حق المعاينة قبل الدفع.
          </p>
        </div>

        {/* Featured Main Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-[#140c11] border border-rose-950 shadow-2xl relative group">
            <img
              src={images[activeImageIndex].url}
              alt={images[activeImageIndex].title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0d080b]/95 via-[#0d080b]/40 to-transparent p-6 text-right">
              <span className="text-xs text-rose-400 font-bold block mb-1">
                الصورة {activeImageIndex + 1} من {images.length}
              </span>
              <h3 className="text-xl font-bold text-white">
                {images[activeImageIndex].title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                {images[activeImageIndex].caption}
              </p>
            </div>
          </div>

          {/* Thumbnail list */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {images.map((item, idx) => {
              const isSelected = activeImageIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`p-3 rounded-2xl border text-right transition-all flex items-center gap-3.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#1b1017] border-rose-500 shadow-md shadow-rose-500/10'
                      : 'bg-[#140c11]/80 border-rose-950 hover:border-rose-900'
                  }`}
                >
                  <div className="w-16 h-14 rounded-xl overflow-hidden bg-[#180e14] shrink-0 border border-rose-950">
                    <img
                      src={item.url}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white truncate">{item.title}</p>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                      {item.caption}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
