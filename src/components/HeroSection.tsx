import React from 'react';
import { ShieldCheck, Truck, Sparkles, Check, ChevronDown, Award, Phone, SlidersHorizontal } from 'lucide-react';
import { ProductConfig, ProductVariant, StoreOwner } from '../data/storeData';
import { CountdownTimer } from './CountdownTimer';

interface HeroSectionProps {
  owner: StoreOwner;
  product: ProductConfig;
  selectedVariant: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
  onOrderClick: () => void;
  onOpenProductCustomizer?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  owner,
  product,
  selectedVariant,
  onSelectVariant,
  onOrderClick,
  onOpenProductCustomizer,
}) => {
  const discountPercent = Math.max(
    5,
    Math.round(((product.oldPrice - product.basePrice) / product.oldPrice) * 100)
  );

  return (
    <section id="hero" className="relative pt-6 pb-16 overflow-hidden">
      {/* Background ambient rose glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial trust kicker */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-rose-950/80 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="text-rose-400 font-bold">{owner.storeName}</span>
            <span aria-hidden="true">·</span>
            <span>بإشراف: {owner.name}</span>
            <span aria-hidden="true">·</span>
            <span className="text-rose-300/80">الكتروميناج أوروبي أصلي معتمد CE</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-300">
            {onOpenProductCustomizer && (
              <button
                onClick={onOpenProductCustomizer}
                className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>تعديل هذا المنتج</span>
              </button>
            )}
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              متوفر في المخزون (تسليم فوري)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Visual Product Showcase */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-[#160e13] border border-rose-950 shadow-2xl group">
              <img
                src={selectedVariant?.image || product.images.hero}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Floating verified badge */}
              <div className="absolute top-4 right-4 bg-[#110b0f]/90 backdrop-blur-md border border-rose-900/60 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-rose-200">
                <Award className="w-4 h-4 text-rose-400" />
                <span>{product.badge}</span>
              </div>

              {/* Discount tag */}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-lg">
                وفر {discountPercent}%
              </div>

              {/* Bottom active variant label */}
              {selectedVariant && (
                <div className="absolute bottom-4 inset-x-4 bg-[#110b0f]/90 backdrop-blur-md border border-rose-950 rounded-2xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-neutral-400">اللون / الموديل المختار:</p>
                    <p className="text-sm font-bold text-white">{selectedVariant.name}</p>
                  </div>
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-inner"
                    style={{ backgroundColor: selectedVariant.colorHex }}
                  />
                </div>
              )}
            </div>

            {/* Thumbnail Variant Selector */}
            <div className="w-full mt-4 flex items-center gap-3">
              {product.variants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => onSelectVariant(v)}
                    className={`flex-1 p-2.5 rounded-2xl border transition-all text-right flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1a1017] border-rose-500 shadow-md shadow-rose-500/10'
                        : 'bg-[#140c11] border-rose-950/60 hover:border-rose-900'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full shrink-0 border border-neutral-700"
                      style={{ backgroundColor: v.colorHex }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-100 truncate">{v.name}</p>
                      <p className="text-[10px] text-neutral-400 truncate">{v.colorName}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Product Details & Pitch */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>{product.kicker}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
                {product.name}
                {product.nameEn && (
                  <span className="block text-transparent bg-clip-text bg-gradient-to-l from-rose-200 via-rose-300 to-pink-400 mt-1 text-2xl sm:text-3xl font-bold" dir="ltr">
                    {product.nameEn}
                  </span>
                )}
              </h1>
              <p className="mt-3 text-base text-neutral-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Pricing Card in Rose Theme */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#140c11]/90 border border-rose-950 shadow-inner">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-rose-400 tabular-nums">
                      {product.basePrice.toLocaleString('ar-DZ')} دج
                    </span>
                    <span className="text-lg text-neutral-500 line-through tabular-nums">
                      {product.oldPrice.toLocaleString('ar-DZ')} دج
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    يشمل الجهاز الأوروبي الأصلي + كامل الملحقات وضمان رسمي لمدة سنتين
                  </p>
                </div>

                <div className="text-left">
                  <span className="inline-block bg-rose-950 text-rose-300 border border-rose-800/80 rounded-xl px-2.5 py-1 text-xs font-bold">
                    الدفع عند الاستلام
                  </span>
                </div>
              </div>

              {/* Scarcity meter */}
              <div className="mt-4 pt-3 border-t border-rose-950">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-neutral-300 font-medium">الكمية المتبقية بسعر العرض:</span>
                  <span className="text-rose-400 font-bold tabular-nums">
                    {product.stockCount} قطع فقط
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden">
                  <div className="w-[84%] h-full bg-gradient-to-r from-rose-600 via-pink-500 to-rose-400 rounded-full" />
                </div>
              </div>
            </div>

            {/* Countdown Timer Module */}
            <CountdownTimer oldPrice={product.oldPrice} />

            {/* Key Bullet Benefits */}
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-neutral-200">
              {product.bulletBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onOrderClick}
                className="flex-1 py-3.5 px-6 text-base font-extrabold text-neutral-950 bg-gradient-to-l from-rose-500 via-rose-400 to-pink-400 hover:from-rose-400 hover:to-pink-300 rounded-2xl transition-all shadow-lg shadow-rose-500/20 text-center cursor-pointer active:scale-98 flex items-center justify-center gap-2"
              >
                <span>املأ استمارة الطلب (الدفع عند الاستلام)</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <a
                href={`tel:${owner.phone.replace(/\s+/g, '')}`}
                className="py-3.5 px-5 text-sm font-semibold text-neutral-200 bg-[#160e13] hover:bg-[#20141c] border border-rose-900/60 rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-rose-400" />
                <span>اتصل للاستفسار</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs text-neutral-400 border-t border-rose-950/80">
              <div className="p-2.5 rounded-xl bg-[#140c11]">
                <Truck className="w-4 h-4 mx-auto mb-1 text-rose-300" />
                <span className="block font-medium text-neutral-200">توصيل لـ 69 ولاية</span>
                <span className="text-[10px] text-neutral-400">سريع في 24-48 ساعة</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#140c11]">
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-rose-300" />
                <span className="block font-medium text-neutral-200">معاينة قبل الدفع</span>
                <span className="text-[10px] text-neutral-400">افتح وافحص طردك</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#140c11]">
                <Award className="w-4 h-4 mx-auto mb-1 text-rose-300" />
                <span className="block font-medium text-neutral-200">
                  ضمان {product.warrantyMonths} شهراً
                </span>
                <span className="text-[10px] text-neutral-400">استبدال رسمي فوري</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
