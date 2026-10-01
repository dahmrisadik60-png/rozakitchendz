import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Droplets,
  Layers,
  Award,
} from 'lucide-react';
import { ProductConfig } from '../data/storeData';

interface FeaturesSectionProps {
  product: ProductConfig;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ product }) => {
  return (
    <section id="features" className="py-20 bg-[#0d080b] border-t border-rose-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 mb-2">
            <span>الهندسة الأوروبية المعتمدة CE</span>
            <span aria-hidden="true">·</span>
            <span>rozakitchendz</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            أداء استثنائي وتصميم وردي ساحر يزين مطبخك
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
            أجهزة الكتروميناج أوروبية أصلية تم اختيارها بعناية لتوفر لك أعلى مستويات الراحة والمتانة مع لمسة عصرية راقية.
          </p>
        </div>

        {/* Dynamic Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {product.features.map((feat, index) => (
            <div
              key={index}
              className="p-6 rounded-3xl bg-[#140c11]/80 border border-rose-950/80 hover:border-rose-800 transition-all group text-right"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/25 text-rose-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-rose-400 transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Macro spotlight banner */}
        {product.macroSpotlight && (
          <div className="mt-16 rounded-3xl overflow-hidden bg-[#140c11] border border-rose-950 grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 p-8 sm:p-12 space-y-4 text-right">
              <span className="text-xs font-bold text-rose-400 tracking-wider">
                {product.macroSpotlight.tag}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {product.macroSpotlight.title}
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {product.macroSpotlight.desc}
              </p>
              <div className="pt-2 text-xs text-neutral-400 flex flex-wrap items-center gap-3">
                {product.macroSpotlight.bullets.map((b, bIdx) => (
                  <React.Fragment key={bIdx}>
                    <span>{b}</span>
                    {bIdx < product.macroSpotlight.bullets.length - 1 && (
                      <span aria-hidden="true" className="text-rose-500">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7 h-72 sm:h-96 bg-[#180e14]">
              <img
                src={product.images.macro || product.images.hero}
                alt={product.macroSpotlight.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
