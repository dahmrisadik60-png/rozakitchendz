import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Package, SlidersHorizontal } from 'lucide-react';
import { StoreOwner } from '../data/storeData';

interface FooterProps {
  owner: StoreOwner;
  onOpenOrders: () => void;
  onOpenProductCustomizer: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  owner,
  onOpenOrders,
  onOpenProductCustomizer,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3 text-right">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950 font-black flex items-center justify-center text-base">
                R
              </div>
              <span className="text-base font-extrabold text-white">{owner.storeName}</span>
            </div>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
              المتجر الجزائري المعتمد لبيع أجهزة المطبخ والعناية الشخصية والأجهزة الذكية الأصلية. نلتزم بأعلى معايير المصداقية والجودة وخدمة ما بعد البيع مع الدفع الآمن عند الاستلام.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <span>إشراف وإدارة: {owner.name}</span>
              <span aria-hidden="true">·</span>
              <span>المقر: {owner.wilayaHq}</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5 text-right">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              معلومات الاتصال المباشرة
            </h4>
            <div className="flex items-center gap-2 text-neutral-300">
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <a
                href={`mailto:${owner.email}`}
                className="hover:text-amber-400 transition-colors"
                dir="ltr"
              >
                {owner.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <a
                href={`tel:${owner.phone.replace(/\s+/g, '')}`}
                className="hover:text-amber-400 transition-colors"
                dir="ltr"
              >
                {owner.phone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>تغطية وشحن لـ 69 ولاية جزائرية</span>
            </div>
          </div>

          {/* Quick Management Links */}
          <div className="space-y-2 text-right">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              أدوات الإدارة والتحكم
            </h4>
            <ul className="space-y-2 text-neutral-300">
              <li>
                <button
                  onClick={onOpenOrders}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1.5 cursor-pointer font-bold"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>صندوق الطلبات الواردة (Inbox)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenProductCustomizer}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1.5 cursor-pointer font-bold"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>استوديو تعديل وتغيير المنتج</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="text-neutral-400 hover:text-white cursor-pointer underline text-[11px]"
                >
                  إعدادات المتجر والتحليلات وبياناتي
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <p className="text-[11px] text-neutral-500">
            جميع الحقوق محفوظة © {new Date().getFullYear()} {owner.storeName} · بإشراف {owner.name}
          </p>
          <div className="flex items-center gap-3 text-[11px] text-neutral-500">
            <span>توصيل لـ 69 ولاية</span>
            <span aria-hidden="true">·</span>
            <span>معاينة حرة</span>
            <span aria-hidden="true">·</span>
            <span>دفع عند الباب</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
